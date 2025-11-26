# scripts/check_refresh_hash.py
import asyncio, hashlib
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

PLAIN = "PASTE_YOUR_REFRESH_HERE"  # <-- paste your refresh token here

def hash_refresh(t: str) -> str:
    return hashlib.sha256(t.encode("utf-8")).hexdigest()

async def main():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.connect() as conn:
        hh = hash_refresh(PLAIN)
        print("Computed hash:", hh)
        r = await conn.execute(text("SELECT id, user_id, token_hash, revoked, expires_at FROM refresh_tokens WHERE token_hash = :h"), {"h": hh})
        rows = r.fetchall()
        print("Matches found:", len(rows))
        for row in rows:
            print(row)
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
