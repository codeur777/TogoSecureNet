from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.core.database import Base

class GraviteEnum(enum.Enum):
    PAS_GRAVE = "pas_grave"
    GRAVE = "grave"
    TRES_GRAVE = "tres_grave"

class Alerte(Base):
    __tablename__ = "alertes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    niveau_gravite = Column(SQLEnum(GraviteEnum), nullable=False)
    type_detection = Column(String)
    message = Column(String)
    est_lue = Column(Boolean, default=False)
    date_emission = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign Key
    detection_id = Column(String, ForeignKey('detections.id'))
    
    # Relations
    detection = relationship("Detection", back_populates="alerte")
    notification = relationship("Notification", back_populates="alerte", uselist=False)
    
    def envoyer(self):
        pass
    
    def marquer_agent_lu(self):
        self.est_lue = True
    
    def notifier_agent(self):
        pass

# Alias pour compatibilité
Alert = Alerte
