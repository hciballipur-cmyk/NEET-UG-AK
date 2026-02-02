
import React, { useState, useEffect } from 'react';
import { QuizState, Question, Subject } from '../types';

interface QuizViewProps {
  questions: Question[];
  subject: Subject;
  onFinish: (state: QuizState) => void;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, subject, onFinish, onExit }) => {
  const [state, setState] = useState<QuizState>({
    id: Math.random().toString(36).substr(2, 9),
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    isComplete: false,
    startTime: Date.now(),
    subject,
    type: questions[0].type
  });

  const [timeLeft, setTimeLeft] = useState(questions.length * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (idx: number) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentIndex] = idx;
    setState({ ...state, answers: newAnswers });
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const currentQ = state.questions[state.currentIndex];
  
  const subjectColors = {
    [Subject.BIOLOGY]: 'text-emerald-600 border-emerald-500',
    [Subject.PHYSICS]: 'text-indigo-600 border-indigo-500',
    [Subject.CHEMISTRY]: 'text-amber-600 border-amber-500'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row gap-6 p-4 md:p-6 font-sans">
      {/* Question Panel */}
      <div className="flex-1 flex flex-col gap-6">
        <header className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">✕</button>
            <h1 className="font-bold text-slate-700 hidden sm:block">NEET Official Mock Mode</h1>
          </div>
          <div className={`px-4 py-2 rounded-xl font-mono text-lg font-bold bg-slate-900 text-white`}>
            {formatTime(timeLeft)}
          </div>
        </header>

        <main className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 flex-1 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <span className={`text-xs font-bold uppercase tracking-widest ${subjectColors[subject]}`}>
              Q{state.currentIndex + 1} • {currentQ.chapter}
            </span>
            {currentQ.year && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">NEET {currentQ.year}</span>}
          </div>

          <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8">
            {currentQ.question}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  state.answers[state.currentIndex] === i 
                  ? 'border-slate-800 bg-slate-900 text-white shadow-lg' 
                  : 'border-slate-100 hover:border-slate-300 bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                   state.answers[state.currentIndex] === i ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-medium">{opt}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 flex justify-between pt-8 border-t border-slate-100">
            <button 
              disabled={state.currentIndex === 0}
              onClick={() => setState({...state, currentIndex: state.currentIndex - 1})}
              className="px-6 py-2 font-bold text-slate-400 disabled:opacity-30"
            >
              ← Back
            </button>
            <button 
              onClick={() => {
                if (state.currentIndex === questions.length - 1) onFinish({...state, isComplete: true, endTime: Date.now()});
                else setState({...state, currentIndex: state.currentIndex + 1});
              }}
              className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-bold hover:bg-slate-800"
            >
              {state.currentIndex === questions.length - 1 ? 'Final Submit' : 'Next Question →'}
            </button>
          </div>
        </main>
      </div>

      {/* Navigation Grid (Sidebar) */}
      <aside className="w-full md:w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Question Palette</h3>
        <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[400px] md:max-h-none pr-2">
          {state.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setState({...state, currentIndex: i})}
              className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                state.currentIndex === i ? 'ring-2 ring-slate-800 ring-offset-2' : ''
              } ${
                state.answers[i] !== null ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div> Attempted
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="w-3 h-3 rounded-sm bg-slate-100"></div> Unattempted
          </div>
        </div>
      </aside>
    </div>
  );
};

export default QuizView;
