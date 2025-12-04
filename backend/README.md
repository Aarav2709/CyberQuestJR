# CyberQuestJR Backend

Production-ready backend API for the CyberQuestJR educational cybersecurity platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT + Argon2 password hashing

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and update values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Minimum 32 character secret for JWT signing

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate

# Seed initial data (chapters, lessons, badges)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3001` by default.

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint           | Description             | Auth |
| ------ | ------------------ | ----------------------- | ---- |
| POST   | `/register`        | Create new account      | No   |
| POST   | `/login`           | Login and receive token | No   |
| POST   | `/logout`          | Invalidate session      | Yes  |
| GET    | `/me`              | Get current user        | Yes  |
| POST   | `/change-password` | Change password         | Yes  |

### Profile (`/api/profile`)

| Method | Endpoint     | Description         | Auth |
| ------ | ------------ | ------------------- | ---- |
| GET    | `/`          | Get profile         | Yes  |
| PATCH  | `/`          | Update profile      | Yes  |
| GET    | `/dashboard` | Get dashboard stats | Yes  |

### Progress (`/api/progress`)

| Method | Endpoint    | Description             | Auth |
| ------ | ----------- | ----------------------- | ---- |
| GET    | `/`         | Get all progress        | Yes  |
| POST   | `/lessons`  | Update lesson progress  | Yes  |
| POST   | `/chapters` | Update chapter progress | Yes  |
| POST   | `/sync`     | Bulk sync from client   | Yes  |
| GET    | `/history`  | Get progress history    | Yes  |

### Quiz (`/api/quiz`)

| Method | Endpoint       | Description           | Auth |
| ------ | -------------- | --------------------- | ---- |
| POST   | `/attempt`     | Submit quiz attempt   | Yes  |
| GET    | `/attempts`    | Get quiz attempts     | Yes  |
| GET    | `/stats`       | Get quiz statistics   | Yes  |
| GET    | `/breakdown`   | Per-lesson breakdown  | Yes  |
| GET    | `/weak-topics` | Get struggling topics | Yes  |
| GET    | `/recent`      | Recent quiz activity  | Yes  |

### Gamification (`/api/gamification`)

| Method | Endpoint       | Description               | Auth |
| ------ | -------------- | ------------------------- | ---- |
| GET    | `/xp`          | Get total XP              | Yes  |
| GET    | `/xp/history`  | Get XP history            | Yes  |
| GET    | `/streak`      | Get streak info           | Yes  |
| GET    | `/badges`      | Get all badges            | Yes  |
| GET    | `/badges/me`   | Get earned badges         | Yes  |
| GET    | `/leaderboard` | Get leaderboard           | No   |
| GET    | `/rank`        | Get user rank             | Yes  |
| GET    | `/summary`     | Full gamification summary | Yes  |

### Certificates (`/api/certificates`)

| Method | Endpoint        | Description           | Auth |
| ------ | --------------- | --------------------- | ---- |
| GET    | `/verify/:code` | Verify certificate    | No   |
| POST   | `/`             | Create certificate    | Yes  |
| GET    | `/`             | Get user certificates | Yes  |
| GET    | `/:id`          | Get certificate by ID | Yes  |

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

## XP System

| Action                   | XP Amount |
| ------------------------ | --------- |
| Start lesson             | 10        |
| Complete lesson          | 50        |
| Quiz correct (first try) | 25        |
| Quiz correct (retry)     | 10        |
| Complete chapter         | 200       |
| Earn badge               | 50        |
| 7-day streak milestone   | 100       |
| First login              | 25        |

## Project Structure

```
backend/
  prisma/
    schema.prisma      # Database schema
    seed.ts            # Seed data script
  src/
    config/
      index.ts         # Environment configuration
    lib/
      prisma.ts        # Prisma client singleton
      ids.ts           # ID generation utilities
    routes/
      auth.ts          # Authentication routes
      profile.ts       # Profile routes
      progress.ts      # Progress tracking routes
      quiz.ts          # Quiz analytics routes
      gamification.ts  # XP, badges, streaks routes
      certificates.ts  # Certificate routes
    schemas/
      auth.ts          # Auth validation schemas
      profile.ts       # Profile validation schemas
      progress.ts      # Progress validation schemas
      quiz.ts          # Quiz validation schemas
      gamification.ts  # Gamification schemas
      certificates.ts  # Certificate schemas
    services/
      auth.ts          # Auth business logic
      profile.ts       # Profile business logic
      progress.ts      # Progress business logic
      quiz.ts          # Quiz business logic
      gamification.ts  # Gamification business logic
      certificates.ts  # Certificate business logic
    server.ts          # Main server entry point
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check without building
