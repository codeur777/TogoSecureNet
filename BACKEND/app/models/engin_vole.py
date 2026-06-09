from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.core.database import Base

class StatutEnginEnum(enum.Enum):
    RECHERCHE = "recherche"
    RETROUVE = "retrouve"
    ARCHIVE = "archive"

class EnginVole(Base):
    __tablename__ = "engins_voles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    marque = Column(String, nullable=False)
    modele = Column(String, nullable=False)
    couleur = Column(String)
    type_engin = Column(String, nullable=False)  # moto, voiture, etc.
    plaque_immatriculation = Column(String, unique=True, nullable=False)
    date_vol = Column(Date)
    statut = Column(SQLEnum(StatutEnginEnum), default=StatutEnginEnum.RECHERCHE)
    
    # Foreign Keys
    signalement_id = Column(String, ForeignKey('signalements.id'))
    
    # Relations
    signalement = relationship("Signalement", back_populates="engin_vole")
    detections = relationship("Detection", back_populates="engin_vole")
    
    def enregistrer(self):
        pass
    
    def rechercher_par_plaque(self, plaque: str):
        pass
