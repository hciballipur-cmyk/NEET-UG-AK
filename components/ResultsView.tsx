
import React from 'react';
import { QuizState } from '../types';

interface ResultsViewProps {
  state: QuizState;
  onHome: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ state, onHome }) => {
  const score = state.answers.reduce((acc, ans, idx) => {
    return ans === state.questions[idx].correctAnswer ? acc + 4 : (ans === null ? acc : acc - 1);
  }, 0);

  const correctCount = state.answers.filter((ans, idx) => ans === state.questions[idx].correctAnswer).length;
  const attemptedCount = state.answers.filter(ans => ans !== null).length;
  const totalMarks = state.questions.length * 4;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Test Result</h1>
        <p className="text-slate-500 mb-8">Performance analysis for NEET Bio Practice</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-700">{score}/{totalMarks}</div>
            <div className="text-xs text-emerald-600 uppercase font-bold tracking-wider">Score</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-700">{Math.round((correctCount / state.questions.length) * 100)}%</div>
            <div className="text-xs text-blue-600 uppercase font-bold tracking-wider">Accuracy</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-2xl font-bold text-slate-700">{attemptedCount}</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Attempted</div>
          </div>
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
            <div className="text-2xl font-bold text-red-700">{attemptedCount - correctCount}</div>
            <div className="text-xs text-red-500 uppercase font-bold tracking-wider">Incorrect</div>
          </div>
        </div>

        <button 
          onClick={onHome}
          className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold px-2">Answer Key & NCERT References</h3>
        {state.questions.map((q, idx) => {
          const isCorrect = state.answers[idx] === q.correctAnswer;
          const isUnattempted = state.answers[idx] === null;
          
          return (
            <div key={idx} className={`bg-white p-6 rounded-2xl border ${isCorrect ? 'border-emerald-100' : isUnattempted ? 'border-slate-100' : 'border-red-100'} shadow-sm`}>
              <div className="flex gap-4 items-start mb-4">
                <span className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-600' : isUnattempted ? 'bg-slate-100 text-slate-400' : 'bg-red-100 text-red-600'}`}>
                  {idx + 1}
                </span>
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded">{q.chapter}</span>
                    {q.year && <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-1.5 py-0.5 rounded">NEET {q.year}</span>}
                  </div>
                  <p className="text-slate-800 font-medium">{q.question}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pl-12">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`p-3 rounded-lg text-sm border ${
                    oIdx === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' :
                    oIdx === state.answers[idx] ? 'bg-red-50 border-red-200 text-red-800' :
                    'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    {String.fromCharCode(65+oIdx)}. {opt}
                  </div>
                ))}
              </div>

              <div className="pl-12 bg-slate-50 p-4 rounded-xl">
                <div className="text-xs font-bold text-emerald-600 uppercase mb-1">NCERT Reference: {q.ncertReference}</div>
                <p className="text-sm text-slate-600 leading-relaxed italic">“{q.explanation}”</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsView;
