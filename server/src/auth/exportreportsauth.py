<<<<<<< HEAD
from fastapi import Depends, HTTPException # type: ignore
from fastapi.security import OAuth2PasswordBearer    # type: ignore
from jose import JWTError, jwt # type: ignore

SECRET_KEY = "mysecretkey123"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        return username
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
=======
from fastapi import Depends, HTTPException # type: ignore
from fastapi.security import OAuth2PasswordBearer    # type: ignore
from jose import JWTError, jwt # type: ignore

SECRET_KEY = "mysecretkey123"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        return username
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
