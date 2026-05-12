from app.core.database import SessionLocal
from app.core import security
from app.models.user import User
from app.core.config import settings

def init_db():
    db = SessionLocal()
    user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not user:
        user = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=security.get_password_hash(settings.ADMIN_PASSWORD),
            full_name="Administrator",
            role="super_admin",
            is_active=True
        )
        db.add(user)
        db.commit()
        print(f"Admin user created: {settings.ADMIN_EMAIL}")
    else:
        print(f"Admin user already exists: {settings.ADMIN_EMAIL}")
    
    # Seed Cameras
    from app.models.camera import Camera
    if db.query(Camera).count() == 0:
        cameras = [
            Camera(name="LOM-MARCHE-01", address="Grand Marché, Lomé", location_lat=6.1319, location_lng=1.2227, status="active"),
            Camera(name="LOM-AERO-04", address="Aéroport Débarquement", location_lat=6.1455, location_lng=1.2105, status="active"),
            Camera(name="LOM-PORT-02", address="Port Autonome Quai 3", location_lat=6.1250, location_lng=1.2350, status="active"),
        ]
        db.add_all(cameras)
        db.commit()
        print("Mock cameras seeded.")

    # Seed Persons
    from app.models.person import Person
    if db.query(Person).count() == 0:
        persons = [
            Person(first_name="Koffi", last_name="Mensah", age=24, gender="M", last_location="Lomé, Baguida", gravity_level="high", status="missing"),
            Person(first_name="Abla", last_name="Ayayi", age=12, gender="F", last_location="Atakpamé", gravity_level="critical", status="missing"),
        ]
        db.add_all(persons)
        db.commit()
        print("Mock persons seeded.")

    db.close()

if __name__ == "__main__":
    init_db()
