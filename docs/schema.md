# Database Schema Documentation

## Overview
Study Sphere uses a relational SQLite database with Drizzle ORM for type-safe database operations. The schema is designed to support a multi-user educational platform with comprehensive feature sets including notes, tasks, quizzes, flashcards, and AI-powered conversations.

## Database Configuration

### Technology Stack
- **Database Engine**: SQLite 3
- **ORM**: Drizzle ORM 0.44.2
- **Driver**: Better SQLite3 11.10.0
- **Migration Tool**: Drizzle Kit 0.31.1
- **Validation**: Zod 3.25.67 with Drizzle Zod integration

### Configuration Files
- **Database File**: `sqlite.db` (root directory)
- **Schema Definition**: `src/lib/db/schema.ts`
- **Configuration**: `drizzle.config.ts`
- **Migration Directory**: `drizzle/`

## Core Tables

### Users Table (`users`)

#### Purpose
Central user management and authentication system.

#### Schema Definition
```typescript
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

#### Field Details
- **`id`**: Auto-incrementing primary key (integer)
- **`name`**: User's display name (text, required)
- **`email`**: Unique email address for authentication (text, required, unique)
- **`password`**: bcrypt hashed password (text, required)
- **`createdAt`**: Account creation timestamp (timestamp, auto-generated)
- **`updatedAt`**: Last profile update timestamp (timestamp, auto-updated)

#### Constraints
- Primary key on `id`
- Unique constraint on `email`
- All fields except `id` are required

#### Relationships
- One-to-many with `notes`, `chats`, `tasks`, `dailyReviews`
- One-to-one with `userSettings`

### Notes Table (`notes`)

#### Purpose
Stores user-created notes with rich content and categorization.

#### Schema Definition
```typescript
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(), // UUID or nanoid
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  categories: text('categories', { mode: 'json' }).notNull(), // Stored as JSON array of strings
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  modifiedAt: integer('modified_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

#### Field Details
- **`id`**: UUID string primary key for unique identification
- **`userId`**: Foreign key reference to users table (cascade delete)
- **`title`**: Note title/heading (text, required)
- **`content`**: Rich HTML content from React Quill editor (text, required)
- **`categories`**: JSON array of category strings for organization
- **`createdAt`**: Note creation timestamp (auto-generated)
- **`modifiedAt`**: Last modification timestamp (auto-updated)

#### Data Examples
```json
{
  "id": "note-uuid-123",
  "userId": 1,
  "title": "Photosynthesis Overview",
  "content": "<h1>Photosynthesis</h1><p>The process by which...</p>",
  "categories": ["Biology", "Science", "Chapter 3"],
  "createdAt": "2024-01-15T10:30:00Z",
  "modifiedAt": "2024-01-16T14:22:00Z"
}
```

### Chats Table (`chats`)

#### Purpose
Stores conversation history with the AI Study Buddy for context and reference.

#### Schema Definition
```typescript
export const chats = sqliteTable('chats', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  promptTime: integer('prompt_time', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

#### Field Details
- **`id`**: UUID string primary key
- **`userId`**: Foreign key reference to users table (cascade delete)
- **`prompt`**: User's input/question to the AI (text, required)
- **`response`**: AI's generated response (text, required)
- **`promptTime`**: Timestamp of the conversation (auto-generated)

#### Usage Patterns
- Conversation history for context awareness
- Performance analytics for AI interactions
- Study session tracking and review

### Tasks Table (`tasks`)

#### Purpose
Comprehensive task management system with scheduling and productivity tracking.

#### Schema Definition
```typescript
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] }).notNull().default('medium'),
  status: text('status', { enum: ['pending', 'in_progress', 'completed'] }).notNull().default('pending'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  scheduledDate: integer('scheduled_date', { mode: 'timestamp' }),
  scheduledStartTime: text('scheduled_start_time'), // HH:MM format
  scheduledEndTime: text('scheduled_end_time'), // HH:MM format
  estimatedDuration: integer('estimated_duration'), // in minutes
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

#### Field Details
- **`id`**: UUID string primary key
- **`userId`**: Foreign key reference to users table (cascade delete)
- **`title`**: Task name/title (text, required)
- **`description`**: Detailed task description (text, optional)
- **`priority`**: Task priority level (enum: 'low', 'medium', 'high', default: 'medium')
- **`status`**: Current task status (enum: 'pending', 'in_progress', 'completed', default: 'pending')
- **`dueDate`**: Task deadline (timestamp, optional)
- **`scheduledDate`**: Planned execution date (timestamp, optional)
- **`scheduledStartTime`**: Planned start time in HH:MM format (text, optional)
- **`scheduledEndTime`**: Planned end time in HH:MM format (text, optional)
- **`estimatedDuration`**: Expected completion time in minutes (integer, optional)
- **`completedAt`**: Actual completion timestamp (timestamp, optional)
- **`createdAt`**: Task creation timestamp (auto-generated)
- **`updatedAt`**: Last modification timestamp (auto-updated)

#### Business Logic
- Status progression: pending → in_progress → completed
- Priority affects scheduling recommendations
- Duration tracking for productivity analytics

### Daily Reviews Table (`dailyReviews`)

#### Purpose
Captures daily productivity reviews and reflection data for continuous improvement.

#### Schema Definition
```typescript
export const dailyReviews = sqliteTable('daily_reviews', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reviewDate: integer('review_date', { mode: 'timestamp' }).notNull(),
  completedTasks: integer('completed_tasks').notNull().default(0),
  totalTasks: integer('total_tasks').notNull().default(0),
  reflection: text('reflection'), // What went well?
  improvements: text('improvements'), // What needs adjustment?
  productivityScore: integer('productivity_score'), // 1-10 scale
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

#### Field Details
- **`id`**: UUID string primary key
- **`userId`**: Foreign key reference to users table (cascade delete)
- **`reviewDate`**: Date of the review (timestamp, required)
- **`completedTasks`**: Number of tasks completed that day (integer, default: 0)
- **`totalTasks`**: Total number of tasks for that day (integer, default: 0)
- **`reflection`**: User's reflection on what went well (text, optional)
- **`improvements`**: Areas identified for improvement (text, optional)
- **`productivityScore`**: Self-assessed productivity rating 1-10 (integer, optional)
- **`createdAt`**: Review creation timestamp (auto-generated)

#### Analytics Applications
- Daily productivity trends
- Long-term improvement tracking
- Pattern recognition in work habits
- Goal setting and adjustment

### User Settings Table (`userSettings`)

#### Purpose
Stores personalized productivity settings and preferences for each user.

#### Schema Definition
```typescript
export const userSettings = sqliteTable('user_settings', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  focusSessionDuration: integer('focus_session_duration').notNull().default(90), // minutes
  breakDuration: integer('break_duration').notNull().default(20), // minutes
  workStartTime: text('work_start_time').notNull().default('09:00'), // HH:MM format
  workEndTime: text('work_end_time').notNull().default('17:00'), // HH:MM format
  peakHoursStart: text('peak_hours_start').notNull().default('10:00'), // HH:MM format
  peakHoursEnd: text('peak_hours_end').notNull().default('12:00'), // HH:MM format
  pomodoroEnabled: integer('pomodoro_enabled', { mode: 'boolean' }).notNull().default(false),
  pomodoroWorkDuration: integer('pomodoro_work_duration').notNull().default(25), // minutes
  pomodoroBreakDuration: integer('pomodoro_break_duration').notNull().default(5), // minutes
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
```

#### Field Details
- **`id`**: UUID string primary key
- **`userId`**: Foreign key reference to users table (cascade delete, unique)
- **`focusSessionDuration`**: Default focus session length in minutes (default: 90)
- **`breakDuration`**: Default break length in minutes (default: 20)
- **`workStartTime`**: Daily work start time in HH:MM format (default: '09:00')
- **`workEndTime`**: Daily work end time in HH:MM format (default: '17:00')
- **`peakHoursStart`**: Peak productivity start time (default: '10:00')
- **`peakHoursEnd`**: Peak productivity end time (default: '12:00')
- **`pomodoroEnabled`**: Whether Pomodoro technique is enabled (boolean, default: false)
- **`pomodoroWorkDuration`**: Pomodoro work session length (default: 25 minutes)
- **`pomodoroBreakDuration`**: Pomodoro break length (default: 5 minutes)
- **`createdAt`**: Settings creation timestamp (auto-generated)
- **`updatedAt`**: Last modification timestamp (auto-updated)

#### Default Values
The system provides sensible defaults based on productivity research:
- 90-minute focus sessions (based on ultradian rhythms)
- 20-minute breaks for optimal recovery
- Standard business hours (9 AM - 5 PM)
- Peak hours during mid-morning (10 AM - 12 PM)
- Traditional Pomodoro settings (25/5 minutes)

## Data Types and Validation

### TypeScript Integration

#### Generated Types
```typescript
// Inferred types from schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type DailyReview = typeof dailyReviews.$inferSelect;
export type NewDailyReview = typeof dailyReviews.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
```

#### Validation Schemas
```typescript
// Zod schemas for runtime validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertNoteSchema = createInsertSchema(notes);
export const selectNoteSchema = createSelectSchema(notes);

export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

export const insertDailyReviewSchema = createInsertSchema(dailyReviews);
export const selectDailyReviewSchema = createSelectSchema(dailyReviews);

export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const selectUserSettingsSchema = createSelectSchema(userSettings);
```

## Database Relationships

### Entity Relationship Diagram

```
Users (1) ──┬── (∞) Notes
            ├── (∞) Chats
            ├── (∞) Tasks
            ├── (∞) DailyReviews
            └── (1) UserSettings
```

### Relationship Details

#### Users → Notes (One-to-Many)
- **Constraint**: CASCADE DELETE
- **Purpose**: User owns all their notes
- **Business Rule**: When user is deleted, all notes are deleted

#### Users → Chats (One-to-Many)
- **Constraint**: CASCADE DELETE
- **Purpose**: User owns their conversation history
- **Business Rule**: When user is deleted, all chat history is deleted

#### Users → Tasks (One-to-Many)
- **Constraint**: CASCADE DELETE
- **Purpose**: User owns their task management data
- **Business Rule**: When user is deleted, all tasks are deleted

#### Users → DailyReviews (One-to-Many)
- **Constraint**: CASCADE DELETE
- **Purpose**: User owns their productivity review data
- **Business Rule**: When user is deleted, all reviews are deleted

#### Users → UserSettings (One-to-One)
- **Constraint**: CASCADE DELETE, UNIQUE
- **Purpose**: Each user has exactly one settings record
- **Business Rule**: Settings are created automatically when user registers

## Migration Management

### Migration Files
- **Location**: `drizzle/` directory
- **Format**: SQL files with sequential numbering
- **Metadata**: JSON files in `drizzle/meta/` directory

### Current Migrations
1. **`0000_pink_blindfold.sql`**: Initial schema creation
2. **`0001_amazing_doomsday.sql`**: Schema updates and refinements

### Migration Commands
```bash
# Generate migration from schema changes
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Push schema directly (development only)
bun run db:push

# Open database studio
bun run db:studio
```

## Indexing Strategy

### Primary Indexes
- All tables have primary key indexes (automatic)
- `users.email` has unique index for fast authentication lookups

### Recommended Indexes (Future Implementation)
```sql
-- Performance optimization indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_categories ON notes(categories);
CREATE INDEX idx_tasks_user_id_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_daily_reviews_user_date ON daily_reviews(user_id, review_date);
```

## Query Patterns

### Common Queries

#### User Authentication
```typescript
// Find user by email
const user = await db.select().from(users).where(eq(users.email, email));

// Verify user exists
const userExists = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
```

#### Notes Management
```typescript
// Get user's notes with categories
const userNotes = await db.select().from(notes).where(eq(notes.userId, userId));

// Search notes by category
const categoryNotes = await db.select().from(notes)
  .where(and(eq(notes.userId, userId), like(notes.categories, `%${category}%`)));
```

#### Task Analytics
```typescript
// Get daily task completion rate
const taskStats = await db.select({
  completed: count(tasks.id),
  total: count(tasks.id)
}).from(tasks)
.where(and(
  eq(tasks.userId, userId),
  eq(tasks.scheduledDate, targetDate)
))
.groupBy(tasks.status);
```

## Data Security and Privacy

### Access Control
- **Row-level Security**: All queries filtered by `userId`
- **Authentication**: JWT-based session management
- **Authorization**: Middleware enforces user isolation

### Data Protection
- **Password Security**: bcrypt hashing with salt
- **Session Security**: HTTP-only cookies with secure flags
- **Input Validation**: Zod schemas for all user inputs

### GDPR Compliance
- **Data Deletion**: CASCADE DELETE ensures complete data removal
- **Data Export**: Type-safe query builders enable data export
- **Data Minimization**: Only necessary data fields are stored

## Performance Considerations

### Query Optimization
- **Prepared Statements**: Drizzle ORM uses prepared statements
- **Connection Pooling**: Better SQLite3 handles connection management
- **Type Safety**: Compile-time query validation prevents runtime errors

### Storage Efficiency
- **JSON Fields**: Categories stored as JSON for flexible querying
- **Timestamp Storage**: Unix timestamps for efficient date operations
- **Text Compression**: SQLite handles text compression automatically

### Scalability Planning
- **Database Migration**: Easy migration to PostgreSQL or MySQL
- **Horizontal Scaling**: User-based partitioning strategy
- **Caching Layer**: Redis integration for session and query caching

This comprehensive schema design supports the full feature set of Study Sphere while maintaining data integrity, performance, and scalability for future growth.
