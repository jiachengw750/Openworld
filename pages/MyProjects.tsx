import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { PROJECTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { useWallet } from '../context/WalletContext';

type FilterType = 'ALL' | 'FUNDING' | 'RESEARCH' | 'COMPLETED';

export const MyProjects: React.FC = () => {
    const { wallet } = useWallet();
    
    // Filter projects where the author matches the connected wallet name
    // Fallback to "Dr. Aris Kothari" for demonstration if wallet not connected or name mismatch
    const currentUser = wallet?.name || "Dr. Aris Kothari";
    const allMyProjects = PROJECTS.filter(p => p.author === currentUser || p.author === "Dr. Aris Kothari");

    // Calculate Aggregate Stats
    const totalProjectsCount = allMyProjects.length;
    const totalGoalAmount = allMyProjects.reduce((acc, curr) => acc + curr.goal, 0);
    const totalRaisedAmount = allMyProjects.reduce((acc, curr) => acc + curr.raised, 0);

    // Filter State
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    // Filter Logic
    const filteredProjects = allMyProjects.filter(project => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'RESEARCH') return project.status === 'RESEARCH';
        return project.status === activeFilter;
    });

    return (
        <div className="min-h-screen bg-paper pb-24">
             {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <div className="flex flex-col">
                         <Link to="/" className="flex items-center text-sm font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-8 w-fit uppercase tracking-widest p-2 -ml-2">
                            <ArrowLeft size={16} className="mr-2" /> Back to Home
                        </Link>
                        <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-6">Scientist Dashboard</h1>
                        <p className="font-sans text-ink/70 max-w-3xl text-xl leading-relaxed">
                            Manage your research projects, track funding, and update milestones.
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-col sm:flex-row gap-16 mt-16 items-start border-t border-ink/10 pt-10 w-full">
                            <div className="flex flex-col">
                                <span className="block text-xs font-mono font-bold uppercase text-ink/60 tracking-widest mb-3">Total Projects</span>
                                <span className="block font-mono text-5xl text-ink font-bold">{totalProjectsCount}</span>
                            </div>
                            <div className="w-px h-24 bg-ink/10 hidden sm:block"></div>
                            <div className="flex flex-col">
                                <span className="block text-xs font-mono font-bold uppercase text-ink/60 tracking-widest mb-3">Total Goal</span>
                                <span className="block font-mono text-5xl text-ink font-bold">{formatCurrency(totalGoalAmount)}</span>
                            </div>
                             <div className="w-px h-24 bg-ink/10 hidden sm:block"></div>
                            <div className="flex flex-col">
                                <span className="block text-xs font-mono font-bold uppercase text-ink/60 tracking-widest mb-3">Total Raised</span>
                                <span className="block font-mono text-5xl text-accent font-bold">{formatCurrency(totalRaisedAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-16">
                
                {/* Filters */}
                <div className="flex items-center space-x-12 border-b border-ink/10 mb-12 overflow-x-auto">
                    {(['ALL', 'FUNDING', 'RESEARCH', 'COMPLETED'] as FilterType[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`pb-5 text-sm font-mono font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                                activeFilter === filter 
                                ? 'text-accent' 
                                : 'text-ink/50 hover:text-ink'
                            }`}
                        >
                            {filter === 'RESEARCH' ? 'IN PROGRESS' : filter}
                            {activeFilter === filter && (
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-accent"></span>
                            )}
                        </button>
                    ))}
                </div>
                
                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-r border-ink/10">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                // Point to new Management Page
                                customLink={`/my-projects/${project.id}/manage`}
                                showManageAction={true}
                            />
                        ))
                    ) : (
                        // Empty State
                        <div className="col-span-full py-32 flex flex-col items-center justify-center border-b border-ink/10 bg-stone/5">
                            <div className="w-20 h-20 bg-ink/5 rounded-full flex items-center justify-center mb-6 text-ink/20">
                                <FolderOpen size={40} />
                            </div>
                            <h3 className="font-sans text-3xl font-bold text-ink mb-4">No projects found</h3>
                            <p className="font-sans text-ink/60 text-lg max-w-lg text-center leading-relaxed">
                                {activeFilter === 'ALL' 
                                    ? "You don't have any active projects linked to this account." 
                                    : `You don't have any projects in the ${activeFilter === 'RESEARCH' ? 'IN PROGRESS' : activeFilter} stage.`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};