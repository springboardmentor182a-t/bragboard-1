from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from src.database.dependencies import get_db
from src.auth.models import User
from src.auth.utils import SECRET_KEY, ALGORITHM  



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Decode JWT access token, load user from DB using email stored in 'sub'.
    This MUST match how create_access_token() builds the payload.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode token with SAME SECRET_KEY and ALGORITHM as create_access_token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # In your login, you put email in "sub": data={"sub": user.email, "role": user.role}
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Load user by email (not id)
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_admin(current_user: User = Depends(get_current_user)):
    """
    Ensure the current user has admin role.
    """
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access only",
        )
    return current_user
