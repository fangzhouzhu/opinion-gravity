# 部署指南（服务器）

## 1. 部署方式

推荐先用 Docker Compose 单机部署（适合 MVP）。

架构：
- `nginx`：80 端口入口
- `web`：Next.js 前端服务（3000）
- `api`：Node API 服务（4000）

## 2. 服务器准备

1. 安装 Docker 与 Docker Compose
2. 开放端口：`80`（可选 `443`）
3. 拉取代码到服务器

## 3. 环境变量

复制 `.env.example` 作为生产环境参考，按实际域名修改：
- `NEXT_PUBLIC_API_BASE`
- `PORT`
- `CORS_ORIGIN`

## 4. 启动

```bash
docker compose up -d --build
```

访问：
- `http://<服务器IP>/` -> web
- `http://<服务器IP>/api/health` -> api health

## 5. Nginx 路由规则

- `/` 转发到 `web:3000`
- `/api/*` 转发到 `api:4000/*`

配置文件：`infra/nginx/default.conf`

## 6. 下一步生产增强

1. 使用 HTTPS（Nginx + Let's Encrypt）
2. API 接入 PostgreSQL/Redis（当前为内存存储）
3. 接入日志与监控（Sentry + Prometheus）
4. 前端改为生产启动命令（`next start`）
