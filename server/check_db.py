import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from database.core import SessionLocal
from shoutouts.models import Shoutout

db = SessionLocal()
shoutouts = db.query(Shoutout).all()
print(f'Total shoutouts: {len(shoutouts)}')
for s in shoutouts:
    print(f'  ID: {s.id}, Msg: {s.message[:30]}, Deleted: {s.is_deleted}, Deleted_at: {s.deleted_at}')
db.close()
