from datetime import datetime, timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.models.session import UserSession
from app.services.otp_service import (
    store_otp, verify_otp, otp_verified_flag,
    check_otp_verified, clear_otp_verified
)
from app.services.email_service import send_otp_email
from app.services.audit_service import log_action

router = APIRouter()

# ── Schémas ─────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class RefreshRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str
    confirm_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

class TwoFactorRequest(BaseModel):
    enabled: bool

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str = ""
    last_name: str = ""
    phone: str = ""

class SignupVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

# ── Helpers ──────────────────────────────────────────────────────────────────

ROLES_2FA_DEFAULT_ON = {"admin", "superviseur", "agent"}

def _get_user_or_404(db: Session, email: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return user

def _create_session(db: Session, user: User, request: Request, refresh_token: str):
    expires = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    session = UserSession(
        user_id=user.id,
        refresh_token=refresh_token,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        expires_at=expires,
    )
    db.add(session)
    db.commit()

# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/signup", status_code=201)
def signup(data: SignupRequest, db: Session = Depends(deps.get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email déjà utilisé")
    
    # Valider le téléphone si fourni
    if data.phone:
        from app.utils.phone_utils import validate_phone_number
        is_valid, result = validate_phone_number(data.phone)
        if not is_valid:
            raise HTTPException(400, f"Téléphone invalide: {result}")
        data.phone = result  # Format E164
    
    # Vérifier si des signalements existent déjà pour cet email/téléphone
    from app.services.signalement_service import count_signalements_by_contact
    nb_signalements = count_signalements_by_contact(db, email=data.email, phone=data.phone)
    
    # Stocker données temporaires en Redis
    import json
    from app.redis_client import redis_client
    signup_data = {
        "email": data.email,
        "password": security.get_password_hash(data.password),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "phone": data.phone,
        "nb_signalements": nb_signalements,  # Stocker le nombre pour affichage
    }
    redis_client.setex(f"signup_pending:{data.email}", 600, json.dumps(signup_data))
    
    # Envoyer OTP
    otp = store_otp(data.email, purpose="signup")
    print(f"\n{'='*50}\n🔐 OTP SIGNUP pour {data.email}: {otp}\n{'='*50}\n")
    email_sent = send_otp_email(data.email, otp, purpose="signup")
    if not email_sent:
        raise HTTPException(500, "Erreur lors de l'envoi de l'email OTP")
    
    response = {
        "message": "Code de vérification envoyé par email", 
        "requires_otp": True
    }
    
    # Informer l'utilisateur si des signalements seront rattachés
    if nb_signalements > 0:
        response["found_signalements"] = nb_signalements
        response["info_message"] = f"Nous avons retrouvé {nb_signalements} signalement{'s' if nb_signalements > 1 else ''} associé{'s' if nb_signalements > 1 else ''} à cette adresse. {'Ils' if nb_signalements > 1 else 'Il'} {'seront' if nb_signalements > 1 else 'sera'} automatiquement rattaché{'s' if nb_signalements > 1 else ''} à votre compte après validation de votre inscription."
    
    return response

@router.post("/signup/verify")
def signup_verify(data: SignupVerifyRequest, db: Session = Depends(deps.get_db)):
    import json
    from app.redis_client import redis_client
    
    # Vérifier OTP
    valid, msg = verify_otp(data.email, data.otp, purpose="signup")
    if not valid:
        raise HTTPException(400, msg)
    
    # Récupérer données
    signup_data_raw = redis_client.get(f"signup_pending:{data.email}")
    if not signup_data_raw:
        raise HTTPException(400, "Session d'inscription expirée")
    
    signup_data = json.loads(signup_data_raw)
    
    # Créer le compte
    user = User(
        email=signup_data["email"],
        hashed_password=signup_data["password"],
        first_name=signup_data["first_name"],
        last_name=signup_data["last_name"],
        full_name=f"{signup_data['first_name']} {signup_data['last_name']}".strip(),
        phone=signup_data["phone"],
        role="citoyen",
        is_active=True,
        is_verified=True,
        two_factor_enabled=False,
    )
    db.add(user)
    db.flush()  # Pour obtenir l'ID sans committer
    
    # Lier les signalements existants après création du compte
    from app.services.signalement_service import find_signalements_by_contact, link_signalements_to_user
    signalements_found = find_signalements_by_contact(
        db, 
        email=signup_data["email"], 
        phone=signup_data.get("phone")
    )
    
    nb_linked = 0
    if signalements_found:
        nb_linked = link_signalements_to_user(db, user.id, signalements_found)
    
    db.commit()
    redis_client.delete(f"signup_pending:{data.email}")
    
    response = {"message": "Compte créé avec succès"}
    
    if nb_linked > 0:
        response["signalements_linked"] = nb_linked
        response["info_message"] = f"{nb_linked} signalement{'s' if nb_linked > 1 else ''} {'ont' if nb_linked > 1 else 'a'} été rattaché{'s' if nb_linked > 1 else ''} à votre compte"
    
    return response


@router.post("/login")
def login(data: LoginRequest, request: Request, db: Session = Depends(deps.get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not security.verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Identifiants invalides")
    if not user.is_active:
        raise HTTPException(403, "Compte désactivé")

    # Forcer 2FA si compte non vérifié (créé par admin)
    requires_2fa = user.two_factor_enabled or not user.is_verified
    
    if requires_2fa:
        otp = store_otp(user.email, purpose="login")
        print(f"\n{'='*50}\n🔐 OTP LOGIN pour {user.email}: {otp}\n{'='*50}\n")
        email_sent = send_otp_email(user.email, otp, purpose="login")
        if not email_sent:
            raise HTTPException(500, "Erreur lors de l'envoi de l'email OTP")
        return {
            "requires_otp": True, 
            "message": "Code OTP envoyé par email",
            "must_change_password": user.must_change_password if hasattr(user, 'must_change_password') else False,
            "is_verified": user.is_verified
        }

    # Pas de 2FA → tokens directs
    access = security.create_access_token(user.email, extra={"role": user.role})
    refresh = security.create_refresh_token(user.email)
    _create_session(db, user, request, refresh)
    user.last_login = datetime.utcnow()
    db.commit()
    log_action(db, user.id, "connexion", request)
    
    return {
        "access_token": access, 
        "refresh_token": refresh, 
        "token_type": "bearer", 
        "role": user.role,
        "must_change_password": user.must_change_password if hasattr(user, 'must_change_password') else False,
        "is_verified": user.is_verified
    }


@router.post("/verify-otp")
def verify_otp_route(data: OTPVerifyRequest, request: Request, db: Session = Depends(deps.get_db)):
    user = _get_user_or_404(db, data.email)
    valid, msg = verify_otp(data.email, data.otp, purpose="login")
    if not valid:
        raise HTTPException(400, msg)

    access = security.create_access_token(user.email, extra={"role": user.role})
    refresh = security.create_refresh_token(user.email)
    _create_session(db, user, request, refresh)
    user.last_login = datetime.utcnow()
    db.commit()
    log_action(db, user.id, "connexion_otp", request)
    
    return {
        "access_token": access, 
        "refresh_token": refresh, 
        "token_type": "bearer", 
        "role": user.role,
        "must_change_password": user.must_change_password if hasattr(user, 'must_change_password') else False,
        "is_verified": user.is_verified
    }


@router.post("/refresh")
def refresh_token(data: RefreshRequest, request: Request, db: Session = Depends(deps.get_db)):
    payload = security.decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(401, "Refresh token invalide")

    session = db.query(UserSession).filter(
        UserSession.refresh_token == data.refresh_token,
        UserSession.is_active == True
    ).first()
    if not session:
        raise HTTPException(401, "Session invalide ou expirée")

    user = _get_user_or_404(db, payload["sub"])
    new_access = security.create_access_token(user.email, extra={"role": user.role})
    return {"access_token": new_access, "token_type": "bearer"}


@router.post("/logout")
def logout(data: RefreshRequest, current_user: User = Depends(deps.get_current_user), db: Session = Depends(deps.get_db), request: Request = None):
    session = db.query(UserSession).filter(UserSession.refresh_token == data.refresh_token).first()
    if session:
        session.is_active = False
        db.commit()
    log_action(db, current_user.id, "déconnexion", request)
    return {"message": "Déconnecté avec succès"}


@router.get("/me")
def me(current_user: User = Depends(deps.get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "phone": current_user.phone,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "must_change_password": current_user.must_change_password if hasattr(current_user, 'must_change_password') else False,
        "two_factor_enabled": current_user.two_factor_enabled,
        "last_login": current_user.last_login,
    }


# ── Mot de passe oublié ───────────────────────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(deps.get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Sécurité : ne pas révéler si l'email existe
        return {"message": "Si cet email existe, un OTP a été envoyé"}
    otp = store_otp(data.email, purpose="reset")
    print(f"\n{'='*50}\n🔑 OTP RESET pour {data.email}: {otp}\n{'='*50}\n")
    send_otp_email(data.email, otp, purpose="reset")
    return {"message": "OTP envoyé"}


@router.post("/verify-reset-otp")
def verify_reset_otp(data: OTPVerifyRequest):
    valid, msg = verify_otp(data.email, data.otp, purpose="reset")
    if not valid:
        raise HTTPException(400, msg)
    otp_verified_flag(data.email)
    return {"verified": True}


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(deps.get_db), request: Request = None):
    if data.new_password != data.confirm_password:
        raise HTTPException(400, "Les mots de passe ne correspondent pas")
    if not check_otp_verified(data.email):
        raise HTTPException(400, "OTP non vérifié ou expiré")
    if len(data.new_password) < 6:
        raise HTTPException(400, "Mot de passe trop court (min. 6 caractères)")
    user = _get_user_or_404(db, data.email)
    user.hashed_password = security.get_password_hash(data.new_password)
    db.commit()
    clear_otp_verified(data.email)
    log_action(db, user.id, "reset_mot_de_passe", request)
    return {"message": "Mot de passe réinitialisé avec succès"}


# ── Paramètres de sécurité ───────────────────────────────────────────────────

@router.put("/settings/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    request: Request = None,
):
    if data.new_password != data.confirm_password:
        raise HTTPException(400, "Les mots de passe ne correspondent pas")
    if not security.verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(400, "Mot de passe actuel incorrect")
    if len(data.new_password) < 6:
        raise HTTPException(400, "Mot de passe trop court (min. 6 caractères)")
    
    current_user.hashed_password = security.get_password_hash(data.new_password)
    
    # Désactiver must_change_password, activer is_verified et désactiver 2FA après le premier changement (compte créé par admin)
    if hasattr(current_user, 'must_change_password') and current_user.must_change_password:
        current_user.must_change_password = False
        current_user.is_verified = True
        # Désactiver 2FA automatiquement sauf pour admin
        if current_user.role != "admin":
            current_user.two_factor_enabled = False
    
    db.commit()
    log_action(db, current_user.id, "changement_mot_de_passe", request)
    return {"message": "Mot de passe modifié avec succès"}


@router.put("/settings/two-factor")
def toggle_two_factor(
    data: TwoFactorRequest,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
    request: Request = None,
):
    # Admin ne peut jamais désactiver
    if current_user.role == "admin" and not data.enabled:
        raise HTTPException(403, "L'administrateur ne peut pas désactiver le 2FA")
    current_user.two_factor_enabled = data.enabled
    db.commit()
    action = "activation_2fa" if data.enabled else "désactivation_2fa"
    log_action(db, current_user.id, action, request)
    return {"two_factor_enabled": current_user.two_factor_enabled}


@router.get("/settings/sessions")
def get_sessions(current_user: User = Depends(deps.get_current_user), db: Session = Depends(deps.get_db)):
    sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.is_active == True
    ).all()
    return [
        {
            "id": s.id,
            "ip_address": s.ip_address,
            "user_agent": s.user_agent,
            "created_at": s.created_at,
            "expires_at": s.expires_at,
        }
        for s in sessions
    ]


@router.delete("/settings/sessions/{session_id}")
def delete_session(
    session_id: str,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db),
):
    session = db.query(UserSession).filter(
        UserSession.id == session_id,
        UserSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(404, "Session introuvable")
    session.is_active = False
    db.commit()
    return {"message": "Session terminée"}
