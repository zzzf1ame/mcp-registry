"""
MCP Registry 评论 API 路由。
提供评论的创建和查询接口。
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import Review
from app.schemas import (
    ReviewCreateRequest,
    ReviewCreateResponse,
    ReviewItem,
    ReviewListResponse,
)

router = APIRouter()


@router.get("/", response_model=ReviewListResponse)
async def list_reviews(
    server_id: int = Query(..., description="服务器 ID"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """列出指定服务器的评论（分页）。"""
    base_stmt = select(Review).where(Review.server_id == server_id)

    # 总数
    total = await db.scalar(
        select(func.count()).select_from(base_stmt.subquery())
    )

    # 分页查询
    stmt = (
        base_stmt.order_by(Review.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(stmt)
    reviews = result.scalars().all()

    return ReviewListResponse(
        total=total or 0,
        page=page,
        page_size=page_size,
        items=[
            ReviewItem(
                id=r.id,
                rating=r.rating,
                title=r.title,
                content=r.content,
                author=r.author,
                helpful_count=r.helpful_count,
                created_at=r.created_at,
            )
            for r in reviews
        ],
    )


@router.post("/", response_model=ReviewCreateResponse, status_code=201)
async def create_review(
    data: ReviewCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """创建评论。"""
    review = Review(
        server_id=data.server_id,
        rating=data.rating,
        title=data.title,
        content=data.content,
        author=data.author,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)

    return ReviewCreateResponse(
        id=review.id,
        rating=review.rating,
        title=review.title,
        content=review.content,
        author=review.author,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
    )
