from sqlalchemy.orm import Session
from fastapi import Depends
from src.database import get_db
from src.models import Users, ShoutOuts, Comments, Reactions, ShoutOutRecipients
from sqlalchemy import func
from datetime import datetime, timedelta

class AnalyticsService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def overview(self):
        return {
            "total_employees": self.db.query(Users).count(),
            "total_shoutouts": self.db.query(ShoutOuts).count(),
            "total_comments": self.db.query(Comments).count(),
            "total_reactions": self.db.query(Reactions).count(),
        }

    def top_senders(self, limit):
        data = (
            self.db.query(ShoutOuts.sender_id, func.count().label("count"))
            .group_by(ShoutOuts.sender_id)
            .order_by(func.count().desc())
            .limit(limit)
            .all()
        )
        return [{"employee_id": i[0], "sent_shoutouts": i[1]} for i in data]

    def most_tagged(self, limit):
        data = (
            self.db.query(ShoutOutRecipients.recipient_id, func.count().label("count"))
            .group_by(ShoutOutRecipients.recipient_id)
            .order_by(func.count().desc())
            .limit(limit)
            .all()
        )
        return [{"employee_id": i[0], "times_tagged": i[1]} for i in data]

    def reaction_counts(self):
        data = (
            self.db.query(Reactions.type, func.count().label("count"))
            .group_by(Reactions.type)
            .all()
        )
        return {i[0]: i[1] for i in data}

    def engagement_trend(self, days):
        start_date = datetime.utcnow() - timedelta(days=days)
        data = (
            self.db.query(
                func.date(ShoutOuts.created_at).label("date"),
                func.count().label("count")
            )
            .filter(ShoutOuts.created_at >= start_date)
            .group_by(func.date(ShoutOuts.created_at))
            .order_by(func.date(ShoutOuts.created_at))
            .all()
        )
        return [{"date": str(i[0]), "activities": i[1]} for i in data]

    def department_stats(self):
        data = (
            self.db.query(Users.department, func.count().label("count"))
            .group_by(Users.department)
            .all()
        )
        return [{"department": i[0], "employees": i[1]} for i in data]
