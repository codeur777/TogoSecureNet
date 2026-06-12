from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import date, datetime
import shutil
import os

from ..database import get_db
from ..models.signalement import Signalement, TypeSignalementEnum, StatutSignalementEnum
from ..models.person import PersonneDisparue, NiveauGraviteEnum
from ..models.engin_vole import EnginVole
from ..models.user import User
from .deps import get_current_user
from ..services.notification import send_notification_to_roles

router = APIRouter()

# ── Schémas ───────────────────────────────────────────────────────────────────

class SignalementCreate(BaseModel):
    declarant_nom: str
    declarant_contact: str
    type_signalement: str  # "personne_disparue" ou "engin_vole"

class PersonneDisparuePublic(BaseModel):
    signalement_id: str
    nom: str
    prenoms: str
    age: str
    date_disparition: date
    lieu_disparition: str
    description: Optional[str] = None
    photos: Optional[List[str]] = []  # URLs des photos uploadées
    # niveau_gravite retiré - sera défini par admin/superviseur

class EnginVolePublic(BaseModel):
    signalement_id: str
    type_engin: str
    marque: str
    modele: str
    couleur: Optional[str] = None
    plaque_immatriculation: str
    date_vol: date
    lieu_vol: Optional[str] = None
    circonstances: Optional[str] = None

class SignalementResponse(BaseModel):
    id: str
    numero_suivi: str
    declarant_nom: str
    declarant_contact: str
    type_signalement: str
    statut: str

    class Config:
        from_attributes = True

# ── Routes Publiques (sans authentification) ───────────────────────────────────

@router.post("/", response_model=SignalementResponse, status_code=201)
def create_signalement(
    data: SignalementCreate,
    db: Session = Depends(get_db)
):
    """Route publique pour créer un signalement"""
    # Générer numéro de suivi unique
    numero_suivi = Signalement.generer_numero_suivi()
    
    signalement = Signalement(
        numero_suivi=numero_suivi,
        declarant_nom=data.declarant_nom,
        declarant_contact=data.declarant_contact,
        type_signalement=TypeSignalementEnum(data.type_signalement),
        statut=StatutSignalementEnum.EN_ATTENTE
    )
    db.add(signalement)
    db.commit()
    db.refresh(signalement)
    
    return signalement


@router.post("/personne", status_code=201)
def create_personne_disparue_public(
    data: PersonneDisparuePublic,
    db: Session = Depends(get_db)
):
    """Route publique pour ajouter une personne disparue à un signalement"""
    signalement = db.query(Signalement).filter(
        Signalement.id == data.signalement_id
    ).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    if signalement.type_signalement != TypeSignalementEnum.PERSONNE_DISPARUE:
        raise HTTPException(status_code=400, detail="Type de signalement incorrect")
    
    # Vérifier qu'au moins une photo est fournie
    if not data.photos or len(data.photos) == 0:
        raise HTTPException(status_code=400, detail="Au moins une photo est requise")
    
    personne = PersonneDisparue(
        nom=data.nom,
        prenoms=data.prenoms,
        age=data.age,
        date_disparition=data.date_disparition,
        lieu_disparition=data.lieu_disparition,
        description=data.description,
        niveau_gravite=NiveauGraviteEnum.GRAVE,  # Valeur par défaut, sera modifiée par admin
        signalement_id=data.signalement_id,
        photo=data.photos
    )
    db.add(personne)
    db.commit()
    db.refresh(personne)
    
    _notify_new_signalement(db, signalement, personne)
    
    return {
        "message": "Signalement enregistré avec succès",
        "personne_id": personne.id,
        "numero_suivi": signalement.numero_suivi
    }


@router.post("/upload-photo", status_code=201)
async def upload_photo(
    file: UploadFile = File(...),
):
    """Upload une photo pour un signalement"""
    # Créer le dossier uploads si inexistant
    os.makedirs("uploads/signalements", exist_ok=True)
    
    # Générer nom unique
    import uuid
    ext = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"uploads/signalements/{filename}"
    
    # Sauvegarder
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"/static/signalements/{filename}"}


@router.post("/engin", status_code=201)
def create_engin_vole_public(
    data: EnginVolePublic,
    db: Session = Depends(get_db)
):
    """Route publique pour ajouter un engin volé à un signalement"""
    # Vérifier que le signalement existe
    signalement = db.query(Signalement).filter(
        Signalement.id == data.signalement_id
    ).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    if signalement.type_signalement != TypeSignalementEnum.ENGIN_VOLE:
        raise HTTPException(status_code=400, detail="Type de signalement incorrect")
    
    # Vérifier que la plaque n'existe pas déjà
    existing = db.query(EnginVole).filter(
        EnginVole.plaque_immatriculation == data.plaque_immatriculation.upper()
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Un signalement existe déjà pour cette plaque d'immatriculation"
        )
    
    # Créer l'engin volé
    engin = EnginVole(
        type_engin=data.type_engin,
        marque=data.marque,
        modele=data.modele,
        couleur=data.couleur,
        plaque_immatriculation=data.plaque_immatriculation.upper(),
        date_vol=data.date_vol,
        signalement_id=data.signalement_id
    )
    db.add(engin)
    db.commit()
    db.refresh(engin)
    
    # Notifier admin et superviseurs
    _notify_new_signalement(db, signalement, engin)
    
    return {"message": "Signalement enregistré avec succès", "engin_id": engin.id}


# ── Routes Protégées (avec authentification) ───────────────────────────────────

@router.get("/", response_model=List[SignalementResponse])
def get_signalements(
    statut: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste des signalements (admin/superviseur)"""
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    query = db.query(Signalement)
    
    if statut:
        query = query.filter(Signalement.statut == StatutSignalementEnum(statut))
    
    signalements = query.order_by(Signalement.date_declaration.desc()).all()
    return signalements


@router.get("/{signalement_id}")
def get_signalement_details(
    signalement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Détails d'un signalement"""
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    # Retourner avec les détails selon le type
    result = {
        "id": signalement.id,
        "declarant_nom": signalement.declarant_nom,
        "declarant_contact": signalement.declarant_contact,
        "type_signalement": signalement.type_signalement.value,
        "statut": signalement.statut.value,
        "date_declaration": signalement.date_declaration.isoformat(),
    }
    
    if signalement.type_signalement == TypeSignalementEnum.PERSONNE_DISPARUE:
        result["personne"] = signalement.personne_disparue
    elif signalement.type_signalement == TypeSignalementEnum.ENGIN_VOLE:
        result["engin"] = signalement.engin_vole
    
    return result


class ValidationRequest(BaseModel):
    niveau_gravite: Optional[str] = None  # Pour les personnes disparues

@router.patch("/{signalement_id}/valider")
def valider_signalement(
    signalement_id: str,
    validation: Optional[ValidationRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Valider un signalement"""
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    # Mettre à jour le niveau de gravité si fourni (personne disparue)
    if validation and validation.niveau_gravite and signalement.personne_disparue:
        try:
            signalement.personne_disparue.niveau_gravite = NiveauGraviteEnum(validation.niveau_gravite)
        except ValueError:
            raise HTTPException(status_code=400, detail="Niveau de gravité invalide")
    
    signalement.valider()
    signalement.date_validation = datetime.utcnow()
    signalement.validateur_id = current_user.id
    db.commit()
    
    # TODO: Notifier le citoyen de la validation
    # TODO: Extraire les vecteurs biométriques via IA (si personne disparue)
    
    return {"message": "Signalement validé", "numero_suivi": signalement.numero_suivi}


@router.patch("/{signalement_id}/rejeter")
def rejeter_signalement(
    signalement_id: str,
    motif: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Rejeter un signalement"""
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    signalement.rejeter()
    if motif:
        signalement.motif_rejet = motif
    db.commit()
    
    # TODO: Notifier le citoyen du rejet
    
    return {"message": "Signalement rejeté"}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _notify_new_signalement(db: Session, signalement: Signalement, entity):
    """Notifier les admin et superviseurs d'un nouveau signalement"""
    try:
        if signalement.type_signalement == TypeSignalementEnum.PERSONNE_DISPARUE:
            title = "Nouveau signalement - Personne disparue"
            message = f"Un citoyen a signalé la disparition de {entity.prenoms} {entity.nom}. Numéro de suivi: {signalement.numero_suivi}. Veuillez valider ou rejeter ce signalement."
        else:
            title = "Nouveau signalement - Engin volé"
            message = f"Un citoyen a signalé le vol d'un engin ({entity.marque} {entity.modele}, plaque: {entity.plaque_immatriculation}). Numéro de suivi: {signalement.numero_suivi}. Veuillez valider ou rejeter ce signalement."
        
        # Envoyer aux admin et superviseurs
        send_notification_to_roles(
            db=db,
            roles=["admin", "superviseur"],
            title=title,
            message=message
        )
        
        print(f"[NOTIFICATION] Envoyée aux admin/superviseurs pour signalement {signalement.numero_suivi}")
    except Exception as e:
        print(f"[ERREUR NOTIFICATION] {str(e)}")
