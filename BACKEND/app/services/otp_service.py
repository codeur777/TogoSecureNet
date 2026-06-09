import redis as redis_lib
from app.core.config import settings
from app.core.security import generate_otp

_redis = redis_lib.from_url(settings.REDIS_URL, decode_responses=True)

OTP_PREFIX = "otp:"
RESET_OTP_PREFIX = "reset_otp:"
ATTEMPTS_PREFIX = "otp_attempts:"
BLOCK_PREFIX = "otp_block:"


def _r() -> redis_lib.Redis:
    return _redis


def store_otp(email: str, purpose: str = "login", expire: int = None) -> str:
    """Génère, stocke et retourne l'OTP."""
    otp = generate_otp()
    prefix = OTP_PREFIX if purpose == "login" else RESET_OTP_PREFIX
    ttl = expire or (settings.OTP_EXPIRE_SECONDS if purpose == "login" else settings.OTP_RESET_EXPIRE_SECONDS)
    _r().setex(f"{prefix}{email}", ttl, otp)
    # Reset le compteur d'essais
    _r().delete(f"{ATTEMPTS_PREFIX}{email}")
    return otp


def verify_otp(email: str, otp: str, purpose: str = "login") -> tuple[bool, str]:
    """Vérifie l'OTP. Retourne (valide, message)."""
    prefix = OTP_PREFIX if purpose == "login" else RESET_OTP_PREFIX
    block_key = f"{BLOCK_PREFIX}{email}"
    attempts_key = f"{ATTEMPTS_PREFIX}{email}"

    if _r().exists(block_key):
        ttl = _r().ttl(block_key)
        return False, f"Compte bloqué. Réessayez dans {ttl // 60} min {ttl % 60} sec."

    stored = _r().get(f"{prefix}{email}")
    if not stored:
        return False, "OTP expiré ou invalide."

    if stored != otp:
        attempts = _r().incr(attempts_key)
        _r().expire(attempts_key, settings.OTP_EXPIRE_SECONDS)
        remaining = settings.OTP_MAX_ATTEMPTS - int(attempts)
        if remaining <= 0:
            _r().setex(block_key, settings.OTP_BLOCK_SECONDS, "1")
            _r().delete(f"{prefix}{email}")
            return False, f"Trop de tentatives. Compte bloqué 15 minutes."
        return False, f"Code incorrect. {remaining} tentative(s) restante(s)."

    # OTP valide → supprimer
    _r().delete(f"{prefix}{email}")
    _r().delete(attempts_key)
    return True, "OK"


def otp_verified_flag(email: str) -> None:
    """Marque l'OTP comme vérifié (pour reset password)."""
    _r().setex(f"otp_verified:{email}", 300, "1")


def check_otp_verified(email: str) -> bool:
    return bool(_r().get(f"otp_verified:{email}"))


def clear_otp_verified(email: str) -> None:
    _r().delete(f"otp_verified:{email}")
