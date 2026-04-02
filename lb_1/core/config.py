from pydantic_settings import BaseSettings, SettingsConfigDict


class DbSettings(BaseSettings):
    url: str
    echo: bool = True

    model_config = SettingsConfigDict(env_file=".env")


class Settings(BaseSettings):
    api_v1_prefix: str = "/api/v1"

    db: DbSettings = DbSettings()


settings = Settings()
