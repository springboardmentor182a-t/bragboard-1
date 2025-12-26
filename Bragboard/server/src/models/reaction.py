from sqlalchemy import Column, Integer, Enum, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    type = Column(
        Enum("like", "clap", "star", name="reaction_type"),
        nullable=False
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
