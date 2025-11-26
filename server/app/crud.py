# app/crud.py
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from app.models import User, EmailOtp, RefreshToken
from app.schemas import UserCreate

# ---------- Users ----------
async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    q = await db.execute(select(User).where(User.email == email))
    return q.scalars().first()

async def create_user(db: AsyncSession, user_in: UserCreate, password_hash: str) -> User:
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=password_hash,
        department=user_in.department,
        role=user_in.role,
        is_email_verified=False,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# ---------- Email OTPs ----------
async def create_otp(db: AsyncSession, user_id: int, otp: str, purpose: str, expires_at: datetime) -> EmailOtp:
    # mark previous OTPs for same purpose consumed
    await db.execute(
        update(EmailOtp)
        .where(EmailOtp.user_id == user_id, EmailOtp.purpose == purpose)
        .values(consumed=True)
    )
    await db.commit()

    db_otp = EmailOtp(
        user_id=user_id,
        otp=otp,
        purpose=purpose,
        expires_at=expires_at,
        consumed=False,
        attempts=0,
    )
    db.add(db_otp)
    await db.commit()
    await db.refresh(db_otp)
    return db_otp

async def get_valid_otp(db: AsyncSession, user_id: int, otp: str, purpose: str) -> Optional[EmailOtp]:
    q = await db.execute(
        select(EmailOtp).where(
            EmailOtp.user_id == user_id,
            EmailOtp.purpose == purpose,
            EmailOtp.consumed == False,
            EmailOtp.expires_at > datetime.now(timezone.utc),
            EmailOtp.otp == otp,
        )
    )
    return q.scalars().first()

async def consume_otp(db: AsyncSession, otp_obj: EmailOtp) -> None:
    otp_obj.consumed = True
    await db.commit()
    await db.refresh(otp_obj)

async def mark_user_verified(db: AsyncSession, user: User) -> None:
    user.is_email_verified = True
    await db.commit()
    await db.refresh(user)

# create reset otp (wrapper, uses same EmailOtp model)
async def create_reset_otp(db: AsyncSession, user_id: int, otp: str, expires_at: datetime) -> EmailOtp:
    # invalidate previous reset otps
    await db.execute(
        update(EmailOtp)
        .where(EmailOtp.user_id == user_id, EmailOtp.purpose == "reset")
        .values(consumed=True)
    )
    await db.commit()

    db_otp = EmailOtp(user_id=user_id, otp=otp, purpose="reset", expires_at=expires_at, consumed=False)
    db.add(db_otp)
    await db.commit()
    await db.refresh(db_otp)
    return db_otp

# ---------- Refresh tokens ----------
async def create_refresh_token_entry(db: AsyncSession, user_id: int, token_hash: str, expires_at: datetime) -> RefreshToken:
    rt = RefreshToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at, revoked=False)
    db.add(rt)
    await db.commit()
    await db.refresh(rt)
    return rt

async def get_refresh_token_by_hash(db: AsyncSession, token_hash: str) -> Optional[RefreshToken]:
    q = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    return q.scalars().first()

async def revoke_refresh_token(db: AsyncSession, token_obj: RefreshToken) -> None:
    token_obj.revoked = True
    await db.commit()
    await db.refresh(token_obj)

async def revoke_all_user_refresh_tokens(db: AsyncSession, user_id: int) -> None:
    await db.execute(update(RefreshToken).where(RefreshToken.user_id == user_id).values(revoked=True))
    await db.commit()
