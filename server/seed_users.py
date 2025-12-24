import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from database.core import SessionLocal
from auth.models import User
from werkzeug.security import generate_password_hash

db = SessionLocal()

# Create test users matching the employee IDs in seed data
test_users = [
    {"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "department": "Development", "role": "admin"},
    {"id": 2, "name": "Bob Smith", "email": "bob@example.com", "department": "Support", "role": "employee"},
    {"id": 3, "name": "Priya Reddy", "email": "priya@example.com", "department": "Marketing", "role": "employee"},
    {"id": 4, "name": "Rahul Singh", "email": "rahul@example.com", "department": "Design", "role": "employee"},
    {"id": 5, "name": "Maria Garcia", "email": "maria@example.com", "department": "HR", "role": "employee"},
    {"id": 6, "name": "Chen Wei", "email": "chen@example.com", "department": "Development", "role": "employee"},
    {"id": 7, "name": "Fatima Khan", "email": "fatima@example.com", "department": "Support", "role": "employee"},
    {"id": 8, "name": "Liam O'Connor", "email": "liam@example.com", "department": "Development", "role": "employee"},
]

# Default password for all test users
default_password = generate_password_hash("password123")

for user_data in test_users:
    existing_user = db.query(User).filter(User.id == user_data["id"]).first()
    if existing_user:
        # Update existing user
        existing_user.name = user_data["name"]
        existing_user.email = user_data["email"]
        existing_user.department = user_data["department"]
        existing_user.role = user_data["role"]
        existing_user.is_verified = True
        existing_user.is_approved = True
        existing_user.status = "approved"
        print(f"Updated user: {user_data['name']}")
    else:
        # Create new user
        new_user = User(
            id=user_data["id"],
            name=user_data["name"],
            email=user_data["email"],
            department=user_data["department"],
            role=user_data["role"],
            password=default_password,
            is_verified=True,
            is_approved=True,
            status="approved"
        )
        db.add(new_user)
        print(f"Created user: {user_data['name']}")

db.commit()
print("\n✅ Users seeded successfully! All users have password: password123")
db.close()
