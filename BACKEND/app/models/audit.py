from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Audit(Base):
    __tablename__ = "audits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    action = Column(String, nullable=False)
    date_heure = Column(DateTime(timezone=True), server_default=func.now())
    adresse_ip = Column(String)
    utilisateur_id = Column(String, ForeignKey('users.id'))
    
    def enregistrer(self):
        pass
