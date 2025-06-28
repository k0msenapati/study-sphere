# Technology Stack

## 🚀 Overview

Study Sphere is built with modern web technologies focused on performance and developer experience.

## Core Technologies

### Runtime & Framework
- **Bun**: JavaScript runtime and package manager
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with TypeScript
- **TypeScript**: Type-safe development

### Frontend
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **React Quill**: Rich text editor
- **Lucide React**: Icon library

### Backend & Database
- **Next.js API Routes**: Server-side endpoints
- **SQLite**: Lightweight database
- **Better SQLite3**: Node.js SQLite driver
- **Drizzle ORM**: Type-safe SQL queries
- **bcryptjs**: Password hashing

### AI Integration
- **CopilotKit**: AI-powered React components
- **GROQ API**: LLM inference

### Development Tools
- **Biome**: Formatter and linter
- **Drizzle Kit**: Database migration tool

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Main app pages
├── components/         # React components
├── lib/               # Utilities and database
└── middleware.ts      # Route protection
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and authentication
- **notes**: Rich text notes with categories
- **tasks**: Task management
- **chats**: AI conversation history
- **daily_reviews**: Progress tracking
- **user_settings**: User preferences

## 🤖 AI Features

### CopilotKit Integration
- Study buddy chat interface
- Context sharing with user data
- AI-powered suggestions

### GROQ API
- Fast LLM inference
- Flashcard generation
- Educational conversations

## 🔒 Security

- JWT authentication with HTTP-only cookies
- bcrypt password hashing
- Route protection middleware
- Input validation