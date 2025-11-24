from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.core import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    department = Column(String, nullable=True)
    role = Column(String, default="employee")
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    shoutouts = relationship("ShoutOut", back_populates="author")
    comments = relationship("Comment", back_populates="user")
    reactions = relationship("Reaction", back_populates="user")
