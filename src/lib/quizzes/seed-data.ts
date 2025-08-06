import { db } from '@/lib/db'
import { quizSubjects, quizTopics } from '@/lib/db/schema'

export async function seedQuizData() {
  try {
    // Insert default subjects
    const subjects = [
      {
        id: "math",
        name: "Mathematics",
        description: "Algebra, Calculus, Geometry, and more",
        color: "#3B82F6",
        icon: "📐",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "science",
        name: "Science",
        description: "Physics, Chemistry, Biology, and more",
        color: "#10B981",
        icon: "🔬",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "history",
        name: "History",
        description: "World History, Ancient Civilizations, and more",
        color: "#F59E0B",
        icon: "📚",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "language",
        name: "Language",
        description: "English, Literature, Grammar, and more",
        color: "#8B5CF6",
        icon: "📝",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "computer-science",
        name: "Computer Science",
        description: "Programming, Algorithms, Data Structures, and more",
        color: "#EF4444",
        icon: "💻",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Insert default topics
    const topics = [
      // Math topics
      { id: "algebra", subjectId: "math", name: "Algebra", description: "Linear equations, polynomials, functions", createdAt: new Date(), updatedAt: new Date() },
      { id: "calculus", subjectId: "math", name: "Calculus", description: "Derivatives, integrals, limits", createdAt: new Date(), updatedAt: new Date() },
      { id: "geometry", subjectId: "math", name: "Geometry", description: "Shapes, angles, theorems", createdAt: new Date(), updatedAt: new Date() },
      
      // Science topics
      { id: "physics", subjectId: "science", name: "Physics", description: "Mechanics, thermodynamics, waves", createdAt: new Date(), updatedAt: new Date() },
      { id: "chemistry", subjectId: "science", name: "Chemistry", description: "Atoms, molecules, reactions", createdAt: new Date(), updatedAt: new Date() },
      { id: "biology", subjectId: "science", name: "Biology", description: "Cells, genetics, evolution", createdAt: new Date(), updatedAt: new Date() },
      
      // History topics
      { id: "ancient-history", subjectId: "history", name: "Ancient History", description: "Egypt, Greece, Rome", createdAt: new Date(), updatedAt: new Date() },
      { id: "modern-history", subjectId: "history", name: "Modern History", description: "World Wars, Cold War", createdAt: new Date(), updatedAt: new Date() },
      
      // Language topics
      { id: "grammar", subjectId: "language", name: "Grammar", description: "Parts of speech, sentence structure", createdAt: new Date(), updatedAt: new Date() },
      { id: "literature", subjectId: "language", name: "Literature", description: "Poetry, novels, drama", createdAt: new Date(), updatedAt: new Date() },
      
      // Computer Science topics
      { id: "programming", subjectId: "computer-science", name: "Programming", description: "Coding, algorithms, data structures", createdAt: new Date(), updatedAt: new Date() },
      { id: "web-development", subjectId: "computer-science", name: "Web Development", description: "HTML, CSS, JavaScript", createdAt: new Date(), updatedAt: new Date() },
    ]

    // Insert subjects
    for (const subject of subjects) {
      await db.insert(quizSubjects).values(subject).onConflictDoNothing()
    }

    // Insert topics
    for (const topic of topics) {
      await db.insert(quizTopics).values(topic).onConflictDoNothing()
    }

    console.log('✅ Quiz seed data inserted successfully')
  } catch (error) {
    console.error('❌ Error seeding quiz data:', error)
  }
} 