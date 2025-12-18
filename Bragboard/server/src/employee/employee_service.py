from sqlalchemy.orm import Session
from fastapi import Depends
from src.database import get_db
from src.models import ShoutOuts, Comments, Reactions, ShoutOutRecipients
from sqlalchemy import func
class EmployeeService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db
    def employee_stats(self, emp_id):
        sent = self.db.query(ShoutOuts).filter(ShoutOuts.sender_id == emp_id).count()
        received = self.db.query(ShoutOutRecipients).filter(ShoutOutRecipients.recipient_id == emp_id).count()
        reactions = self.db.query(Reactions).filter(Reactions.user_id == emp_id).count()
        comments = self.db.query(Comments).filter(Comments.user_id == emp_id).count()
        return {
            "sent_shoutouts": sent,
            "received_shoutouts": received,
            "total_reactions done": reactions,
            "comments_written": comments,
        }
    def recent_shoutouts(self, emp_id, limit):
        data = (
            self.db.query(ShoutOuts.message, ShoutOuts.created_at)
            .join(ShoutOutRecipients, ShoutOuts.id == ShoutOutRecipients.shoutout_id)
            .filter(ShoutOutRecipients.recipient_id == emp_id)
            .order_by(ShoutOuts.created_at.desc())
            .limit(limit)
            .all()
        )
        return [{"message": i[0], "date": str(i[1])} for i in data]
    def compute_badges(self, emp_id):
        sent = self.employee_stats(emp_id)["sent_shoutouts"]
        tagged = self.db.query(func.count()).filter(ShoutOutRecipients.recipient_id == emp_id).scalar()
        badges = []
        if sent >= 10:
            badges.append("Top Sender")
        if tagged >= 15:
            badges.append("Most Appreciated")

        return {"employee_id": emp_id, "badges_earned": badges}
