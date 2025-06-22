// Inside your QuizProvider component

const [quizzes, setQuizzes] = useState<QuizType[]>([]);

// Add this method
const addQuiz = (quiz: QuizType) => {
  setQuizzes((prev) => [...prev, quiz]);
};

// Pass `addQuiz` into the context value
<QuizContext.Provider value={{ quizzes, addQuiz, ...otherFunctions }}>
