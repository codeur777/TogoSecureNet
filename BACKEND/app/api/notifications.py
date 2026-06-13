"""
API pour gérer les notifications utilisateurs
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.notification import Notification

router = APIRouter()


from datetime import datetime

class NotificationResponse(BaseModel):
    id: str
    titre: str
    message: str
    lu: bool
    date_creation: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère toutes les notifications de l'utilisateur connecté"""
    notifications = db.query(Notification).filter(
        Notification.utilisateur_id == current_user.id
    ).order_by(Notification.date_creation.desc()).all()
    
    return notifications


@router.patch("/{notification_id}/lire")
def marquer_comme_lu(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marque une notification comme lue"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.utilisateur_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(404, "Notification introuvable")
    
    notification.lu = True
    db.commit()
    
    return {"message": "Notification marquée comme lue"}


@router.delete("/{notification_id}")
def supprimer_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprime une notification"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.utilisateur_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(404, "Notification introuvable")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification supprimée"}


@router.post("/mark-all-read")
def marquer_toutes_comme_lues(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marque toutes les notifications comme lues"""
    db.query(Notification).filter(
        Notification.utilisateur_id == current_user.id,
        Notification.lu == False
    ).update({"lu": True})
    db.commit()
    
    return {"message": "Toutes les notifications ont été marquées comme lues"}
