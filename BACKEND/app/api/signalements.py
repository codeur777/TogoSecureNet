from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..database import get_db
from ..models.signalement import Signalement, TypeSignalementEnum, StatutSignalementEnum
from .deps import get_current_user
from ..models.user import User

router = APIRouter()

class SignalementCreate(BaseModel):
    declarant_nom: str
    type_signalement: str
    declarant_contact: str

class SignalementUpdate(BaseModel):
    statut: str

class SignalementResponse(BaseModel):
    id: str
    declarant_nom: str
    type_signalement: str
    declarant_contact: str
    statut: str
    date_declaration: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[SignalementResponse])
def get_signalements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalements = db.query(Signalement).all()
    return signalements

@router.post("/", response_model=SignalementResponse)
def create_signalement(
    data: SignalementCreate,
    db: Session = Depends(get_db)
):
    """Créer un signalement (accès public pour citoyens)"""
    signalement = Signalement(
        declarant_nom=data.declarant_nom,
        type_signalement=TypeSignalementEnum(data.type_signalement),
        declarant_contact=data.declarant_contact
    )
    db.add(signalement)
    db.commit()
    db.refresh(signalement)
    return signalement

@router.patch("/{signalement_id}/valider")
def valider_signalement(
    signalement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement non trouvé")
    
    signalement.valider()
    db.commit()
    return {"message": "Signalement validé"}

@router.patch("/{signalement_id}/rejeter")
def rejeter_signalement(
    signalement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement non trouvé")
    
    signalement.rejeter()
    db.commit()
    return {"message": "Signalement rejeté"}
