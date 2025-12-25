from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database.core import Base

class Reaction(Base):
    """
    Generic reaction linked to any parent item (e.g. shoutout, post).
    shoutout_type + shoutout_id identifies what was reacted to.
    """
    __tablename__ = "reactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    shoutout_type: Mapped[str] = mapped_column(String(50), index=True)  # e.g. "shoutout"
    shoutout_id: Mapped[int] = mapped_column(Integer, index=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True)         # optional
    reaction_type: Mapped[str] = mapped_column(String(20), index=True)  # "like", "love", etc.

