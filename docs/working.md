# Study Sphere Workflows

## 🔄 Overview

This document describes the actual user workflows and system processes in Study Sphere.

## 🔐 Authentication

### Registration
1. Visit `/auth/register`
2. Fill form: name, email, password
3. POST `/api/auth/register`
4. Password hashed with bcrypt
5. Store in SQLite database
6. Generate JWT token
7. Set HTTP-only cookie
8. Redirect to dashboard

### Login
1. Visit `/auth/login`
2. Enter email/password
3. POST `/api/auth/login`
4. Verify password
5. Generate JWT token
6. Set secure cookie
7. Redirect to dashboard

## 📝 Notes Workflow

### Creating Notes
1. Navigate to `/dashboard/notes`
2. Click "Add New Note"
3. Enter title and content (React Quill)
4. Add categories/tags
5. Auto-save functionality
6. Submit to POST `/api/notes`
7. Store in SQLite with userId

### Managing Notes
- Edit: Click note → modify content → auto-save
- Delete: Click delete → DELETE `/api/notes`
- Search: Type query → filter notes
- Categories: Add/remove tags

## 🃏 Flashcards Workflow

### Generating Flashcards
1. Navigate to `/dashboard/flashcards`
2. Enter text content
3. Select number of cards (5-25)
4. Choose difficulty level
5. Submit to CopilotKit
6. AI generates question-answer pairs
7. Display interactive cards

### Studying
- Flip cards to reveal answers
- Mark as correct/incorrect
- Progress tracking
- Navigate through card deck

## ❓ Quiz System

### Taking Quizzes
1. Navigate to `/dashboard/quizzes`
2. Select quiz from collection
3. Start timer (5 minutes)
4. Answer multiple choice questions
5. Submit answers
6. Calculate score
7. Show results

## 🤖 Study Buddy Chat

### AI Conversation
1. Navigate to `/dashboard/chat`
2. Type question or request
3. useCopilotChat() processes input
4. Send to GROQ API via CopilotKit
5. Stream response back to UI
6. Save conversation to `/api/chats`

## 📋 Task Management

### Creating Tasks
1. Navigate to `/dashboard/todos`
2. Click "Add Task"
3. Enter title, description, priority, due date
4. Submit to POST `/api/tasks`
5. Store in SQLite

### Managing Tasks
- Update status (pending → in-progress → completed)
- Edit task details
- Delete tasks
- Filter by status/priority

## 📊 Daily Review

### Review Process
1. Navigate to daily review
2. Rate productivity (1-10 scale)
3. Add reflection notes
4. Submit to POST `/api/daily-reviews`
5. View progress over time

## ⚙️ Settings Management

### User Preferences
1. Navigate to settings
2. Configure study preferences:
   - Work hours (start/end time)
   - Break intervals
   - Focus session duration
   - Peak productivity hours
3. Save to PUT `/api/user-settings`

## 🔄 Data Flow

### Authentication Flow
```
Login → JWT Token → Session Cookie → Protected Routes
```

### API Communication
```
Frontend → React Context → API Route → Drizzle ORM → SQLite
```

### AI Integration
```
User Input → CopilotKit → GROQ API → AI Response → UI Update
```

## 🚫 Limitations

- No WebSocket connections
- No real-time collaboration
- No cloud storage
- SQLite for development only
- Basic error handling
- Single-user focus