from sqlalchemy.orm import Session
from sqlalchemy import func
from src.models import Shoutout, ShoutoutRecipient, Comment, Reaction, User, Report
from .schemas import ShoutOutCreate, CommentCreate, CommentUpdate, ShoutOutUpdate
from typing import List

class ShoutoutService:
    @staticmethod
    def create_shoutout(db: Session, sender_id: int, data: ShoutOutCreate):
        new_shoutout = Shoutout(
            sender_id=sender_id,
            message=data.message
        )
        db.add(new_shoutout)
        db.flush() # Get ID

        for recipient_id in data.recipient_ids:
            recipient = ShoutoutRecipient(
                shoutout_id=new_shoutout.id,
                recipient_id=recipient_id
            )
            db.add(recipient)
        
        db.commit()
        db.refresh(new_shoutout)
        
        # Return dict to ensure Pydantic model compatibility (missing fields on ORM object)
        # Manually format recipients to match ShoutOutRecipientOut schema
        formatted_recipients = [
            {"recipient_id": r.id, "recipient_name": (r.name or "").strip() or "Unknown"} 
            for r in new_shoutout.recipients
        ]

        return {
            "id": new_shoutout.id,
            "sender_id": new_shoutout.sender_id,
            "sender_name": new_shoutout.sender.name if new_shoutout.sender else "Unknown",
            "message": new_shoutout.message,
            "created_at": new_shoutout.created_at,
            "recipients": formatted_recipients,
            "comments": [],
            "reaction_counts": {},
            "user_reactions": []
        }

    @staticmethod
    def get_shoutouts(db: Session, user_id: int, view: str = "all"):
        query = db.query(Shoutout)
        
        if view == "toMe":
            query = query.join(ShoutoutRecipient).filter(ShoutoutRecipient.recipient_id == user_id)
        elif view == "fromMe":
            query = query.filter(Shoutout.sender_id == user_id)
        elif view == "all":
            # Show all shoutouts to everyone
            pass

        shoutouts = query.order_by(Shoutout.created_at.desc()).distinct().all()
        
        result = []
        for s in shoutouts:
            # Map recipients
            recipients = db.query(User).join(
                ShoutoutRecipient, User.id == ShoutoutRecipient.recipient_id
            ).filter(ShoutoutRecipient.shoutout_id == s.id).all()
            
            s_recipients = [{"recipient_id": r.id, "recipient_name": (r.name or "").strip() or "Unknown"} for r in recipients]
            
            # Map comments
            comments = db.query(Comment, User).join(
                User, Comment.user_id == User.id
            ).filter(Comment.shoutout_id == s.id).all()
            
            s_comments = []
            for c, u in comments:
                s_comments.append({
                    "id": c.id,
                    "shoutout_id": c.shoutout_id,
                    "user_id": c.user_id,
                    "user_name": (u.name or "").strip() or "Unknown",
                    "content": c.content,
                    "created_at": c.created_at
                })
            
            # Reaction counts
            reaction_counts = {}
            for r_type in ['like', 'clap', 'star']:
                count = db.query(func.count(Reaction.id)).filter(
                    Reaction.shoutout_id == s.id, Reaction.type == r_type
                ).scalar()
                reaction_counts[r_type] = count
            
            # User reactions
            user_reactions = [r.type for r in db.query(Reaction.type).filter(
                Reaction.shoutout_id == s.id, Reaction.user_id == user_id
            ).all()]

            # Sender name
            sender = db.query(User).filter(User.id == s.sender_id).first()
            sender_name = (sender.name or "").strip() if sender else "Unknown"

            result.append({
                "id": s.id,
                "sender_id": s.sender_id,
                "sender_name": sender_name,
                "message": s.message,
                "created_at": s.created_at,
                "recipients": s_recipients,
                "comments": s_comments,
                "reaction_counts": reaction_counts,
                "user_reactions": user_reactions
            })
            
        return result

    @staticmethod
    def toggle_reaction(db: Session, user_id: int, shoutout_id: int, reaction_type: str):
        existing = db.query(Reaction).filter(
            Reaction.shoutout_id == shoutout_id,
            Reaction.user_id == user_id,
            Reaction.type == reaction_type
        ).first()
        
        if existing:
            db.delete(existing)
            message = "Reaction removed"
        else:
            new_reaction = Reaction(
                shoutout_id=shoutout_id,
                user_id=user_id,
                type=reaction_type
            )
            db.add(new_reaction)
            message = "Reaction added"
        
        db.commit()
        return {"message": message}

    @staticmethod
    def add_comment(db: Session, user_id: int, shoutout_id: int, data: CommentCreate):
        comment = Comment(
            shoutout_id=shoutout_id,
            user_id=user_id,
            content=data.content
        )
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return comment

    @staticmethod
    def update_comment(db: Session, user_id: int, comment_id: int, data: CommentUpdate):
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            return None
        if comment.user_id != user_id:
            raise Exception("Unauthorized to edit this comment")
        
        comment.content = data.content
        db.commit()
        db.refresh(comment)
        return comment

    @staticmethod
    def delete_comment(db: Session, user_id: int, comment_id: int):
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            return False
        if comment.user_id != user_id:
            raise Exception("Unauthorized to delete this comment")
        
        db.delete(comment)
        db.commit()
        return True

    @staticmethod
    def update_shoutout(db: Session, user_id: int, shoutout_id: int, data: ShoutOutUpdate):
        shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
        if not shoutout:
            return None
        if shoutout.sender_id != user_id:
            raise Exception("Unauthorized to update this shoutout")

        if data.message is not None:
            shoutout.message = data.message
        
        if data.recipient_ids is not None:
            # Delete old recipients
            db.query(ShoutoutRecipient).filter(ShoutoutRecipient.shoutout_id == shoutout_id).delete()
            # Add new recipients
            for rid in data.recipient_ids:
                db.add(ShoutoutRecipient(shoutout_id=shoutout_id, recipient_id=rid))
        
        db.commit()
        db.refresh(shoutout)
        return shoutout

    @staticmethod
    def delete_shoutout(db: Session, user_id: int, shoutout_id: int):
        shoutout = db.query(Shoutout).filter(Shoutout.id == shoutout_id).first()
        if not shoutout:
            return False
            
        # Check permissions: Sender OR Admin
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
             raise Exception("User not found")
             
        if shoutout.sender_id != user_id and user.role != 'admin':
            raise Exception("Unauthorized to delete this shoutout")

        # Delete related data first
        db.query(ShoutoutRecipient).filter(ShoutoutRecipient.shoutout_id == shoutout_id).delete()
        db.query(Comment).filter(Comment.shoutout_id == shoutout_id).delete()
        db.query(Reaction).filter(Reaction.shoutout_id == shoutout_id).delete()
        db.query(Report).filter(Report.shoutout_id == shoutout_id).delete()
        
        db.delete(shoutout)
        db.commit()
        return True
