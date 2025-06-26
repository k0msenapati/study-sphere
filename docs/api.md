# API Documentation

## Overview
Study Sphere provides a comprehensive REST API built with Next.js App Router for managing educational content, user interactions, and AI-powered features. This document details all available endpoints, request/response formats, authentication, and integration patterns.

## Table of Contents
- [Authentication](#authentication)
- [Core Endpoints](#core-endpoints)
- [AI-Powered Endpoints](#ai-powered-endpoints)
- [Real-time Features](#real-time-features)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Integration Examples](#integration-examples)

## Authentication

### JWT Token Management
All API endpoints (except public ones) require authentication via JWT tokens stored in secure HTTP-only cookies.

```typescript
// Authentication middleware
export async function authenticateUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const payload = await verifyJWT(token);
    return payload.userId;
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
```

### Session Management
```typescript
// Login endpoint
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expiresAt": "2024-01-15T10:30:00Z"
}
```

## Core Endpoints

### Notes Management

#### Create Note
```http
POST /api/notes
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "title": "Advanced Calculus",
  "content": "Detailed notes about derivatives and integrals...",
  "subject": "Mathematics",
  "tags": ["calculus", "derivatives", "integrals"],
  "visibility": "private"
}
```

**Response:**
```json
{
  "id": "note_456",
  "title": "Advanced Calculus",
  "content": "Detailed notes about derivatives and integrals...",
  "subject": "Mathematics",
  "tags": ["calculus", "derivatives", "integrals"],
  "visibility": "private",
  "createdAt": "2024-01-10T14:30:00Z",
  "updatedAt": "2024-01-10T14:30:00Z",
  "userId": "user_123"
}
```

#### List Notes
```http
GET /api/notes?page=1&limit=20&subject=Mathematics&search=calculus
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "notes": [
    {
      "id": "note_456",
      "title": "Advanced Calculus",
      "subject": "Mathematics",
      "tags": ["calculus", "derivatives"],
      "createdAt": "2024-01-10T14:30:00Z",
      "preview": "Detailed notes about derivatives..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 97,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

#### Update Note
```http
PUT /api/notes/[noteId]
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "title": "Advanced Calculus - Updated",
  "content": "Updated content with new examples...",
  "tags": ["calculus", "derivatives", "integrals", "examples"]
}
```

#### Delete Note
```http
DELETE /api/notes/[noteId]
Authorization: Bearer <jwt-token>
```

### Flashcards Management

#### Generate Flashcards from Notes
```http
POST /api/flashcards/generate
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "noteId": "note_456",
  "count": 10,
  "difficulty": "medium",
  "includeImages": false
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "id": "flashcard_789",
      "question": "What is the derivative of x²?",
      "answer": "2x",
      "difficulty": "medium",
      "tags": ["derivatives", "calculus"],
      "noteId": "note_456"
    }
  ],
  "generatedCount": 10,
  "processingTime": "2.3s"
}
```

#### Study Flashcards
```http
GET /api/flashcards/study?subject=Mathematics&difficulty=medium&limit=5
Authorization: Bearer <jwt-token>
```

#### Update Flashcard Performance
```http
POST /api/flashcards/[flashcardId]/performance
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "correct": true,
  "responseTime": 4500,
  "difficulty": "easy",
  "confidence": 0.8
}
```

### Quiz System

#### Create Quiz
```http
POST /api/quizzes
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "title": "Calculus Fundamentals",
  "subject": "Mathematics",
  "difficulty": "medium",
  "timeLimit": 1800,
  "questions": [
    {
      "question": "What is the derivative of sin(x)?",
      "type": "multiple-choice",
      "options": ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      "correctAnswer": 0,
      "explanation": "The derivative of sin(x) is cos(x)"
    }
  ]
}
```

#### Take Quiz
```http
POST /api/quizzes/[quizId]/attempt
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "answers": [0, 2, 1, 3],
  "timeSpent": 1200,
  "startedAt": "2024-01-10T15:00:00Z",
  "completedAt": "2024-01-10T15:20:00Z"
}
```

**Response:**
```json
{
  "attemptId": "attempt_321",
  "score": 85,
  "correctAnswers": 17,
  "totalQuestions": 20,
  "timeSpent": 1200,
  "feedback": [
    {
      "questionId": "q_1",
      "correct": true,
      "userAnswer": 0,
      "correctAnswer": 0,
      "explanation": "Correct! The derivative of sin(x) is cos(x)"
    }
  ],
  "recommendations": [
    "Review integration by parts",
    "Practice more derivative problems"
  ]
}
```

### Task Management

#### Create Task
```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "title": "Complete Calculus Assignment",
  "description": "Solve problems 1-15 from chapter 4",
  "priority": "high",
  "dueDate": "2024-01-15T23:59:59Z",
  "subject": "Mathematics",
  "estimatedTime": 120,
  "tags": ["assignment", "calculus"]
}
```

#### Update Task Status
```http
PATCH /api/tasks/[taskId]
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "status": "completed",
  "actualTime": 135,
  "notes": "Completed all problems successfully"
}
```

#### Get Task Analytics
```http
GET /api/tasks/analytics?period=week&subject=Mathematics
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "totalTasks": 25,
  "completedTasks": 18,
  "completionRate": 0.72,
  "averageTime": 142,
  "productivityTrend": "increasing",
  "subjectBreakdown": {
    "Mathematics": 10,
    "Physics": 8,
    "Chemistry": 7
  },
  "upcomingDeadlines": [
    {
      "taskId": "task_123",
      "title": "Physics Lab Report",
      "dueDate": "2024-01-12T23:59:59Z",
      "priority": "high"
    }
  ]
}
```

## AI-Powered Endpoints

### Chat with Study Buddy
```http
POST /api/chats
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "message": "Explain the concept of derivatives in simple terms",
  "context": {
    "subject": "Mathematics",
    "currentTopic": "Calculus",
    "userLevel": "intermediate"
  },
  "sessionId": "chat_session_456"
}
```

**Response:**
```json
{
  "response": "A derivative measures how a function changes as its input changes. Think of it as the slope of a curve at any given point...",
  "suggestedFollowUps": [
    "Can you show me an example?",
    "How do I calculate derivatives?",
    "What are derivatives used for?"
  ],
  "relatedConcepts": ["limits", "tangent lines", "rate of change"],
  "confidence": 0.92,
  "processingTime": 1.2
}
```

### Content Enhancement
```http
POST /api/ai/enhance-content
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "content": "Basic notes about photosynthesis",
  "contentType": "notes",
  "enhancementType": "expand",
  "targetLevel": "advanced",
  "includeExamples": true
}
```

### Generate Study Plan
```http
POST /api/ai/study-plan
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "subjects": ["Mathematics", "Physics"],
  "availableTime": 20,
  "timeUnit": "hours",
  "period": "week",
  "goals": ["Improve calculus understanding", "Prepare for physics exam"],
  "currentLevel": "intermediate"
}
```

**Response:**
```json
{
  "studyPlan": {
    "totalHours": 20,
    "weeklySchedule": {
      "Monday": [
        {
          "subject": "Mathematics",
          "topic": "Derivatives",
          "duration": 90,
          "activities": ["Review notes", "Practice problems", "Create flashcards"]
        }
      ]
    },
    "milestones": [
      {
        "week": 1,
        "goal": "Master basic derivatives",
        "assessments": ["Quiz on derivative rules"]
      }
    ],
    "adaptiveAdjustments": true
  }
}
```

## Real-time Features

### WebSocket Connections
Study Sphere uses WebSocket connections for real-time features like live study sessions and collaborative notes.

```javascript
// Client-side WebSocket connection
const ws = new WebSocket('wss://api.studysphere.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'study_session_update':
      updateStudySessionUI(data.payload);
      break;
    case 'collaborative_edit':
      applyCollaborativeEdit(data.payload);
      break;
    case 'ai_suggestion':
      displayAISuggestion(data.payload);
      break;
  }
};
```

### Live Study Sessions
```http
POST /api/study-sessions
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "type": "collaborative",
  "subject": "Mathematics",
  "maxParticipants": 5,
  "duration": 3600,
  "materials": ["note_456", "quiz_789"]
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2024-01-10T14:30:00Z",
    "requestId": "req_12345"
  }
}
```

### Error Codes
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server-side error
- `AI_SERVICE_UNAVAILABLE`: AI service temporarily unavailable

## Rate Limiting

### Default Limits
- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **AI endpoints**: 50 requests per hour per user
- **File uploads**: 10 uploads per hour per user

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641811200
X-RateLimit-Retry-After: 3600
```

## Integration Examples

### React Hook for API Integration
```typescript
import { useState, useEffect } from 'react';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/notes?${queryParams}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      setNotes(data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      const newNote = await response.json();
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    refetch: fetchNotes
  };
}
```

### Python SDK Example
```python
import requests
from typing import Dict, List, Optional

class StudySphereAPI:
    def __init__(self, base_url: str, auth_token: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json'
        })
    
    def create_note(self, title: str, content: str, subject: str, tags: List[str] = None) -> Dict:
        """Create a new note"""
        payload = {
            'title': title,
            'content': content,
            'subject': subject,
            'tags': tags or []
        }
        
        response = self.session.post(f'{self.base_url}/api/notes', json=payload)
        response.raise_for_status()
        return response.json()
    
    def generate_flashcards(self, note_id: str, count: int = 10, difficulty: str = 'medium') -> Dict:
        """Generate flashcards from a note"""
        payload = {
            'noteId': note_id,
            'count': count,
            'difficulty': difficulty
        }
        
        response = self.session.post(f'{self.base_url}/api/flashcards/generate', json=payload)
        response.raise_for_status()
        return response.json()
    
    def chat_with_ai(self, message: str, context: Dict = None) -> Dict:
        """Chat with the AI study buddy"""
        payload = {
            'message': message,
            'context': context or {}
        }
        
        response = self.session.post(f'{self.base_url}/api/chats', json=payload)
        response.raise_for_status()
        return response.json()

# Usage example
api = StudySphereAPI('https://api.studysphere.com', 'your-auth-token')

# Create a note
note = api.create_note(
    title='Quantum Mechanics Basics',
    content='Introduction to quantum mechanics principles...',
    subject='Physics',
    tags=['quantum', 'physics', 'fundamentals']
)

# Generate flashcards from the note
flashcards = api.generate_flashcards(note['id'], count=15, difficulty='medium')

# Chat with AI about the topic
response = api.chat_with_ai(
    'Explain quantum superposition in simple terms',
    context={'subject': 'Physics', 'currentTopic': 'Quantum Mechanics'}
)
```

## Testing the API

### Using curl
```bash
# Login
curl -X POST https://api.studysphere.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Create a note (using saved cookies)
curl -X POST https://api.studysphere.com/api/notes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Test Note",
    "content": "This is a test note content",
    "subject": "Computer Science",
    "tags": ["test", "api"]
  }'

# Get notes
curl -X GET "https://api.studysphere.com/api/notes?page=1&limit=10" \
  -b cookies.txt
```

### Postman Collection
A comprehensive Postman collection is available for testing all API endpoints. The collection includes:
- Environment variables for different deployment stages
- Pre-request scripts for authentication
- Test scripts for response validation
- Example requests with sample data

## API Versioning

Study Sphere API uses URL versioning:
- Current version: `v1` (default, no version prefix required)
- Future versions: `/api/v2/notes`, `/api/v3/notes`, etc.

### Backward Compatibility
- API v1 will be supported for at least 12 months after v2 release
- Deprecation warnings will be included in response headers
- Migration guides will be provided for breaking changes

## Security Considerations

### Request Validation
- All inputs are validated and sanitized
- SQL injection protection via parameterized queries
- XSS prevention through output encoding
- CSRF protection via SameSite cookies

### Data Privacy
- Personal data encryption at rest
- Secure data transmission via HTTPS
- GDPR compliance for EU users
- User data export and deletion capabilities

## Performance Optimization

### Caching Strategy
- Redis caching for frequently accessed data
- CDN caching for static assets
- Browser caching headers for API responses
- Database query optimization with indexes

### Monitoring
- API response time monitoring
- Error rate tracking
- Usage analytics and insights
- Performance alerting thresholds

This comprehensive API documentation provides developers with all the information needed to integrate with Study Sphere's backend services effectively.
