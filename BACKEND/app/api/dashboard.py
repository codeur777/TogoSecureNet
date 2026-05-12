from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.person import Person
from app.models.camera import Camera
from app.models.alert import Alert

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(deps.get_db)):
    total_persons = db.query(Person).count()
    total_cameras = db.query(Camera).filter(Camera.status == "active").count()
    pending_alerts = db.query(Alert).filter(Alert.status == "pending").count()
    resolved_incidents = db.query(Alert).filter(Alert.status == "resolved").count()
    
    return {
        "total_persons": total_persons,
        "active_cameras": total_cameras,
        "pending_alerts": pending_alerts,
        "resolved_incidents": resolved_incidents
    }
