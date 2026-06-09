from sqlalchemy import Column, String, Float, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
import uuid

from app.core.database import Base

class TypeCameraEnum(enum.Enum):
    IP = "ip"
    ESP32 = "esp32"
    MOBILE = "mobile"

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String, nullable=False)
    type = Column(SQLEnum(TypeCameraEnum), default=TypeCameraEnum.IP)
    description = Column(String)
    localisation = Column(String)
    url_flux = Column(String)  # RTSP, MQTT topic, etc.
    est_active = Column(Boolean, default=True)
    
    # Coordonnées GPS
    location_lat = Column(Float)
    location_lng = Column(Float)
    
    last_heartbeat = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    detections = relationship("Detection", back_populates="camera")
    
    def get_flux_video(self):
        return self.url_flux
    
    def activer(self):
        self.est_active = True
    
    def desactiver(self):
        self.est_active = False
