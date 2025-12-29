from sqlalchemy import func
from src.models import User, ShoutOuts, Comments, Reactions, ShoutOutRecipients
def total_employees(db):
    return db.query(func.count(User.id)).scalar()
def total_shoutouts(db):
    return db.query(func.count(ShoutOuts.id)).scalar()
def total_comments(db):
    return db.query(func.count(Comments.id)).scalar()
def total_reactions(db):
    return db.query(func.count(Reactions.id)).scalar()
def top_senders(db,limit):
    return (
        db.query(ShoutOuts.sender_id,func.count(ShoutOuts.id).label("count"))
        .group_by(ShoutOuts.sender_id)
        .order_by(func.count(ShoutOuts.id).desc())
        .limit(limit).all()
    )
def most_tagged(db,limit):
    return (
        db.query(ShoutOutRecipients.recipient_id,func.count(ShoutOutRecipients.id).label("count"))
        .group_by(ShoutOutRecipients.recipient_id)
        .order_by(func.count(ShoutOutRecipients.id).desc())
        .limit(limit).all()
    )
def reaction_stats(db):
    return (
        db.query(Reactions.type,func.count(Reactions.id).label("count"))
        .group_by(Reactions.type).all()
    )
