from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(String, default="citoyen")  # admin, superviseur, agent, citoyen
    status = Column(String, default="actif")  # actif, inactif, suspendu
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    must_change_password = Column(Boolean, default=False)  # True si créé par admin
    two_factor_enabled = Column(Boolean, default=False)  # activé selon le rôle au seed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    audits = relationship("Audit", foreign_keys="[Audit.utilisateur_id]")
