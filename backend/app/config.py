"""
MCP Registry 配置管理。
使用 pydantic-settings 从环境变量 / .env 文件读取配置。
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用配置。"""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # 应用
    APP_NAME: str = "MCP Registry"
    DEBUG: bool = False

    # 数据库
    DATABASE_URL: str = "sqlite+aiosqlite:///./mcp_registry.db"

    # GitHub API
    GITHUB_TOKEN: str | None = None

    # CORS
    CORS_ORIGINS: list[str] = ["*"]


settings = Settings()
