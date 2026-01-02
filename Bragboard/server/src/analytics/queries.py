from sqlalchemy import func
from src.models import User, Shoutout, Comment, Reaction, ShoutoutRecipient

def total_employees(db):
    return db.query(func.count(User.id)).scalar()

def total_shoutouts(db):
    return db.query(func.count(Shoutout.id)).scalar()

def total_comments(db):
    return db.query(func.count(Comment.id)).scalar()

def total_reactions(db):
    return db.query(func.count(Reaction.id)).scalar()

def top_senders(db,limit):
    return (
        db.query(Shoutout.sender_id,func.count(Shoutout.id).label("count"))
        .group_by(Shoutout.sender_id)
        .order_by(func.count(Shoutout.id).desc())
        .limit(limit).all()
    )

def most_tagged(db,limit):
    return (
        db.query(ShoutoutRecipient.recipient_id,func.count(ShoutoutRecipient.id).label("count"))
        .group_by(ShoutoutRecipient.recipient_id)
        .order_by(func.count(ShoutoutRecipient.id).desc())
        .limit(limit).all()
    )

def reaction_stats(db):
    return (
        db.query(Reaction.type,func.count(Reaction.id).label("count"))
        .group_by(Reaction.type).all()
    )
