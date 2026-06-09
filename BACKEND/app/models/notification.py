from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    fournisseur_sms = Column(String)
    fournisseur_email = Column(String)
    
    # Foreign Key
    alerte_id = Column(String, ForeignKey('alertes.id'))
    
    # Relations
    alerte = relationship("Alerte", back_populates="notification")
    
    def envoyer_sms(self, destination: str, message: str):
        pass
    
    def envoyer_email(self, destination: str, contenu: str):
        pass
    
    def envoyer_push_notification(self, user_id: str, message: str):
        pass
