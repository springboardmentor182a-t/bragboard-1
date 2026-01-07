from sqlalchemy import create_engine, text
from src.database import DATABASE_URL

def add_columns():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT"))
            print("Columns added successfully.")
        except Exception as e:
            print(f"Error adding columns: {e}")

if __name__ == "__main__":
    add_columns()
