from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.api import deps
from app.models.person import PersonneDisparue
from app.models.camera import Camera
from app.models.alert import Alerte
from app.models.detection import Detection

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(deps.get_db)):
    # Compteurs de base
    total_persons = db.query(PersonneDisparue).count()
    total_cameras = db.query(Camera).count()
    active_cameras = db.query(Camera).filter(Camera.est_active == True).count()
    
    # Alertes aujourd'hui
    today = datetime.utcnow().date()
    alertes_today = db.query(Alerte).filter(
        func.date(Alerte.date_emission) == today
    ).all()
    
    total_alerts_today = len(alertes_today)
    critical_alerts_today = len([a for a in alertes_today if a.niveau_gravite.value == "tres_grave"])
    
    # Toutes les alertes
    all_alertes = db.query(Alerte).count()
    
    # Taux de confiance moyen (si disponible dans Detection)
    avg_confidence = db.query(func.avg(Detection.score_confiance)).scalar() or 0
    
    # Caméra la plus active (basé sur les détections)
    top_camera = db.query(
        Camera.nom,
        func.count(Detection.id).label("count")
    ).join(
        Detection, Camera.id == Detection.camera_id
    ).group_by(
        Camera.nom
    ).order_by(
        func.count(Detection.id).desc()
    ).first()
    
    most_active_camera = top_camera[0] if top_camera else "—"
    
    # Alertes par jour (7 derniers jours)
    daily_alerts = []
    for i in range(6, -1, -1):
        date = datetime.utcnow().date() - timedelta(days=i)
        day_alertes = db.query(Alerte).filter(
            func.date(Alerte.date_emission) == date
        ).all()
        
        daily_alerts.append({
            "date": str(date),
            "total": len(day_alertes),
            "critical": len([a for a in day_alertes if a.niveau_gravite.value == "tres_grave"])
        })
    
    # Top 5 caméras par nombre d'alertes
    top_cameras_query = db.query(
        Camera.id,
        Camera.nom,
        func.count(Detection.id).label("alert_count")
    ).join(
        Detection, Camera.id == Detection.camera_id
    ).group_by(
        Camera.id, Camera.nom
    ).order_by(
        func.count(Detection.id).desc()
    ).limit(5).all()
    
    top_cameras = [
        {
            "camera_id": str(cam[0]),
            "camera_name": cam[1],
            "alert_count": cam[2]
        }
        for cam in top_cameras_query
    ]
    
    return {
        "total_cameras": total_cameras,
        "active_cameras": active_cameras,
        "total_alerts": all_alertes,
        "total_alerts_today": total_alerts_today,
        "critical_alerts_today": critical_alerts_today,
        "avg_confidence": float(avg_confidence) if avg_confidence else 0.0,
        "most_active_camera": most_active_camera,
        "daily_alerts": daily_alerts,
        "top_cameras": top_cameras
    }
