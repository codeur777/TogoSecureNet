from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class PersonBase(BaseModel):
    first_name: str
    last_name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    distinctive_signs: Optional[str] = None
    last_location: Optional[str] = None
    disappearance_date: Optional[date] = None
    gravity_level: str = "low"
    status: str = "missing"
    photo_url: Optional[str] = None
    is_ai_ready: bool = False
    ai_metadata: Optional[str] = None

class PersonCreate(PersonBase):
    pass

class PersonUpdate(PersonBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class Person(PersonBase):
    id: int

    class Config:
        from_attributes = True
