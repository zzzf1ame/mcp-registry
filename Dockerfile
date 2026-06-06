FROM python:3.13-slim

WORKDIR /app

# 安装系统依赖（sqlite3 已内置）
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 安装 Python 依赖（利用 Docker 层缓存）
COPY pyproject.toml ./
RUN pip install --no-cache-dir .

# 复制应用代码
COPY backend/ ./backend/

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
