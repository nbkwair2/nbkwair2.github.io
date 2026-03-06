# cloudkitchen-os

A Turborepo monorepo for the CloudKitchen OS platform — a modern cloud kitchen ordering and management system.

## Apps

| App | Stack | Port |
|-----|-------|------|
| `apps/customer-web` | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui | 3000 |
| `apps/kitchen-dashboard` | React 18 + Vite + Tailwind CSS | 3001 |
| `apps/admin-panel` | React 18 + Vite + Tailwind CSS | 3002 |

## Packages

| Package | Description |
|---------|-------------|
| `packages/api` | Node.js + Express + TypeScript REST API server |
| `packages/db` | Prisma ORM + PostgreSQL migrations & seed |
| `packages/shared-types` | TypeScript types shared across all apps |
| `packages/notifications` | FCM (push) + Twilio (SMS) helper library |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose (for Postgres + Redis)

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL 15** on `localhost:5432`
- **Redis 7** on `localhost:6379`

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and fill in your values
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Database

```bash
cd packages/db
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:seed       # Seed initial data
```

### 5. Start Development

```bash
turbo dev
# or
npm run dev
```

All apps start in parallel:
- Customer Web → http://localhost:3000
- Kitchen Dashboard → http://localhost:3001
- Admin Panel → http://localhost:3002
- API Server → http://localhost:4000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in parallel |
| `npm run build` | Build all apps |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |
| `docker-compose up` | Start Postgres + Redis |

## Architecture

```
cloudkitchen-os/
├── apps/
│   ├── customer-web/        # Next.js 14 customer-facing storefront
│   ├── kitchen-dashboard/   # React 18 kitchen operations dashboard
│   └── admin-panel/         # React 18 admin management panel
├── packages/
│   ├── api/                 # Express REST API + WebSocket server
│   ├── db/                  # Prisma schema, migrations, seed
│   ├── shared-types/        # Shared TypeScript interfaces & enums
│   └── notifications/       # FCM + Twilio notification helpers
├── turbo.json               # Turborepo pipeline config
├── docker-compose.yml       # Postgres 15 + Redis 7
└── .env.example             # Environment variable template
```