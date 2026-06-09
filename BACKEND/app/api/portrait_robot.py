"""
API endpoints pour la génération de portraits-robots
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
import base64
from datetime import datetime
import uuid
import os

from ..database import get_db
from ..models.person import Person
from .deps import get_current_user
from ..models.user import User
from ..services.portrait_robot import (
    generate_portrait_with_gemini,
    generate_portrait_simple,
    refine_portrait_with_feedback
)

router = APIRouter()

class PortraitDescription(BaseModel):
    # Informations générales
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    
    # Visage
    face_shape: Optional[str] = None
    skin_tone: Optional[str] = None
    
    # Cheveux
    hair_color: Optional[str] = None
    hair_style: Optional[str] = None
    hair_length: Optional[str] = None
    
    # Yeux
    eye_color: Optional[str] = None
    eye_shape: Optional[str] = None
    
    # Nez et bouche
    nose_shape: Optional[str] = None
    mouth_shape: Optional[str] = None
    
    # Autres
    facial_hair: Optional[str] = None
    distinctive_features: Optional[str] = None
    additional_description: Optional[str] = None

class PortraitRefinement(BaseModel):
    original_prompt: str
    feedback: str

class PortraitSave(BaseModel):
    description: PortraitDescription
    image_base64: str
    last_location: Optional[str] = None
    circumstances: Optional[str] = None

@router.post("/generate")
async def generate_portrait(
    description: PortraitDescription,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère un portrait-robot basé sur la description fournie
    """
    # Vérifier que l'utilisateur est admin ou superviseur
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs et superviseurs"
        )
    
    try:
        # Générer le portrait (version simple pour démo)
        result = await generate_portrait_simple(description.dict())
        
        return {
            "success": result["success"],
            "prompt": result.get("prompt"),
            "image_url": result.get("image_url"),
            "message": result.get("message"),
            "provider": result.get("provider")
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la génération: {str(e)}"
        )

@router.post("/refine")
async def refine_portrait(
    refinement: PortraitRefinement,
    current_user: User = Depends(get_current_user)
):
    """
    Affine un portrait existant avec des retours
    """
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs et superviseurs"
        )
    
    try:
        # Créer un nouveau prompt affiné
        refined_prompt = refine_portrait_with_feedback(
            refinement.original_prompt,
            refinement.feedback
        )
        
        # Regénérer avec le prompt affiné
        # Pour la démo, on retourne juste le nouveau prompt
        return {
            "success": True,
            "refined_prompt": refined_prompt,
            "message": "Prompt affiné généré. Regénérer l'image avec ce nouveau prompt."
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'affinement: {str(e)}"
        )

@router.post("/save")
async def save_portrait(
    portrait_data: PortraitSave,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Sauvegarde le portrait-robot comme personne recherchée
    """
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs et superviseurs"
        )
    
    try:
        # Décoder l'image base64 et la sauvegarder
        image_data = base64.b64decode(portrait_data.image_base64.split(',')[1] if ',' in portrait_data.image_base64 else portrait_data.image_base64)
        
        # Créer le dossier si nécessaire
        upload_dir = "uploads/portraits"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Générer un nom de fichier unique
        filename = f"{uuid.uuid4()}.png"
        filepath = os.path.join(upload_dir, filename)
        
        # Sauvegarder l'image
        with open(filepath, "wb") as f:
            f.write(image_data)
        
        # Créer l'entrée dans la base de données
        desc = portrait_data.description
        new_person = Person(
            first_name=desc.name or "Inconnu",
            last_name="Portrait-Robot",
            age=desc.age,
            gender=desc.gender or "M",
            photo_url=f"/static/{filepath}",
            last_location=portrait_data.last_location or "Non spécifié",
            status="missing",
            gravity_level="high",
            description=desc.additional_description or "",
            circumstances=portrait_data.circumstances or "Portrait-robot généré par IA",
            reported_by=current_user.id,
            reported_at=datetime.utcnow()
        )
        
        db.add(new_person)
        db.commit()
        db.refresh(new_person)
        
        return {
            "success": True,
            "person_id": new_person.id,
            "message": "Portrait-robot sauvegardé comme personne recherchée",
            "photo_url": new_person.photo_url
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la sauvegarde: {str(e)}"
        )

@router.get("/options")
async def get_portrait_options():
    """
    Retourne les options disponibles pour les sélections du formulaire
    """
    return {
        "face_shapes": ["Ovale", "Rond", "Carré", "Rectangulaire", "Triangulaire", "Cœur"],
        "skin_tones": ["Très clair", "Clair", "Moyen", "Mat", "Foncé", "Très foncé"],
        "hair_colors": ["Noir", "Brun foncé", "Brun", "Châtain", "Blond", "Roux", "Gris", "Blanc"],
        "hair_styles": ["Lisse", "Ondulé", "Bouclé", "Crépu", "Tressé", "Rasé"],
        "hair_lengths": ["Chauve", "Très court", "Court", "Mi-long", "Long", "Très long"],
        "eye_colors": ["Noir", "Brun", "Noisette", "Vert", "Bleu", "Gris"],
        "eye_shapes": ["Amande", "Rond", "Bridé", "Tombant", "Écarquillé"],
        "nose_shapes": ["Droit", "Aquilin", "Retroussé", "Large", "Fin", "Busqué"],
        "mouth_shapes": ["Petite", "Moyenne", "Grande", "Lèvres fines", "Lèvres pulpeuses"],
        "facial_hair": ["Aucune", "Moustache", "Barbe complète", "Bouc", "Favoris", "Barbe de 3 jours"],
        "ethnicities": ["Africain", "Européen", "Asiatique", "Arabe", "Latino-américain", "Mixte"]
    }
