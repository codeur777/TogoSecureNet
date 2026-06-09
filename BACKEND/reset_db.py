"""
Reset complet de la base de données
"""
from app.core.database import engine
from sqlalchemy import text

print("Suppression de toutes les tables...")

with engine.connect() as conn:
    # Supprimer toutes les tables en CASCADE
    conn.execute(text("DROP SCHEMA public CASCADE"))
    conn.execute(text("CREATE SCHEMA public"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO admin"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
    conn.commit()

print("✓ Base de données nettoyée")

# Recréer les tables
from app.models import Base
Base.metadata.create_all(bind=engine)
print("✓ Tables recréées")

# Seed
print("\nLancement du seed...")
import subprocess
subprocess.run(["python", "seed_db.py"])
