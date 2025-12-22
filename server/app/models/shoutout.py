from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Shoutout(Base):
    __tablename__ = "shoutouts"

    id = Column(Integer, primary_key=True, index=True)
    employee = Column(String, index=True)
    message = Column(String)
    status = Column(String)
