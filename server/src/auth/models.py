from sqlalchemy import Column, Integer, String, Boolean
from src.database.core import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    otp = Column(String, nullable=True)
    role = Column(String, default="employee")  # "admin" or "employee"