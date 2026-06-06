"""
MCP Registry API 测试。
使用 FastAPI TestClient + dependency_overrides 注入内存数据库。

运行方式：
    cd backend
    python -m pytest test_api.py -v
"""

import asyncio
from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.database import get_db
from app.main import app
from app.models import Base, MCPServer, SubmissionStatus

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def test_db() -> AsyncIterator[AsyncSession]:
    """创建内存数据库并注入到 FastAPI。"""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    test_session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_db() -> AsyncIterator[AsyncSession]:
        async with test_session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    # 替换依赖
    app.dependency_overrides[get_db] = override_get_db
    try:
        async with test_session_factory() as session:
            yield session
    finally:
        app.dependency_overrides.clear()
        await engine.dispose()


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    """创建测试用 HTTP 客户端。"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ── 测试用例 ──────────────────────────────────────────────


@pytest.mark.asyncio
async def test_list_empty_servers(client: AsyncClient, test_db):
    """测试1：空列表返回正确结构。"""
    resp = await client.get("/api/v1/servers/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_submit_server(client: AsyncClient, test_db):
    """测试2：提交服务器返回 pending 状态。"""
    resp = await client.post(
        "/api/v1/servers/",
        json={
            "name": "Test MCP Server",
            "repo_url": "https://github.com/test/test-mcp",
            "category": "database",
            "submitted_by": "tester",
        },
    )
    assert resp.status_code == 201, f"创建失败: {resp.text}"
    data = resp.json()
    assert data["status"] == "pending"
    assert "slug" in data


@pytest.mark.asyncio
async def test_pending_server_not_visible(client: AsyncClient, test_db):
    """测试3：pending 状态的服务器对外不可见。"""
    # 先提交一个
    resp = await client.post(
        "/api/v1/servers/",
        json={
            "name": "Hidden Server",
            "repo_url": "https://github.com/test/hidden",
            "category": "ai",
        },
    )
    slug = resp.json()["slug"]

    # 查询详情应该 404
    resp = await client.get(f"/api/v1/servers/{slug}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_submit_validation(client: AsyncClient, test_db):
    """测试4：缺少必填字段时返回 422。"""
    resp = await client.post("/api/v1/servers/", json={"description": "no name or url"})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_review_rating_validation(client: AsyncClient, test_db):
    """测试5：评分超出 1-5 范围时返回 422。"""
    resp = await client.post(
        "/api/v1/reviews/",
        json={"server_id": 1, "rating": 999, "author": "troll"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient, test_db):
    """测试6：健康检查。"""
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
