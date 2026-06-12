from pydantic import BaseModel
from typing import Optional

class CameraBase(BaseModel):
    nom: str
    type: Optional[str] = "ip"
    description: Optional[str] = None
    localisation: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    url_flux: Optional[str] = None
    est_active: bool = True

class CameraCreate(CameraBase):
    pass

class CameraUpdate(BaseModel):
    nom: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    localisation: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    url_flux: Optional[str] = None
    est_active: Optional[bool] = None

class Camera(CameraBase):
    id: str

    class Config:
        from_attributes = True
