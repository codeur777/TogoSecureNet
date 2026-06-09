from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, Enum as SQLEnum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
import enum
import uuid

from app.core.database import Base

class NiveauGraviteEnum(enum.Enum):
    PAS_GRAVE = "pas_grave"
    GRAVE = "grave"
    TRES_GRAVE = "tres_grave"

class PersonneDisparue(Base):
    __tablename__ = "personnes_disparues"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String, nullable=False)
    prenoms = Column(String, nullable=False)
    description = Column(Text)
    age = Column(String)
    niveau_gravite = Column(SQLEnum(NiveauGraviteEnum), default=NiveauGraviteEnum.GRAVE)
    date_disparition = Column(Date)
    lieu_disparition = Column(String)
    vecteur_facial = Column(ARRAY(Float))  # Embeddings faciaux
    photo = Column(ARRAY(String))  # URLs des photos
    
    # Foreign Key
    signalement_id = Column(String, ForeignKey('signalements.id'))
    
    # Relations
    signalement = relationship("Signalement", back_populates="personne_disparue")
    detections = relationship("Detection", back_populates="personne_disparue")
    
    def enregistrer(self):
        pass
    
    def mettre_a_jour_statut(self):
        pass
    
    def get_historique_detection(self):
        return self.detections

# Alias pour compatibilité
Person = PersonneDisparue
