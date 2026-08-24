"""
MCP Registry 数据库模型。
使用 SQLAlchemy 2.0 声明式映射。
"""

from datetime import UTC, datetime
from enum import StrEnum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    """所有模型的基类。"""


class SubmissionStatus(StrEnum):
    """提交审核状态。"""

    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class MCPServer(Base):
    """MCP 服务器主表。"""

    __tablename__ = "mcp_servers"

    id = Column(Integer, primary_key=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    repo_url = Column(String(500), nullable=False)
    homepage_url = Column(String(500), nullable=True)
    category = Column(String(50), nullable=False, index=True)
    tags = Column(JSON, default=list)  # 存为 JSON 数组
    logo_url = Column(String(500), nullable=True)

    # GitHub 数据
    github_stars = Column(Integer, default=0)
    github_forks = Column(Integer, default=0)
    github_last_push = Column(DateTime(timezone=True), nullable=True)

    # 审核状态
    status = Column(String(20), default=SubmissionStatus.PENDING.value, index=True)
    submitted_by = Column(String(100), nullable=True)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # 统计
    install_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)

    # 时间戳
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # 关系
    versions = relationship("MCPServerVersion", back_populates="server", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="server", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_mcp_servers_category_status", "category", "status"),
        Index("idx_mcp_servers_stars", "github_stars"),
    )


class MCPServerVersion(Base):
    """MCP 服务器版本记录。"""

    __tablename__ = "mcp_server_versions"

    id = Column(Integer, primary_key=True)
    server_id = Column(Integer, ForeignKey("mcp_servers.id", ondelete="CASCADE"), nullable=False)
    version = Column(String(50), nullable=False)
    changelog = Column(Text, nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    server = relationship("MCPServer", back_populates="versions")

    __table_args__ = (
        UniqueConstraint("server_id", "version", name="uq_server_version"),
    )


class Review(Base):
    """用户评价。"""

    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    server_id = Column(Integer, ForeignKey("mcp_servers.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5，API 层校验
    title = Column(String(200), nullable=True)
    content = Column(Text, nullable=True)
    author = Column(String(100), nullable=True)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    server = relationship("MCPServer", back_populates="reviews")

    __table_args__ = (
        Index("idx_reviews_server", "server_id"),
    )
