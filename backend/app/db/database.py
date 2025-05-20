from app.core.config import settings
import asyncpg
from typing import Optional

pool: Optional[asyncpg.Pool] = None

async def init_db():
    """Initialize the database connection pool."""
    global pool
    try:
        pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            min_size=5,
            max_size=20
        )
        print("Database connection pool created successfully")
    except Exception as e:
        print(f"Error creating database connection pool: {str(e)}")
        raise

async def get_db():
    """Get a database connection from the pool."""
    if pool is None:
        await init_db()
    return pool

async def close_db():
    global pool
    if pool:
        await pool.close()
        print("Database connection pool closed")
