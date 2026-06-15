from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
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
    declarant_email: Optional[str] = None
    declarant_phone: Optional[str] = None
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
    numero_suivi: Optional[str] = None
    declarant_nom: str
    declarant_email: Optional[str] = None
    declarant_phone: Optional[str] = None
    type_signalement: str
    statut: str
    date_declaration: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

@router.post("/personne-complete", status_code=201)
def create_personne_complete(
    declarant_nom: str = Form(...),
    declarant_email: Optional[str] = Form(None),
    declarant_phone: Optional[str] = Form(None),
    nom: str = Form(...),
    prenoms: str = Form(...),
    age: str = Form(...),
    date_disparition: date = Form(...),
    lieu_disparition: str = Form(...),
    description: Optional[str] = Form(None),
    photos: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Route publique ATOMIQUE pour créer un signalement de personne disparue complet.
    Tout est créé en une seule transaction.
    """
    from app.utils.phone_utils import validate_phone_number
    import uuid
    import os
    
    # Valider qu'au moins un contact est fourni
    if not declarant_email and not declarant_phone:
        raise HTTPException(400, "Email ou téléphone requis")
    
    # Valider le téléphone si fourni
    if declarant_phone:
        is_valid, result = validate_phone_number(declarant_phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        declarant_phone = result
    
    # Vérifier qu'au moins une photo est fournie
    if not photos or len(photos) == 0:
        raise HTTPException(400, "Au moins une photo est requise")
    
    try:
        # Upload des photos
        os.makedirs("uploads/signalements", exist_ok=True)
        photo_urls = []
        
        for photo in photos:
            ext = photo.filename.split('.')[-1] if '.' in photo.filename else 'jpg'
            filename = f"{uuid.uuid4()}.{ext}"
            filepath = f"uploads/signalements/{filename}"
            
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
            
            photo_urls.append(f"/static/signalements/{filename}")
        
        # Transaction atomique
        numero_suivi = Signalement.generer_numero_suivi()
        
        # Créer signalement
        signalement = Signalement(
            numero_suivi=numero_suivi,
            declarant_nom=declarant_nom,
            declarant_email=declarant_email,
            declarant_phone=declarant_phone,
            type_signalement=TypeSignalementEnum.PERSONNE_DISPARUE,
            statut=StatutSignalementEnum.EN_ATTENTE
        )
        db.add(signalement)
        db.flush()  # Pour obtenir l'ID
        
        # Créer personne disparue
        personne = PersonneDisparue(
            nom=nom,
            prenoms=prenoms,
            age=age,
            date_disparition=date_disparition,
            lieu_disparition=lieu_disparition,
            description=description,
            niveau_gravite=NiveauGraviteEnum.GRAVE,
            signalement_id=signalement.id,
            photo=photo_urls
        )
        db.add(personne)
        db.commit()
        
        # Notifier admin/superviseurs
        _notify_new_signalement(db, signalement, personne)
        
        return {
            "message": "Signalement enregistré avec succès",
            "numero_suivi": numero_suivi,
            "signalement_id": signalement.id,
            "personne_id": personne.id
        }
        
    except Exception as e:
        db.rollback()
        # Nettoyer les photos uploadées en cas d'erreur
        for url in photo_urls:
            try:
                filepath = f"uploads/signalements/{url.split('/')[-1]}"
                if os.path.exists(filepath):
                    os.remove(filepath)
            except:
                pass
        raise HTTPException(500, f"Erreur lors de l'enregistrement: {str(e)}")


@router.post("/engin-complete", status_code=201)
def create_engin_complete(
    declarant_nom: str = Form(...),
    declarant_email: Optional[str] = Form(None),
    declarant_phone: Optional[str] = Form(None),
    type_engin: str = Form(...),
    marque: str = Form(...),
    modele: str = Form(...),
    plaque_immatriculation: str = Form(...),
    couleur: Optional[str] = Form(None),
    date_vol: date = Form(...),
    lieu_vol: Optional[str] = Form(None),
    circonstances: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Route publique ATOMIQUE pour créer un signalement d'engin volé complet.
    Tout est créé en une seule transaction.
    """
    from app.utils.phone_utils import validate_phone_number
    
    # Valider qu'au moins un contact est fourni
    if not declarant_email and not declarant_phone:
        raise HTTPException(400, "Email ou téléphone requis")
    
    # Valider le téléphone si fourni
    if declarant_phone:
        is_valid, result = validate_phone_number(declarant_phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        declarant_phone = result
    
    # Vérifier que la plaque n'existe pas déjà
    existing = db.query(EnginVole).filter(
        EnginVole.plaque_immatriculation == plaque_immatriculation.upper()
    ).first()
    
    if existing:
        raise HTTPException(400, "Un signalement existe déjà pour cette plaque")
    
    try:
        # Transaction atomique
        numero_suivi = Signalement.generer_numero_suivi()
        
        # Créer signalement
        signalement = Signalement(
            numero_suivi=numero_suivi,
            declarant_nom=declarant_nom,
            declarant_email=declarant_email,
            declarant_phone=declarant_phone,
            type_signalement=TypeSignalementEnum.ENGIN_VOLE,
            statut=StatutSignalementEnum.EN_ATTENTE
        )
        db.add(signalement)
        db.flush()
        
        # Créer engin volé
        engin = EnginVole(
            type_engin=type_engin,
            marque=marque,
            modele=modele,
            couleur=couleur,
            plaque_immatriculation=plaque_immatriculation.upper(),
            date_vol=date_vol,
            lieu_vol=lieu_vol,
            circonstances=circonstances,
            signalement_id=signalement.id
        )
        db.add(engin)
        db.commit()
        
        # Notifier admin/superviseurs
        _notify_new_signalement(db, signalement, engin)
        
        return {
            "message": "Signalement enregistré avec succès",
            "numero_suivi": numero_suivi,
            "signalement_id": signalement.id,
            "engin_id": engin.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Erreur lors de l'enregistrement: {str(e)}")


# ── Routes Publiques (ANCIENNES - garder pour compatibilité) ──────────────────

@router.post("/", response_model=SignalementResponse, status_code=201)
def create_signalement(
    data: SignalementCreate,
    db: Session = Depends(get_db)
):
    """Route publique pour créer un signalement"""
    from app.utils.phone_utils import validate_phone_number
    
    # Valider qu'au moins un moyen de contact est fourni
    if not data.declarant_email and not data.declarant_phone:
        raise HTTPException(400, "Email ou téléphone requis")
    
    # Valider le téléphone si fourni
    if data.declarant_phone:
        is_valid, result = validate_phone_number(data.declarant_phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        data.declarant_phone = result  # Format E164
    
    # Générer numéro de suivi unique
    numero_suivi = Signalement.generer_numero_suivi()
    
    signalement = Signalement(
        numero_suivi=numero_suivi,
        declarant_nom=data.declarant_nom,
        declarant_email=data.declarant_email,
        declarant_phone=data.declarant_phone,
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

@router.get("/mes-signalements", response_model=List[SignalementResponse])
def get_mes_signalements(
    statut: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les signalements du citoyen connecté"""
    from app.services.signalement_service import get_user_signalements
    
    signalements = get_user_signalements(db, current_user.id, statut)
    return signalements


@router.get("/", response_model=List[SignalementResponse])
def get_signalements(
    statut: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste des signalements (admin/superviseur) ou mes signalements (citoyen)"""
    # Si citoyen, retourner uniquement ses signalements
    if current_user.role == "citoyen":
        from app.services.signalement_service import get_user_signalements
        signalements = get_user_signalements(db, current_user.id, statut)
        # Sérialiser correctement pour les citoyens
        return [{
            "id": s.id,
            "numero_suivi": s.numero_suivi or "",
            "declarant_nom": s.declarant_nom,
            "declarant_email": s.declarant_email or "",
            "declarant_phone": s.declarant_phone or "",
            "type_signalement": s.type_signalement.value,
            "statut": s.statut.value,
            "date_declaration": s.date_declaration.isoformat()
        } for s in signalements]
    
    # Si admin/superviseur, retourner tous les signalements
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    query = db.query(Signalement)
    
    if statut:
        query = query.filter(Signalement.statut == StatutSignalementEnum(statut))
    
    signalements = query.order_by(Signalement.date_declaration.desc()).all()
    
    # Convertir en réponse avec gestion des champs optionnels
    return [{
        "id": s.id,
        "numero_suivi": s.numero_suivi or "",
        "declarant_nom": s.declarant_nom,
        "declarant_email": s.declarant_email or "",
        "declarant_phone": s.declarant_phone or "",
        "type_signalement": s.type_signalement.value,
        "statut": s.statut.value,
        "date_declaration": s.date_declaration.isoformat()
    } for s in signalements]


@router.get("/{signalement_id}")
def get_signalement_details(
    signalement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Détails d'un signalement"""
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    # Vérifier les permissions : admin/superviseur TOUJOURS, citoyen SEULEMENT si c'est son signalement
    if current_user.role not in ["admin", "superviseur"]:
        if signalement.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès refusé")
    
    # Retourner avec les détails selon le type
    result = {
        "id": signalement.id,
        "numero_suivi": signalement.numero_suivi,
        "declarant_nom": signalement.declarant_nom,
        "declarant_email": signalement.declarant_email or "",
        "declarant_phone": signalement.declarant_phone or "",
        "type_signalement": signalement.type_signalement.value,
        "statut": signalement.statut.value,
        "date_declaration": signalement.date_declaration.isoformat(),
    }
    
    if signalement.type_signalement == TypeSignalementEnum.PERSONNE_DISPARUE:
        personne = signalement.personne_disparue
        if personne:
            result["personne"] = {
                "id": personne.id,
                "nom": personne.nom,
                "prenoms": personne.prenoms,
                "age": personne.age,
                "description": personne.description,
                "date_disparition": personne.date_disparition.isoformat() if personne.date_disparition else None,
                "lieu_disparition": personne.lieu_disparition,
                "niveau_gravite": personne.niveau_gravite.value,
                "photo": personne.photo,
                "vecteur_facial": personne.vecteur_facial,
                "has_embeddings": personne.vecteur_facial is not None and len(personne.vecteur_facial) > 0
            }
    elif signalement.type_signalement == TypeSignalementEnum.ENGIN_VOLE:
        engin = signalement.engin_vole
        if engin:
            result["engin"] = {
                "id": engin.id,
                "type_engin": engin.type_engin,
                "marque": engin.marque,
                "modele": engin.modele,
                "couleur": engin.couleur,
                "plaque_immatriculation": engin.plaque_immatriculation,
                "date_vol": engin.date_vol.isoformat() if engin.date_vol else None,
                "lieu_vol": engin.lieu_vol,
                "circonstances": engin.circonstances
            }
    
    return result


@router.put("/{signalement_id}/update-personne", status_code=200)
def update_personne_signalement(
    signalement_id: str,
    declarant_nom: str = Form(...),
    declarant_email: Optional[str] = Form(None),
    declarant_phone: Optional[str] = Form(None),
    nom: str = Form(...),
    prenoms: str = Form(...),
    age: str = Form(...),
    date_disparition: date = Form(...),
    lieu_disparition: str = Form(...),
    description: Optional[str] = Form(None),
    photos: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un signalement de personne disparue (uniquement si statut en_attente)"""
    from app.utils.phone_utils import validate_phone_number
    import uuid
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    # Vérifier que l'utilisateur est propriétaire du signalement
    if signalement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres signalements")
    
    # Vérifier que le statut permet la modification
    if signalement.statut != StatutSignalementEnum.EN_ATTENTE:
        raise HTTPException(status_code=400, detail="Ce signalement ne peut plus être modifié (déjà examiné)")
    
    # Vérifier que c'est bien une personne disparue
    if signalement.type_signalement != TypeSignalementEnum.PERSONNE_DISPARUE:
        raise HTTPException(status_code=400, detail="Ce signalement n'est pas une personne disparue")
    
    # Valider le téléphone si fourni
    if declarant_phone:
        is_valid, result = validate_phone_number(declarant_phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        declarant_phone = result
    
    try:
        # Mettre à jour les infos du signalement
        signalement.declarant_nom = declarant_nom
        signalement.declarant_email = declarant_email
        signalement.declarant_phone = declarant_phone
        
        # Mettre à jour la personne disparue
        personne = signalement.personne_disparue
        if not personne:
            raise HTTPException(status_code=404, detail="Personne disparue introuvable")
        
        personne.nom = nom
        personne.prenoms = prenoms
        personne.age = age
        personne.date_disparition = date_disparition
        personne.lieu_disparition = lieu_disparition
        personne.description = description
        
        # Ajouter de nouvelles photos si fournies
        if photos and len(photos) > 0:
            os.makedirs("uploads/signalements", exist_ok=True)
            new_photo_urls = []
            
            for photo in photos:
                ext = photo.filename.split('.')[-1] if '.' in photo.filename else 'jpg'
                filename = f"{uuid.uuid4()}.{ext}"
                filepath = f"uploads/signalements/{filename}"
                
                with open(filepath, "wb") as buffer:
                    shutil.copyfileobj(photo.file, buffer)
                
                new_photo_urls.append(f"/static/signalements/{filename}")
            
            # Ajouter aux photos existantes
            personne.photo = (personne.photo or []) + new_photo_urls
        
        db.commit()
        
        return {
            "message": "Signalement modifié avec succès",
            "numero_suivi": signalement.numero_suivi
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Erreur lors de la modification: {str(e)}")


@router.put("/{signalement_id}/update-engin", status_code=200)
def update_engin_signalement(
    signalement_id: str,
    declarant_nom: str = Form(...),
    declarant_email: Optional[str] = Form(None),
    declarant_phone: Optional[str] = Form(None),
    type_engin: str = Form(...),
    marque: str = Form(...),
    modele: str = Form(...),
    plaque_immatriculation: str = Form(...),
    couleur: Optional[str] = Form(None),
    date_vol: date = Form(...),
    lieu_vol: Optional[str] = Form(None),
    circonstances: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un signalement d'engin volé (uniquement si statut en_attente)"""
    from app.utils.phone_utils import validate_phone_number
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    # Vérifier que l'utilisateur est propriétaire du signalement
    if signalement.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Vous ne pouvez modifier que vos propres signalements")
    
    # Vérifier que le statut permet la modification
    if signalement.statut != StatutSignalementEnum.EN_ATTENTE:
        raise HTTPException(status_code=400, detail="Ce signalement ne peut plus être modifié (déjà examiné)")
    
    # Vérifier que c'est bien un engin volé
    if signalement.type_signalement != TypeSignalementEnum.ENGIN_VOLE:
        raise HTTPException(status_code=400, detail="Ce signalement n'est pas un engin volé")
    
    # Valider le téléphone si fourni
    if declarant_phone:
        is_valid, result = validate_phone_number(declarant_phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        declarant_phone = result
    
    # Vérifier si la nouvelle plaque n'existe pas déjà (sauf pour ce signalement)
    existing = db.query(EnginVole).filter(
        EnginVole.plaque_immatriculation == plaque_immatriculation.upper(),
        EnginVole.signalement_id != signalement_id
    ).first()
    
    if existing:
        raise HTTPException(400, "Un autre signalement existe déjà pour cette plaque")
    
    try:
        # Mettre à jour les infos du signalement
        signalement.declarant_nom = declarant_nom
        signalement.declarant_email = declarant_email
        signalement.declarant_phone = declarant_phone
        
        # Mettre à jour l'engin volé
        engin = signalement.engin_vole
        if not engin:
            raise HTTPException(status_code=404, detail="Engin volé introuvable")
        
        engin.type_engin = type_engin
        engin.marque = marque
        engin.modele = modele
        engin.couleur = couleur
        engin.plaque_immatriculation = plaque_immatriculation.upper()
        engin.date_vol = date_vol
        engin.lieu_vol = lieu_vol
        engin.circonstances = circonstances
        
        db.commit()
        
        return {
            "message": "Signalement modifié avec succès",
            "numero_suivi": signalement.numero_suivi
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Erreur lors de la modification: {str(e)}")


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
    
    # Notifier le citoyen de la validation
    try:
        if signalement.user_id:
            from app.models.notification import Notification
            notification = Notification(
                utilisateur_id=signalement.user_id,
                titre="Signalement validé",
                message=f"Votre signalement {signalement.numero_suivi} a été validé par nos équipes. Il est maintenant actif dans notre système de surveillance."
            )
            db.add(notification)
            db.commit()
    except Exception as e:
        print(f"[ERREUR NOTIFICATION] {str(e)}")
    
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
    
    # Notifier le citoyen du rejet
    try:
        if signalement.user_id:
            from app.models.notification import Notification
            notification = Notification(
                utilisateur_id=signalement.user_id,
                titre="Signalement rejeté",
                message=f"Votre signalement {signalement.numero_suivi} a été rejeté. Motif: {motif or 'Non précisé'}"
            )
            db.add(notification)
            db.commit()
    except Exception as e:
        print(f"[ERREUR NOTIFICATION] {str(e)}")
    
    return {"message": "Signalement rejeté"}


# ── Helpers ────────────────────────────────────────────────────────────────────

@router.post("/{signalement_id}/extraire-vecteurs")
def extraire_vecteurs_faciaux(
    signalement_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Extraire les vecteurs faciaux d'une personne disparue"""
    if current_user.role not in ["admin", "superviseur"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    signalement = db.query(Signalement).filter(Signalement.id == signalement_id).first()
    
    if not signalement:
        raise HTTPException(status_code=404, detail="Signalement introuvable")
    
    if signalement.type_signalement != TypeSignalementEnum.PERSONNE_DISPARUE:
        raise HTTPException(status_code=400, detail="Cette action n'est disponible que pour les personnes disparues")
    
    personne = signalement.personne_disparue
    if not personne:
        raise HTTPException(status_code=404, detail="Personne disparue introuvable")
    
    if not personne.photo or len(personne.photo) == 0:
        raise HTTPException(status_code=400, detail="Aucune photo disponible pour l'extraction")
    
    # Importer le service d'extraction
    from app.services.face_extraction import FaceEmbeddingExtractor
    
    try:
        # Utiliser ArcFace (buffalo_s) pour extraction rapide
        extractor = FaceEmbeddingExtractor(model_name="buffalo_s")
        
        # Extraire les embeddings
        all_embeddings = []
        success_count = 0
        
        for photo_url in personne.photo:
            # Convertir l'URL en chemin de fichier
            filename = photo_url.split('/')[-1]
            file_path = os.path.join("uploads/signalements", filename)
            
            if not os.path.exists(file_path):
                print(f"[AVERTISSEMENT] Fichier introuvable: {file_path}")
                continue
            
            # Extraire l'embedding
            embedding = extractor.extract_from_file(file_path)
            
            if embedding is not None:
                all_embeddings.extend(embedding)
                success_count += 1
        
        if success_count == 0:
            raise HTTPException(status_code=500, detail="Aucun vecteur facial n'a pu être extrait")
        
        # Calculer la moyenne des embeddings si plusieurs photos
        if success_count > 1:
            embedding_size = len(all_embeddings) // success_count
            avg_embedding = []
            for i in range(embedding_size):
                sum_val = sum(all_embeddings[i + j * embedding_size] for j in range(success_count))
                avg_embedding.append(sum_val / success_count)
            personne.vecteur_facial = avg_embedding
        else:
            personne.vecteur_facial = all_embeddings
        
        db.commit()
        
        return {
            "message": "Vecteurs faciaux extraits avec succès",
            "photos_traitees": success_count,
            "dimensions": len(personne.vecteur_facial)
        }
        
    except Exception as e:
        db.rollback()
        print(f"[ERREUR EXTRACTION] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'extraction: {str(e)}")


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
