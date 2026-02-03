from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "hrms_lite"
    
    # CORS
    frontend_url: str = "http://localhost:4200"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
