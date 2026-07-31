import os
import urllib.parse
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    try:
        SECRET_KEY = os.environ["SECRET_KEY"]
        if not SECRET_KEY or SECRET_KEY == "your-super-secret-key-change-me":
            raise ValueError("SECRET_KEY must be a secure unique secret, not default placeholder")

        JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
        if not JWT_SECRET_KEY or JWT_SECRET_KEY == "your-jwt-secret-key-change-me":
            raise ValueError("JWT_SECRET_KEY must be a secure unique secret, not default placeholder")

        GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
        if not GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID == "your-google-client-id-here.apps.googleusercontent.com":
            raise ValueError("GOOGLE_CLIENT_ID must be configured with a real Google client ID")

        DB_HOST = os.environ["DB_HOST"]
        DB_PORT = os.environ.get("DB_PORT", "3306")
        DB_USER = os.environ["DB_USER"]
        DB_PASSWORD = os.environ["DB_PASSWORD"]
        DB_NAME = os.environ["DB_NAME"]
    except KeyError as e:
        raise ValueError(f"Missing required environment variable: {e.args[0]}") from e

    # Quote password to handle special characters (e.g. '@') safely in the connection URI
    DB_PASSWORD_QUOTED = urllib.parse.quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD_QUOTED}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    RATE_LIMIT_DEFAULT = os.environ.get("RATE_LIMIT_DEFAULT", "100/hour")

    PLAN_LIMITS = {
        "free": {
            "max_folders": 5,
            "max_notes": 50,
            "max_storage_bytes": 50000
        },
        "pro": {
            "max_folders": 999999,
            "max_notes": 999999,
            "max_storage_bytes": 500000000
        },
        "business": {
            "max_folders": 999999,
            "max_notes": 999999,
            "max_storage_bytes": 500000000
        },
        "enterprise": {
            "max_folders": 999999,
            "max_notes": 999999,
            "max_storage_bytes": 500000000
        }
    }

    # AI daily action caps per plan (protects shared Gemini free-tier quota)
    # Free: 20 actions/day. Paid plans: effectively unlimited (99999).
    AI_DAILY_LIMITS = {
        "free": 20,
        "pro": 99999,
        "business": 99999,
        "enterprise": 99999
    }

    # Gemini model names — change here only, never inline
    GEMINI_GENERATION_MODEL = os.environ.get("GEMINI_GENERATION_MODEL", "gemini-1.5-flash")
    GEMINI_EMBEDDING_MODEL = os.environ.get("GEMINI_EMBEDDING_MODEL", "text-embedding-004")
