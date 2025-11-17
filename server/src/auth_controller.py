from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core import get_db
from src.entities_user import User
from src.schemas_user import UserCreate, UserOut
from src.schemas_user import UserCreate as _UserCreate
from src.schemas_user import UserOut as _UserOut
from src.auth_service import hash_password, verify_password, create_access_token, create_refresh_token
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=_UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user_in.password)
    user = User(name=user_in.name, email=user_in.email, hashed_password=hashed, department=user_in.department)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=TokenOut)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token_data = {"sub": user.email, "user_id": user.id, "role": user.role}
    access = create_access_token(token_data)
    refresh = create_refresh_token(token_data)
    return {"access_token": access, "refresh_token": refresh}

from fastapi.security import OAuth2PasswordBearer
from src.auth_service import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {
        "email": payload.get("sub"),
        "user_id": payload.get("user_id"),
        "role": payload.get("role")
    }
from src.otp_service import create_and_store_otp, verify_otp

@router.post("/send-otp")
def send_otp(email: str, db: Session = Depends(get_db)):
    """
    Generate a 6-digit OTP and store it for this email.
    (You can later connect email/SMS service)
    """
    code = create_and_store_otp(email, db)
    return {"message": "OTP sent successfully", "otp": code}  # remove otp later
@router.post("/verify-otp")
def verify_otp_route(email: str, otp: str, db: Session = Depends(get_db)):
    """
    Verify OTP for the given email
    """
    is_valid = verify_otp(email, otp, db)

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"message": "OTP verified successfully"}
