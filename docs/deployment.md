# Deployment Guide

## Overview
This comprehensive guide covers all aspects of deploying Study Sphere to various environments, from local development to production deployment on cloud platforms. It includes configuration, monitoring, scaling, and maintenance procedures.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Database Management](#database-management)
- [Monitoring & Logging](#monitoring--logging)
- [Scaling Strategies](#scaling-strategies)
- [Maintenance & Updates](#maintenance--updates)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **Bun**: Latest stable version (recommended) or npm/yarn
- **SQLite**: 3.35.0 or higher (for local/staging)
- **PostgreSQL**: 13.0 or higher (for production)
- **Redis**: 6.0 or higher (for caching and sessions)
- **Docker**: 20.10 or higher (optional, for containerization)

### Development Tools
- Git for version control
- VS Code or preferred IDE
- Postman for API testing
- Database management tool (DB Browser for SQLite, pgAdmin for PostgreSQL)

### Cloud Services
- **Vercel**: For hosting Next.js application
- **Railway/Supabase**: For PostgreSQL database
- **Redis Cloud**: For Redis caching
- **Cloudflare**: For CDN and DNS
- **GitHub**: For CI/CD workflows

## Environment Setup

### Environment Variables

Create `.env.local` file in the project root:

```bash
# Database Configuration
DATABASE_URL="sqlite:./sqlite.db"
# For production: DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRES_IN="7d"

# AI Configuration
GROQ_API_KEY="your-groq-api-key"
COPILOT_CLOUD_API_KEY="your-copilotkit-api-key"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Redis Configuration (Optional for development)
REDIS_URL="redis://localhost:6379"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS="GA_MEASUREMENT_ID"
NEXT_PUBLIC_POSTHOG_KEY="phc_your_posthog_key"

# Error Tracking
SENTRY_DSN="your-sentry-dsn"
```

### Environment-Specific Variables

#### Development (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=sqlite:./sqlite.db
LOG_LEVEL=debug
```

#### Staging (.env.staging)
```bash
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.studysphere.com
DATABASE_URL=postgresql://user:password@staging-db:5432/studysphere_staging
LOG_LEVEL=info
REDIS_URL=redis://staging-redis:6379
```

#### Production (.env.production)
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://studysphere.com
DATABASE_URL=postgresql://user:password@prod-db:5432/studysphere
LOG_LEVEL=warn
REDIS_URL=redis://prod-redis:6379
SENTRY_DSN=https://your-sentry-dsn
```

## Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-org/study-sphere.git
cd study-sphere

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
bun run db:push
bun run db:seed

# Start the development server
bun run dev
```

### Development Workflow
```bash
# Start development with hot reload
bun run dev

# Run in different modes
bun run dev:debug     # With debug logging
bun run dev:https     # With HTTPS (requires SSL certificates)
bun run dev:turbo     # With Turbopack (experimental)

# Database operations
bun run db:studio     # Open Drizzle Studio
bun run db:generate   # Generate migration files
bun run db:migrate    # Apply migrations
bun run db:seed       # Seed with sample data
bun run db:reset      # Reset database

# Testing
bun run test          # Run all tests
bun run test:watch    # Run tests in watch mode
bun run test:coverage # Generate coverage report
bun run test:e2e      # Run end-to-end tests

# Code quality
bun run lint          # Run ESLint
bun run lint:fix      # Fix linting issues
bun run format        # Format code with Prettier
bun run type-check    # TypeScript type checking
```

### Docker Development Environment

Create `docker-compose.dev.yml`:
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/studysphere_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: studysphere_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

## Staging Deployment

### Vercel Staging Setup

1. **Connect Repository to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and link project
   vercel login
   vercel link
   ```

2. **Configure Staging Environment**
   ```bash
   # Create staging branch
   git checkout -b staging
   
   # Set up staging environment in Vercel
   vercel env add DATABASE_URL staging
   vercel env add JWT_SECRET staging
   vercel env add GROQ_API_KEY staging
   # Add all required environment variables
   ```

3. **Deploy to Staging**
   ```bash
   # Push to staging branch triggers automatic deployment
   git push origin staging
   
   # Or deploy manually
   vercel --prod --scope=staging
   ```

### Railway Staging Database

1. **Create Database Service**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and create project
   railway login
   railway new
   railway add --database postgresql
   ```

2. **Configure Database Connection**
   ```bash
   # Get database URL
   railway connect postgresql
   
   # Run migrations
   railway run bun run db:migrate
   ```

### Staging CI/CD Pipeline

Create `.github/workflows/staging.yml`:
```yaml
name: Staging Deployment

on:
  push:
    branches: [staging]
  pull_request:
    branches: [staging]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run type check
        run: bun run type-check
      
      - name: Run linting
        run: bun run lint
      
      - name: Run tests
        run: bun run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run build
        run: bun run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: staging
```

## Production Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimization verified
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] Monitoring tools configured
- [ ] Backup strategy implemented
- [ ] Rollback plan prepared

### Vercel Production Deployment

1. **Production Environment Setup**
   ```bash
   # Configure production environment variables
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add GROQ_API_KEY production
   vercel env add REDIS_URL production
   vercel env add SENTRY_DSN production
   
   # Set up custom domain
   vercel domains add studysphere.com
   vercel domains add www.studysphere.com
   ```

2. **Production Build Configuration**
   
   Update `next.config.mjs`:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       serverComponentsExternalPackages: ['@node-rs/argon2']
     },
     
     // Production optimizations
     compiler: {
       removeConsole: process.env.NODE_ENV === 'production'
     },
     
     // Security headers
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'X-Frame-Options',
               value: 'DENY'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             },
             {
               key: 'Referrer-Policy',
               value: 'origin-when-cross-origin'
             },
             {
               key: 'Strict-Transport-Security',
               value: 'max-age=31536000; includeSubDomains'
             }
           ]
         }
       ]
     },
     
     // Image optimization
     images: {
       domains: ['studysphere.com'],
       formats: ['image/webp', 'image/avif']
     }
   }
   
   export default nextConfig
   ```

3. **Deploy to Production**
   ```bash
   # Deploy from main branch
   git checkout main
   git pull origin main
   vercel --prod
   ```

### Database Production Setup

1. **PostgreSQL on Railway/Supabase**
   ```bash
   # Create production database
   railway new studysphere-prod
   railway add --database postgresql
   
   # Configure connection pooling
   railway variables set PGBOUNCER_ENABLED=true
   railway variables set PGBOUNCER_POOL_SIZE=25
   ```

2. **Migration Strategy**
   ```bash
   # Create migration script
   echo '#!/bin/bash
   
   # Backup current database
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   
   # Run migrations
   bun run db:migrate
   
   # Verify migration
   bun run db:validate
   
   echo "Migration completed successfully"
   ' > scripts/migrate-prod.sh
   
   chmod +x scripts/migrate-prod.sh
   ```

### Redis Production Setup

1. **Redis Cloud Configuration**
   ```bash
   # Configure Redis for production
   REDIS_URL="rediss://username:password@host:port"
   REDIS_MAX_CONNECTIONS=50
   REDIS_CONNECTION_TIMEOUT=5000
   ```

2. **Redis Configuration File**
   
   Create `redis.config.js`:
   ```javascript
   export const redisConfig = {
     production: {
       host: process.env.REDIS_HOST,
       port: process.env.REDIS_PORT,
       password: process.env.REDIS_PASSWORD,
       tls: true,
       maxRetriesPerRequest: 3,
       retryDelayOnFailover: 100,
       lazyConnect: true,
       keepAlive: 30000,
       maxRetriesPerRequest: null,
       maxRetriesPerRequest: 3
     }
   }
   ```

### Production CI/CD Pipeline

Create `.github/workflows/production.yml`:
```yaml
name: Production Deployment

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security scan
        uses: securecodewarrior/github-action-add-sarif@v1
        with:
          sarif-file: security-scan-results.sarif

  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Build application
        run: bun run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: ./lighthouserc.json

  deploy:
    needs: [security-scan, performance-test]
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Run smoke tests
        run: |
          curl -f https://studysphere.com/api/health || exit 1
          curl -f https://studysphere.com/ || exit 1
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed successfully!'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Database Management

### Migration Management

1. **Create Migration**
   ```bash
   # Generate migration from schema changes
   bun run db:generate
   
   # Create custom migration
   bunx drizzle-kit generate:pg --custom
   ```

2. **Migration File Structure**
   ```sql
   -- Migration: 0002_add_user_preferences.sql
   
   -- Up migration
   CREATE TABLE user_preferences (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     theme VARCHAR(20) DEFAULT 'light',
     language VARCHAR(10) DEFAULT 'en',
     notifications JSONB DEFAULT '{}',
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
   
   -- Insert default preferences for existing users
   INSERT INTO user_preferences (user_id)
   SELECT id FROM users WHERE id NOT IN (SELECT user_id FROM user_preferences);
   ```

3. **Production Migration Process**
   ```bash
   #!/bin/bash
   # migrate-prod-safe.sh
   
   set -e
   
   echo "Starting production migration..."
   
   # 1. Create backup
   echo "Creating backup..."
   pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d_%H%M%S).sql"
   
   # 2. Test migration on backup
   echo "Testing migration on backup database..."
   createdb temp_migration_test
   psql temp_migration_test < "backup_$(date +%Y%m%d_%H%M%S).sql"
   DATABASE_URL="postgresql://localhost/temp_migration_test" bun run db:migrate
   
   # 3. If test successful, run on production
   echo "Running migration on production..."
   bun run db:migrate
   
   # 4. Verify migration
   echo "Verifying migration..."
   bun run db:validate
   
   # 5. Cleanup
   dropdb temp_migration_test
   
   echo "Migration completed successfully!"
   ```

### Database Backup Strategy

1. **Automated Backups**
   ```bash
   #!/bin/bash
   # backup-database.sh
   
   BACKUP_DIR="/var/backups/studysphere"
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_FILE="$BACKUP_DIR/studysphere_$DATE.sql.gz"
   
   # Create backup directory
   mkdir -p $BACKUP_DIR
   
   # Create compressed backup
   pg_dump $DATABASE_URL | gzip > $BACKUP_FILE
   
   # Upload to cloud storage
   aws s3 cp $BACKUP_FILE s3://studysphere-backups/daily/
   
   # Keep only last 30 days of local backups
   find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
   
   echo "Backup completed: $BACKUP_FILE"
   ```

2. **Backup Cron Job**
   ```bash
   # Add to crontab: crontab -e
   # Daily backup at 2 AM
   0 2 * * * /path/to/backup-database.sh >> /var/log/backup.log 2>&1
   
   # Weekly full backup (Sundays at 1 AM)
   0 1 * * 0 /path/to/full-backup.sh >> /var/log/backup.log 2>&1
   ```

## Monitoring & Logging

### Application Monitoring

1. **Health Check Endpoint**
   
   Create `src/app/api/health/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server';
   import { db } from '@/lib/db';
   
   export async function GET() {
     try {
       // Check database connection
       await db.execute('SELECT 1');
       
       // Check Redis connection (if using)
       // await redis.ping();
       
       // Check external services
       const groqCheck = await fetch('https://api.groq.com/health', {
         method: 'HEAD',
         timeout: 5000
       });
       
       return NextResponse.json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         services: {
           database: 'up',
           redis: 'up',
           groq: groqCheck.ok ? 'up' : 'down'
         }
       });
     } catch (error) {
       return NextResponse.json(
         {
           status: 'unhealthy',
           timestamp: new Date().toISOString(),
           error: error.message
         },
         { status: 503 }
       );
     }
   }
   ```

2. **Sentry Integration**
   
   Create `sentry.client.config.ts`:
   ```typescript
   import * as Sentry from '@sentry/nextjs';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     
     // Performance monitoring
     tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
     
     // Session replay
     replaysSessionSampleRate: 0.1,
     replaysOnErrorSampleRate: 1.0,
     
     beforeSend(event) {
       // Filter out noise
       if (event.exception) {
         const error = event.exception.values[0];
         if (error && error.value && error.value.includes('Non-Error exception captured')) {
           return null;
         }
       }
       return event;
     },
     
     // Custom tags
     tags: {
       version: process.env.npm_package_version
     }
   });
   ```

3. **Custom Logging**
   
   Create `src/lib/logger.ts`:
   ```typescript
   import winston from 'winston';
   
   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     defaultMeta: {
       service: 'study-sphere',
       version: process.env.npm_package_version
     },
     transports: [
       new winston.transports.Console({
         format: winston.format.combine(
           winston.format.colorize(),
           winston.format.simple()
         )
       }),
       new winston.transports.File({
         filename: 'logs/error.log',
         level: 'error'
       }),
       new winston.transports.File({
         filename: 'logs/combined.log'
       })
     ]
   });
   
   export default logger;
   ```

### Performance Monitoring

1. **Web Vitals Tracking**
   
   Create `src/app/web-vitals.tsx`:
   ```typescript
   'use client';
   
   import { useReportWebVitals } from 'next/web-vitals';
   
   export function WebVitals() {
     useReportWebVitals((metric) => {
       // Send to analytics
       gtag('event', metric.name, {
         custom_map: { metric_id: 'web_vitals' },
         value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
         metric_id: metric.id,
         metric_name: metric.name,
         metric_delta: metric.delta,
         metric_rating: metric.rating
       });
       
       // Send to monitoring service
       if (process.env.NODE_ENV === 'production') {
         fetch('/api/analytics/web-vitals', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(metric)
         });
       }
     });
   
     return null;
   }
   ```

2. **Database Query Monitoring**
   
   Create `src/lib/db/monitor.ts`:
   ```typescript
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Pool } from 'pg';
   import logger from '@/lib/logger';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   
   // Monitor connection pool
   pool.on('connect', () => {
     logger.info('Database connection established');
   });
   
   pool.on('error', (err) => {
     logger.error('Database connection error:', err);
   });
   
   export const db = drizzle(pool, {
     logger: {
       logQuery: (query, params) => {
         const start = Date.now();
         logger.debug('Executing query:', { query, params });
         
         return () => {
           const duration = Date.now() - start;
           if (duration > 1000) {
             logger.warn('Slow query detected:', { query, duration, params });
           }
         };
       }
     }
   });
   ```

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancing Configuration**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   
   services:
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/ssl
       depends_on:
         - app1
         - app2
   
     app1:
       build: .
       environment:
         - NODE_ENV=production
         - INSTANCE_ID=app1
       depends_on:
         - db
         - redis
   
     app2:
       build: .
       environment:
         - NODE_ENV=production
         - INSTANCE_ID=app2
       depends_on:
         - db
         - redis
   
     db:
       image: postgres:15
       environment:
         POSTGRES_DB: studysphere
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
     redis:
       image: redis:7-alpine
       volumes:
         - redis_data:/data
   ```

2. **Session Management for Scaling**
   ```typescript
   // src/lib/session/store.ts
   import Redis from 'ioredis';
   
   const redis = new Redis(process.env.REDIS_URL);
   
   export class SessionStore {
     async get(sessionId: string) {
       const session = await redis.get(`session:${sessionId}`);
       return session ? JSON.parse(session) : null;
     }
   
     async set(sessionId: string, data: any, ttl: number = 7 * 24 * 60 * 60) {
       await redis.setex(`session:${sessionId}`, ttl, JSON.stringify(data));
     }
   
     async destroy(sessionId: string) {
       await redis.del(`session:${sessionId}`);
     }
   }
   ```

### Database Scaling

1. **Read Replicas**
   ```typescript
   // src/lib/db/cluster.ts
   import { Pool } from 'pg';
   
   const masterPool = new Pool({
     connectionString: process.env.DATABASE_MASTER_URL,
     max: 20
   });
   
   const replicaPool = new Pool({
     connectionString: process.env.DATABASE_REPLICA_URL,
     max: 30
   });
   
   export class DatabaseCluster {
     async write(query: string, params: any[]) {
       return masterPool.query(query, params);
     }
   
     async read(query: string, params: any[]) {
       // Route read queries to replica
       return replicaPool.query(query, params);
     }
   }
   ```

2. **Connection Pooling**
   ```typescript
   // src/lib/db/pool.ts
   import { Pool } from 'pg';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     min: 5,
     max: 30,
     acquireTimeoutMillis: 60000,
     createTimeoutMillis: 30000,
     destroyTimeoutMillis: 5000,
     idleTimeoutMillis: 600000,
     reapIntervalMillis: 1000,
     createRetryIntervalMillis: 200,
   });
   
   export default pool;
   ```

### Caching Strategy

1. **Multi-level Caching**
   ```typescript
   // src/lib/cache/strategy.ts
   import Redis from 'ioredis';
   import LRU from 'lru-cache';
   
   const redis = new Redis(process.env.REDIS_URL);
   const memoryCache = new LRU<string, any>({
     max: 1000,
     ttl: 5 * 60 * 1000 // 5 minutes
   });
   
   export class CacheStrategy {
     async get(key: string) {
       // L1: Memory cache
       let value = memoryCache.get(key);
       if (value !== undefined) {
         return value;
       }
   
       // L2: Redis cache
       const redisValue = await redis.get(key);
       if (redisValue) {
         value = JSON.parse(redisValue);
         memoryCache.set(key, value);
         return value;
       }
   
       return null;
     }
   
     async set(key: string, value: any, ttl: number = 300) {
       memoryCache.set(key, value);
       await redis.setex(key, ttl, JSON.stringify(value));
     }
   
     async invalidate(pattern: string) {
       memoryCache.clear();
       const keys = await redis.keys(pattern);
       if (keys.length > 0) {
         await redis.del(...keys);
       }
     }
   }
   ```

## Maintenance & Updates

### Update Process

1. **Automated Dependency Updates**
   
   Create `.github/workflows/dependency-updates.yml`:
   ```yaml
   name: Dependency Updates
   
   on:
     schedule:
       - cron: '0 9 * * 1'  # Weekly on Monday
     workflow_dispatch:
   
   jobs:
     update-dependencies:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Bun
           uses: oven-sh/setup-bun@v1
         
         - name: Update dependencies
           run: |
             bun update
             
         - name: Run tests
           run: |
             bun install
             bun run test
             
         - name: Create pull request
           uses: peter-evans/create-pull-request@v5
           with:
             token: ${{ secrets.GITHUB_TOKEN }}
             commit-message: 'chore: update dependencies'
             title: 'Automated dependency updates'
             body: 'This PR contains automated dependency updates.'
             branch: dependency-updates
   ```

2. **Database Maintenance**
   ```bash
   #!/bin/bash
   # maintenance.sh
   
   echo "Starting database maintenance..."
   
   # 1. Analyze and vacuum tables
   psql $DATABASE_URL -c "ANALYZE;"
   psql $DATABASE_URL -c "VACUUM ANALYZE;"
   
   # 2. Reindex tables
   psql $DATABASE_URL -c "REINDEX DATABASE studysphere;"
   
   # 3. Update statistics
   psql $DATABASE_URL -c "ANALYZE VERBOSE;"
   
   # 4. Check for unused indexes
   psql $DATABASE_URL -f scripts/unused_indexes.sql
   
   # 5. Archive old data
   psql $DATABASE_URL -f scripts/archive_old_data.sql
   
   echo "Database maintenance completed."
   ```

### Zero-Downtime Deployment

1. **Blue-Green Deployment**
   ```bash
   #!/bin/bash
   # deploy-blue-green.sh
   
   CURRENT_VERSION=$(vercel ls --scope=production | grep studysphere | head -1 | awk '{print $2}')
   
   echo "Current version: $CURRENT_VERSION"
   echo "Deploying new version..."
   
   # Deploy to staging slot
   NEW_VERSION=$(vercel --prod --scope=staging)
   
   # Run smoke tests
   curl -f https://staging.studysphere.com/api/health
   
   if [ $? -eq 0 ]; then
     echo "Smoke tests passed. Switching traffic..."
     
     # Switch production traffic to new version
     vercel alias $NEW_VERSION studysphere.com
     
     echo "Deployment successful!"
   else
     echo "Smoke tests failed. Rolling back..."
     exit 1
   fi
   ```

2. **Database Migration with Zero Downtime**
   ```sql
   -- Example: Adding a new column with zero downtime
   
   -- Step 1: Add column with default value (non-blocking)
   ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
   
   -- Step 2: Backfill data in batches
   DO $$
   DECLARE
       batch_size INTEGER := 1000;
       offset_val INTEGER := 0;
       row_count INTEGER;
   BEGIN
       LOOP
           UPDATE users
           SET preferences = '{}'
           WHERE id >= offset_val AND id < offset_val + batch_size
           AND preferences IS NULL;
           
           GET DIAGNOSTICS row_count = ROW_COUNT;
           EXIT WHEN row_count = 0;
           
           offset_val := offset_val + batch_size;
           
           -- Small delay to avoid blocking
           PERFORM pg_sleep(0.1);
       END LOOP;
   END $$;
   
   -- Step 3: Add NOT NULL constraint (after application deployment)
   ALTER TABLE users ALTER COLUMN preferences SET NOT NULL;
   ```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check connection
   psql $DATABASE_URL -c "SELECT version();"
   
   # Check active connections
   psql $DATABASE_URL -c "
   SELECT pid, usename, application_name, client_addr, state, query_start 
   FROM pg_stat_activity 
   WHERE state = 'active';
   "
   
   # Kill long-running queries
   psql $DATABASE_URL -c "
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE state = 'active' 
   AND query_start < NOW() - INTERVAL '5 minutes';
   "
   ```

2. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Check Node.js memory usage
   node --max-old-space-size=4096 --expose-gc app.js
   
   # Monitor memory leaks
   bun run --inspect app.js
   ```

3. **Performance Issues**
   ```sql
   -- Find slow queries
   SELECT query, calls, total_time, mean_time, rows
   FROM pg_stat_statements
   ORDER BY total_time DESC
   LIMIT 10;
   
   -- Check index usage
   SELECT schemaname, tablename, attname, n_distinct, correlation
   FROM pg_stats
   WHERE schemaname = 'public'
   ORDER BY n_distinct DESC;
   ```

### Monitoring Alerts

1. **Uptime Monitoring**
   ```javascript
   // monitoring/uptime.js
   const axios = require('axios');
   
   const endpoints = [
     'https://studysphere.com',
     'https://studysphere.com/api/health',
     'https://studysphere.com/dashboard'
   ];
   
   async function checkEndpoints() {
     for (const endpoint of endpoints) {
       try {
         const response = await axios.get(endpoint, { timeout: 10000 });
         console.log(`✅ ${endpoint} - ${response.status}`);
       } catch (error) {
         console.error(`❌ ${endpoint} - ${error.message}`);
         // Send alert notification
         await sendAlert(`Endpoint ${endpoint} is down: ${error.message}`);
       }
     }
   }
   
   // Run every 5 minutes
   setInterval(checkEndpoints, 5 * 60 * 1000);
   ```

2. **Resource Monitoring**
   ```bash
   #!/bin/bash
   # monitor-resources.sh
   
   # CPU usage
   CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
   
   # Memory usage
   MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.2f"), ($3/$2) * 100.0}')
   
   # Disk usage
   DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
   
   # Database connections
   DB_CONNECTIONS=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM pg_stat_activity;")
   
   echo "CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%, Disk: ${DISK_USAGE}%, DB Connections: ${DB_CONNECTIONS}"
   
   # Alert if thresholds exceeded
   if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
     echo "High CPU usage alert: ${CPU_USAGE}%"
   fi
   
   if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
     echo "High memory usage alert: ${MEMORY_USAGE}%"
   fi
   ```

### Recovery Procedures

1. **Database Recovery**
   ```bash
   #!/bin/bash
   # recover-database.sh
   
   BACKUP_FILE=$1
   
   if [ -z "$BACKUP_FILE" ]; then
     echo "Usage: $0 <backup-file>"
     exit 1
   fi
   
   echo "Starting database recovery from $BACKUP_FILE"
   
   # 1. Stop application
   systemctl stop studysphere
   
   # 2. Create backup of current state
   pg_dump $DATABASE_URL > emergency_backup_$(date +%Y%m%d_%H%M%S).sql
   
   # 3. Drop and recreate database
   dropdb studysphere
   createdb studysphere
   
   # 4. Restore from backup
   psql $DATABASE_URL < $BACKUP_FILE
   
   # 5. Run health checks
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
   
   # 6. Restart application
   systemctl start studysphere
   
   echo "Database recovery completed"
   ```

2. **Application Recovery**
   ```bash
   #!/bin/bash
   # recover-application.sh
   
   echo "Starting application recovery..."
   
   # 1. Check system resources
   df -h
   free -h
   
   # 2. Check logs for errors
   tail -n 100 /var/log/studysphere/error.log
   
   # 3. Restart services
   systemctl restart nginx
   systemctl restart redis
   pm2 restart all
   
   # 4. Verify health
   curl -f http://localhost:3000/api/health
   
   # 5. Clear caches if needed
   redis-cli FLUSHALL
   
   echo "Application recovery completed"
   ```

This comprehensive deployment guide provides everything needed to successfully deploy and maintain Study Sphere in any environment, from development to production scale.
