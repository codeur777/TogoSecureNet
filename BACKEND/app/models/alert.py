from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("persons.id"))
    camera_id = Column(Integer, ForeignKey("cameras.id"))
    captured_photo_url = Column(String)
    confidence = Column(Float)
    gravity_level = Column(String)
    status = Column(String, default="pending") # pending, validated, rejected, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())
