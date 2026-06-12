"""
Modèle Signalement - Déclarations citoyennes
"""
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.core.database import Base

class TypeSignalementEnum(enum.Enum):
    PERSONNE_DISPARUE = "personne_disparue"
    ENGIN_VOLE = "engin_vole"

class StatutSignalementEnum(enum.Enum):
    EN_ATTENTE = "en_attente"
    VALIDE = "valide"
    REJETE = "rejete"

class Signalement(Base):
    __tablename__ = "signalements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    numero_suivi = Column(String, unique=True, nullable=False)  # Numéro de suivi
    declarant_nom = Column(String, nullable=False)
    type_signalement = Column(SQLEnum(TypeSignalementEnum), nullable=False)
    declarant_contact = Column(String, nullable=False)
    statut = Column(SQLEnum(StatutSignalementEnum), default=StatutSignalementEnum.EN_ATTENTE)
    date_declaration = Column(DateTime(timezone=True), server_default=func.now())
    date_validation = Column(DateTime(timezone=True), nullable=True)  # Date validation
    validateur_id = Column(String, ForeignKey('users.id'), nullable=True)  # Qui a validé
    motif_rejet = Column(String, nullable=True)  # Si rejeté
    
    # Relations
    personne_disparue = relationship("PersonneDisparue", back_populates="signalement", uselist=False)
    engin_vole = relationship("EnginVole", back_populates="signalement", uselist=False)
    
    # Méthodes
    def rejeter(self):
        self.statut = StatutSignalementEnum.REJETE
    
    def soumettre(self):
        self.statut = StatutSignalementEnum.EN_ATTENTE
    
    def valider(self):
        self.statut = StatutSignalementEnum.VALIDE
    
    @staticmethod
    def generer_numero_suivi():
        """Génère un numéro de suivi unique (ex: TSN-2026-001234)"""
        import random
        import datetime
        year = datetime.datetime.now().year
        num = random.randint(100000, 999999)
        return f"TSN-{year}-{num}"
