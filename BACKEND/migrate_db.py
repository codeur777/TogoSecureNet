"""
Script de migration de la base de données pour ajouter les nouveaux champs à la table users
"""
from sqlalchemy import inspect, text
from app.core.database import engine, SessionLocal
from app.models.user import User

def migrate_users_table():
    """
    Ajoute les nouveaux champs à la table users si ils n'existent pas
    """
    inspector = inspect(engine)
    
    # Vérifier si la table users existe
    if 'users' not in inspector.get_table_names():
        print("La table users n'existe pas encore. Elle sera créée au démarrage de l'app.")
        return
    
    # Récupérer les colonnes existantes
    existing_columns = [col['name'] for col in inspector.get_columns('users')]
    print(f"Colonnes existantes: {existing_columns}")
    
    # Colonnes à ajouter avec leurs définitions SQL
    new_columns = {
        'first_name': "VARCHAR",
        'last_name': "VARCHAR",
        'phone': "VARCHAR",
        'status': "VARCHAR DEFAULT 'actif'",
        'last_login': "TIMESTAMP"
    }
    
    # Connexion pour exécuter les ALTER TABLE
    with engine.connect() as conn:
        for col_name, col_type in new_columns.items():
            if col_name not in existing_columns:
                try:
                    # Ajouter la colonne
                    sql = f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"
                    conn.execute(text(sql))
                    conn.commit()
                    print(f"✓ Colonne '{col_name}' ajoutée avec succès")
                except Exception as e:
                    print(f"✗ Erreur lors de l'ajout de '{col_name}': {e}")
            else:
                print(f"○ Colonne '{col_name}' existe déjà")
        
        # Modifier la valeur par défaut de role si nécessaire
        try:
            sql = "ALTER TABLE users ALTER COLUMN role SET DEFAULT 'citoyen'"
            conn.execute(text(sql))
            conn.commit()
            print("✓ Valeur par défaut de 'role' mise à jour vers 'citoyen'")
        except Exception as e:
            print(f"○ Modification de la valeur par défaut de 'role': {e}")
    
    # Mettre à jour les données existantes
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            # Si full_name existe mais pas first_name/last_name, les extraire
            if user.full_name and not user.first_name:
                parts = user.full_name.split(' ', 1)
                user.first_name = parts[0] if len(parts) > 0 else ""
                user.last_name = parts[1] if len(parts) > 1 else ""
            
            # Définir le statut si non défini
            if not hasattr(user, 'status') or not user.status:
                user.status = "actif"
            
            # Mettre à jour le rôle si c'est l'ancien système
            if user.role == "super_admin":
                user.role = "admin"
            elif user.role == "police":
                user.role = "agent"
        
        db.commit()
        print(f"✓ Données migrées pour {len(users)} utilisateur(s)")
    except Exception as e:
        print(f"✗ Erreur lors de la migration des données: {e}")
        db.rollback()
    finally:
        db.close()
    
    print("\n✓ Migration terminée avec succès!")

if __name__ == "__main__":
    print("=== Début de la migration de la base de données ===\n")
    migrate_users_table()
    print("\n=== Fin de la migration ===")
