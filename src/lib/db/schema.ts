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
  themePreference: text('theme_preference').notNull().default('system'), // 'light' | 'dark' | 'system'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Flashcard Decks Table ---
export const decks = sqliteTable('decks', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  color: text('color').notNull().default('#3B82F6'),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  tags: text('tags').notNull().default('[]'), // JSON array of strings
  studyMaterial: text('study_material'), // Original material used to generate cards
  totalCards: integer('total_cards').notNull().default(0),
  lastStudied: integer('last_studied', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Flashcards Table ---
export const flashcards = sqliteTable('flashcards', {
  id: text('id').primaryKey(), // UUID
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  difficulty: text('difficulty').notNull().default('medium'),
  topic: text('topic').notNull(),
  hints: text('hints').default('[]'), // JSON array of strings
  explanation: text('explanation'),
  tags: text('tags').notNull().default('[]'), // JSON array of strings
  correctCount: integer('correct_count').notNull().default(0),
  incorrectCount: integer('incorrect_count').notNull().default(0),
  lastReviewed: integer('last_reviewed', { mode: 'timestamp' }),
  nextReview: integer('next_review', { mode: 'timestamp' }),
  order: integer('order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Study Sessions Table ---
export const studySessions = sqliteTable('study_sessions', {
  id: text('id').primaryKey(), // UUID
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  totalCards: integer('total_cards').notNull().default(0),
  correctAnswers: integer('correct_answers').notNull().default(0),
  incorrectAnswers: integer('incorrect_answers').notNull().default(0),
  partialAnswers: integer('partial_answers').notNull().default(0),
  sessionType: text('session_type').notNull().default('study'),
  timeSpent: integer('time_spent').notNull().default(0),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Flashcard Results Table ---
export const flashcardResults = sqliteTable('flashcard_results', {
  id: text('id').primaryKey(), // UUID
  sessionId: text('session_id').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
  flashcardId: text('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
  result: text('result').notNull(), // 'correct', 'incorrect', 'partial'
  timeToAnswer: integer('time_to_answer').notNull().default(0), // in seconds
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }).notNull(),
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

export const insertDeckSchema = createInsertSchema(decks);
export const selectDeckSchema = createSelectSchema(decks);

export const insertFlashcardSchema = createInsertSchema(flashcards);
export const selectFlashcardSchema = createSelectSchema(flashcards);

export const insertStudySessionSchema = createInsertSchema(studySessions);
export const selectStudySessionSchema = createSelectSchema(studySessions);

export const insertFlashcardResultSchema = createInsertSchema(flashcardResults);
export const selectFlashcardResultSchema = createSelectSchema(flashcardResults);

// --- Quiz Subjects Table ---
export const quizSubjects = sqliteTable('quiz_subjects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').notNull().default('#3B82F6'),
  icon: text('icon').notNull().default('📚'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Quiz Topics Table ---
export const quizTopics = sqliteTable('quiz_topics', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').notNull().references(() => quizSubjects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Quizzes Table ---
export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => quizSubjects.id, { onDelete: 'cascade' }),
  topicId: text('topic_id').notNull().references(() => quizTopics.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull().default('intermediate'), // beginner, intermediate, advanced
  questions: text('questions').notNull(), // JSON array of questions
  timeLimit: integer('time_limit').notNull().default(300), // in seconds
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Quiz Bookmarks Table ---
export const quizBookmarks = sqliteTable('quiz_bookmarks', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// --- Quiz Completions Table ---
export const quizCompletions = sqliteTable('quiz_completions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  timeSpent: integer('time_spent').notNull(), // in seconds
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
  answers: text('answers').notNull(), // JSON array of user answers
});

// --- Zod Schemas for Quiz Tables ---
export const insertQuizSubjectSchema = createInsertSchema(quizSubjects);
export const selectQuizSubjectSchema = createSelectSchema(quizSubjects);

export const insertQuizTopicSchema = createInsertSchema(quizTopics);
export const selectQuizTopicSchema = createSelectSchema(quizTopics);

export const insertQuizSchema = createInsertSchema(quizzes);
export const selectQuizSchema = createSelectSchema(quizzes);

export const insertQuizBookmarkSchema = createInsertSchema(quizBookmarks);
export const selectQuizBookmarkSchema = createSelectSchema(quizBookmarks);

export const insertQuizCompletionSchema = createInsertSchema(quizCompletions);
export const selectQuizCompletionSchema = createSelectSchema(quizCompletions);

// --- Types for Quiz Tables ---
export type QuizSubject = typeof quizSubjects.$inferSelect;
export type NewQuizSubject = typeof quizSubjects.$inferInsert;

export type QuizTopic = typeof quizTopics.$inferSelect;
export type NewQuizTopic = typeof quizTopics.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;

export type QuizBookmark = typeof quizBookmarks.$inferSelect;
export type NewQuizBookmark = typeof quizBookmarks.$inferInsert;

export type QuizCompletion = typeof quizCompletions.$inferSelect;
export type NewQuizCompletion = typeof quizCompletions.$inferInsert;

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

export type Deck = typeof decks.$inferSelect;
export type NewDeck = typeof decks.$inferInsert;

export type Flashcard = typeof flashcards.$inferSelect;
export type NewFlashcard = typeof flashcards.$inferInsert;

export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;

export type FlashcardResult = typeof flashcardResults.$inferSelect;
export type NewFlashcardResult = typeof flashcardResults.$inferInsert;