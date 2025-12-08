# create_reports_table.py
from src.database import Base, engine
from src.entities_report import Report

# Create all tables defined in models
Base.metadata.create_all(bind=engine)

print("Reports table created successfully!")
