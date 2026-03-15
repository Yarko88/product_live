from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Live City Backend"
    debug: bool = True

    database_url: PostgresDsn = "postgresql://postgres:postgres@db:5432/live_city"

    jwt_secret_key: str = "CHANGE_ME_SECRET"  # TODO: вынести в .env
    jwt_algorithm: str = "HS256"
    jwt_access_token_expires_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()

