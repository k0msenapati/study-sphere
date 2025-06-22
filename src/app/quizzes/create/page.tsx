// src/app/quizzes/create/page.tsx
'use client';

import React from 'react';
import QuizForm from '@/components/QuizForm';
import { useQuiz } from '@/context/QuizProvider';
import { useRouter } from 'next/navigation';

export default function CreateQuizPage() {
  const { addQuiz } = useQuiz();
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Quiz</h1>
      <QuizForm
        onSubmit={(quizData) => {
          addQuiz(quizData);
          router.push('/quizzes');
        }}
      />
    </div>
  );
}
