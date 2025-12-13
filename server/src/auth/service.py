# src/auth_service.py

from src.entities_user import User
from src.entities_otp import OTP
from src.database import get_db
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import random


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "YOUR_SECRET_KEY_HERE"
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_minutes=60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


class AuthService:

    def register_user(self, payload, db: Session):
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")

        hashed = pwd_context.hash(payload.password)

        new_user = User(
            name=payload.name,
            email=payload.email,
            password=hashed
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "User registered", "user_id": new_user.id}

    def login_user(self, payload, db: Session):
        user = db.query(User).filter(User.email == payload.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not pwd_context.verify(payload.password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect password")

        token = create_access_token({"user_id": user.id})

        return {"access_token": token}

    def verify_otp(self, email, otp, db: Session):
        record = db.query(OTP).filter(OTP.email == email, OTP.otp == otp).first()

        if not record:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        user = db.query(User).filter(User.email == email).first()
        user.is_verified = True
        db.commit()

        return {"message": "OTP Verified"}

    def forgot_password(self, email, db: Session):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Email not found")

        otp_val = str(random.randint(100000, 999999))

        otp = OTP(email=email, otp=otp_val)
        db.add(otp)
        db.commit()

        return {"message": "OTP sent to email", "otp_debug": otp_val}
