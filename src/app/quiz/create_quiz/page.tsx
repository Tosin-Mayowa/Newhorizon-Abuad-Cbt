'use client';
import React, { useState, useMemo } from 'react';

// --- Type Definitions (placed here since we removed firebase.ts) ---
interface AnswerOption {
    text: string;
    isCorrect: boolean;
}

interface QuizQuestion {
    id: string;
    questionText: string;
    timeLimitSeconds: number;
    answerOptions: AnswerOption[];
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    createdBy: string; 
    createdAt: number;
}
// --- End Type Definitions ---

// Helper function to save quiz data to Local Storage
const saveQuizToLocalStorage = (quiz: Quiz) => {
    try {
        const quizzesJson = localStorage.getItem('quizzes') || '{}';
        const quizzes: { [key: string]: Quiz } = JSON.parse(quizzesJson);
        quizzes[quiz.id] = quiz;
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        return true;
    } catch (e) {
        console.error("Error saving to local storage:", e);
        return false;
    }
};

// Helper component for creating a single question
const QuestionForm = ({ question, index, updateQuestion, removeQuestion }: { question: QuizQuestion; index: number; updateQuestion: (id: string, updates: Partial<QuizQuestion>) => void; removeQuestion: (id: string) => void }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg justify-center border border-gray-100 space-y-4">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h3 className="text-xl font-bold text-indigo-700">Question {index + 1}</h3>
        <button
          type="button"
          onClick={() => removeQuestion(question.id)}
          className="text-red-500 hover:text-red-700 font-medium transition duration-150"
        >
          Remove
        </button>
      </div>

      {/* Question Text */}
      <label htmlFor={`qText-${question.id}`} className="block text-sm font-medium text-gray-700">Question Text</label>
      <input
        id={`qText-${question.id}`}
        type="text"
        required
        value={question.questionText}
        onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
        placeholder="Enter the question here"
      />

      {/* Time Limit */}
      <label htmlFor={`qTime-${question.id}`} className="block text-sm font-medium text-gray-700 pt-2">Time Limit (Seconds)</label>
      <input
        id={`qTime-${question.id}`}
        type="number"
        required
        value={question.timeLimitSeconds}
        onChange={(e) => updateQuestion(question.id, { timeLimitSeconds: parseInt(e.target.value) || 0 })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
        min="5"
        max="300"
      />

      {/* Answer Options */}
      <h4 className="text-lg font-semibold text-gray-800 pt-4">Answer Options (Select the correct one)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.answerOptions.map((option, optIndex) => (
          <div key={optIndex} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border">
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={() => {
                // Ensure only one option is correct
                const newOptions = question.answerOptions.map((opt, i) => ({
                  ...opt,
                  isCorrect: i === optIndex,
                }));
                updateQuestion(question.id, { answerOptions: newOptions });
              }}
              className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              title={`Mark option ${optIndex + 1} as correct`}
              placeholder={`Mark option ${optIndex + 1} as correct`}
            />
            <input
              type="text"
              required
              value={option.text}
              onChange={(e) => {
                const newOptions = [...question.answerOptions];
                newOptions[optIndex].text = e.target.value;
                updateQuestion(question.id, { answerOptions: newOptions });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm text-sm"
              placeholder={`Option ${optIndex + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [quizLink, setQuizLink] = useState('');

  // Quiz Validation
  const isQuizValid = useMemo(() => {
    if (!title.trim() || !description.trim() || questions.length === 0) return false;
    
    // Check every question has text, a time limit, and exactly one correct answer
    return questions.every(q => 
        q.questionText.trim() && 
        q.timeLimitSeconds > 0 &&
        q.answerOptions.filter(opt => opt.isCorrect).length === 1 &&
        q.answerOptions.every(opt => opt.text.trim()) // All options must have text
    );
  }, [title, description, questions]);

  // Handlers
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      questionText: '',
      timeLimitSeconds: 60, // Default 60 seconds
      answerOptions: [
        { text: '', isCorrect: true }, // Default first option as correct
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates as QuizQuestion } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isQuizValid || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    setQuizLink('');

    const newQuizId = crypto.randomUUID();
    const newQuiz: Quiz = {
      id: newQuizId,
      title,
      description,
      questions,
      createdBy: "StaffUser", // Placeholder for staff ID
      createdAt: Date.now(),
    };

    const success = saveQuizToLocalStorage(newQuiz);

    if (success) {
      setMessage(`Quiz "${title}" created and saved successfully!`);
      setQuizLink(`/quiz/take/${newQuizId}`);
      
      // Clear form
      setTitle('');
      setDescription('');
      setQuestions([]);
    } else {
      setMessage('Failed to save quiz. Local storage might be full or unavailable.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Create New Test</h1>
      <p className="text-gray-500 mb-8">Design a new CBT test for students.</p>

      {message && (
        <div className={`p-4 mb-6 text-sm ${quizLink ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-lg`} role="alert">
          <p className="font-semibold">{message}</p>
          {quizLink && (
            <p className="mt-2">
              Share this link with students: 
              <a href={quizLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-bold ml-2 underline break-words">
                {window.location.origin + quizLink}
              </a>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        
        {/* Quiz Metadata */}
        <div className="p-6 bg-white rounded-2xl shadow-xl space-y-4">
          <h2 className="text-2xl font-bold text-indigo-700 border-b pb-3">Test Details</h2>
          <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-700">Quiz Title</label>
          <input
            id="quizTitle"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
            placeholder="e.g., Q4 Mathematics Assessment"
          />

          <label htmlFor="quizDesc" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="quizDesc"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm resize-none"
            placeholder="Briefly describe the test content and duration."
            rows={3}
          />
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-indigo-700 border-b pb-3">Test Questions ({questions.length})</h2>
          {questions.map((q, index) => (
            <QuestionForm
              key={q.id}
              question={q}
              index={index}
              updateQuestion={updateQuestion}
              removeQuestion={removeQuestion}
            />
          ))}
          
          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition duration-200"
          >
            + Add New Question
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isQuizValid || isSubmitting}
          className={`w-full py-4 font-extrabold rounded-lg shadow-xl transition duration-300 ${
            isQuizValid && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Saving Quiz...' : 'Finalize and Publish Test'}
        </button>
      </form>
    </div>
  );
}