# File Structure Documentation

## Overview
This document provides a comprehensive overview of the important files and directories in the Study Sphere project, explaining their purpose, functionality, and interdependencies.

## Root Directory Files

### Configuration Files

#### `package.json`
- **Purpose**: Contains project metadata, dependencies, and build scripts
- **Key Dependencies**: 
  - CopilotKit packages for AI integration
  - Next.js for React framework
  - Drizzle ORM for database operations
  - Radix UI components for consistent UI
- **Scripts**: Development, build, database management, and formatting commands

#### `next.config.mjs`
- **Purpose**: Next.js configuration file
- **Contains**: Custom webpack configurations, environment variable handling, and build optimizations

#### `tailwind.config.ts`
- **Purpose**: Tailwind CSS configuration
- **Features**: Custom color schemes, animations, component classes, and responsive design settings

#### `tsconfig.json`
- **Purpose**: TypeScript configuration
- **Settings**: Compiler options, path aliases (`@/` mapping), and strict type checking

#### `drizzle.config.ts`
- **Purpose**: Database configuration for Drizzle ORM
- **Configuration**: SQLite database connection, schema location, and migration settings

#### `biome.json`
- **Purpose**: Code formatting and linting configuration using Biome
- **Features**: Code style rules, import sorting, and formatting preferences

#### `components.json`
- **Purpose**: Shadcn/ui configuration for component generation
- **Settings**: Component library setup and custom component paths

### Database Files

#### `sqlite.db`
- **Purpose**: Local SQLite database file
- **Contains**: User data, notes, tasks, chats, flashcards, and user settings
- **Location**: Root directory for easy access and backup

#### `drizzle/` Directory
- **Purpose**: Database migration files and metadata
- **Files**:
  - `0000_pink_blindfold.sql`: Initial database schema
  - `0001_amazing_doomsday.sql`: Schema updates and modifications
  - `meta/`: Migration metadata and snapshots

## Source Code Structure (`src/`)

### Application Core (`src/app/`)

#### `layout.tsx`
- **Purpose**: Root layout component for the entire application
- **Features**: Theme provider, font configuration, and global styling
- **Dependencies**: Custom components for navigation and theming

#### `page.tsx`
- **Purpose**: Landing page component
- **Components**: Hero section, features, testimonials, and call-to-action

#### `globals.css`
- **Purpose**: Global CSS styles and Tailwind imports
- **Features**: Custom animations, component styles, and theme variables

#### `SEO.tsx`
- **Purpose**: Search Engine Optimization component
- **Features**: Meta tags, Open Graph, and structured data

### Authentication (`src/app/auth/`)

#### `login/page.tsx`
- **Purpose**: User login interface
- **Features**: Form validation, error handling, and session management

#### `register/page.tsx`
- **Purpose**: User registration interface
- **Features**: Account creation, input validation, and automatic login

#### `session/route.ts`
- **Purpose**: Session management API endpoint
- **Features**: Session validation and user data retrieval

### Dashboard (`src/app/dashboard/`)

#### `layout.tsx`
- **Purpose**: Dashboard layout with AI integration
- **Features**: CopilotKit integration, authenticated navigation, and provider wrappers
- **Key Integrations**: FlashcardsProvider, TasksProvider, CopilotPopup

#### `page.tsx`
- **Purpose**: Main dashboard overview
- **Features**: Quick stats, recent activity, and feature shortcuts

#### Feature Modules:
- **`notes/`**: Note-taking functionality with rich text editor
- **`flashcards/`**: AI-powered flashcard generation and study tools
- **`quizzes/`**: Interactive quiz creation and taking
- **`todos/`**: Task management and productivity tracking
- **`chat/`**: AI-powered study buddy conversation interface

### API Routes (`src/app/api/`)

#### Authentication APIs (`auth/`)
- **`login/route.ts`**: User authentication endpoint
- **`register/route.ts`**: User registration endpoint
- **`logout/route.ts`**: Session termination endpoint
- **`me/route.ts`**: Current user information retrieval

#### CopilotKit Integration (`copilotkit/`)
- **`route.ts`**: Main CopilotKit runtime endpoint
- **`generate-flashcards/route.ts`**: AI flashcard generation API

#### Data Management APIs:
- **`notes/route.ts`**: CRUD operations for notes
- **`tasks/route.ts`**: Task management operations
- **`chats/route.ts`**: Chat history management
- **`daily-reviews/route.ts`**: Productivity review tracking
- **`user-settings/route.ts`**: User preference management

### Components (`src/components/`)

#### UI Components (`ui/`)
- **Base Components**: Built on Radix UI primitives
- **Key Files**:
  - `button.tsx`: Customizable button variants
  - `card.tsx`: Content container components
  - `dialog.tsx`: Modal and popup interfaces
  - `flashcard.tsx`: Interactive flashcard component
  - `notes-grid.tsx`: Note organization layout
  - `second-brain.tsx`: Knowledge management interface

#### Feature Components:
- **`auth/`**: Login, logout, and registration forms
- **`landing/`**: Landing page sections and marketing content
- **`tasks/`**: Task management interfaces and productivity tools

#### Shared Components:
- **`navbar.tsx`**: Main navigation component
- **`theme-provider.tsx`**: Dark/light theme management
- **`FAQ.tsx`**: Frequently asked questions component

### Library Code (`src/lib/`)

#### Database (`db/`)
- **`schema.ts`**: Drizzle ORM schema definitions
- **`index.ts`**: Database connection and configuration

#### Authentication (`auth/`)
- **`jwt.ts`**: JSON Web Token management
- **`password.ts`**: Password hashing and verification

#### Feature Libraries:
- **`flashcards/`**: Flashcard types, hooks, and providers
- **`notes/`**: Note management utilities and types
- **`quizzes/`**: Quiz creation and management logic
- **`tasks/`**: Task scheduling and productivity features

#### Utilities:
- **`utils.ts`**: Common utility functions
- **`content-utils.ts`**: Content processing and formatting

### Middleware (`src/middleware.ts`)
- **Purpose**: Request interception and route protection
- **Features**: Authentication checks, route redirects, and session validation

## File Relationships and Dependencies

### Data Flow
1. **User Authentication**: `middleware.ts` → `auth/` APIs → `jwt.ts`
2. **Database Operations**: Feature APIs → `schema.ts` → `sqlite.db`
3. **AI Integration**: Components → `copilotkit/route.ts` → GROQ API
4. **State Management**: React Context Providers → Feature hooks → Components

### Import Patterns
- **Path Aliases**: `@/` maps to `src/` directory
- **Component Imports**: UI components from `@/components/ui`
- **Library Imports**: Utilities from `@/lib`
- **Type Imports**: Shared types from feature libraries

### Build Dependencies
- **TypeScript**: Strict type checking across all files
- **Tailwind CSS**: Utility-first styling system
- **Next.js**: Full-stack React framework with API routes
- **Drizzle ORM**: Type-safe database operations

## Development Workflow Files

### Scripts and Automation
- **`dev`**: Development server with hot reload
- **`build`**: Production build generation
- **`db:*`**: Database migration and management commands
- **`format`**: Code formatting with Biome

### Environment Configuration
- **`.env.local`**: Environment variables (not in repository)
- **Required Variables**: `GROQ_API_KEY`, `JWT_SECRET`

## Asset Management

### Public Assets (`public/`)
- **`og banner.png`**: Open Graph social media image
- **`sqlite_db_error.png`**: Database error documentation image

### Font Assets (`src/app/fonts/`)
- **`GeistVF.woff`**: Variable font for body text
- **`GeistMonoVF.woff`**: Monospace font for code

## Security Considerations

### Protected Files
- **Database**: SQLite file with user data
- **Environment**: API keys and secrets
- **Sessions**: JWT tokens with user authentication

### Access Control
- **Middleware**: Route-level authentication
- **API Protection**: Session validation on all protected endpoints
- **Data Isolation**: User-specific data filtering

## Performance Optimizations

### Code Splitting
- **Dynamic Imports**: Lazy loading of heavy components
- **Route-based Splitting**: Automatic code splitting by Next.js

### Database Efficiency
- **Indexed Queries**: Optimized database schema
- **Connection Pooling**: Efficient database connections
- **Migration Management**: Version-controlled schema changes

This file structure supports a scalable, maintainable, and feature-rich educational platform with clear separation of concerns and robust architecture patterns.
