
import React from 'react';
import { TestResult, Subject } from '../types';

interface AnalysisViewProps {
  results: TestResult[];
  onReview: (result: TestResult) => void;
  onBack: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ results, onReview, onBack }) => {
  const subjectStats = (sub: Subject) => {
    const subTests = results.filter(r => r.subject === sub);
    // Fix: Corrected typo in variable name from subTestS to subTests
    if (subTests.length === 0) return { avg: 0, count: 0 };
    // Fix: Corrected typo in variable name from subTestS to subTests
    const avg = Math.round(subTests.reduce((acc, r) => acc + r.accuracy, 0) / subTests.length);
    // Fix: Corrected typo in variable name from subTestS to subTests
    return { avg, count: subTests.length };
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Performance Analytics</h1>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-bold">← Dashboard</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[Subject.BIOLOGY, Subject.PHYSICS, Subject.CHEMISTRY].map(sub => {
          const stats = subjectStats(sub);
          const color = sub === Subject.BIOLOGY ? 'emerald' : sub === Subject.PHYSICS ? 'indigo' : 'amber';
          return (
            <div key={sub} className={`bg-white p-6 rounded-3xl border-2 border-${color}-100 shadow-sm`}>
               <h3 className={`text-${color}-600 font-bold uppercase tracking-widest text-xs mb-4`}>{sub}</h3>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black">{stats.avg}%</span>
                 <span className="text-slate-400 text-sm">Avg. Accuracy</span>
               </div>
               <p className="text-slate-500 text-sm mt-1">{stats.count} tests completed</p>
               <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className={`h-full bg-${color}-500 transition-all`} style={{ width: `${stats.avg}%` }}></div>
               </div>
            </div>
          );
        })}
      </div>

      <section>
        <h2 className="text-xl font-bold mb-6">Test History</h2>
        {results.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
            No tests taken yet. Start practicing!
          </div>
        ) : (
          <div className="space-y-4">
            {results.slice().reverse().map((res) => (
              <div 
                key={res.id} 
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                onClick={() => onReview(res)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                    res.subject === Subject.BIOLOGY ? 'bg-emerald-100 text-emerald-600' : 
                    res.subject === Subject.PHYSICS ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {res.subject[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{res.type.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-400">{res.date} • {res.totalQuestions} Questions</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-700">{res.score}/{res.totalQuestions * 4}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-500">{res.accuracy}%</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</div>
                  </div>
                  <button className="bg-slate-50 text-slate-400 p-2 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    Review →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AnalysisView;
