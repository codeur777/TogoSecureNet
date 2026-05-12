import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.person import Person as PersonModel
from app.schemas.person import Person, PersonCreate
from app.services.recognition import RecognitionService
from datetime import date
import face_recognition

router = APIRouter()

UPLOAD_DIR = "uploads/persons"

@router.post("/", response_model=Person)
async def create_person(
    first_name: str = Form(...),
    last_name: str = Form(...),
    age: int = Form(None),
    gender: str = Form(None),
    gravity_level: str = Form("low"),
    db: Session = Depends(deps.get_db),
    photos: List[UploadFile] = File(...)
):
    # Enregistrer les photos
    photo_urls = []
    for photo in photos:
        file_ext = os.path.splitext(photo.filename)[1]
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, file_name)
        
        with open(file_path, "wb") as buffer:
            content = await photo.read()
            buffer.write(content)
        
        photo_urls.append(f"/static/persons/{file_name}")

    # Analyse IA de la première photo pour valider la qualité
    if photo_urls:
        actual_file_path = os.path.join(UPLOAD_DIR, os.path.basename(photo_urls[0]))
        ai_analysis = RecognitionService.analyze_image_quality(actual_file_path)
        
        if not ai_analysis["success"]:
            # Optionnel : On pourrait lever une erreur 400 si on veut être strict
            # raise HTTPException(status_code=400, detail=ai_analysis["message"])
            pass 
        # On pourrait stocker le résultat de l'analyse dans le modèle

    # Créer l'entrée en DB
    db_person = PersonModel(
        first_name=first_name,
        last_name=last_name,
        age=age,
        gender=gender,
        gravity_level=gravity_level,
        photo_url=photo_urls[0] if photo_urls else None,
        is_ai_ready=ai_analysis["success"] if photo_urls else False,
        ai_metadata=str(ai_analysis) if photo_urls else None
    )
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    
    # Si l'IA est prête, sauvegarder l'encodage facial pour les futures recherches
    if db_person.is_ai_ready:
        actual_file_path = os.path.join(UPLOAD_DIR, os.path.basename(db_person.photo_url))
        RecognitionService.save_face_encoding(db_person.id, actual_file_path)
        
    return db_person

@router.get("/", response_model=List[Person])
def read_persons(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    persons = db.query(PersonModel).offset(skip).limit(limit).all()
    return persons

@router.get("/embeddings")
def get_all_embeddings(db: Session = Depends(deps.get_db)):
    """
    Retourne tous les encodings faciaux pour synchronisation avec les caméras Edge.
    """
    persons = db.query(PersonModel).filter(PersonModel.is_ai_ready == True).all()
    
    results = []
    for person in persons:
        from app.redis_client import redis_client
        data = redis_client.get(f"encoding:person:{person.id}")
        
        if data:
            import numpy as np
            encoding = np.frombuffer(data, dtype=np.float64).tolist()
            results.append({
                "id": person.id,
                "name": f"{person.first_name} {person.last_name}",
                "encoding": encoding
            })
            
    return results

@router.get("/{person_id}", response_model=Person)
def read_person(person_id: int, db: Session = Depends(deps.get_db)):
    db_person = db.query(PersonModel).filter(PersonModel.id == person_id).first()
    if db_person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    return db_person

@router.post("/search", response_model=List[Person])
async def search_person_by_photo(
    db: Session = Depends(deps.get_db),
    photo: UploadFile = File(...)
):
    # 1. Sauvegarder temporairement la photo de recherche
    temp_path = f"uploads/temp_{uuid.uuid4()}.jpg"
    with open(temp_path, "wb") as buffer:
        content = await photo.read()
        buffer.write(content)

    try:
        # 2. Extraire l'encodage
        print(f"DEBUG: Analyse de la photo de recherche ({temp_path})...")
        search_image = face_recognition.load_image_file(temp_path)
        search_encodings = face_recognition.face_encodings(search_image)

        if not search_encodings:
            print("DEBUG: Aucun visage détecté sur la photo envoyée.")
            raise HTTPException(status_code=400, detail="Aucun visage détecté sur la photo de recherche.")

        print(f"DEBUG: Visage détecté. Extraction des traits faciaux réussie.")

        # 3. Récupérer tous les encodings actifs
        known_encodings, person_ids = RecognitionService.get_all_active_encodings()
        
        if not known_encodings:
            print("DEBUG: La base de données de visages connus est vide.")
            return []

        print(f"DEBUG: Comparaison avec {len(known_encodings)} visages en base de données...")

        # 4. Comparer
        matches = face_recognition.compare_faces(known_encodings, search_encodings[0], tolerance=0.6)
        
        matched_ids = []
        for i, is_match in enumerate(matches):
            p_id = person_ids[i]
            if is_match:
                print(f"DEBUG: MATCH TROUVÉ ! Correspondance avec la personne ID: {p_id}")
                matched_ids.append(p_id)
            else:
                # Log discret pour ne pas saturer si beaucoup de visages
                pass

        if not matched_ids:
            print("DEBUG: Recherche terminée. Aucune correspondance trouvée.")
            return []

        print(f"DEBUG: Succès. {len(matched_ids)} résultat(s) retourné(s).")
        return db.query(PersonModel).filter(PersonModel.id.in_(matched_ids)).all()
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

