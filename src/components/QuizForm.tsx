// src/components/QuizForm.tsx
'use client';

import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

export default function QuizForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctIndex: 0 },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[index].question = value;
    } else {
      updated[index].options = [...updated[index].options];
      updated[index].options[field] = value;
    }
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quiz = {
      id: uuid(),
      title,
      category,
      questions,
    };
    onSubmit(quiz);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Quiz Title"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        className="border p-2 w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      {questions.map((q, idx) => (
        <div key={idx} className="border p-4">
          <input
            type="text"
            placeholder="Question"
            className="border p-2 w-full mb-2"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(idx, 'question', e.target.value)
            }
            required
          />
          {q.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              className="border p-2 w-full mb-1"
              value={opt}
              onChange={(e) =>
                handleQuestionChange(idx, i, e.target.value)
              }
              required
            />
          ))}
        </div>
      ))}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Quiz
      </button>
    </form>
  );
}
