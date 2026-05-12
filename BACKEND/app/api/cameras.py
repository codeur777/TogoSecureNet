from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.camera import Camera as CameraModel
from app.schemas.camera import Camera, CameraCreate, CameraUpdate

router = APIRouter()

@router.post("/", response_model=Camera)
def create_camera(
    *,
    db: Session = Depends(deps.get_db),
    camera_in: CameraCreate
):
    db_camera = CameraModel(**camera_in.model_dump())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.get("/", response_model=List[Camera])
def read_cameras(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    cameras = db.query(CameraModel).offset(skip).limit(limit).all()
    return cameras

@router.get("/{camera_id}", response_model=Camera)
def read_camera(camera_id: int, db: Session = Depends(deps.get_db)):
    db_camera = db.query(CameraModel).filter(CameraModel.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return db_camera

@router.patch("/{camera_id}", response_model=Camera)
def update_camera(
    camera_id: int,
    camera_in: CameraUpdate,
    db: Session = Depends(deps.get_db)
):
    db_camera = db.query(CameraModel).filter(CameraModel.id == camera_id).first()
    if not db_camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    update_data = camera_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_camera, field, value)
    
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera
