/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronDown, 
  Code2, 
  CheckCircle2, 
  Search, 
  Menu, 
  X,
  Layout,
  Terminal,
  Lightbulb,
  ClipboardList,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import { curriculum, Phase, DayContent } from './data/curriculum';
import { cn } from './lib/utils';

export default function App() {
  const [selectedPhaseId, setSelectedPhaseId] = useState(0);
  const [selectedDayId, setSelectedDayId] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0, 1]);

  useEffect(() => {
    Prism.highlightAll();
  }, [selectedDayId]);

  const togglePhase = (id: number) => {
    setExpandedPhases(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleDayCompletion = (id: number) => {
    setCompletedDays(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const currentPhase = curriculum.find(p => p.id === selectedPhaseId) || curriculum[0];
  const currentDay = currentPhase.days.find(d => d.id === selectedDayId) || currentPhase.days[0];

  const filteredCurriculum = curriculum.map(phase => ({
    ...phase,
    days: phase.days.filter(day => 
      day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phase.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(phase => phase.days.length > 0);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
          >
            <Menu size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? '320px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col z-40 relative",
          !isSidebarOpen && "pointer-events-none"
        )}
      >
        <div className="p-6 border-bottom border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">JS Master</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 rounded-md">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-6 custom-scrollbar">
          {filteredCurriculum.map((phase) => (
            <div key={phase.id} className="mb-2">
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
              >
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                  {phase.title}
                </span>
                {expandedPhases.includes(phase.id) ? (
                  <ChevronDown size={14} className="text-slate-400" />
                ) : (
                  <ChevronRight size={14} className="text-slate-400" />
                )}
              </button>
              
              <AnimatePresence initial={false}>
                {expandedPhases.includes(phase.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {phase.days.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => {
                          setSelectedPhaseId(phase.id);
                          setSelectedDayId(day.id);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all mb-1 group",
                          selectedDayId === day.id && selectedPhaseId === phase.id
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          completedDays.includes(day.id) 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "border-slate-300 group-hover:border-indigo-400"
                        )}>
                          {completedDays.includes(day.id) && <CheckCircle2 size={12} />}
                        </div>
                        <span className="truncate">{day.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-md">
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-900">{currentPhase.title}</span>
              <ChevronRight size={14} />
              <span>{currentDay.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleDayCompletion(currentDay.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                completedDays.includes(currentDay.id)
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {completedDays.includes(currentDay.id) ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Completed</span>
                </>
              ) : (
                <span>Mark as Complete</span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentDay.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
                {currentDay.title}
              </h1>

              {/* Theory Section */}
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                  <BookOpen size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-wider">Theory (তত্ত্বীয় আলোচনা)</h2>
                </div>
                <div className="prose prose-slate max-w-none bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <ReactMarkdown>{currentDay.theory}</ReactMarkdown>
                </div>
              </section>

              {/* Code Section */}
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                  <Code2 size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-wider">Code Example (কোড উদাহরণ)</h2>
                </div>
                <div className="relative group">
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigator.clipboard.writeText(currentDay.code)}
                      className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-all"
                      title="Copy Code"
                    >
                      <Terminal size={18} />
                    </button>
                  </div>
                  <pre className="rounded-3xl overflow-hidden !m-0 !p-8 shadow-2xl shadow-indigo-500/10">
                    <code className="language-javascript">
                      {currentDay.code.trim()}
                    </code>
                  </pre>
                </div>
              </section>

              {/* Explanation Section */}
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                  <Lightbulb size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-wider">Explanation (কোড ব্যাখ্যা)</h2>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                  <p className="text-amber-900 leading-relaxed">
                    {currentDay.explanation}
                  </p>
                </div>
              </section>

              {/* Tasks Section */}
              <section className="mb-20">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                  <ClipboardList size={24} />
                  <h2 className="text-xl font-bold uppercase tracking-wider">Practice Tasks (অনুশীলন কাজ)</h2>
                </div>
                <div className="grid gap-3">
                  {currentDay.tasks.map((task, idx) => (
                    <div 
                      key={task.id}
                      className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                      <span className="flex shrink-0 w-8 h-8 items-center justify-center bg-slate-100 text-slate-500 font-bold rounded-lg text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 pt-1">{task.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        
        pre[class*="language-"] {
          background: #0F172A !important;
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 0.95rem !important;
          line-height: 1.6 !important;
        }

        .prose h3 {
          color: #0F172A;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .prose p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #475569;
        }

        .prose ul {
          list-style-type: none;
          padding-left: 0;
        }

        .prose li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .prose li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6366F1;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
