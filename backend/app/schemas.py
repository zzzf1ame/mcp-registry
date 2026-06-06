"""
MCP Registry Pydantic Schema。
定义请求和响应的数据模型，用于输入校验和 API 文档生成。
"""

from datetime import datetime

from pydantic import BaseModel, Field


# ── Server Schemas ─────────────────────────────────────────


class ServerSubmitRequest(BaseModel):
    """提交 MCP 服务器的请求体。"""

    name: str = Field(..., min_length=1, max_length=200, description="服务器名称")
    repo_url: str = Field(..., min_length=1, max_length=500, description="GitHub 仓库地址")
    description: str | None = Field(None, max_length=2000, description="简短描述")
    homepage_url: str | None = Field(None, max_length=500, description="主页链接")
    category: str = Field("other", max_length=50, description="分类: database / ai / devtools / other")
    tags: list[str] = Field(default_factory=list, description="标签列表")
    submitted_by: str | None = Field(None, max_length=100, description="提交者")


class ServerListItem(BaseModel):
    """服务器列表中的单条记录。"""

    id: int
    slug: str
    name: str
    description: str | None
    category: str
    github_stars: int
    view_count: int
    install_count: int


class ServerListResponse(BaseModel):
    """服务器列表响应。"""

    total: int
    page: int
    page_size: int
    items: list[ServerListItem]


class ServerDetail(BaseModel):
    """服务器详情。"""

    id: int
    slug: str
    name: str
    description: str | None
    repo_url: str
    homepage_url: str | None
    category: str
    tags: list[str]
    logo_url: str | None
    github_stars: int
    github_forks: int
    github_last_push: datetime | None
    view_count: int
    install_count: int
    created_at: datetime
    updated_at: datetime


class ServerSubmitResponse(BaseModel):
    """提交服务器的响应体。"""

    id: int
    slug: str
    status: str


# ── Review Schemas ─────────────────────────────────────────


class ReviewCreateRequest(BaseModel):
    """创建评论的请求体。"""

    server_id: int = Field(..., description="关联的服务器 ID")
    rating: int = Field(..., ge=1, le=5, description="评分 1-5")
    title: str | None = Field(None, max_length=200, description="评论标题")
    content: str | None = Field(None, max_length=5000, description="评论内容")
    author: str | None = Field(None, max_length=100, description="评论者")


class ReviewItem(BaseModel):
    """评论列表中的单条记录。"""

    id: int
    rating: int
    title: str | None
    content: str | None
    author: str | None
    helpful_count: int
    created_at: datetime


class ReviewListResponse(BaseModel):
    """评论列表响应。"""

    total: int
    page: int
    page_size: int
    items: list[ReviewItem]


class ReviewCreateResponse(ReviewItem):
    """创建评论的响应体（继承 ReviewItem，返回完整评论信息）。"""
    pass
