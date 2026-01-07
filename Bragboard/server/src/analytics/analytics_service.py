from sqlalchemy.orm import Session
from fastapi import Depends
from src.database import get_db
from src.models import User, Shoutout, Comment, Reaction, ShoutoutRecipient
from sqlalchemy import func
from datetime import datetime, timedelta
class AnalyticsService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
    def overview(self):
        return {
            "total_employees": self.db.query(User).count(),
            "total_shoutouts": self.db.query(Shoutout).count(),
            "total_comments": self.db.query(Comment).count(),
            "total_reactions": self.db.query(Reaction).count(),
        }
    def top_senders(self, limit):
        data = (
            self.db.query(Shoutout.sender_id, User.name, func.count().label("count"))
            .join(User, Shoutout.sender_id == User.id)
            .group_by(Shoutout.sender_id, User.name)
            .order_by(func.count().desc())
            .limit(limit)
            .all()
        )
        return [{"employee_id": i[0], "name": i[1], "count": i[2]} for i in data]

    def most_tagged(self, limit):
        data = (
            self.db.query(ShoutoutRecipient.recipient_id, User.name, func.count().label("count"))
            .join(User, ShoutoutRecipient.recipient_id == User.id)
            .group_by(ShoutoutRecipient.recipient_id, User.name)
            .order_by(func.count().desc())
            .limit(limit)
            .all()
        )
        return [{"employee_id": i[0], "name": i[1], "count": i[2]} for i in data]

    def reaction_counts(self):
        data = (
            self.db.query(Reaction.type, func.count().label("count"))
            .group_by(Reaction.type)
            .all()
        )
        return {i[0]: i[1] for i in data}

    def engagement_trend(self, days):
        start_date = datetime.utcnow() - timedelta(days=days)
        data = (
            self.db.query(
                func.date(Shoutout.created_at).label("date"),
                func.count().label("count")
            )
            .filter(Shoutout.created_at >= start_date)
            .group_by(func.date(Shoutout.created_at))
            .order_by(func.date(Shoutout.created_at))
            .all()
        )
        return [{"date": str(i[0]), "activities": i[1]} for i in data]

    def department_stats(self):
        # Standard departments to ensure they always appear
        STANDARD_DEPARTMENTS = [
            "Engineering", "Marketing", "Sales", "Design", 
            "Human Resources", "IT", "Administration"
        ]
        
        # Get actual data from DB
        db_data = (
            self.db.query(User.department, func.count(Shoutout.id).label("count"))
            .outerjoin(Shoutout, Shoutout.sender_id == User.id)
            .group_by(User.department)
            .all()
        )
        
        # Convert to dictionary for easy lookup
        stats_map = {r[0]: r[1] for r in db_data if r[0]}
        
        # Merge with standard list (preserving any non-standard ones found in DB too if needed, though list is safer for order)
        # We'll prioritize the standard list order, then add any others found in DB at the end
        final_stats = []
        processed_depts = set()
        
        for dept in STANDARD_DEPARTMENTS:
            avg = stats_map.get(dept, 0)
            final_stats.append({"name": dept, "shoutouts": avg})
            processed_depts.add(dept)
            
        # Add any non-standard departments found in DB
        for dept, count in stats_map.items():
            if dept not in processed_depts:
                final_stats.append({"name": dept, "shoutouts": count})
                
        return final_stats
