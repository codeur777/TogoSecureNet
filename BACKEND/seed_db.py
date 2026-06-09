from app.core.database import SessionLocal, engine, Base
from app.core import security
from app.models.user import User
from app.core.config import settings
from datetime import datetime

def init_db():
    # Créer toutes les tables
    print("Création des tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables créées avec succès")
    
    db = SessionLocal()
    
    # Create admin user
    admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin_user:
        admin_user = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=security.get_password_hash(settings.ADMIN_PASSWORD),
            first_name="Super",
            last_name="Admin",
            full_name="Super Admin",
            phone="+228 90 00 00 00",
            role="admin",
            status="actif",
            is_active=True,
            is_verified=True,
            two_factor_enabled=True,  # Admin : 2FA toujours ON
        )
        db.add(admin_user)
        db.commit()
        print(f"Admin user created: {settings.ADMIN_EMAIL}")
    else:
        print(f"Admin user already exists: {settings.ADMIN_EMAIL}")
    
    # Create test users for different roles
    test_users = [
        {
            "email": "superviseur@togosecurenet.tg",
            "password": "superviseur123",
            "first_name": "Jean",
            "last_name": "Dupont",
            "phone": "+228 90 11 11 11",
            "role": "superviseur",
            "two_factor_enabled": True,   # Superviseur : 2FA ON par défaut
        },
        {
            "email": "agent@togosecurenet.tg",
            "password": "agent123",
            "first_name": "Marie",
            "last_name": "Kouassi",
            "phone": "+228 90 22 22 22",
            "role": "agent",
            "two_factor_enabled": True,   # Agent : 2FA ON par défaut
        },
        {
            "email": "citoyen@togosecurenet.tg",
            "password": "citoyen123",
            "first_name": "Koffi",
            "last_name": "Mensah",
            "phone": "+228 90 33 33 33",
            "role": "citoyen",
            "two_factor_enabled": False,  # Citoyen : 2FA OFF par défaut
        }
    ]
    
    for user_data in test_users:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            new_user = User(
                email=user_data["email"],
                hashed_password=security.get_password_hash(user_data["password"]),
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                full_name=f"{user_data['first_name']} {user_data['last_name']}",
                phone=user_data["phone"],
                role=user_data["role"],
                status="actif",
                is_active=True,
                is_verified=True,
                two_factor_enabled=user_data["two_factor_enabled"],
            )
            db.add(new_user)
    
    db.commit()
    print(f"Test users created successfully")
    
    # Seed Cameras
    from app.models.camera import Camera
    if db.query(Camera).count() == 0:
        cameras = [
            Camera(nom="LOM-MARCHE-01", localisation="Grand Marché, Lomé", location_lat=6.1319, location_lng=1.2227, est_active=True),
            Camera(nom="LOM-AERO-04", localisation="Aéroport Débarquement", location_lat=6.1455, location_lng=1.2105, est_active=True),
            Camera(nom="LOM-PORT-02", localisation="Port Autonome Quai 3", location_lat=6.1250, location_lng=1.2350, est_active=True),
        ]
        db.add_all(cameras)
        db.commit()
        print("Mock cameras seeded.")

    # Seed Persons
    from app.models.person import PersonneDisparue, NiveauGraviteEnum
    if db.query(PersonneDisparue).count() == 0:
        import datetime
        personnes = [
            PersonneDisparue(nom="Mensah", prenoms="Koffi", age="24", niveau_gravite=NiveauGraviteEnum.TRES_GRAVE, lieu_disparition="Lomé, Baguida", date_disparition=datetime.date(2024, 1, 15)),
            PersonneDisparue(nom="Ayayi", prenoms="Abla", age="12", niveau_gravite=NiveauGraviteEnum.TRES_GRAVE, lieu_disparition="Atakpamé", date_disparition=datetime.date(2024, 2, 3)),
        ]
        db.add_all(personnes)
        db.commit()
        print("Mock persons seeded.")

    db.close()

if __name__ == "__main__":
    init_db()
