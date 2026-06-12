from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Notification(Base):
    """Notifications pour les utilisateurs (non liées aux alertes système)"""
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(String, ForeignKey('users.id'), nullable=False)
    titre = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    lu = Column(Boolean, default=False)
    date_creation = Column(DateTime(timezone=True), server_default=func.now())
    
    # Anciens champs (à garder pour compatibilité)
    fournisseur_sms = Column(String, nullable=True)
    fournisseur_email = Column(String, nullable=True)
    alerte_id = Column(String, ForeignKey('alertes.id'), nullable=True)
    
    # Relations
    alerte = relationship("Alerte", back_populates="notification")
    
    def envoyer_sms(self, destination: str, message: str):
        pass
    
    def envoyer_email(self, destination: str, contenu: str):
        pass
    
    def envoyer_push_notification(self, user_id: str, message: str):
        pass
