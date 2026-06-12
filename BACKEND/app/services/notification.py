from typing import List
from sqlalchemy.orm import Session

from app.models.notification import Notification
from app.models.user import User


def send_notification(db: Session, user_id: str, title: str, message: str, type_notification: str = "info"):
    """
    Envoyer une notification à un utilisateur spécifique
    """
    notification = Notification(
        utilisateur_id=user_id,
        titre=title,
        message=message
    )
    db.add(notification)
    db.commit()
    return notification


def send_notification_to_role(db: Session, role: str, title: str, message: str, type_notification: str = "info"):
    """
    Envoyer une notification à tous les utilisateurs d'un rôle spécifique
    """
    users = db.query(User).filter(User.role == role, User.is_active == True).all()
    notifications = []
    
    for user in users:
        notification = Notification(
            utilisateur_id=user.id,
            titre=title,
            message=message
        )
        db.add(notification)
        notifications.append(notification)
    
    db.commit()
    return notifications


def send_notification_to_roles(db: Session, roles: List[str], title: str, message: str, type_notification: str = "info"):
    """
    Envoyer une notification à tous les utilisateurs de plusieurs rôles
    """
    users = db.query(User).filter(User.role.in_(roles), User.is_active == True).all()
    notifications = []
    
    for user in users:
        notification = Notification(
            utilisateur_id=user.id,
            titre=title,
            message=message
        )
        db.add(notification)
        notifications.append(notification)
    
    db.commit()
    return notifications
