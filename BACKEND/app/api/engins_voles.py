from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import date

from ..database import get_db
from ..models.engin_vole import EnginVole, StatutEnginEnum
from .deps import get_current_user
from ..models.user import User

router = APIRouter()

class EnginVoleCreate(BaseModel):
    marque: str
    modele: str
    couleur: Optional[str] = None
    type_engin: str
    plaque_immatriculation: str
    date_vol: Optional[date] = None
    signalement_id: Optional[str] = None

class EnginVoleResponse(BaseModel):
    id: str
    marque: str
    modele: str
    couleur: Optional[str]
    type_engin: str
    plaque_immatriculation: str
    date_vol: Optional[date]
    statut: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[EnginVoleResponse])
def get_engins_voles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engins = db.query(EnginVole).all()
    return engins

@router.get("/{engin_id}", response_model=EnginVoleResponse)
def get_engin_vole(
    engin_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engin = db.query(EnginVole).filter(EnginVole.id == engin_id).first()
    if not engin:
        raise HTTPException(status_code=404, detail="Engin non trouvé")
    return engin

@router.get("/plaque/{plaque}")
def search_by_plaque(
    plaque: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    engin = db.query(EnginVole).filter(EnginVole.plaque_immatriculation == plaque).first()
    if not engin:
        raise HTTPException(status_code=404, detail="Engin non trouvé")
    return engin

@router.post("/", response_model=EnginVoleResponse)
def create_engin_vole(
    data: EnginVoleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Vérifier si la plaque existe déjà
    existing = db.query(EnginVole).filter(EnginVole.plaque_immatriculation == data.plaque_immatriculation).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cette plaque d'immatriculation existe déjà")
    
    engin = EnginVole(
        marque=data.marque,
        modele=data.modele,
        couleur=data.couleur,
        type_engin=data.type_engin,
        plaque_immatriculation=data.plaque_immatriculation,
        date_vol=data.date_vol,
        signalement_id=data.signalement_id
    )
    db.add(engin)
    db.commit()
    db.refresh(engin)
    return engin

@router.delete("/{engin_id}")
def delete_engin_vole(
    engin_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    engin = db.query(EnginVole).filter(EnginVole.id == engin_id).first()
    if not engin:
        raise HTTPException(status_code=404, detail="Engin non trouvé")
    
    db.delete(engin)
    db.commit()
    return {"message": "Engin supprimé"}
