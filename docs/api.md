# API Documentation

## 🚀 Overview

Study Sphere provides a REST API for managing notes, tasks, flashcards, and AI-powered features.

<details>
<summary>🔐 <strong>Authentication</strong></summary>

All API endpoints require JWT authentication via HTTP-only cookies.

### Auth Endpoints
```typescript
POST /api/auth/register   // User registration
POST /api/auth/login      // User login  
POST /api/auth/logout     // User logout
GET  /api/auth/session    // Check session
GET  /api/auth/me         // Get user info
```

</details>

<details>
<summary>📋 <strong>Core Endpoints</strong></summary>

### Notes
```typescript
GET    /api/notes         // Get user notes
POST   /api/notes         // Create note
PUT    /api/notes/:id     // Update note
DELETE /api/notes/:id     // Delete note
```

### Tasks  
```typescript
GET    /api/tasks         // Get user tasks
POST   /api/tasks         // Create task
PUT    /api/tasks/:id     // Update task
DELETE /api/tasks/:id     // Delete task
```

### AI Chat
```typescript
GET    /api/chats         // Get chat history
POST   /api/chats         // Save chat message
DELETE /api/chats/:id     // Delete chat
```

### Flashcards (AI-Powered)
```typescript
POST /api/copilotkit/generate-flashcards  // Generate from text
POST /api/copilotkit/explain-flashcard    // Explain flashcard
```

### Settings & Reviews
```typescript
GET  /api/user-settings   // Get preferences
PUT  /api/user-settings   // Update preferences
GET  /api/daily-reviews   // Get reviews
POST /api/daily-reviews   // Create review
```

</details>

<details>
<summary>🤖 <strong>AI Integration</strong></summary>

### CopilotKit Endpoint
```typescript
POST /api/copilotkit     // Main AI processing endpoint
```

**Powers:**
- Study buddy chat responses
- Flashcard generation from text
- Content explanations
- Study suggestions

**AI Model:** GROQ Gemma2-9B-IT

</details>

<details>
<summary>📝 <strong>Example Usage</strong></summary>

### Create a Note
```bash
curl -X POST /api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Physics Notes",
    "content": "Newton'\''s laws of motion...",
    "categories": ["physics", "mechanics"]
  }'
```

### Generate Flashcards
```bash
curl -X POST /api/copilotkit/generate-flashcards \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Photosynthesis is the process...",
    "count": 5,
    "difficulty": "medium"
  }'
```

</details>

---

## 📞 Support

- **Issues**: Create GitHub issues for bugs
- **API Problems**: Check authentication and request format
- **Feature Requests**: Use GitHub discussions

