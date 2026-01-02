from sqlalchemy.orm import Session
from fastapi import Depends
from src.database import get_db
from src.models import Shoutout, Comment, Reaction, ShoutoutRecipient
from sqlalchemy import func

class EmployeeService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
    def employee_stats(self, emp_id):
        sent = self.db.query(Shoutout).filter(Shoutout.sender_id == emp_id).count()
        received = self.db.query(ShoutoutRecipient).filter(ShoutoutRecipient.recipient_id == emp_id).count()
        reactions = self.db.query(Reaction).filter(Reaction.user_id == emp_id).count()
        comments = self.db.query(Comment).filter(Comment.user_id == emp_id).count()
        return {
            "sent_shoutouts": sent,
            "received_shoutouts": received,
            "total_reactions done": reactions,
            "comments_written": comments,
        }
    def recent_shoutouts(self, emp_id, limit):
        data = (
            self.db.query(Shoutout.message, Shoutout.created_at)
            .join(ShoutoutRecipient, Shoutout.id == ShoutoutRecipient.shoutout_id)
            .filter(ShoutoutRecipient.recipient_id == emp_id)
            .order_by(Shoutout.created_at.desc())
            .limit(limit)
            .all()
        )
        return [{"message": i[0], "date": str(i[1])} for i in data]
    def compute_badges(self, emp_id):
        sent = self.employee_stats(emp_id)["sent_shoutouts"]
        tagged = self.db.query(func.count()).filter(ShoutoutRecipient.recipient_id == emp_id).scalar()
        badges = []
        if sent >= 10:
            badges.append("Top Sender")
        if tagged >= 15:
            badges.append("Most Appreciated")

        return {"employee_id": emp_id, "badges_earned": badges}
