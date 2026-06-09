from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..database import get_db
from ..models.alert import Alerte, GraviteEnum
from .deps import get_current_user
from ..models.user import User

router = APIRouter()

class AlerteResponse(BaseModel):
    id: str
    niveau_gravite: str
    type_detection: str
    message: str
    est_lue: bool
    date_emission: str
    detection_id: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[AlerteResponse])
def get_alertes(
    est_lue: bool = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Alerte)
    if est_lue is not None:
        query = query.filter(Alerte.est_lue == est_lue)
    
    alertes = query.order_by(Alerte.date_emission.desc()).all()
    return alertes

@router.get("/{alerte_id}", response_model=AlerteResponse)
def get_alerte(
    alerte_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alerte = db.query(Alerte).filter(Alerte.id == alerte_id).first()
    if not alerte:
        raise HTTPException(status_code=404, detail="Alerte non trouvée")
    return alerte

@router.patch("/{alerte_id}/lire")
def marquer_alerte_lue(
    alerte_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    alerte = db.query(Alerte).filter(Alerte.id == alerte_id).first()
    if not alerte:
        raise HTTPException(status_code=404, detail="Alerte non trouvée")
    
    alerte.marquer_agent_lu()
    db.commit()
    return {"message": "Alerte marquée comme lue"}

@router.get("/non-lues/count")
def count_alertes_non_lues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = db.query(Alerte).filter(Alerte.est_lue == False).count()
    return {"count": count}
