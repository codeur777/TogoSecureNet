from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models.detection import Detection, TypeDetectionEnum
from .deps import get_current_user
from ..models.user import User

router = APIRouter()

class DetectionCreate(BaseModel):
    score_confiance: float
    image_capture: Optional[str] = None
    localisation: Optional[str] = None
    type_detection: str
    camera_id: str
    personne_disparue_id: Optional[str] = None
    engin_vole_id: Optional[str] = None

class DetectionResponse(BaseModel):
    id: str
    date_heure: datetime
    score_confiance: float
    image_capture: Optional[str]
    localisation: Optional[str]
    type_detection: str
    camera_id: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[DetectionResponse])
def get_detections(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detections = db.query(Detection).offset(skip).limit(limit).all()
    return detections

@router.get("/{detection_id}", response_model=DetectionResponse)
def get_detection(
    detection_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detection = db.query(Detection).filter(Detection.id == detection_id).first()
    if not detection:
        raise HTTPException(status_code=404, detail="Détection non trouvée")
    return detection

@router.post("/", response_model=DetectionResponse)
def create_detection(
    data: DetectionCreate,
    db: Session = Depends(get_db)
):
    """Endpoint appelé par le système IA"""
    detection = Detection(
        score_confiance=data.score_confiance,
        image_capture=data.image_capture,
        localisation=data.localisation,
        type_detection=TypeDetectionEnum(data.type_detection),
        camera_id=data.camera_id,
        personne_disparue_id=data.personne_disparue_id,
        engin_vole_id=data.engin_vole_id
    )
    db.add(detection)
    db.commit()
    db.refresh(detection)
    
    # TODO: Générer automatiquement une alerte
    detection.generer_alerte()
    
    return detection

@router.get("/camera/{camera_id}")
def get_detections_by_camera(
    camera_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detections = db.query(Detection).filter(Detection.camera_id == camera_id).all()
    return detections

@router.get("/personne/{personne_id}")
def get_detections_by_personne(
    personne_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detections = db.query(Detection).filter(Detection.personne_disparue_id == personne_id).all()
    return detections
