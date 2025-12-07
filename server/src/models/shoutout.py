from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.sqlite import JSON
from ..database import Base

def default_reactions():
    return {"like": 0, "love": 0, "laugh": 0}

class Shoutout(Base):
    __tablename__ = "shoutouts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    reactions = Column(JSON, default=default_reactions)  # ✅ always dict
