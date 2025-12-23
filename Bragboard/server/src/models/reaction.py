from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from src.database import Base

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String)  # like | clap | star
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("shoutout_id", "user_id"),
    )
