from sqlalchemy.orm import Session
from app.models.audit import Audit
from fastapi import Request


def log_action(db: Session, user_id: str, action: str, request: Request = None):
    ip = None
    ua = None
    if request:
        ip = request.client.host if request.client else None
        ua = request.headers.get("user-agent")
    entry = Audit(utilisateur_id=user_id, action=action, adresse_ip=ip)
    db.add(entry)
    db.commit()
