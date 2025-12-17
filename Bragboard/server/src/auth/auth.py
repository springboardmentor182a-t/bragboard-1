from fastapi import Depends, HTTPException, status

from src.utils.jwt_handler import get_current_user, TokenData


def employee_required(
    current_user: TokenData = Depends(get_current_user),
) -> TokenData:
    if current_user.role not in ("employee", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employees can access this resource",
        )
    return current_user


def admin_required(
    current_user: TokenData = Depends(get_current_user),
) -> TokenData:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins only",
        )
    return current_user
