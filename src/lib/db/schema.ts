import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// --- Users Table ---
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  bio: text('bio'),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  lastSignIn: integer('last_sign_in', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Notes Table ---
export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(), // UUID or nanoid
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  categories: text('categories', { mode: 'json' }).notNull(), // Stored as JSON array of strings
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  modifiedAt: integer('modified_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const chats = sqliteTable('chats', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  promptTime: integer('prompt_time', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Tasks Table ---
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

// --- Daily Reviews Table ---
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

// --- User Productivity Settings Table ---
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

// --- Zod Schemas (Optional, for validation) ---
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

// --- Types ---
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