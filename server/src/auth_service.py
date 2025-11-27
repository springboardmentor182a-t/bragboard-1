# server/src/auth_service.py
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import os
from dotenv import load_dotenv

from src.entities_user import User

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# JWT config
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
ACCESS_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))

# --------------------------
# Password functions
# --------------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# --------------------------
# User functions
# --------------------------
def create_user(email: str, password: str, db: Session) -> User:
    hashed_password = hash_password(password)
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(email: str, password: str, db: Session) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# --------------------------
# JWT functions
# --------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token
