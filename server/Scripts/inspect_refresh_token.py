# scripts/inspect_refresh_token.py
import asyncio, hashlib
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

async def main():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.connect() as conn:
        print("All refresh_tokens rows:")
        r = await conn.execute(text("SELECT id, user_id, token_hash, revoked, expires_at FROM refresh_tokens ORDER BY id DESC"))
        rows = r.fetchall()
        for row in rows:
            print(row)
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
