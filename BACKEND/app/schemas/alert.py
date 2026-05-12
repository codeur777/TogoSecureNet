from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertBase(BaseModel):
    person_id: int
    camera_id: int
    captured_photo_url: Optional[str] = None
    confidence: float
    gravity_level: str
    status: str = "pending"

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
