"""
MCP Registry FastAPI 主应用。
"""

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import reviews, servers
from app.config import settings
from app.database import engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """应用生命周期管理：启动时建表，关闭时释放连接池。"""
    # 启动时：创建数据库表（复用 database.py 的 engine）
    from app.models import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # 关闭时：释放连接池
    await engine.dispose()


app = FastAPI(
    title="MCP Registry API",
    description="MCP Server Registry — discover, evaluate, and install MCP servers",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS 配置（从 settings 读取，不再硬编码）
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials="*" not in settings.CORS_ORIGINS,  # * 与 credentials 互斥
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """健康检查。"""
    return {"status": "ok", "version": "0.1.0"}


# 注册路由
app.include_router(servers.router, prefix="/api/v1/servers", tags=["servers"])
app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["reviews"])
