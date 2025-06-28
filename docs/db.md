# Database Setup

## Overview

Study Sphere uses SQLite with Drizzle ORM for type-safe database operations.

## Quick Start

### Prerequisites
- Bun runtime
- SQLite (built-in)

### Installation
```bash
# Clone repository
git clone https://github.com/k0msenapati/study-sphere.git
cd study-sphere

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your GROQ_API_KEY
```

## Environment Configuration

### Required Variables
```env
# Database
DATABASE_URL="file:./sqlite.db"

# AI Integration
GROQ_API_KEY="your-groq-api-key-here"

# Security
JWT_SECRET="your-jwt-secret-key"
```

## Database Setup

### Initialize Database
```bash
# Generate migration files
bun run db:generate

# Apply migrations
bun run db:migrate

# Optional: Open database studio
bun run db:studio
```

### Configuration Files

#### drizzle.config.ts
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db', 
  },
} satisfies Config;
```

#### src/lib/db/index.ts
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('./sqlite.db');
export const db = drizzle(sqlite);
```

## Schema Overview

### Core Tables
- **users**: User authentication
- **notes**: Rich text notes
- **tasks**: Task management
- **chats**: AI conversation history
- **daily_reviews**: Progress tracking
- **user_settings**: User preferences

### Relationships
- All tables link to users via `userId`
- Foreign key constraints with cascade delete
- Timestamps for created/updated tracking

## Available Commands

```bash
# Database operations
bun run db:generate    # Generate migrations
bun run db:migrate     # Apply migrations
bun run db:push        # Push schema changes
bun run db:studio      # Open database studio

# Development
bun run dev           # Start development server
bun run build         # Build for production
```

## Development Notes

- SQLite file stored in project root
- Migrations stored in `/drizzle` folder
- Schema defined in `src/lib/db/schema.ts`
- Auto-generated timestamps
- Type-safe queries with Drizzle ORM