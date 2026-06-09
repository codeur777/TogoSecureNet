from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.core.database import Base

class TypeDetectionEnum(enum.Enum):
    PERSONNE = "personne"
    ENGIN = "engin"

class Detection(Base):
    __tablename__ = "detections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    date_heure = Column(DateTime(timezone=True), server_default=func.now())
    score_confiance = Column(Float, nullable=False)
    image_capture = Column(String)
    localisation = Column(String)
    type_detection = Column(SQLEnum(TypeDetectionEnum), nullable=False)
    
    # Foreign Keys
    camera_id = Column(String, ForeignKey('cameras.id'))
    personne_disparue_id = Column(String, ForeignKey('personnes_disparues.id'), nullable=True)
    engin_vole_id = Column(String, ForeignKey('engins_voles.id'), nullable=True)
    
    # Relations
    camera = relationship("Camera", back_populates="detections")
    personne_disparue = relationship("PersonneDisparue", back_populates="detections")
    engin_vole = relationship("EnginVole", back_populates="detections")
    alerte = relationship("Alerte", back_populates="detection", uselist=False)
    
    def generer_alerte(self):
        pass
    
    def sauvegarder(self):
        pass
