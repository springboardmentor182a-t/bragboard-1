# server/create_admin_user.py
from database.core import SessionLocal, Base, engine
from auth.models import User
import bcrypt

def hash_password(password: str) -> str:
    password_bytes = str(password).encode("utf-8")
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

def main():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Change these if you want a different admin
        email = "admin@example.com"
        password = "Admin@123"

        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("Admin already exists:", existing.id, existing.email)
            return

        admin_user = User(
            email=email,
            password=hash_password(password),
            is_verified=True,
            is_approved=True,
            otp=None,
            role="admin",
            status="approved",   # or "active" depending on your app
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("Admin created:", admin_user.id, admin_user.email)

    finally:
        db.close()

if __name__ == "__main__":
    main()
