# Database Setup and Configuration Guide

## Overview
This comprehensive guide covers the database setup, configuration, and management for Study Sphere. The application uses SQLite with Drizzle ORM for type-safe database operations, providing a robust and scalable data layer.

## Quick Start

### Prerequisites
- **Bun**: Fast JavaScript runtime and package manager
- **Node.js**: Version 18 or higher (for compatibility)
- **SQLite**: Built into the system (no separate installation required)

### Installation
```bash
# Clone the repository
git clone https://github.com/k0msenapati/study-sphere.git
cd study-sphere

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

## Environment Configuration

### Required Environment Variables
Create a `.env.local` file in the project root:

```env
# Database Configuration
DATABASE_URL="file:./sqlite.db"

# AI Integration
GROQ_API_KEY="your-groq-api-key-here"

# Security
JWT_SECRET="your-jwt-secret-key-change-in-production"

# Development
NODE_ENV="development"
```

### Environment Variable Details

#### `DATABASE_URL`
- **Purpose**: SQLite database file location
- **Format**: `file:./sqlite.db` (relative to project root)
- **Production**: Consider absolute paths for production deployments

#### `GROQ_API_KEY`
- **Purpose**: Authentication for GROQ AI service
- **Obtain**: Sign up at [GROQ Console](https://console.groq.com/)
- **Required**: For AI-powered features (flashcards, study buddy)

#### `JWT_SECRET`
- **Purpose**: Secret key for JWT token signing
- **Security**: Use a strong, random string (minimum 32 characters)
- **Generation**: `openssl rand -base64 32` or use a password generator

## Database Configuration

### Drizzle Configuration (`drizzle.config.ts`)
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

#### Configuration Options
- **`schema`**: Path to schema definition file
- **`out`**: Directory for migration files
- **`dialect`**: Database type (sqlite, postgresql, mysql)
- **`dbCredentials.url`**: Database connection string

### Database Connection (`src/lib/db/index.ts`)
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('./sqlite.db');
export const db = drizzle(sqlite);
```

## Initial Setup

### 1. Database Initialization
```bash
# Generate initial migration files
bun run db:generate

# Apply migrations to create database
bun run db:migrate
```

### 2. Verify Setup
```bash
# Open database studio for visual inspection
bun run db:studio
```

The studio will open at `http://localhost:4983` showing your database tables and data.

### 3. Start Development Server
```bash
# Start the development server
bun run dev
```

The application will be available at `http://localhost:3000`.

## Database Scripts

### Available Commands

#### `bun run db:generate`
- **Purpose**: Generate migration files from schema changes
- **When to Use**: After modifying `src/lib/db/schema.ts`
- **Output**: Creates SQL files in `drizzle/` directory

#### `bun run db:migrate`
- **Purpose**: Apply pending migrations to database
- **When to Use**: After generating migrations or on new environment setup
- **Effect**: Updates database structure to match schema

#### `bun run db:push`
- **Purpose**: Push schema changes directly without migrations
- **When to Use**: Development only, for rapid prototyping
- **Warning**: Not recommended for production use

#### `bun run db:studio`
- **Purpose**: Open visual database management interface
- **Features**: View tables, run queries, edit data
- **URL**: `http://localhost:4983`

### Workflow Examples

#### Adding a New Table
1. **Update Schema**: Modify `src/lib/db/schema.ts`
2. **Generate Migration**: `bun run db:generate`
3. **Apply Migration**: `bun run db:migrate`
4. **Verify Changes**: `bun run db:studio`

#### Modifying Existing Table
1. **Update Schema**: Change field definitions in schema file
2. **Generate Migration**: `bun run db:generate`
3. **Review Migration**: Check generated SQL in `drizzle/` directory
4. **Apply Migration**: `bun run db:migrate`

## Schema Management

### Schema Definition Location
- **File**: `src/lib/db/schema.ts`
- **Structure**: Drizzle ORM table definitions
- **Type Safety**: Automatic TypeScript type generation

### Adding New Tables
```typescript
// Example: Adding a new table
export const newTable = sqliteTable('new_table', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  data: text('data').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Generate types
export type NewTable = typeof newTable.$inferSelect;
export type NewNewTable = typeof newTable.$inferInsert;
```

### Modifying Existing Tables
```typescript
// Example: Adding a new column
export const existingTable = sqliteTable('existing_table', {
  // ... existing columns ...
  newColumn: text('new_column'), // Add new optional column
  // or
  newRequiredColumn: text('new_required_column').notNull().default('default_value'),
});
```

## Migration Management

### Migration File Structure
```
drizzle/
├── 0000_pink_blindfold.sql          # Initial schema
├── 0001_amazing_doomsday.sql        # Schema updates
└── meta/
    ├── _journal.json                # Migration journal
    ├── 0000_snapshot.json           # Schema snapshot
    └── 0001_snapshot.json           # Updated snapshot
```

### Migration Best Practices

#### 1. Review Generated Migrations
Always check generated SQL before applying:
```sql
-- Example migration file
CREATE TABLE `new_table` (
    `id` text PRIMARY KEY NOT NULL,
    `user_id` integer NOT NULL,
    `data` text NOT NULL,
    `created_at` integer NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
```

#### 2. Backup Before Migration
```bash
# Create backup before applying migrations
cp sqlite.db sqlite.db.backup.$(date +%Y%m%d_%H%M%S)
```

#### 3. Test Migrations
```bash
# Test migrations on a copy of production data
cp production.db test.db
# Update drizzle.config.ts to point to test.db
bun run db:migrate
# Verify results, then apply to production
```

## Data Seeding

### Development Data
```typescript
// Create seed script: scripts/seed.ts
import { db } from '../src/lib/db';
import { users, notes, tasks } from '../src/lib/db/schema';

async function seed() {
  // Insert test user
  const [user] = await db.insert(users).values({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password_here'
  }).returning();

  // Insert sample notes
  await db.insert(notes).values({
    id: 'note-1',
    userId: user.id,
    title: 'Sample Note',
    content: '<p>This is a sample note</p>',
    categories: ['Sample', 'Test']
  });

  console.log('Database seeded successfully');
}

seed().catch(console.error);
```

### Running Seed Script
```bash
# Add to package.json scripts
"db:seed": "bun run scripts/seed.ts"

# Execute seeding
bun run db:seed
```

## Backup and Recovery

### Backup Strategies

#### 1. File-based Backup
```bash
# Simple file copy (database must be closed)
cp sqlite.db backups/sqlite.db.$(date +%Y%m%d_%H%M%S)
```

#### 2. Online Backup
```bash
# Using SQLite backup command (safe with active connections)
sqlite3 sqlite.db ".backup backups/sqlite.db.$(date +%Y%m%d_%H%M%S)"
```

#### 3. Automated Backup Script
```bash
#!/bin/bash
# scripts/backup.sh
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/sqlite.db.$TIMESTAMP"

mkdir -p $BACKUP_DIR
sqlite3 sqlite.db ".backup $BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"

# Keep only last 10 backups
ls -t $BACKUP_DIR/sqlite.db.* | tail -n +11 | xargs rm -f
```

### Recovery Procedures

#### 1. Restore from Backup
```bash
# Stop the application
# Replace current database
cp backups/sqlite.db.20241226_143000 sqlite.db
# Restart the application
```

#### 2. Partial Recovery
```bash
# Attach backup database and copy specific tables
sqlite3 sqlite.db "
ATTACH 'backups/sqlite.db.20241226_143000' AS backup;
DELETE FROM notes WHERE user_id = 1;
INSERT INTO notes SELECT * FROM backup.notes WHERE user_id = 1;
DETACH backup;
"
```

## Performance Optimization

### Database Tuning

#### 1. SQLite PRAGMA Settings
```typescript
// Add to database connection setup
import Database from 'better-sqlite3';

const sqlite = new Database('./sqlite.db');

// Performance optimizations
sqlite.pragma('journal_mode = WAL');  // Write-Ahead Logging
sqlite.pragma('synchronous = NORMAL'); // Faster writes
sqlite.pragma('cache_size = 1000000'); // Larger cache
sqlite.pragma('temp_store = MEMORY');  // Memory for temp tables
```

#### 2. Indexing Strategy
```sql
-- Add indexes for common queries
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_categories ON notes(categories);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_chats_user_time ON chats(user_id, prompt_time);
```

### Query Optimization

#### 1. Use Prepared Statements
```typescript
// Drizzle automatically uses prepared statements
const getUserNotes = db.select().from(notes).where(eq(notes.userId, placeholder('userId'))).prepare();

// Reuse prepared statement
const userNotes = getUserNotes.execute({ userId: 1 });
```

#### 2. Limit Result Sets
```typescript
// Use pagination for large datasets
const recentNotes = await db.select()
  .from(notes)
  .where(eq(notes.userId, userId))
  .orderBy(desc(notes.modifiedAt))
  .limit(20)
  .offset(page * 20);
```

## Production Deployment

### Database Considerations

#### 1. File Permissions
```bash
# Set appropriate permissions for database file
chmod 644 sqlite.db
chown www-data:www-data sqlite.db  # Adjust user as needed
```

#### 2. Directory Structure
```
/var/www/study-sphere/
├── sqlite.db                    # Production database
├── backups/                     # Backup directory
│   ├── sqlite.db.20241226_120000
│   └── sqlite.db.20241226_180000
└── logs/                        # Application logs
```

#### 3. Monitoring Setup
```bash
# Monitor database size
watch -n 300 'ls -lh sqlite.db'

# Monitor active connections (if using connection pooling)
sqlite3 sqlite.db "PRAGMA database_list;"
```

### Security Considerations

#### 1. File Security
```bash
# Restrict database file access
chmod 600 sqlite.db
chown app-user:app-group sqlite.db
```

#### 2. Connection Security
```typescript
// Use environment-specific connection strings
const dbUrl = process.env.NODE_ENV === 'production' 
  ? '/var/lib/app/sqlite.db'
  : './sqlite.db';
```

#### 3. Backup Encryption
```bash
# Encrypt sensitive backups
gpg --symmetric --cipher-algo AES256 sqlite.db.backup
```

## Troubleshooting

### Common Issues

#### 1. Database Locked Error
```
Error: database is locked
```
**Solution**:
```bash
# Check for zombie processes
lsof sqlite.db

# If needed, remove lock file
rm sqlite.db-wal sqlite.db-shm
```

#### 2. Migration Conflicts
```
Error: table already exists
```
**Solution**:
```bash
# Reset migration state (development only)
rm -rf drizzle/
bun run db:generate
bun run db:migrate
```

#### 3. Schema Mismatch
```
Error: no such column
```
**Solution**:
```bash
# Regenerate and apply migrations
bun run db:generate
bun run db:migrate
```

### Debug Mode

#### Enable SQL Logging
```typescript
// Add to database connection
import { drizzle } from 'drizzle-orm/better-sqlite3';

const db = drizzle(sqlite, { 
  logger: process.env.NODE_ENV === 'development' 
});
```

#### Database Studio Debug
```bash
# Open studio with verbose logging
DEBUG=* bun run db:studio
```

This comprehensive database guide ensures reliable setup, efficient operation, and maintainable data management for the Study Sphere application.
