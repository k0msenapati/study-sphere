# Quiz System Setup Guide

## API Key Configuration

To enable AI-powered quiz generation, you need to set up a Groq API key:

1. **Get a Groq API Key:**
   - Go to https://console.groq.com/keys
   - Sign up or log in to your account
   - Create a new API key

2. **Add the API Key to Environment:**
   - Create a `.env.local` file in the root directory
   - Add your API key:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

## Features

### ✅ Subject-wise Organization
- Quizzes are organized by subjects (Math, Science, History, Language, Computer Science)
- Each subject has multiple topics
- Filter quizzes by subject and topic

### ✅ Difficulty Levels
- **Beginner (🌱)**: Basic concepts and fundamentals
- **Intermediate (🎯)**: Moderate complexity
- **Advanced (🧠)**: Complex topics and advanced concepts

### ✅ Bookmark System
- Click the bookmark icon to save quizzes for later
- Filter to show only bookmarked quizzes
- Bookmarks persist across sessions

### ✅ Completion Tracking
- Track your quiz completion status
- View scores and percentages
- Filter to show completed quizzes

### ✅ AI Quiz Generation
- Generate quizzes from your study material
- AI analyzes your content and creates relevant questions
- Fallback to sample questions if AI is unavailable

## Sample Quizzes

The system includes sample quizzes to get you started:
- **Basic Algebra Quiz** (Beginner level)
- **Physics Fundamentals** (Intermediate level)

## Data Persistence

- Quizzes are saved to localStorage
- Bookmarks and completion status persist
- Data survives page refreshes and browser restarts

## Troubleshooting

### API Key Issues
If you see "Invalid API Key" errors:
1. Check that your `.env.local` file exists
2. Verify the API key is correct
3. Restart the development server

### Quiz Generation Issues
If AI generation fails:
- The system will fall back to sample questions based on your study material
- Check the console for detailed error messages

### Data Loss
If quizzes disappear:
- Check browser localStorage settings
- Ensure you're not in incognito/private mode
- Try refreshing the page 