<<<<<<< HEAD
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.core import Base

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, index=True)
    user_id = Column(Integer)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
=======
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database.core import Base

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    shoutout_id = Column(Integer, index=True)
    user_id = Column(Integer)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)