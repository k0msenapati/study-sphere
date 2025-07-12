# Study Sphere Features

## 📚 Core Features

Study Sphere is an AI-powered learning platform built with Next.js, React, and CopilotKit.

### 📝 Notes System
- Rich text editor with React Quill
- Category-based organization
- Auto-save functionality
- Search and filtering

### 🃏 AI Flashcards
- Generate flashcards from text using AI
- Interactive flip-card interface
- Difficulty levels (easy, medium, hard)
- Progress tracking

### ❓ Quiz System
- **AI Quiz Generation**: Create custom quizzes from your study material
- **Multiple Creation Methods**: 
  - Step-by-step quiz generator (similar to flashcards)
  - AI chat integration for quick quiz creation
- **Customizable Settings**:
  - Number of questions (5-25)
  - Difficulty levels (easy, medium, hard)  
  - Question types (multiple choice, true/false, mixed)
- **Pre-built quiz collection**
- **Timed challenges** (5-minute timer)
- **Score tracking** and progress analytics
- **Interactive preview** before saving

### 🤖 Study Buddy Chat
- **AI conversation** powered by CopilotKit with Groq integration
- **Context-aware responses** for study assistance
- **Chat history persistence** with deletion options
- **Study content generation**:
  - Create flashcards from conversations
  - Generate quiz questions from material
  - Get study explanations and tips
- **Quick action suggestions** for common study tasks

### 📋 Task Management
- Create tasks with title, description, priority, due dates
- Status tracking (pending, in-progress, completed)
- Priority levels with visual indicators
- Basic scheduling

### 📊 Daily Review
- Daily productivity scoring (1-10 scale)
- Reflection prompts
- Progress tracking
- Basic analytics

### ⚙️ User Settings
- Study preferences (peak hours, break intervals)
- Productivity goals
- Profile management
- Theme support (dark/light mode)

## 🛠️ Technical Stack

### Frontend
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS
- Radix UI components

### Backend
- Next.js API Routes
- SQLite database
- Drizzle ORM
- JWT authentication

### AI Integration
- CopilotKit framework
- GROQ API for LLM

### Development
- Bun runtime
- Biome for formatting
- TypeScript for type safety

## 🚫 Not Implemented

- WebSocket connections
- Real-time collaboration
- Cloud storage
- Multi-user features
- Mobile app
- Third-party integrations