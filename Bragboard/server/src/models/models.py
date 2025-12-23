from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.sql import func
from src.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    department = Column(String, nullable=True)
    role = Column(Enum('employee', 'admin', name="user_roles"), default='employee')
    otp = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

class ShoutOuts(Base):
    __tablename__ = "shoutouts"
    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ShoutOutRecipients(Base):
    __tablename__ = "shoutout_recipients"
    id = Column(Integer, primary_key=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))

class Comments(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Reactions(Base):
    __tablename__ = "reactions"
    id = Column(Integer, primary_key=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum('like','clap','star', name="reaction_types"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
