from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.alert import Alert as AlertModel
from app.schemas.alert import Alert, AlertCreate

router = APIRouter()

@router.get("/", response_model=List[Alert])
def read_alerts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db)
):
    alerts = db.query(AlertModel).order_by(AlertModel.created_at.desc()).offset(skip).limit(limit).all()
    return alerts

@router.patch("/{alert_id}", response_model=Alert)
def update_alert_status(
    alert_id: int,
    status: str,
    db: Session = Depends(deps.get_db)
):
    db_alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not db_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db_alert.status = status
    db.commit()
    db.refresh(db_alert)
    return db_alert
