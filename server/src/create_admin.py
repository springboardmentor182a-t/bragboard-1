from src.database.core import SessionLocal, Base, engine
from src.auth.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def main():
    # ✅ Ensure tables are created in the fresh auth.db
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 🔹 Change these to whatever you want for the admin
        email = "admin@example.com"
        password = "Admin@123"

        # Check if admin already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("Admin already exists:", existing.email)
            return

        # 🔹 Match your model field names exactly
        admin_user = User(
            email=email,
            password=get_password_hash(password),
            is_verified=True,   # admin is verified
            otp=None,           # no OTP
            role="admin",       # set role to admin
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("Admin created:", admin_user.id, admin_user.email)

    finally:
        db.close()


if __name__ == "__main__":
    main()
