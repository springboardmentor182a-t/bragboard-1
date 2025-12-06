from datetime import datetime, timedelta
from typing import List, Dict
import random

class LeaderboardService:
    def __init__(self):
        # Demo data - real employee names and departments
        self.demo_users = [
            {"id": 1, "name": "Alex Johnson", "department": "Engineering", "avatar_color": "#3B82F6"},
            {"id": 2, "name": "Sarah Miller", "department": "Marketing", "avatar_color": "#10B981"},
            {"id": 3, "name": "David Chen", "department": "Engineering", "avatar_color": "#8B5CF6"},
            {"id": 4, "name": "Emma Wilson", "department": "Sales", "avatar_color": "#F59E0B"},
            {"id": 5, "name": "Michael Brown", "department": "HR", "avatar_color": "#EF4444"},
            {"id": 6, "name": "Priya Sharma", "department": "Engineering", "avatar_color": "#EC4899"},
            {"id": 7, "name": "James Taylor", "department": "Marketing", "avatar_color": "#6366F1"},
            {"id": 8, "name": "Lisa Wang", "department": "Finance", "avatar_color": "#14B8A6"},
            {"id": 9, "name": "Robert Garcia", "department": "Sales", "avatar_color": "#F97316"},
            {"id": 10, "name": "Maria Gonzalez", "department": "HR", "avatar_color": "#8B5CF6"},
        ]
        
        # Generate demo shoutouts data
        self.demo_shoutouts = self._generate_demo_shoutouts()
        
    def _generate_demo_shoutouts(self):
        """Generate realistic demo shoutouts data"""
        shoutouts = []
        reasons = [
            "for helping me debug that tricky API issue",
            "for the amazing presentation to clients",
            "for going above and beyond on the project deadline",
            "for your creative marketing campaign idea",
            "for mentoring new team members",
            "for exceptional customer support",
            "for innovative solution to our workflow problem",
            "for being an awesome team player",
            "for handling the crisis situation calmly",
            "for your consistent high-quality work"
        ]
        
        for i in range(50):  # Generate 50 demo shoutouts
            sender = random.choice(self.demo_users)
            recipient = random.choice([u for u in self.demo_users if u["id"] != sender["id"]])
            
            shoutouts.append({
                "id": i + 1,
                "sender_id": sender["id"],
                "sender_name": sender["name"],
                "recipient_id": recipient["id"],
                "recipient_name": recipient["name"],
                "message": f"Great work {recipient['name'].split()[0]}! {random.choice(reasons)}",
                "timestamp": datetime.now() - timedelta(days=random.randint(0, 30)),
                "reactions": {
                    "like": random.randint(0, 15),
                    "clap": random.randint(0, 10),
                    "star": random.randint(0, 5)
                }
            })
        
        return shoutouts
    
    def get_leaderboard(self, range_type: str = "weekly") -> List[Dict]:
        """Get leaderboard based on time range"""
        scores = {}
        
        # Calculate scores for each user
        for user in self.demo_users:
            user_shoutouts = [s for s in self.demo_shoutouts if s["recipient_id"] == user["id"]]
            sent_shoutouts = [s for s in self.demo_shoutouts if s["sender_id"] == user["id"]]
            
            total_reactions = sum(
                sum(s["reactions"].values()) 
                for s in user_shoutouts
            )
            
            # Scoring formula
            score = (
                len(user_shoutouts) * 10 +  # Points for received shoutouts
                len(sent_shoutouts) * 5 +   # Points for sending shoutouts
                total_reactions * 2         # Points for reactions
            )
            
            scores[user["id"]] = {
                "user_id": user["id"],
                "name": user["name"],
                "department": user["department"],
                "score": score,
                "shoutouts_received": len(user_shoutouts),
                "shoutouts_sent": len(sent_shoutouts),
                "total_reactions": total_reactions,
                "avatar_color": user["avatar_color"]
            }
        
        # Sort by score and add rank
        sorted_scores = sorted(scores.values(), key=lambda x: x["score"], reverse=True)
        
        for i, entry in enumerate(sorted_scores, 1):
            entry["rank"] = i
        
        return sorted_scores[:10]  # Return top 10
    
    def get_department_stats(self) -> List[Dict]:
        """Get statistics by department"""
        departments = {}
        
        for user in self.demo_users:
            dept = user["department"]
            if dept not in departments:
                departments[dept] = {
                    "users": [],
                    "total_shoutouts": 0,
                    "total_reactions": 0
                }
            departments[dept]["users"].append(user["name"])
        
        # Calculate department stats
        for shoutout in self.demo_shoutouts:
            recipient_dept = next(
                u["department"] for u in self.demo_users 
                if u["id"] == shoutout["recipient_id"]
            )
            departments[recipient_dept]["total_shoutouts"] += 1
            departments[recipient_dept]["total_reactions"] += sum(shoutout["reactions"].values())
        
        # Prepare response
        stats = []
        for dept, data in departments.items():
            stats.append({
                "department": dept,
                "total_shoutouts": data["total_shoutouts"],
                "active_users": len(data["users"]),
                "avg_engagement": round(data["total_reactions"] / max(data["total_shoutouts"], 1), 1),
                "most_active_user": random.choice(data["users"]) if data["users"] else "None"
            })
        
        return stats
    
    def get_recent_highlights(self) -> List[Dict]:
        """Get recent recognition highlights"""
        recent_shoutouts = sorted(
            self.demo_shoutouts, 
            key=lambda x: x["timestamp"], 
            reverse=True
        )[:5]
        
        highlights = []
        for shoutout in recent_shoutouts:
            highlights.append({
                "id": shoutout["id"],
                "from": shoutout["sender_name"],
                "to": shoutout["recipient_name"],
                "message": shoutout["message"],
                "time_ago": self._get_time_ago(shoutout["timestamp"]),
                "reactions": shoutout["reactions"]
            })
        
        return highlights
    
    def _get_time_ago(self, timestamp: datetime) -> str:
        """Convert timestamp to 'time ago' string"""
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
        else:
            return "Just now"

leaderboard_service = LeaderboardService()
