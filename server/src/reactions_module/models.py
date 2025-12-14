from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Reaction(Base):
    """
    Generic reaction linked to any parent item (e.g. shoutout, post).
    parent_type + parent_id identifies what was reacted to.
    """
    __tablename__ = "reactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    parent_type: Mapped[str] = mapped_column(String(50), index=True)  # e.g. "shoutout"
    parent_id: Mapped[int] = mapped_column(Integer, index=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True)         # optional
    reaction_type: Mapped[str] = mapped_column(String(20), index=True)  # "like", "love", etc.

