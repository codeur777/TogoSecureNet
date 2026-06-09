from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.user import User
from .deps import get_current_user

router = APIRouter()

# Modèle temporaire pour les logs d'audit (à remplacer par un vrai modèle DB)
class AuditLog:
    def __init__(self, id, user_email, action, module, description, timestamp, ip_address, status, details=None):
        self.id = id
        self.utilisateur = user_email
        self.action = action
        self.module = module
        self.description = description
        self.dateHeure = timestamp
        self.ipAddress = ip_address
        self.statut = status
        self.details = details

@router.get("/logs")
def get_audit_logs(
    module: Optional[str] = None,
    status_filter: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupérer les logs d'audit (Admin uniquement)
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux administrateurs"
        )
    
    # TODO: Remplacer par une vraie table d'audit dans la BD
    # Pour l'instant, retourner des données d'exemple
    logs = [
        {
            "id": 1,
            "utilisateur": "admin@togosecurenet.tg",
            "action": "Connexion",
            "module": "systeme",
            "description": "Connexion réussie de l'administrateur",
            "dateHeure": datetime.now().isoformat(),
            "ipAddress": "192.168.1.100",
            "statut": "succes"
        },
        {
            "id": 2,
            "utilisateur": "superviseur@togosecurenet.tg",
            "action": "Consultation signalements",
            "module": "signalements",
            "description": "Consultation de la liste des signalements",
            "dateHeure": datetime.now().isoformat(),
            "ipAddress": "192.168.1.105",
            "statut": "succes"
        }
    ]
    
    # Filtrer par module si spécifié
    if module and module != "tous":
        logs = [log for log in logs if log["module"] == module]
    
    # Filtrer par statut si spécifié
    if status_filter and status_filter != "tous":
        logs = [log for log in logs if log["statut"] == status_filter]
    
    # Limiter le nombre de résultats
    return logs[:limit]

@router.post("/logs")
def create_audit_log(
    action: str,
    module: str,
    description: str,
    status: str = "succes",
    details: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Créer un nouveau log d'audit
    """
    # TODO: Implémenter l'écriture dans une vraie table d'audit
    log_data = {
        "utilisateur": current_user.email,
        "action": action,
        "module": module,
        "description": description,
        "dateHeure": datetime.now().isoformat(),
        "statut": status,
        "details": details
    }
    
    return {"message": "Log créé", "log": log_data}
