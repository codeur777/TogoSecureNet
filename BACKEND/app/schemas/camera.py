from pydantic import BaseModel
from typing import Optional

class CameraBase(BaseModel):
    name: str
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    address: Optional[str] = None
    rtsp_url: Optional[str] = None
    status: str = "active"

class CameraCreate(CameraBase):
    pass

class CameraUpdate(CameraBase):
    name: Optional[str] = None

class Camera(CameraBase):
    id: int

    class Config:
        from_attributes = True
