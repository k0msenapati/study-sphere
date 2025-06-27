# File Structure

## 📁 Project Overview

Study Sphere follows Next.js App Router conventions with organized directories.

## 🗂️ Root Directory

```
├── package.json           # Dependencies and scripts
├── next.config.mjs        # Next.js configuration  
├── tailwind.config.ts     # Tailwind CSS setup
├── tsconfig.json          # TypeScript configuration
├── drizzle.config.ts      # Database configuration
├── biome.json            # Code formatting rules
├── components.json        # UI component configuration
├── sqlite.db             # SQLite database
└── drizzle/              # Database migrations
```

## 📱 Source Code Structure

### `src/app/` - Next.js App Router
```
src/app/
├── layout.tsx            # Root layout
├── page.tsx              # Landing page
├── globals.css           # Global styles
├── auth/                # Authentication pages
│   ├── login/
│   └── register/
├── dashboard/           # Main application
│   ├── page.tsx         # Dashboard home
│   ├── notes/           # Notes feature
│   ├── flashcards/      # Flashcards feature
│   ├── quizzes/         # Quiz feature
│   ├── chat/            # AI chat feature
│   └── todos/           # Task management
└── api/                 # API routes
    ├── auth/            # Authentication APIs
    ├── notes/           # Notes CRUD
    ├── tasks/           # Task management
    ├── chats/           # Chat history
    ├── daily-reviews/   # Review system
    ├── user-settings/   # User preferences
    └── copilotkit/      # AI integration
```

### `src/components/` - React Components
```
src/components/
├── auth/                # Authentication components
├── landing/             # Landing page sections
├── tasks/               # Task management components
└── ui/                  # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
```

### `src/lib/` - Utilities and Libraries
```
src/lib/
├── utils.ts             # General utilities
├── auth/                # Authentication logic
│   ├── jwt.ts
│   └── password.ts
├── db/                  # Database configuration
│   ├── index.ts
│   └── schema.ts
├── notes/               # Notes feature logic
├── tasks/               # Task management logic
├── flashcards/          # Flashcards feature logic
└── quizzes/             # Quiz feature logic
```

## 🎨 Public Assets

```
public/
├── og banner.png        # Social media banner
└── sqlite_db_error.png # Error illustration
```

## 📄 Documentation

```
docs/
├── README.md            # Documentation overview
├── api.md              # API reference
├── features.md         # Feature documentation
├── tech.md             # Technology stack
├── working.md          # Workflows
├── db.md               # Database setup
├── files.md            # File structure
├── ui.md               # UI components
└── schema.md           # Database schema
```

## Key Files

- **middleware.ts**: Route protection
- **drizzle.config.ts**: Database configuration
- **tailwind.config.ts**: Styling configuration
- **next.config.mjs**: Next.js settings
- **biome.json**: Code formatting rules