import { relations } from "drizzle-orm/relations";
import { users, chats, dailyReviews, notes, tasks, userSettings, decks, flashcards, flashcardResults, studySessions } from "./schema";

export const chatsRelations = relations(chats, ({one}) => ({
	user: one(users, {
		fields: [chats.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	chats: many(chats),
	dailyReviews: many(dailyReviews),
	notes: many(notes),
	tasks: many(tasks),
	userSettings: many(userSettings),
	decks: many(decks),
	studySessions: many(studySessions),
}));

export const dailyReviewsRelations = relations(dailyReviews, ({one}) => ({
	user: one(users, {
		fields: [dailyReviews.userId],
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