import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from database.core import SessionLocal
from shoutouts.service import soft_delete_shoutout, get_shoutout
from shoutouts.models import Shoutout

db = SessionLocal()

# Test getting shoutout 1
s = get_shoutout(db, 1)
print(f"Get shoutout 1: {s}")
if s:
    print(f"  ID: {s.id}, Message: {s.message[:30]}, Deleted: {s.is_deleted}")

# Test soft delete
result = soft_delete_shoutout(db, 1)
print(f"Soft delete result: {result}")
if result:
    print(f"  ID: {result.id}, Deleted: {result.is_deleted}, Deleted_at: {result.deleted_at}")

db.close()
