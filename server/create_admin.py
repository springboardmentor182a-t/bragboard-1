import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.database.core import SessionLocal
from src.auth.models import User
from src.auth.utils import hash_password

db = SessionLocal()

# Check if admin exists
existing_admin = db.query(User).filter(User.email == "admin@example.com").first()

if not existing_admin:
    admin_user = User(
        name="Admin User",
        email="admin@example.com",
        password=hash_password("Admin@123"),
        role="admin",
        is_verified=True,
        is_approved=True,
        status="approved",
        department="IT"
    )
    db.add(admin_user)
    db.commit()
    print("✅ Admin user created successfully!")
else:
    print("⚠️ Admin user already exists")

db.close()