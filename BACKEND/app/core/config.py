from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Togo SecureNet"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://admin:postgres@localhost:5433/togo_securenet")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    MQTT_BROKER: str = os.getenv("MQTT_BROKER", "localhost")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))

    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_super_secret_key_change_me")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15          # 15 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7             # 7 jours
    OTP_EXPIRE_SECONDS: int = 300                  # 5 minutes login
    OTP_RESET_EXPIRE_SECONDS: int = 600            # 10 minutes reset
    OTP_MAX_ATTEMPTS: int = 5
    OTP_BLOCK_SECONDS: int = 900                   # 15 minutes blocage

    ADMIN_EMAIL: str = "admin@togosecurenet.tg"
    ADMIN_PASSWORD: str = "admin123"

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Email (SMTP)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM: str = os.getenv("SMTP_FROM", os.getenv("SMTP_USER", "noreply@togosecurenet.tg"))

    class Config:
        case_sensitive = True

settings = Settings()
