# Opinion Gravity

观点共创社区（MVP）

## 已完成

- 辩题列表页（首页）
- 创建辩题页
- 辩题详情页（立场统计、投票、观点发布）
- API 路由：Topic / Opinion / Vote / Health
- Docker Compose + Nginx 部署骨架

## 目录

- `docs/TECHNICAL_SPEC.md` 技术方案与实施文档
- `docs/deploy/DEPLOYMENT.md` 服务器部署指南
- `apps/web` 前端应用（Next.js）
- `apps/api` 后端应用（Express + TypeScript）
- `packages/shared` 共享类型
- `infra/nginx/default.conf` 反向代理配置

## 本地开发

1. 安装依赖
```bash
npm install
```

2. 启动后端
```bash
npm run dev:api
```

3. 启动前端
```bash
npm run dev:web
```

默认地址：
- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## 容器部署（MVP）

```bash
docker compose up -d --build
```

访问：
- `http://localhost/`
- `http://localhost/api/health`

## 环境变量

参考根目录 `.env.example`。
