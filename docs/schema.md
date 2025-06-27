# Database Schema

## 🗄️ Overview

Study Sphere uses SQLite with Drizzle ORM for type-safe database operations.

## 📊 Configuration

- **Database**: SQLite (`sqlite.db`)
- **ORM**: Drizzle ORM with Better SQLite3
- **Migrations**: Drizzle Kit
- **Validation**: Zod schemas

## 📋 Core Tables

### Users Table
```typescript
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

**Purpose**: User authentication and profiles

### Notes Table
```typescript
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  categories: text('categories', { mode: 'json' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  modifiedAt: integer('modified_at', { mode: 'timestamp' }).notNull(),
});
```

**Purpose**: Rich text notes with categories

### Tasks Table
```typescript
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).default('medium'),
  status: text('status', { enum: ['pending', 'in_progress', 'completed'] }).default('pending'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

**Purpose**: Task management with priorities and status

### Chats Table
```typescript
export const chats = sqliteTable('chats', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  promptTime: integer('prompt_time', { mode: 'timestamp' }).notNull(),
});
```

**Purpose**: AI chat history

### Daily Reviews Table
```typescript
export const dailyReviews = sqliteTable('daily_reviews', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  reviewDate: integer('review_date', { mode: 'timestamp' }).notNull(),
  completedTasks: integer('completed_tasks').default(0).notNull(),
  totalTasks: integer('total_tasks').default(0).notNull(),
  reflection: text('reflection'),
  improvements: text('improvements'),
  productivityScore: integer('productivity_score'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

**Purpose**: Daily productivity tracking

### User Settings Table
```typescript
export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  focusSessionDuration: integer('focus_session_duration').default(90).notNull(),
  breakDuration: integer('break_duration').default(20).notNull(),
  workStartTime: text('work_start_time').default('09:00').notNull(),
  workEndTime: text('work_end_time').default('17:00').notNull(),
  peakHoursStart: text('peak_hours_start').default('10:00').notNull(),
  peakHoursEnd: text('peak_hours_end').default('12:00').notNull(),
  pomodoroEnabled: integer('pomodoro_enabled', { mode: 'boolean' }).default(false).notNull(),
  pomodoroWorkDuration: integer('pomodoro_work_duration').default(25).notNull(),
  pomodoroBreakDuration: integer('pomodoro_break_duration').default(5).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

**Purpose**: User productivity preferences

## 🔗 Relationships

- All tables reference `users.id` with cascade delete
- Foreign key constraints ensure data integrity
- Timestamps track creation and modification
- JSON fields for flexible data storage (categories)

## 🛠️ Migration Commands

```bash
# Generate migrations
bun run db:generate

# Apply migrations
bun run db:migrate

# Push schema changes
bun run db:push

# Open database studio
bun run db:studio
```

## 🔍 Query Examples

### Get User Notes
```typescript
const userNotes = await db
  .select()
  .from(notes)
  .where(eq(notes.userId, userId));
```

### Create Task
```typescript
const newTask = await db
  .insert(tasks)
  .values({
    id: generateId(),
    userId,
    title,
    description,
    priority,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
```

### Get Chat History
```typescript
const chatHistory = await db
  .select()
  .from(chats)
  .where(eq(chats.userId, userId))
  .orderBy(desc(chats.promptTime));
```