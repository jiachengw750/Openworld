

import React, { useState, useRef, useEffect } from 'react';
import { QUESTS } from '../constants';
import { QuestCard } from '../components/quest/QuestCard';
import { QuestStatus } from '../types';
import { Filter, LayoutGrid, List, ChevronDown, Check } from 'lucide-react';

const SUBJECT_OPTIONS = ['Math', 'Computer', 'Statistics', 'Physics', 'Chemistry', 'Biology'];

export const QuestPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<'ALL' | QuestStatus>('ALL');
    const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
    const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
    const [customSubject, setCustomSubject] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsSubjectMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSubject = (subject: string) => {
        const newSet = new Set(selectedSubjects);
        if (newSet.has(subject)) {
            newSet.delete(subject);
        } else {
            newSet.add(subject);
        }
        setSelectedSubjects(newSet);
    };

    const handleAddCustomSubject = () => {
        if (customSubject.trim()) {
            toggleSubject(customSubject.trim());
            setCustomSubject('');
        }
    };

    const filteredQuests = QUESTS.filter(q => {
        // 1. Filter by Status
        if (activeFilter !== 'ALL' && q.status !== activeFilter) {
            return false;
        }
        // 2. Filter by Subjects (OR logic)
        if (selectedSubjects.size > 0) {
            const hasMatchingSubject = q.subjects.some(s => selectedSubjects.has(s));
            if (!hasMatchingSubject) return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Breadcrumb / Title Area */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 pt-12 pb-8">
                 <div className="flex items-center text-xs font-mono font-bold text-ink/40 uppercase tracking-widest mb-4">
                    <span>Quest</span>
                    <span className="mx-2">/</span>
                    <span className="text-ink">Reward Task</span>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h1 className="font-sans text-5xl font-bold text-ink">Reward task <span className="text-ink/30 ml-2">({QUESTS.length})</span></h1>
                 </div>
            </div>

            {/* Control Bar */}
            <div className="sticky top-[88px] z-30 bg-paper/95 backdrop-blur-md border-b border-ink/10">
                <div className="max-w-[1512px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
                    
                    {/* Left: Filters */}
                    <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
                         <button 
                            onClick={() => setActiveFilter('ALL')}
                            className={`flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-wider h-16 border-b-2 transition-all px-1 whitespace-nowrap ${
                                activeFilter === 'ALL' ? 'text-ink border-ink' : 'text-ink/40 border-transparent hover:text-ink'
                            }`}
                        >
                            <LayoutGrid size={14} />
                            All
                         </button>
                         <button 
                             onClick={() => setActiveFilter('RECRUITING')}
                             className={`flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-wider h-16 border-b-2 transition-all px-1 whitespace-nowrap ${
                                activeFilter === 'RECRUITING' ? 'text-ink border-ink' : 'text-ink/40 border-transparent hover:text-ink'
                            }`}
                         >
                            <span className={`w-2 h-2 rounded-full ${activeFilter === 'RECRUITING' ? 'bg-accent' : 'bg-ink/20'}`}></span>
                            Recruiting
                         </button>
                         <button 
                             onClick={() => setActiveFilter('IN_PROGRESS')}
                             className={`flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-wider h-16 border-b-2 transition-all px-1 whitespace-nowrap ${
                                activeFilter === 'IN_PROGRESS' ? 'text-ink border-ink' : 'text-ink/40 border-transparent hover:text-ink'
                            }`}
                         >
                            <span className={`w-2 h-2 rounded-full ${activeFilter === 'IN_PROGRESS' ? 'bg-blue-400' : 'bg-ink/20'}`}></span>
                            In process
                         </button>
                         <button 
                             onClick={() => setActiveFilter('COMPLETED')}
                             className={`flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-wider h-16 border-b-2 transition-all px-1 whitespace-nowrap ${
                                activeFilter === 'COMPLETED' ? 'text-ink border-ink' : 'text-ink/40 border-transparent hover:text-ink'
                            }`}
                         >
                             <span className={`w-2 h-2 rounded-full ${activeFilter === 'COMPLETED' ? 'bg-green-500' : 'bg-ink/20'}`}></span>
                            Complete
                         </button>
                    </div>

                    {/* Right: Sort / View (Visual only) */}
                    <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-bold uppercase tracking-widest text-ink/60">
                         
                         {/* Subject Filter Dropdown */}
                         <div className="relative" ref={menuRef}>
                             <button 
                                onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                                className={`flex items-center gap-2 hover:text-ink transition-colors ${selectedSubjects.size > 0 ? 'text-ink' : ''}`}
                             >
                                 <Filter size={12} />
                                 Subject 
                                 {selectedSubjects.size > 0 && <span className="bg-ink text-paper rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{selectedSubjects.size}</span>}
                                 <ChevronDown size={12} className={`transition-transform duration-200 ${isSubjectMenuOpen ? 'rotate-180' : ''}`} />
                             </button>

                             {isSubjectMenuOpen && (
                                <div className="absolute top-full right-0 mt-4 w-64 bg-paper border border-ink/10 shadow-xl rounded-sm z-50 p-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-60 overflow-y-auto">
                                        {SUBJECT_OPTIONS.map(subject => {
                                            const isSelected = selectedSubjects.has(subject);
                                            return (
                                                <div 
                                                    key={subject} 
                                                    onClick={() => toggleSubject(subject)} 
                                                    className="flex items-center p-2.5 hover:bg-stone/5 cursor-pointer group"
                                                >
                                                    <div className={`w-4 h-4 border border-ink/20 mr-3 flex items-center justify-center transition-colors rounded-sm ${isSelected ? 'bg-ink border-ink' : 'bg-paper group-hover:border-ink/40'}`}>
                                                        {isSelected && <Check size={10} className="text-paper" strokeWidth={3} />}
                                                    </div>
                                                    <span className="font-mono text-sm font-bold text-ink">{subject}</span>
                                                </div>
                                            );
                                        })}
                                        {/* Show currently selected custom subjects if they aren't in default list */}
                                        {Array.from(selectedSubjects).map((subject: string) => {
                                            if (SUBJECT_OPTIONS.includes(subject)) return null;
                                            return (
                                                 <div 
                                                    key={subject} 
                                                    onClick={() => toggleSubject(subject)} 
                                                    className="flex items-center p-2.5 hover:bg-stone/5 cursor-pointer group"
                                                >
                                                    <div className={`w-4 h-4 border border-ink/20 mr-3 flex items-center justify-center transition-colors rounded-sm bg-ink border-ink`}>
                                                        <Check size={10} className="text-paper" strokeWidth={3} />
                                                    </div>
                                                    <span className="font-mono text-sm font-bold text-ink">{subject}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    
                                    <div className="border-t border-ink/10 mt-2 pt-2 px-1 pb-1">
                                        <div className="flex border border-ink/10 rounded-sm overflow-hidden">
                                            <input 
                                                className="flex-1 bg-stone/5 text-xs p-2.5 font-mono text-ink focus:outline-none placeholder-ink/30" 
                                                placeholder="Enter your subject"
                                                value={customSubject}
                                                onChange={(e) => setCustomSubject(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSubject()}
                                            />
                                            <button 
                                                onClick={handleAddCustomSubject} 
                                                className="bg-ink text-paper text-[10px] font-bold px-3 uppercase hover:bg-accent transition-colors tracking-wider"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             )}
                         </div>

                         <button className="flex items-center gap-2 hover:text-ink">
                             Sort <List size={12} />
                         </button>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-8">
                 <div className="flex flex-col gap-6">
                     {filteredQuests.length > 0 ? (
                        filteredQuests.map((quest) => (
                            <QuestCard 
                                key={quest.id} 
                                quest={quest} 
                            />
                        ))
                     ) : (
                        <div className="py-24 text-center border border-dashed border-ink/10 rounded-sm bg-stone/5">
                            <h3 className="text-xl font-sans font-bold text-ink mb-2">No tasks found</h3>
                            <p className="text-ink/50 font-mono text-sm">Try adjusting your filters.</p>
                        </div>
                     )}
                 </div>
            </div>
        </div>
    );
};
