import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
from app.db import Base
from app.config import settings
import app.models
# Alembic Config object
config = context.config

# Logging configuration
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import your app's Base and settings
# IMPORTANT: This path must match your project structure
from app.db import Base
from app.config import settings

# Metadata for 'autogenerate' support
target_metadata = Base.metadata

# Override sqlalchemy.url from alembic.ini using settings.DATABASE_URL
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)


def run_migrations_offline() -> None:
    """Run migrations without a DB connection (offline mode)."""
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection):
    """Run migrations with DB connection (online mode)."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations():
    """Create async engine and run migrations."""
    async_engine = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with async_engine.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await async_engine.dispose()


def run_migrations_online():
    """Entrypoint for online migrations."""
    asyncio.run(run_async_migrations())


# Determine if we are running in offline or online mode
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
