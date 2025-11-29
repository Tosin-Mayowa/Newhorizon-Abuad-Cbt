'use client';
import React, { useState, useEffect, useCallback } from 'react';

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

// Helper function to load quiz data from Local Storage
const getQuizByIdFromLocalStorage = (quizId: string): Quiz | null => {
    if (typeof window === 'undefined') return null; // Avoid running on server side
    try {
        const quizzesJson = localStorage.getItem('quizzes');
        if (!quizzesJson) return null;
        const quizzes: { [key: string]: Quiz } = JSON.parse(quizzesJson);
        return quizzes[quizId] || null;
    } catch (e) {
        console.error("Error loading from local storage:", e);
        return null;
    }
};

// Helper component for displaying messages/results
const MessageCard = ({ title, message, buttonText, onButtonClick, score, total }: { title: string; message: string; buttonText?: string; onButtonClick?: () => void; score?: number; total?: number }) => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl text-center">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">{title}</h1>
      <p className="text-lg text-gray-700 mb-8">{message}</p>
      
      {score !== undefined && total !== undefined && (
          <div className="w-32 h-32 mb-8 mx-auto flex items-center justify-center rounded-full bg-indigo-100 border-4 border-indigo-600">
              <span className="text-5xl font-extrabold text-indigo-600">
                  {Math.round((score / total) * 100)}%
              </span>
          </div>
      )}

      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

// Main Quiz Component
export default function TakeQuizPage({ params }: { params?: { quizId?: string } }) { // Safely define params with optional properties
  // Safely destructure quizId, falling back to a dummy value if params is missing.
  const quizId = params?.quizId; 
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<'loading' | 'active' | 'finished' | 'error'>('loading');
  
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const [timeLeft, setTimeLeft] = useState(0);

  // 1. Fetch Quiz Data
  useEffect(() => {
    if (!quizId) {
      setQuizState('error');
      // Early exit if quizId is not available
      return; 
    }
    
    // Use a short delay to ensure local storage is accessible
    const timer = setTimeout(() => {
        const loadedQuiz = getQuizByIdFromLocalStorage(quizId as string);
        if (loadedQuiz && loadedQuiz.questions.length > 0) {
            setQuiz(loadedQuiz);
            setQuizState('active');
            setTimeLeft(loadedQuiz.questions[0].timeLimitSeconds);
        } else {
            setQuizState('error');
        }
    }, 100);

    return () => clearTimeout(timer);
  }, [quizId]);

  // 2. Handle Answer Submission
  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setScore(s => s + 1);
    }

    const nextIndex = currentQuestionIndex + 1;
    if (quiz && nextIndex < quiz.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      // Reset timer for the next question
      setTimeLeft(quiz.questions[nextIndex].timeLimitSeconds);
    } else {
      setQuizState('finished');
    }
  }, [currentQuestionIndex, quiz]);

  // 3. Handle Timer Logic
  useEffect(() => {
    if (quizState !== 'active' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Auto-move to next question if time runs out
          handleAnswer(false); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, [quizState, timeLeft, handleAnswer]);


  // --- Render Logic ---

  if (quizState === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-600">Searching for Test ID: {quizId || '...'}...</div>
      </div>
    );
  }

  if (quizState === 'error' || !quiz) {
    return (
      <div className="p-4 md:p-8 min-h-screen flex justify-center items-center bg-gray-100">
        <MessageCard 
          title="Test Not Found" 
          message={`Could not load the specified quiz (ID: ${quizId || 'N/A'}). Ensure the staff member has saved the test in this browser.`}
          buttonText="Go to Home Page"
          onButtonClick={() => window.location.href = '/'} 
          score={undefined}
          total={undefined}
        />
      </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="p-4 md:p-8 min-h-screen flex justify-center items-center bg-gray-100">
        <MessageCard 
          title="Congratulations!" 
          message={`You have completed the test "${quiz.title}"!`}
          score={score}
          total={quiz.questions.length}
          buttonText="Start Over"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }

  // Active Quiz Display
  const progressPercent = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const timerColor = timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="p-4 md:p-8 min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-2xl">
        
        {/* Quiz Header & Timer */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-indigo-700 truncate">{quiz.title}</h2>
          <div className="flex items-center space-x-2 text-lg font-bold text-gray-700">
            <svg className={`w-6 h-6 ${timerColor.replace('bg-', 'text-')}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className={timerColor.replace('bg-', 'text-')}>{timeLeft}s</span>
          </div>
        </div>

        {/* Question Status */}
        <div className="mb-8">
          <div className="text-lg font-medium text-gray-500 mb-2">
            Question {currentQuestionIndex + 1} / {quiz.questions.length}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
            <div 
              className="h-2 bg-indigo-600 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          {/* Question Text */}
          {currentQuestion ? (
            <div className="text-xl md:text-2xl font-semibold text-gray-800 p-4 bg-indigo-50 rounded-lg">
              {currentQuestion.questionText}
            </div>
          ) : (
            <div className="text-xl md:text-2xl font-semibold text-gray-800 p-4 bg-indigo-50 rounded-lg">
              Loading question...
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion ? currentQuestion.answerOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.isCorrect)}
              className="w-full text-left p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-500 transition duration-150 shadow-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {option.text}
            </button>
          )) : null}
        </div>
      </div>
    </div>
  );
}