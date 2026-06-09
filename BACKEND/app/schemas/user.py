from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role: str = "citoyen"

class UserCreate(UserBase):
    password: str
    role: str = "citoyen"

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    nom: str
    prenom: str
    telephone: str
    role: str
    statut: str = "actif"
    dateCreation: Optional[datetime] = None
    derniereConnexion: Optional[datetime] = None
    photo: str = "/images/user/user-01.png"

    class Config:
        from_attributes = True
    
    @classmethod
    def model_validate(cls, obj, **kwargs):
        # Mapper les champs du modèle DB aux champs attendus par le frontend
        if hasattr(obj, '__dict__'):
            data = {
                "id": obj.id,
                "email": obj.email,
                "nom": obj.last_name or "",
                "prenom": obj.first_name or "",
                "telephone": obj.phone or "",
                "role": obj.role,
                "statut": obj.status if hasattr(obj, 'status') else "actif",
                "dateCreation": obj.created_at if hasattr(obj, 'created_at') else None,
                "derniereConnexion": obj.last_login if hasattr(obj, 'last_login') else None,
                "photo": "/images/user/user-01.png"
            }
            return cls(**data)
        return super().model_validate(obj, **kwargs)

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

