"""
MCP 服务器 API 路由。
提供服务器的 CRUD、搜索、详情等接口。
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from slugify import slugify
from sqlalchemy import desc, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import MCPServer, SubmissionStatus
from app.schemas import (
    ServerDetail,
    ServerListItem,
    ServerListResponse,
    ServerSubmitRequest,
    ServerSubmitResponse,
)

router = APIRouter()


@router.get("/", response_model=ServerListResponse)
async def list_servers(
    q: str = Query(default="", description="搜索关键词"),
    category: str = Query(default="", description="分类过滤"),
    sort: str = Query(default="stars", description="排序方式: stars|updated|newest"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """列出 MCP 服务器（支持搜索、过滤、分页）。"""
    stmt = select(MCPServer).where(MCPServer.status == SubmissionStatus.APPROVED.value)

    # 搜索
    if q:
        search = f"%{q}%"
        stmt = stmt.where(
            or_(MCPServer.name.ilike(search), MCPServer.description.ilike(search))
        )

    # 分类过滤
    if category:
        stmt = stmt.where(MCPServer.category == category)

    # 排序
    if sort == "stars":
        stmt = stmt.order_by(desc(MCPServer.github_stars))
    elif sort == "updated":
        stmt = stmt.order_by(desc(MCPServer.updated_at))
    else:
        stmt = stmt.order_by(desc(MCPServer.created_at))

    # 分页
    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = await db.scalar(total_stmt)

    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(stmt)
    servers = result.scalars().all()

    return ServerListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[
            ServerListItem(
                id=s.id,
                slug=s.slug,
                name=s.name,
                description=s.description,
                category=s.category,
                github_stars=s.github_stars,
                view_count=s.view_count,
                install_count=s.install_count,
            )
            for s in servers
        ],
    )


@router.get("/{slug}", response_model=ServerDetail)
async def get_server(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """获取服务器详情（自动增加浏览次数）。"""
    result = await db.execute(
        select(MCPServer).where(
            MCPServer.slug == slug,
            MCPServer.status == SubmissionStatus.APPROVED.value,
        )
    )
    server = result.scalar_one_or_none()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")

    # 增加浏览计数
    server.view_count += 1
    await db.commit()

    return ServerDetail(
        id=server.id,
        slug=server.slug,
        name=server.name,
        description=server.description,
        repo_url=server.repo_url,
        homepage_url=server.homepage_url,
        category=server.category,
        tags=server.tags if isinstance(server.tags, list) else [],
        logo_url=server.logo_url,
        github_stars=server.github_stars,
        github_forks=server.github_forks,
        github_last_push=server.github_last_push,
        view_count=server.view_count,
        install_count=server.install_count,
        created_at=server.created_at,
        updated_at=server.updated_at,
    )


@router.post("/", response_model=ServerSubmitResponse, status_code=201)
async def submit_server(
    data: ServerSubmitRequest,
    db: AsyncSession = Depends(get_db),
):
    """提交新的 MCP 服务器（待审核）。"""
    slug = slugify(data.name)

    # 检查 slug 是否已存在
    existing = await db.execute(select(MCPServer).where(MCPServer.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{data.repo_url[-8:]}"

    server = MCPServer(
        slug=slug,
        name=data.name,
        description=data.description,
        repo_url=data.repo_url,
        homepage_url=data.homepage_url,
        category=data.category,
        tags=data.tags,  # JSON 列直接存列表
        status=SubmissionStatus.PENDING.value,
        submitted_by=data.submitted_by,
    )
    db.add(server)
    await db.commit()
    await db.refresh(server)

    return ServerSubmitResponse(
        id=server.id,
        slug=server.slug,
        status=server.status,
    )
