
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    employees = relationship("Employee", back_populates="department")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)

    department = relationship("Department", back_populates="employees")
    # sent_shoutouts and received_shoutouts removed - not needed with current Shoutout model


# NOTE: Shoutout model removed - using shoutouts.models.Shoutout instead
# class Shoutout(Base):
#     __tablename__ = "shoutouts"
#     id = Column(Integer, primary_key=True, index=True)
#     message = Column(Text, nullable=False)
#     sender_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
#     receiver_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
#     sender = relationship("Employee", back_populates="sent_shoutouts", foreign_keys=[sender_id])
#     receiver = relationship("Employee", back_populates="received_shoutouts", foreign_keys=[receiver_id])

