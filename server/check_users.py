import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from database.core import SessionLocal
from auth.models import User
from shoutouts.models import Shoutout

db = SessionLocal()

# Check users
users = db.query(User).all()
print(f'Total users: {len(users)}')
for u in users:
    print(f'  ID: {u.id}, Name: {u.name}, Email: {u.email}, Role: {u.role}, Status: {u.status}')

print('\n' + '='*50 + '\n')

# Check shoutouts with sender/receiver info
shoutouts = db.query(Shoutout).all()
print(f'Total shoutouts: {len(shoutouts)}')
for s in shoutouts:
    sender = db.query(User).filter(User.id == s.sender_id).first()
    receiver = db.query(User).filter(User.id == s.receiver_id).first()
    sender_name = sender.name if sender and sender.name else (sender.email if sender else "Unknown")
    receiver_name = receiver.name if receiver and receiver.name else (receiver.email if receiver else "Unknown")
    print(f'  ID: {s.id}, From: {sender_name} (ID:{s.sender_id}) -> To: {receiver_name} (ID:{s.receiver_id})')

db.close()
