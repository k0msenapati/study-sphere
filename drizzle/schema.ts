import { sqliteTable, AnySQLiteColumn, uniqueIndex, integer, text, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	email: text().notNull(),
	password: text().notNull(),
	name: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	bio: text(),
	displayName: text("display_name"),
	avatarUrl: text("avatar_url"),
	lastSignIn: integer("last_sign_in"),
},
(table) => [
	uniqueIndex("users_email_unique").on(table.email),
]);

export const chats = sqliteTable("chats", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	prompt: text().notNull(),
	response: text().notNull(),
	promptTime: integer("prompt_time").notNull(),
});

export const dailyReviews = sqliteTable("daily_reviews", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	reviewDate: integer("review_date").notNull(),
	completedTasks: integer("completed_tasks").default(0).notNull(),
	totalTasks: integer("total_tasks").default(0).notNull(),
	reflection: text(),
	improvements: text(),
	productivityScore: integer("productivity_score"),
	createdAt: integer("created_at").notNull(),
});

export const notes = sqliteTable("notes", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	content: text().notNull(),
	categories: text().notNull(),
	createdAt: integer("created_at").notNull(),
	modifiedAt: integer("modified_at").notNull(),
});

export const tasks = sqliteTable("tasks", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	description: text(),
	priority: text().default("medium").notNull(),
	status: text().default("pending").notNull(),
	dueDate: integer("due_date"),
	scheduledDate: integer("scheduled_date"),
	scheduledStartTime: text("scheduled_start_time"),
	scheduledEndTime: text("scheduled_end_time"),
	estimatedDuration: integer("estimated_duration"),
	completedAt: integer("completed_at"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const userSettings = sqliteTable("user_settings", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	focusSessionDuration: integer("focus_session_duration").default(90).notNull(),
	breakDuration: integer("break_duration").default(20).notNull(),
	workStartTime: text("work_start_time").default("09:00").notNull(),
	workEndTime: text("work_end_time").default("17:00").notNull(),
	peakHoursStart: text("peak_hours_start").default("10:00").notNull(),
	peakHoursEnd: text("peak_hours_end").default("12:00").notNull(),
	pomodoroEnabled: integer("pomodoro_enabled").default(0).notNull(),
	pomodoroWorkDuration: integer("pomodoro_work_duration").default(25).notNull(),
	pomodoroBreakDuration: integer("pomodoro_break_duration").default(5).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	themePreference: text("theme_preference").default("system").notNull(),
},
(table) => [
	uniqueIndex("user_settings_user_id_unique").on(table.userId),
]);

export const decks = sqliteTable("decks", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	description: text(),
	color: text().default("#3B82F6").notNull(),
	isPublic: integer("is_public").default(0).notNull(),
	tags: text().default("[]").notNull(),
	studyMaterial: text("study_material"),
	totalCards: integer("total_cards").default(0).notNull(),
	lastStudied: integer("last_studied"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const flashcardResults = sqliteTable("flashcard_results", {
	id: text().primaryKey().notNull(),
	sessionId: text("session_id").notNull().references(() => studySessions.id, { onDelete: "cascade" } ),
	flashcardId: text("flashcard_id").notNull().references(() => flashcards.id, { onDelete: "cascade" } ),
	result: text().notNull(),
	timeToAnswer: integer("time_to_answer").default(0).notNull(),
	reviewedAt: integer("reviewed_at").notNull(),
});

export const flashcards = sqliteTable("flashcards", {
	id: text().primaryKey().notNull(),
	deckId: text("deck_id").notNull().references(() => decks.id, { onDelete: "cascade" } ),
	question: text().notNull(),
	answer: text().notNull(),
	difficulty: text().default("medium").notNull(),
	topic: text().notNull(),
	hints: text().default("[]"),
	explanation: text(),
	tags: text().default("[]").notNull(),
	correctCount: integer("correct_count").default(0).notNull(),
	incorrectCount: integer("incorrect_count").default(0).notNull(),
	lastReviewed: integer("last_reviewed"),
	nextReview: integer("next_review"),
	order: integer().default(0).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const studySessions = sqliteTable("study_sessions", {
	id: text().primaryKey().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	deckId: text("deck_id").notNull().references(() => decks.id, { onDelete: "cascade" } ),
	startTime: integer("start_time").notNull(),
	endTime: integer("end_time"),
	totalCards: integer("total_cards").default(0).notNull(),
	correctAnswers: integer("correct_answers").default(0).notNull(),
	incorrectAnswers: integer("incorrect_answers").default(0).notNull(),
	partialAnswers: integer("partial_answers").default(0).notNull(),
	sessionType: text("session_type").default("study").notNull(),
	timeSpent: integer("time_spent").default(0).notNull(),
	completed: integer().default(0).notNull(),
	createdAt: integer("created_at").notNull(),
});

