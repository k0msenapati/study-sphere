# Study Sphere Documentation

## 📚 Welcome

Study Sphere is an AI-powered learning companion that helps students organize, study, and retain information effectively.

<details>
<summary>🎯 <strong>Quick Start</strong></summary>

### For Users
1. [Features Overview](features.md) - What Study Sphere offers
2. [Database Setup](db.md) - Get the app running
3. [UI Components](ui.md) - Understanding the interface

### For Developers  
1. [File Structure](files.md) - Codebase organization
2. [Technology Stack](tech.md) - Technical foundation
3. [Database Schema](schema.md) - Data modeling
4. [Workflows](working.md) - Development processes

</details>

<details>
<summary>📑 <strong>Documentation Files</strong></summary>

| File | Purpose | Audience |
|------|---------|----------|
| [files.md](files.md) | Project structure | Developers |
| [features.md](features.md) | Feature documentation | All Users |
| [tech.md](tech.md) | Technology stack | Developers |
| [schema.md](schema.md) | Database design | Backend Devs |
| [db.md](db.md) | Database setup | Developers |
| [working.md](working.md) | Workflows | Developers |
| [ui.md](ui.md) | UI components | Frontend Devs |
| [api.md](api.md) | API endpoints | Backend Devs |

</details>

<details>
<summary>🚀 <strong>Setup</strong></summary>

```bash
# Clone and install
git clone <repo-url>
bun install

# Environment setup
cp .env.example .env.local
# Add GROQ_API_KEY and JWT_SECRET

# Database
bun run db:generate
bun run db:migrate

# Start development
bun run dev
```

</details>

<details>
<summary>📖 <strong>Features</strong></summary>

### Core Features
- **📝 Smart Notes** - [Features](features.md#1--smart-notes-management) | [UI](ui.md#notes-grid-component-notes-gridtsx)
- **🃏 AI Flashcards** - [Features](features.md#3--ai-powered-flashcards-generator) | [Workflow](working.md#flashcards-generation-workflow)
- **❓ Interactive Quizzes** - [Features](features.md#2--interactive-quiz-system) | [Workflow](working.md#quiz-system-workflow)
- **🤖 Study Buddy Chat** - [Features](features.md#4--study-buddy-ai-mentor) | [Database](schema.md#chats-table-chats)
- **📋 Task Management** - [Features](features.md#5--smart-task-management) | [Database](schema.md#tasks-table-tasks)
- **📊 Daily Reviews** - [Features](features.md#6--daily-reviews-and-analytics) | [Database](schema.md#daily-reviews-table-dailyreviews)

</details>

<details>
<summary>🔧 <strong>API Reference</strong></summary>

```typescript
// Authentication
POST /api/auth/register    // User registration
POST /api/auth/login       // User login
GET  /api/auth/session     // Session validation

// Features
GET    /api/notes          // Get user notes
POST   /api/notes          // Create note
GET    /api/tasks          // Get user tasks
POST   /api/tasks          // Create task
POST   /api/copilotkit     // AI endpoint
GET    /api/chats          // Get chat history
POST   /api/daily-reviews  // Create review
```

See [api.md](api.md) for complete documentation.

</details>

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: SQLite
- **AI**: CopilotKit, GROQ API
- **Auth**: JWT

See [tech.md](tech.md) for detailed architecture.

---

## 📞 Support

- **Issues**: Create GitHub issues with detailed descriptions
- **Documentation**: Report unclear content
- **Contributions**: Follow the patterns in existing code

**Happy Learning with Study Sphere! 🚀📚**
