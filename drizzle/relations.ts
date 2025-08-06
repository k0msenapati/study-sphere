import { relations } from "drizzle-orm/relations";
import { users, chats, dailyReviews, decks, flashcards, flashcardResults, studySessions, notes, tasks, userSettings, quizzes, quizBookmarks, quizCompletions, quizSubjects, quizTopics } from "./schema";

export const chatsRelations = relations(chats, ({one}) => ({
	user: one(users, {
		fields: [chats.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	chats: many(chats),
	dailyReviews: many(dailyReviews),
	decks: many(decks),
	notes: many(notes),
	studySessions: many(studySessions),
	tasks: many(tasks),
	userSettings: many(userSettings),
	quizBookmarks: many(quizBookmarks),
	quizCompletions: many(quizCompletions),
	quizzes: many(quizzes),
}));

export const dailyReviewsRelations = relations(dailyReviews, ({one}) => ({
	user: one(users, {
		fields: [dailyReviews.userId],
		references: [users.id]
	}),
}));

export const decksRelations = relations(decks, ({one, many}) => ({
	user: one(users, {
		fields: [decks.userId],
		references: [users.id]
	}),
	flashcards: many(flashcards),
	studySessions: many(studySessions),
}));

export const flashcardResultsRelations = relations(flashcardResults, ({one}) => ({
	flashcard: one(flashcards, {
		fields: [flashcardResults.flashcardId],
		references: [flashcards.id]
	}),
	studySession: one(studySessions, {
		fields: [flashcardResults.sessionId],
		references: [studySessions.id]
	}),
}));

export const flashcardsRelations = relations(flashcards, ({one, many}) => ({
	flashcardResults: many(flashcardResults),
	deck: one(decks, {
		fields: [flashcards.deckId],
		references: [decks.id]
	}),
}));

export const studySessionsRelations = relations(studySessions, ({one, many}) => ({
	flashcardResults: many(flashcardResults),
	deck: one(decks, {
		fields: [studySessions.deckId],
		references: [decks.id]
	}),
	user: one(users, {
		fields: [studySessions.userId],
		references: [users.id]
	}),
}));

export const notesRelations = relations(notes, ({one}) => ({
	user: one(users, {
		fields: [notes.userId],
		references: [users.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id]
	}),
}));

export const userSettingsRelations = relations(userSettings, ({one}) => ({
	user: one(users, {
		fields: [userSettings.userId],
		references: [users.id]
	}),
}));

export const quizBookmarksRelations = relations(quizBookmarks, ({one}) => ({
	quiz: one(quizzes, {
		fields: [quizBookmarks.quizId],
		references: [quizzes.id]
	}),
	user: one(users, {
		fields: [quizBookmarks.userId],
		references: [users.id]
	}),
}));

export const quizzesRelations = relations(quizzes, ({one, many}) => ({
	quizBookmarks: many(quizBookmarks),
	quizCompletions: many(quizCompletions),
	quizTopic: one(quizTopics, {
		fields: [quizzes.topicId],
		references: [quizTopics.id]
	}),
	quizSubject: one(quizSubjects, {
		fields: [quizzes.subjectId],
		references: [quizSubjects.id]
	}),
	user: one(users, {
		fields: [quizzes.userId],
		references: [users.id]
	}),
}));

export const quizCompletionsRelations = relations(quizCompletions, ({one}) => ({
	quiz: one(quizzes, {
		fields: [quizCompletions.quizId],
		references: [quizzes.id]
	}),
	user: one(users, {
		fields: [quizCompletions.userId],
		references: [users.id]
	}),
}));

export const quizTopicsRelations = relations(quizTopics, ({one, many}) => ({
	quizSubject: one(quizSubjects, {
		fields: [quizTopics.subjectId],
		references: [quizSubjects.id]
	}),
	quizzes: many(quizzes),
}));

export const quizSubjectsRelations = relations(quizSubjects, ({many}) => ({
	quizTopics: many(quizTopics),
	quizzes: many(quizzes),
}));