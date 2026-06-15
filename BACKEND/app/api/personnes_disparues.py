from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import date

from ..database import get_db
from ..models.person import PersonneDisparue, NiveauGraviteEnum
from .deps import get_current_user
from ..models.user import User

router = APIRouter()

class PersonneDisparueCreate(BaseModel):
    nom: str
    prenoms: str
    description: Optional[str] = None
    age: Optional[str] = None
    niveau_gravite: str = "grave"
    date_disparition: Optional[date] = None
    lieu_disparition: Optional[str] = None
    signalement_id: Optional[str] = None

class PersonneDisparueResponse(BaseModel):
    id: str
    nom: str
    prenoms: str
    description: Optional[str]
    age: Optional[str]
    niveau_gravite: str
    date_disparition: Optional[date]
    lieu_disparition: Optional[str]

    class Config:
        from_attributes = True

@router.get("/", response_model=List[PersonneDisparueResponse])
def get_personnes_disparues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    personnes = db.query(PersonneDisparue).all()
    return personnes

@router.get("/{personne_id}", response_model=PersonneDisparueResponse)
def get_personne_disparue(
    personne_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    personne = db.query(PersonneDisparue).filter(PersonneDisparue.id == personne_id).first()
    if not personne:
        raise HTTPException(status_code=404, detail="Personne non trouvée")
    return personne

@router.post("/", response_model=PersonneDisparueResponse)
def create_personne_disparue(
    data: PersonneDisparueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    personne = PersonneDisparue(
        nom=data.nom,
        prenoms=data.prenoms,
        description=data.description,
        age=data.age,
        niveau_gravite=NiveauGraviteEnum(data.niveau_gravite),
        date_disparition=data.date_disparition,
        lieu_disparition=data.lieu_disparition,
        signalement_id=data.signalement_id
    )
    db.add(personne)
    db.commit()
    db.refresh(personne)
    return personne

@router.delete("/{personne_id}")
def delete_personne_disparue(
    personne_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    personne = db.query(PersonneDisparue).filter(PersonneDisparue.id == personne_id).first()
    if not personne:
        raise HTTPException(status_code=404, detail="Personne non trouvée")
    
    db.delete(personne)
    db.commit()
    return {"message": "Personne supprimée"}

@router.get("/{personne_id}/detections")
def get_historique_detections(
    personne_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    personne = db.query(PersonneDisparue).filter(PersonneDisparue.id == personne_id).first()
    if not personne:
        raise HTTPException(status_code=404, detail="Personne non trouvée")
    
    return personne.detections

@router.post("/{personne_id}/extraire-vecteurs")
def extraire_vecteurs_faciaux(
    personne_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Extrait les vecteurs faciaux des photos d'une personne disparue"""
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    personne = db.query(PersonneDisparue).filter(PersonneDisparue.id == personne_id).first()
    if not personne:
        raise HTTPException(status_code=404, detail="Personne non trouvée")
    
    if not personne.photo or len(personne.photo) == 0:
        raise HTTPException(status_code=400, detail="Aucune photo disponible")
    
    # Extraire les vecteurs faciaux via le service
    from app.services.face_extraction import extract_embeddings_for_person
    
    try:
        embeddings_json = extract_embeddings_for_person(personne.photo)
        
        if embeddings_json is None:
            raise HTTPException(
                status_code=400, 
                detail="Impossible d'extraire les vecteurs faciaux. Vérifiez que les photos contiennent des visages clairs."
            )
        
        # Sauvegarder dans la base de données
        personne.vecteur_facial = embeddings_json
        db.commit()
        
        import json
        result = json.loads(embeddings_json)
        
        return {
            "message": "Vecteurs faciaux extraits avec succès",
            "photos_traitees": result["total_photos"],
            "extractions_reussies": result["successful_extractions"],
            "modele": result["model"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[ERREUR] Extraction vecteurs: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'extraction des vecteurs faciaux: {str(e)}"
        )
