from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from .settings import settings


class Database:
    """MongoDB database connection manager."""
    
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None


db = Database()


async def connect_to_mongo():
    """Create database connection."""
    print(f"🔌 Connecting to MongoDB...")
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.database = db.client[settings.database_name]
    print(f"✅ Connected to MongoDB: {settings.database_name}")


async def close_mongo_connection():
    """Close database connection."""
    if db.client:
        db.client.close()
        print("🔌 MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    """Get database instance."""
    return db.database
