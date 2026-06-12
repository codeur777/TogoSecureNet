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
    id: str
    email: EmailStr
    first_name: str = ""
    last_name: str = ""
    full_name: str = ""
    phone: Optional[str] = None
    role: str
    status: str = "actif"
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True
    
    @classmethod
    def model_validate(cls, obj, **kwargs):
        # Générer full_name s'il n'existe pas
        if hasattr(obj, '__dict__'):
            full_name = obj.full_name if obj.full_name else f"{obj.first_name or ''} {obj.last_name or ''}".strip()
            data = {
                "id": str(obj.id),
                "email": obj.email,
                "first_name": obj.first_name or "",
                "last_name": obj.last_name or "",
                "full_name": full_name or "Utilisateur",
                "phone": obj.phone,
                "role": obj.role,
                "status": obj.status if hasattr(obj, 'status') else "actif",
                "created_at": obj.created_at if hasattr(obj, 'created_at') else None,
                "last_login": obj.last_login if hasattr(obj, 'last_login') else None,
            }
            return cls(**data)
        return super().model_validate(obj, **kwargs)

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

