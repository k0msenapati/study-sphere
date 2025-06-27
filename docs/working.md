# Study Sphere Workflows

## 🔄 Overview

This document describes the actual user workflows and system processes in Study Sphere.

## 🔐 Authentication

### Registration Flow
```mermaid
flowchart TD
    A[Visit /auth/register] --> B[Fill Form: name, email, password]
    B --> C[Submit Form]
    C --> D[POST /api/auth/register]
    D --> E[Validate Input]
    E --> F{Email Unique?}
    F -->|No| G[Return Error]
    F -->|Yes| H[Hash Password with bcrypt]
    H --> I[Store User in SQLite]
    I --> J[Generate JWT Token]
    J --> K[Set HTTP-only Cookie]
    K --> L[Redirect to Dashboard]
    G --> B
```

### Login Flow
```mermaid
flowchart TD
    A[Visit /auth/login] --> B[Enter email/password]
    B --> C[Submit Form]
    C --> D[POST /api/auth/login]
    D --> E[Find User by Email]
    E --> F{User Exists?}
    F -->|No| G[Return Error]
    F -->|Yes| H[Verify Password with bcrypt]
    H --> I{Password Valid?}
    I -->|No| G
    I -->|Yes| J[Generate JWT Token]
    J --> K[Set Secure Cookie]
    K --> L[Redirect to Dashboard]
    G --> B
```

## 📝 Notes Workflow

### Creating Notes Flow
```mermaid
flowchart TD
    A[Navigate to /dashboard/notes] --> B[Click 'Add New Note']
    B --> C[Enter Title & Content in React Quill]
    C --> D[Add Categories/Tags]
    D --> E[Auto-save Triggered]
    E --> F[Submit to POST /api/notes]
    F --> G[Validate Input]
    G --> H[Store in SQLite with userId]
    H --> I[Return Note Data]
    I --> J[Update UI with New Note]
```

### Managing Notes Flow
```mermaid
flowchart TD
    A[Select Note Action] --> B{Action Type}
    B -->|Edit| C[Click Note]
    B -->|Delete| D[Click Delete Button]
    B -->|Search| E[Type in Search Box]
    
    C --> F[Modify Content in Editor]
    F --> G[Auto-save Triggered]
    G --> H[PUT /api/notes]
    
    D --> I[Confirm Deletion]
    I --> J[DELETE /api/notes]
    J --> K[Remove from UI]
    
    E --> L[Filter Notes Locally]
    L --> M[Display Filtered Results]
```

## 🃏 Flashcards Workflow

### Generating Flashcards Flow
```mermaid
flowchart TD
    A[Navigate to /dashboard/flashcards] --> B[Enter Text Content]
    B --> C[Select Number of Cards: 5-25]
    C --> D[Choose Difficulty Level]
    D --> E[Submit to CopilotKit]
    E --> F[Process via GROQ API]
    F --> G[AI Generates Q&A Pairs]
    G --> H[Return Flashcard Data]
    H --> I[Display Interactive Cards]
```

### Studying Flow
```mermaid
flowchart TD
    A[Start Study Session] --> B[Display Card Question]
    B --> C[User Thinks/Recalls]
    C --> D[Flip Card]
    D --> E[Show Answer]
    E --> F{Mark Response}
    F -->|Correct| G[Mark as Correct]
    F -->|Incorrect| H[Mark as Incorrect]
    G --> I[Update Progress]
    H --> I
    I --> J{More Cards?}
    J -->|Yes| K[Next Card]
    J -->|No| L[Show Session Results]
    K --> B
```

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

### AI Conversation Flow
```mermaid
flowchart TD
    A[Navigate to /dashboard/chat] --> B[Type Question/Request]
    B --> C[useCopilotChat Processes Input]
    C --> D[Send to GROQ API via CopilotKit]
    D --> E[AI Processes with Context]
    E --> F[Generate Response]
    F --> G[Stream Response to UI]
    G --> H[Display Message in Chat]
    H --> I[Save Conversation to /api/chats]
    I --> J[Update Chat History]
```

### Chat Context Flow
```mermaid
flowchart TD
    A[User Input] --> B[Gather Context]
    B --> C[User Notes Content]
    B --> D[Task Progress]
    B --> E[Previous Chat History]
    B --> F[Study Preferences]
    C --> G[Build AI Prompt]
    D --> G
    E --> G
    F --> G
    G --> H[Send to GROQ API]
    H --> I[Contextual AI Response]
```

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
```mermaid
flowchart LR
    A[User Login] --> B[JWT Token Generated]
    B --> C[HTTP-only Cookie Set]
    C --> D[Middleware Validates]
    D --> E[Access Protected Routes]
```

### API Communication Flow
```mermaid
flowchart TD
    A[Frontend Component] --> B[React Context Hook]
    B --> C[API Route Call]
    C --> D[Middleware Auth Check]
    D --> E{Authenticated?}
    E -->|No| F[401 Unauthorized]
    E -->|Yes| G[Drizzle ORM Query]
    G --> H[SQLite Database]
    H --> I[Return Data]
    I --> J[Update React State]
    J --> K[Re-render UI]
```

### AI Integration Flow
```mermaid
flowchart TD
    A[User Input] --> B[CopilotKit Hook]
    B --> C[Context Data Gathering]
    C --> D[Build AI Prompt]
    D --> E[GROQ API Request]
    E --> F[AI Response]
    F --> G[Stream to UI]
    G --> H[Optional: Save to DB]
```

## 🚫 Limitations

- No WebSocket connections
- No real-time collaboration
- No cloud storage
- SQLite for development only
- Basic error handling
- Single-user focus