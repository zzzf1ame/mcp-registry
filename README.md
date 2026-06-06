# MCP Registry

一个开源的后端 API，用于发现、评估和管理 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 服务器。基于 FastAPI 和 SQLAlchemy 2.0 异步框架构建。

## 功能特性

- **服务器注册中心** — 浏览、搜索和按分类筛选 MCP 服务器，支持分页和排序
- **提交工作流** — 提交新的 MCP 服务器，附带审核/批准流程
- **评论系统** — 对 MCP 服务器进行评分和评论（1-5 星）
- **版本追踪** — 追踪服务器版本和变更日志
- **GitHub 集成** — 自动同步 Stars、Forks 和最后推送时间（可配置）

## 技术栈

| 组件 | 选择 |
|------|------|
| 框架 | FastAPI (异步) |
| ORM | SQLAlchemy 2.0 (异步, 声明式) |
| 数据库 | SQLite / PostgreSQL (通过 aiosqlite / asyncpg) |
| 数据验证 | Pydantic v2 |
| 配置管理 | pydantic-settings (支持 .env) |
| 测试 | pytest + httpx (异步) |

## 快速开始

### 前置条件

- Python 3.11+
- pip / uv

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/your-username/mcp-registry.git
cd mcp-registry/backend

# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安装依赖
pip install -e ".[dev]"

# 启动服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

打开 [http://localhost:8000/docs](http://localhost:8000/docs) 查看交互式 API 文档。

### Docker 部署

```bash
docker compose up --build
```

API 将在 [http://localhost:8000](http://localhost:8000) 上可用。

## API 端点

### 服务器相关

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/v1/servers/` | 列出服务器（支持搜索、筛选、分页） |
| GET | `/api/v1/servers/{slug}` | 获取服务器详情 |
| POST | `/api/v1/servers/` | 提交新服务器（待审核） |

### 评论相关

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/v1/reviews/?server_id={id}` | 列出指定服务器的评论 |
| POST | `/api/v1/reviews/` | 创建评论 |

### 健康检查

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |

## 项目结构

```
mcp-registry/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 应用、生命周期、CORS 配置
│   │   ├── config.py        # 设置（pydantic-settings）
│   │   ├── database.py      # 异步引擎和会话工厂
│   │   ├── models.py        # SQLAlchemy ORM 模型
│   │   ├── schemas.py       # Pydantic 请求/响应模型
│   │   └── api/
│   │       ├── servers.py   # 服务器 CRUD 和搜索端点
│   │       └── reviews.py   # 评论 CRUD 端点
│   ├── test_api.py          # API 集成测试
│   ├── alembic/             # 数据库迁移
│   ├── alembic.ini          # Alembic 配置
│   ├── requirements.txt     # Pip 依赖
│   └── pyproject.toml       # 项目元数据和构建配置
├── Dockerfile
├── docker-compose.yml
├── LICENSE
└── README.md
```

## 配置

在 `backend/` 目录下创建一个 `.env` 文件：

```env
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./mcp_registry.db
GITHUB_TOKEN=ghp_xxxxxxxxxxxx   # 可选：用于 GitHub API 同步
CORS_ORIGINS=["http://localhost:3000"]
```

所有设置都有合理的默认值，可以通过环境变量覆盖。

## 开发指南

### 运行测试

```bash
cd backend
pip install -e ".[dev]"
python -m pytest test_api.py -v
```

### 数据库迁移

```bash
cd backend

# 创建新的迁移
alembic revision --autogenerate -m "描述你的变更"

# 应用迁移
alembic upgrade head
```

## 开发路线图

- [ ] 身份认证（GitHub OAuth，用于提交者登录）
- [ ] 管理后台（用于审核提交）
- [ ] GitHub Webhook 集成（自动更新 Stars/Forks）
- [ ] 全文搜索（FTS5 或 pgvector）
- [ ] 前端界面（React / Vue）

## 许可证

[MIT](LICENSE)
