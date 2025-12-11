from datetime import datetime
from typing import List, Dict
from sqlalchemy.orm import Session
from src.models.user import User
from src.models.shoutout import Shoutout


class LeaderboardService:
    """
    CLEAN version:
    - No demo users
    - No random generation
    - No fake reactions
    - Uses REAL database values
    """

    def get_leaderboard(self, db: Session, range_type: str = "weekly") -> List[Dict]:
        """
        Returns REAL leaderboard using DB records.
        """

        # 1. Get all users
        users = db.query(User).all()

        results = []

        for user in users:
            # Shoutouts received
            received = db.query(Shoutout).filter(Shoutout.recipient_id == user.id).all()

            # Shoutouts sent
            sent = db.query(Shoutout).filter(Shoutout.sender_id == user.id).all()

            # Total reactions (if you add a reactions table later)
            total_reactions = sum(s.reactions_count for s in received) if hasattr(Shoutout, "reactions_count") else 0

            # Scoring
            score = (
                len(received) * 10 +
                len(sent) * 5 +
                total_reactions * 2
            )

            results.append({
                "user_id": user.id,
                "name": user.name,
                "department": user.department,
                "avatar_color": user.avatar_color,
                "score": score,
                "shoutouts_received": len(received),
                "shoutouts_sent": len(sent),
                "total_reactions": total_reactions
            })

        # Sort by score
        results = sorted(results, key=lambda x: x["score"], reverse=True)

        
        for i, r in enumerate(results, start=1):
            r["rank"] = i

        return results[:10]

  

    def get_department_stats(self, db: Session) -> List[Dict]:
        """
        Returns REAL department stats from DB.
        """

        users = db.query(User).all()
        shoutouts = db.query(Shoutout).all()

        departments = {}

       
        for user in users:
            if user.department not in departments:
                departments[user.department] = {
                    "users": [],
                    "total_shoutouts": 0,
                    "total_reactions": 0
                }

            departments[user.department]["users"].append(user)

       
        for s in shoutouts:
            rec_user = next((u for u in users if u.id == s.recipient_id), None)
            if rec_user:
                dept = rec_user.department
                departments[dept]["total_shoutouts"] += 1

                if hasattr(s, "reactions_count"):
                    departments[dept]["total_reactions"] += s.reactions_count

       
        stats = []
        for dept, data in departments.items():
            stats.append({
                "department": dept,
                "total_shoutouts": data["total_shoutouts"],
                "active_users": len(data["users"]),
                "avg_engagement": round(
                    (data["total_reactions"] / data["total_shoutouts"])
                    if data["total_shoutouts"] > 0 else 0,
                    1
                ),
                "most_active_user": None   # You can add logic later
            })

        return stats

    

    def get_recent_highlights(self, db: Session) -> List[Dict]:
        """
        Returns REAL shoutouts sorted by latest first.
        """

        shoutouts = (
            db.query(Shoutout)
            .order_by(Shoutout.created_at.desc())
            .limit(5)
            .all()
        )

        highlights = []
        for s in shoutouts:
            highlights.append({
                "id": s.id,
                "from": s.sender.name if s.sender else "Unknown",
                "to": s.recipient.name if s.recipient else "Unknown",
                "message": s.message,
                "time_ago": self._get_time_ago(s.created_at),
                "reactions": getattr(s, "reactions", {})
            })

        return highlights

   

    def _get_time_ago(self, timestamp: datetime) -> str:
        """Converts timestamp to human-friendly time ago text."""
        now = datetime.now()
        diff = now - timestamp

        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        return "Just now"


leaderboard_service = LeaderboardService()
