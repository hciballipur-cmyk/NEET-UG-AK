
import React, { useState, useEffect } from 'react';
import { NCERT_CHAPTERS } from './constants';
import { TestType, Question, QuizState, Subject, TestResult } from './types';
import { generateQuestions } from './services/geminiService';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import AnalysisView from './components/AnalysisView';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'quiz' | 'results' | 'analysis' | 'chapter-select'>('dashboard');
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.BIOLOGY);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [resultsHistory, setResultsHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('neet_test_history');
    if (saved) setResultsHistory(JSON.parse(saved));
  }, []);

  const saveResult = (state: QuizState) => {
    const correctCount = state.answers.filter((ans, idx) => ans === state.questions[idx].correctAnswer).length;
    const attemptedCount = state.answers.filter(ans => ans !== null).length;
    const totalQuestions = state.questions.length;
    const score = state.answers.reduce((acc, ans, idx) => {
      if (ans === null) return acc;
      return ans === state.questions[idx].correctAnswer ? acc + 4 : acc - 1;
    }, 0);

    const newResult: TestResult = {
      id: state.id,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      subject: state.subject,
      type: state.type,
      score,
      totalQuestions,
      accuracy: Math.round((correctCount / totalQuestions) * 100) || 0,
      timeTaken: '45m', // Simplified for now
      quizState: state
    };

    const updatedHistory = [...resultsHistory, newResult];
    setResultsHistory(updatedHistory);
    localStorage.setItem('neet_test_history', JSON.stringify(updatedHistory));
  };

  const startTest = async (type: TestType, chaptersOverride?: string[]) => {
    setLoading(true);
    try {
      const targetChapters = chaptersOverride || selectedChapters;
      const qs = await generateQuestions(type, currentSubject, targetChapters, 90);
      if (qs.length === 0) throw new Error("Empty questions");
      setQuestions(qs);
      setView('quiz');
    } catch (e) {
      alert("AI generation failed. Please check your API Key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (result: TestResult) => {
    setQuizState(result.quizState);
    setView('results');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <div className="w-20 h-20 border-t-4 border-emerald-500 border-solid rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black mb-2 animate-pulse">GENERATING 90 QUESTIONS</h2>
        <p className="text-slate-400 max-w-xs text-center">Selecting randomized topics from {currentSubject} NCERT for a fresh experience...</p>
      </div>
    );
  }

  const subjectMeta = {
    [Subject.BIOLOGY]: { color: 'emerald', label: 'Biology', icon: '🧬' },
    [Subject.PHYSICS]: { color: 'indigo', label: 'Physics', icon: '⚡' },
    [Subject.CHEMISTRY]: { color: 'amber', label: 'Chemistry', icon: '⚗️' }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="bg-slate-900 text-white p-2 rounded-xl font-black text-xl">NH</div>
            <span className="font-black text-2xl tracking-tighter">NEET<span className="text-slate-400">Hub</span></span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('analysis')} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">History</button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {(Object.values(Subject) as Subject[]).map(sub => (
                 <button 
                  key={sub}
                  onClick={() => setCurrentSubject(sub)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currentSubject === sub ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {sub}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </nav>

      {view === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Welcome Card */}
          <div className={`bg-${subjectMeta[currentSubject].color}-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl`}>
             <div className="relative z-10 max-w-2xl">
                <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">NEET 2025 Target</span>
                <h1 className="text-5xl font-black mb-4 leading-none">Command {subjectMeta[currentSubject].label} <br/>NCERT Today.</h1>
                <p className="text-lg opacity-80 mb-8 font-medium">Infinite variety of tests. AI-powered 90-question full-length mocks. Statement based logic. PYQs from 2010 onwards.</p>
                <div className="flex gap-4">
                  <button onClick={() => startTest(TestType.MIXED)} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl">Start Full {currentSubject} Test</button>
                  <button onClick={() => setView('chapter-select')} className="bg-slate-900/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all">Select Chapters</button>
                </div>
             </div>
             <div className="absolute right-[-10%] bottom-[-10%] opacity-10 text-[300px] leading-none pointer-events-none">{subjectMeta[currentSubject].icon}</div>
          </div>

          {/* Test Modes */}
          <section>
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-slate-900 rounded-full"></span> Special Modules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { type: TestType.STATEMENT_BASED, label: 'NTA Statement Test', desc: 'Focus on Correct/Incorrect logic based on every NCERT line.', icon: '📑' },
                { type: TestType.PYQ, label: 'PYQ Marathon', desc: 'Real previous year questions with original years mentioned.', icon: '⏳' },
                { type: TestType.MIXED, label: 'Mixed Practice', desc: 'Random high-yield topics to test your overall preparedness.', icon: '🌪️' },
                { type: TestType.CHAPTER_WISE, label: 'Chapter Selection', desc: 'Pick specific weak chapters to build mastery.', icon: '🎯' },
              ].map(mode => (
                <div 
                  key={mode.type} 
                  onClick={() => mode.type === TestType.CHAPTER_WISE ? setView('chapter-select') : startTest(mode.type)}
                  className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-400 hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{mode.icon}</div>
                  <h4 className="text-xl font-black mb-2">{mode.label}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{mode.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {view === 'chapter-select' && (
        <div className="max-w-4xl mx-auto p-4 md:p-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-3xl font-black mb-2">Select {subjectMeta[currentSubject].label} Chapters</h2>
            <p className="text-slate-500 mb-8">Choose one or more chapters to generate a customized 90-question mock test.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
              {NCERT_CHAPTERS.filter(c => c.subject === currentSubject).map(chapter => {
                const isSelected = selectedChapters.includes(chapter.name);
                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setSelectedChapters(prev => isSelected ? prev.filter(n => n !== chapter.name) : [...prev, chapter.name]);
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      isSelected ? 'border-slate-800 bg-slate-50' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold text-slate-800">{chapter.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">Class {chapter.class} • {chapter.unit}</div>
                    </div>
                    {isSelected && <span className="text-slate-800 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4">
              <button 
                disabled={selectedChapters.length === 0}
                onClick={() => startTest(TestType.CHAPTER_WISE)}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 disabled:opacity-50"
              >
                Generate Test ({selectedChapters.length} Selected)
              </button>
              <button onClick={() => setView('dashboard')} className="px-8 py-4 rounded-2xl font-black text-slate-400">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {view === 'quiz' && (
        <QuizView 
          questions={questions} 
          subject={currentSubject} 
          onFinish={(state) => {
            saveResult(state);
            setQuizState(state);
            setView('results');
          }}
          onExit={() => setView('dashboard')}
        />
      )}

      {view === 'results' && quizState && (
        <ResultsView state={quizState} onHome={() => setView('dashboard')} />
      )}

      {view === 'analysis' && (
        <AnalysisView 
          results={resultsHistory} 
          onReview={handleReview} 
          onBack={() => setView('dashboard')} 
        />
      )}
    </div>
  );
};

export default App;
