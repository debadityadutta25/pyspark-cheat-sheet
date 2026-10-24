import React, { useState } from 'react';
import { PYSPARK_QUIZ_QUESTIONS, QuizQuestion } from '../data/pysparkData';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  HelpCircle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    PYSPARK_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const totalQuestions = PYSPARK_QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = calculateScore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Quiz Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interactive PySpark Assessment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Test Your PySpark Mastery
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Reinforce your knowledge of Lazy Evaluation, Narrow vs Wide Shuffles, Catalyst Optimizer, and DataFrame API best practices.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-300">
          Answered <strong className="text-orange-400">{answeredCount}</strong> of {totalQuestions} questions
        </div>

        {submitted ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-sm font-bold text-white bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Score: {score} / {totalQuestions} ({Math.round((score / totalQuestions) * 100)}%)</span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={answeredCount < totalQuestions}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              answeredCount === totalQuestions
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Submit & View Explanations
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {PYSPARK_QUIZ_QUESTIONS.map((question, qIdx) => {
          const userAnswer = selectedAnswers[question.id];
          const isCorrect = userAnswer === question.correctIndex;

          return (
            <div
              key={question.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/15 border-emerald-500/40'
                    : 'bg-rose-950/15 border-rose-500/40'
                  : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <div className="flex items-start space-x-3 mb-4">
                <span className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  {question.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5 ml-0 sm:ml-9">
                {question.options.map((opt, optIdx) => {
                  let optStyle = 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700';

                  if (userAnswer === optIdx) {
                    optStyle = 'bg-orange-500/10 border-orange-500 text-orange-300 font-medium';
                  }

                  if (submitted) {
                    if (optIdx === question.correctIndex) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-medium';
                    } else if (userAnswer === optIdx) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    } else {
                      optStyle = 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(question.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === question.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {submitted && userAnswer === optIdx && optIdx !== question.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation upon submission */}
              {submitted && (
                <div className="mt-4 pt-4 border-t border-zinc-800/80 ml-0 sm:ml-9 text-xs leading-relaxed text-zinc-300 bg-zinc-950/60 p-3.5 rounded-xl">
                  <div className="flex items-center space-x-1.5 font-semibold mb-1 text-orange-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
