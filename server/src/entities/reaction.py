from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from src.core import Base


class Reaction(Base):
    __tablename__ = "reactions"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # "like", "clap", "star"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shoutout_id = Column(Integer, ForeignKey("shoutouts.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="reactions")
    shoutout = relationship("ShoutOut", back_populates="reactions")
    
    # Ensure a user can only have one reaction of each type per shoutout
    __table_args__ = (
        UniqueConstraint('user_id', 'shoutout_id', 'type', name='unique_user_shoutout_reaction'),
    )
