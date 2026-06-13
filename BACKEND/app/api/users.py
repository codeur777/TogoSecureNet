from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, UserResponse
from .deps import get_current_user
from ..core.security import get_password_hash

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupérer tous les utilisateurs (Admin uniquement)
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    
    users = db.query(User).all()
    
    # Mettre à jour full_name pour les utilisateurs qui n'en ont pas
    for user in users:
        if not user.full_name and (user.first_name or user.last_name):
            user.full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
    
    db.commit()
    
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupérer un utilisateur par ID
    """
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return user

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Créer un nouvel utilisateur (Admin uniquement)
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    
    # Vérifier si l'email existe déjà
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé"
        )
    
    # Valider le téléphone si fourni
    if user_data.phone:
        from app.utils.phone_utils import validate_phone_number
        is_valid, result = validate_phone_number(user_data.phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        user_data.phone = result  # Format E164
    
    # Créer l'utilisateur
    hashed_password = get_password_hash(user_data.password)
    full_name = f"{user_data.first_name} {user_data.last_name}".strip()
    
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        full_name=full_name,
        phone=user_data.phone,
        role=user_data.role,
        status="actif",
        is_verified=False,  # Email non vérifié
        must_change_password=True,  # Doit changer le mot de passe
        two_factor_enabled=True  # 2FA obligatoire pour comptes non vérifiés
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mettre à jour un utilisateur
    """
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    # Mettre à jour les champs fournis
    update_data = user_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "password" and value:
            setattr(user, "hashed_password", get_password_hash(value))
        else:
            setattr(user, field, value)
    
    # Regénérer full_name si first_name ou last_name sont modifiés
    if 'first_name' in update_data or 'last_name' in update_data:
        user.full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
    
    db.commit()
    db.refresh(user)
    
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Supprimer un utilisateur (Admin uniquement)
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    
    # Ne pas permettre de supprimer son propre compte
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous ne pouvez pas supprimer votre propre compte"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    db.delete(user)
    db.commit()
    
    return None

@router.put("/me")
def update_my_profile(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour son propre profil"""
    if "first_name" in data:
        current_user.first_name = data["first_name"]
    if "last_name" in data:
        current_user.last_name = data["last_name"]
    if "phone" in data:
        current_user.phone = data["phone"]
    
    current_user.full_name = f"{current_user.first_name} {current_user.last_name}".strip()
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Profil mis à jour"}
