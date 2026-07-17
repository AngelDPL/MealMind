import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev_jwt_secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=90)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///mealmind.db").replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    RESEND_API_KEY = os.getenv("RESEND_API_KEY")