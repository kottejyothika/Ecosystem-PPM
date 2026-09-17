import React, { useState } from 'react';
import {
  Lightbulb,
  CheckSquare,
  Sparkles,
  BookOpen,
  HelpCircle,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_ECO_TIPS } from '../data/initialData';
import { useEcoCampus } from '../context/EcoCampusContext';

export const EcoTipsPage: React.FC = () => {
  const { setToast } = useEcoCampus();

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Carried personal reusable bottle to all lectures today', done: true },
    { id: 2, text: 'Refused single-use plastic bag at the campus convenience store', done: false },
    { id: 3, text: 'Deposited clean plastic container in designated smart bin', done: true },
    { id: 4, text: 'Used steel spoon instead of plastic cutlery at lunch', done: false },
    { id: 5, text: 'Shared an eco-tip with a classmate or roommate', done: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Sustainable Habits & Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-emerald-950">
            Eco Tips & Daily Zero-Waste Habits
          </h1>
          <p className="text-xs sm:text-sm text-emerald-800/80 mt-1 max-w-xl">
            Practical, evidence-backed advice to eliminate single-use plastics from campus daily life,
            hostels, and cafeterias.
          </p>
        </div>
      </div>

      {/* Daily Zero-Waste Student Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              Daily Student Zero-Waste Habits Checklist
            </h2>
            <p className="text-xs text-gray-500">Check off your daily sustainable decisions</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {completedCount} of {checklist.length} Completed Today
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                item.done
                  ? 'bg-emerald-50/70 border-emerald-200 text-gray-500'
                  : 'bg-gray-50 border-gray-200 text-emerald-950 hover:bg-emerald-50/30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  item.done ? 'bg-emerald-700 text-white' : 'border border-gray-300 bg-white'
                }`}
              >
                {item.done && '✓'}
              </div>
              <span className={`text-xs font-medium ${item.done ? 'line-through' : ''}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Eco Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_ECO_TIPS.map((tip) => (
          <div
            key={tip.id}
            className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
              {tip.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-950 font-serif">{tip.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {tip.impactLevel} Impact
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{tip.tip}</p>
              <span className="inline-block text-[11px] font-semibold text-emerald-700 pt-1">
                Category: {tip.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
