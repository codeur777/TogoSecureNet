from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    height_cm = Column(Integer)
    distinctive_signs = Column(String)
    last_location = Column(String)
    disappearance_date = Column(Date)
    gravity_level = Column(String, default="low") # low, high, critical
    status = Column(String, default="missing") # missing, found, archived
    photo_url = Column(String)
    is_ai_ready = Column(Boolean, default=False)
    ai_metadata = Column(String) # JSON string with analysis details
    created_at = Column(DateTime(timezone=True), server_default=func.now())
