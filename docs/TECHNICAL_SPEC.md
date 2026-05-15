# Opinion Gravity 技术方案与实施文档

## 1. 项目目标

构建一个“观点共创社区”网站：
- 用户可创建辩题（Topic）
- 用户可在不同立场下发表观点（Opinion）
- 用户可参与立场投票与观点投票
- 系统突出“表达欲 + 认同感”，并兼顾内容质量与社区治理

本项目避免任何综艺 IP 元素复用，采用原创命名与机制。

## 2. 技术选型

### 2.1 前端（Web）
- Next.js 14+（App Router）
- TypeScript
- CSS Variables + 自定义样式系统

### 2.2 后端（API）
- Express（当前阶段）+ TypeScript
- RESTful API
- 后续演进：NestJS + 模块化服务层

### 2.3 数据与基础设施
- 当前：内存存储（便于快速迭代）
- 下一阶段：PostgreSQL + Redis
- 部署：Docker Compose + Nginx（已提供）

## 3. 系统架构

- `apps/web`：用户侧页面
- `apps/api`：业务 API
- `packages/shared`：共享类型
- `infra/nginx`：反向代理
- `docs`：方案与部署文档

## 4. 当前已实现功能（MVP v0）

1. 辩题首页：
- 展示辩题列表
- 显示每个辩题投票总数

2. 辩题创建：
- 标题、描述、标签
- 立场 A/B 自定义

3. 辩题详情：
- 立场统计
- 立场投票
- 发布观点
- 观点列表展示

4. API：
- `GET /health`
- `GET /v1/topics`
- `GET /v1/topics/:id`
- `POST /v1/topics`
- `GET /v1/topics/:id/opinions`
- `POST /v1/topics/:id/opinions`
- `POST /v1/topics/:id/vote`
- `POST /v1/opinions/:id/vote`

## 5. 数据模型（下一阶段 PostgreSQL）

核心表：
- `users`
- `topics`
- `stances`
- `opinions`
- `topic_votes`
- `opinion_votes`

> 详细 SQL 草案可在下一迭代补为 `docs/db/schema.sql`。

## 6. 部署策略

### 6.1 MVP 服务器部署
- 容器：`web`、`api`、`nginx`
- Nginx 统一入口
- `/api/*` 转发到后端

### 6.2 生产增强建议
1. HTTPS + 自动续期
2. 数据库托管（RDS）
3. Redis 缓存与限流
4. 日志监控与告警
5. CI/CD（GitHub Actions）

## 7. 后续开发路线

1. 接入真实数据库（Prisma + PostgreSQL）
2. 鉴权系统（JWT）
3. 举报审核与内容治理
4. 推荐与热榜
5. 实时票数更新（WebSocket）
