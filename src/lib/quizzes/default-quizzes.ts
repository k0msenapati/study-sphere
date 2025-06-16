import { Quiz } from "./types"

export const defaultQuizzes: Quiz[] = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    description: "Test your general knowledge with these 5 questions.",
    questions: [
      {
        id: "1",
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctOption: "Paris",
      },
      {
        id: "2",
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctOption: "Mars",
      },
      {
        id: "3",
        question: 'Who wrote "Hamlet"?',
        options: ["William Shakespeare", "Mark Twain", "J.K. Rowling", "Charles Dickens"],
        correctOption: "William Shakespeare",
      },
      {
        id: "4",
        question: "What is the boiling point of water?",
        options: ["90°C", "100°C", "110°C", "120°C"],
        correctOption: "100°C",
      },
      {
        id: "5",
        question: 'Which element has the chemical symbol "O"?',
        options: ["Oxygen", "Gold", "Osmium", "Oganesson"],
        correctOption: "Oxygen",
      },
    ],
  },
  {
    id: "2",
    title: "Science Quiz",
    description: "Test your science knowledge with these 5 questions.",
    questions: [
      {
        id: "1",
        question: "What is the chemical formula for water?",
        options: ["H2O", "O2", "CO2", "H2SO4"],
        correctOption: "H2O",
      },
      {
        id: "2",
        question: "Which planet is closest to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correctOption: "Mercury",
      },
      {
        id: "3",
        question: "What is the speed of light?",
        options: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "100,000 km/s"],
        correctOption: "300,000 km/s",
      },
      {
        id: "4",
        question: "What gas do plants absorb during photosynthesis?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctOption: "Carbon Dioxide",
      },
      {
        id: "5",
        question: "Which part of the human body contains the smallest bones?",
        options: ["Ear", "Hand", "Foot", "Spine"],
        correctOption: "Ear",
      },
    ],
  },
]
