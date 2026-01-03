from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv
import random

from src.entities_user import User
from src.entities_otp import OTP

load_dotenv()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
ACCESS_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))


# -----------------------------
# Hashing & verification
# -----------------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# -----------------------------
# User creation
# -----------------------------
def create_user(
    name: str,
    email: str,
    password: str,
    db: Session,
    role: str = "employee",
    department: str | None = None
) -> User:

    hashed = hash_password(password)

    user = User(
        fullname=name,
        email=email,
        hashed_password=hashed,
        role=role,
        department=department
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# -----------------------------
# Authentication
# -----------------------------
def authenticate_user(email: str, password: str, db: Session) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None

    if verify_password(password, user.hashed_password):
        return user

    return None


# -----------------------------
# JWT creation
# -----------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -----------------------------
# OTP helpers
# -----------------------------
def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def create_password_reset_otp(email: str, db: Session) -> str:
    otp = generate_otp()

    db.query(OTP).filter(OTP.email == email).delete()

    otp_entry = OTP(
        email=email,
        otp=otp,
        purpose="reset_password",
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    )

    db.add(otp_entry)
    db.commit()
    return otp


def verify_password_reset_otp(email: str, otp: str, db: Session) -> bool:
    entry = (
        db.query(OTP)
        .filter(
            OTP.email == email,
            OTP.otp == otp,
            OTP.purpose == "reset_password",
            OTP.expires_at > datetime.utcnow(),
        )
        .first()
    )

    return entry is not None


def reset_password(email: str, new_password: str, db: Session) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False

    user.hashed_password = hash_password(new_password)
    db.commit()

    db.query(OTP).filter(OTP.email == email).delete()
    db.commit()

    return True
