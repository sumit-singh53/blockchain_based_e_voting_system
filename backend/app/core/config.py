from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Blockchain eVoting API"
    api_v1_prefix: str = "/api"
    secret_key: str = "changeme"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "blockchain-database"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


settings = Settings()
