import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


def send_otp_email(to_email: str, otp: str, purpose: str = "login") -> bool:
    """Envoie un OTP par email. Retourne True si succès."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        # Mode dev : log l'OTP
        logger.warning(f"[DEV MODE] OTP pour {to_email} : {otp}")
        print(f"\n{'='*40}\nOTP pour {to_email}: {otp}\n{'='*40}\n")
        return True

    subject_map = {
        "login": "Code de connexion TogoSecureNet",
        "reset": "Code de réinitialisation TogoSecureNet",
        "signup": "Code de vérification TogoSecureNet",
    }
    body_map = {
        "login": f"Votre code de connexion est : <b>{otp}</b><br>Valide 5 minutes.",
        "reset": f"Votre code de réinitialisation est : <b>{otp}</b><br>Valide 10 minutes.",
        "signup": f"Votre code de vérification est : <b>{otp}</b><br>Valide 10 minutes.",
    }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject_map.get(purpose, "Code TogoSecureNet")
        msg["From"] = settings.EMAILS_FROM
        msg["To"] = to_email

        html = f"""
        <html><body>
        <div style="font-family:Arial;max-width:480px;margin:auto;padding:32px;background:#f8f9fa;border-radius:12px">
            <h2 style="color:#1a56db">TogoSecureNet</h2>
            <p>{body_map.get(purpose, f'Code: <b>{otp}</b>')}</p>
            <p style="font-size:2rem;font-weight:bold;letter-spacing:8px;color:#1a56db">{otp}</p>
            <p style="color:#6b7280;font-size:12px">Ne partagez jamais ce code.</p>
        </div>
        </body></html>
        """
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAILS_FROM, to_email, msg.as_string())
        return True
    except Exception as e:
        logger.error(f"Erreur envoi email: {e}")
        return False
