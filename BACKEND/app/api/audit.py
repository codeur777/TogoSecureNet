from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.user import User
from ..models.audit import Audit
from .deps import get_current_user

router = APIRouter()

@router.get("/logs")
def get_audit_logs(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer les logs d'audit (Admin uniquement)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    
    # Récupérer depuis la vraie table audits
    audits = db.query(Audit).order_by(Audit.date_heure.desc()).limit(limit).all()
    
    # Formater pour le frontend
    logs = []
    for audit in audits:
        # Récupérer l'email de l'utilisateur
        user = db.query(User).filter(User.id == audit.utilisateur_id).first()
        logs.append({
            "id": audit.id,
            "utilisateur": user.email if user else "Inconnu",
            "action": audit.action,
            "dateHeure": audit.date_heure.isoformat() if audit.date_heure else None,
            "ipAddress": audit.adresse_ip
        })
    
    return logs
