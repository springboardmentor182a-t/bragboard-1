"""Custom exceptions for the BragBoard Admin API."""
from fastapi import HTTPException


class AuthenticationError(HTTPException):
    """Raised when authentication fails."""
    def __init__(self, detail: str = "Invalid credentials"):
        super().__init__(status_code=401, detail=detail)


class NotFoundError(HTTPException):
    """Raised when a resource is not found."""
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail)


class ValidationError(HTTPException):
    """Raised when validation fails."""
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=400, detail=detail)
