
import React from 'react';
import { Project } from '../../types';
import { Award, Lock, UserPlus, Building2 } from 'lucide-react';

interface ProjectContentProps {
    project: Project;
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const hasMilestones = project.milestones && project.milestones.length > 0;
    const hasTeam = project.team && project.team.length > 0;

    return (
        <div className="prose prose-xl prose-stone max-w-none text-ink">
            {/* Abstract */}
            <div className="mb-16">
                <h3 className="font-sans text-3xl font-bold mb-6 text-ink tracking-tight">Research Abstract</h3>
                <p className="text-ink text-lg md:text-xl leading-loose whitespace-pre-line font-sans font-normal">
                    {project.fullDescription}
                </p>
            </div>

            {/* Methodology */}
            <div className="mb-16">
                <h3 className="font-sans text-3xl font-bold mb-6 text-ink tracking-tight">Research Methodology</h3>
                <p className="text-ink text-lg md:text-xl leading-loose font-sans font-normal">
                    Our approach utilizes a three-phase verification process. Initially, we conduct simulation testing in controlled environments. Following successful benchmarks, we move to isolated field trials. The final phase involves peer-reviewed data analysis and publication.
                </p>
            </div>

            {/* Allocation - Clean Table Style */}
            <div className="mb-16">
                <h3 className="font-sans text-3xl font-bold mb-8 text-ink tracking-tight">Funds Allocation</h3>
                <div className="border-t-2 border-ink/10">
                    {project.allocation && project.allocation.length > 0 ? (
                        project.allocation.map((alloc, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row justify-between py-8 border-b border-ink/10 group hover:bg-stone/5 transition-colors px-4">
                                <div className="md:w-2/3 pr-8 mb-4 md:mb-0">
                                    <h4 className="text-xl font-bold text-ink mb-2">{alloc.category}</h4>
                                    <p className="text-base text-ink/70">{alloc.description}</p>
                                </div>
                                <div className="md:w-1/3 text-left md:text-right flex flex-col justify-center">
                                    <span className="font-mono text-2xl font-bold text-ink">{formatCurrency(alloc.amount)}</span>
                                    <span className="text-sm font-mono text-ink/60 uppercase tracking-wide font-bold">{alloc.percentage}% of total</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 px-4 text-ink/50 italic font-mono text-base">Detailed allocation breakdown pending finalization.</div>
                    )}
                    <div className="flex justify-between items-center py-8 px-6 mt-4 bg-stone/5 border border-ink/10">
                        <span className="font-mono text-sm uppercase tracking-widest font-bold text-ink/70">Total Goal</span>
                        <span className="font-mono text-2xl font-bold text-ink">{formatCurrency(project.goal)}</span>
                    </div>
                </div>
            </div>

            {/* Milestones - Minimalist Timeline or Locked Blueprint */}
            <div className="mb-16">
                <h3 className="font-sans text-3xl font-bold mb-8 text-ink tracking-tight">Milestones</h3>
                
                {hasMilestones ? (
                    <div className="space-y-0 relative border-l-2 border-ink/10 ml-3">
                        {project.milestones.map((milestone) => (
                            <div key={milestone.id} className="pl-10 pb-16 relative last:pb-0">
                                {/* Timeline Node */}
                                <div className={`absolute -left-2.5 top-1 w-5 h-5 rounded-full ring-4 ring-paper flex items-center justify-center z-10 ${
                                    milestone.status === 'COMPLETED' ? 'bg-green-600' :
                                    milestone.status === 'IN_PROGRESS' ? 'bg-paper border-2 border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.1)]' :
                                    'bg-paper border-2 border-dashed border-ink/30'
                                }`}>
                                    {milestone.status === 'COMPLETED' && (
                                        <div className="w-1.5 h-1.5 bg-paper rounded-full" />
                                    )}
                                    {milestone.status === 'IN_PROGRESS' && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                    )}
                                </div>
                                
                                <div className="flex flex-col mb-3">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className={`font-bold text-xl ${milestone.status === 'UPCOMING' ? 'text-ink/60' : 'text-ink'}`}>
                                            {milestone.title}
                                        </h4>
                                        <span className="font-mono text-xs text-ink/60 uppercase tracking-widest bg-stone/5 px-3 py-1 rounded-sm font-bold border border-ink/10">
                                            {milestone.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <span className="font-mono text-sm text-ink/60 font-medium mb-2">{milestone.date}</span>
                                </div>
                                <p className="text-lg text-ink/80 leading-relaxed max-w-3xl">{milestone.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Locked Timeline Blueprint
                    <div className="space-y-0 relative border-l-2 border-dashed border-ink/10 ml-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="pl-10 pb-16 relative last:pb-0 opacity-60 hover:opacity-100 transition-opacity">
                                {/* Locked Node */}
                                <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-paper border-2 border-ink/20 flex items-center justify-center z-10">
                                    <Lock size={10} className="text-ink/40" />
                                </div>
                                
                                <div className="flex flex-col mb-3">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-xl text-ink/60">Phase {i}: Classified</h4>
                                        <span className="font-mono text-xs text-ink/40 uppercase tracking-widest bg-stone/5 px-3 py-1 rounded-sm font-bold border border-ink/10">
                                            Locked
                                        </span>
                                    </div>
                                    <span className="font-mono text-sm text-ink/40 font-medium mb-2">Date: TBA</span>
                                </div>
                                <p className="text-lg text-ink/50 leading-relaxed max-w-3xl">
                                    Operational objectives for this phase are currently confidential. Full research roadmap will be decrypted upon official project launch.
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Researchers - Clean Cards or Recruitment */}
            <div className="mb-12">
                <h3 className="font-sans text-3xl font-bold mb-8 text-ink tracking-tight">Researchers</h3>
                <div className="grid grid-cols-1 gap-8">
                    {hasTeam ? (
                        project.team.map((member, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-start p-8 border border-ink/10 bg-paper hover:shadow-lg transition-shadow">
                                <img 
                                    src={member.avatar} 
                                    alt={member.name} 
                                    className="w-20 h-20 rounded-full object-cover border border-ink/10 mr-8 mb-6 sm:mb-0 grayscale hover:grayscale-0 transition-all" 
                                />
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3">
                                        <h4 className="font-bold text-xl text-ink">{member.name}</h4>
                                        <span className="font-mono text-sm font-bold text-ink/60 uppercase tracking-widest">{member.role}</span>
                                    </div>
                                    <p className="text-base text-ink/80 mb-6 leading-relaxed">{member.bio}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {/* Institution Tag - Neutral Stone Style */}
                                        <span className="inline-flex items-center text-xs font-mono font-bold text-ink/60 bg-stone/5 border border-ink/10 px-4 py-2 rounded-full">
                                            <Building2 size={14} className="mr-2 text-ink/40" />
                                            {member.institution}
                                        </span>
                                        {/* Award Tags - Prestigious Gold/Amber Style */}
                                        {member.awards.map((award, i) => (
                                            <span key={i} className="inline-flex items-center text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800/50">
                                                <Award size={14} className="mr-2 text-amber-600 dark:text-amber-400" />
                                                {award}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Team Forming State
                        <>
                            {/* Principal Investigator (Derived from Author) */}
                            <div className="flex flex-col sm:flex-row items-start p-8 border border-ink/10 bg-paper">
                                <img 
                                    src={project.authorAvatar} 
                                    alt={project.author} 
                                    className="w-20 h-20 rounded-full object-cover border border-ink/10 mr-8 mb-6 sm:mb-0 grayscale hover:grayscale-0 transition-all" 
                                />
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3">
                                        <h4 className="font-bold text-xl text-ink">{project.author}</h4>
                                        <span className="font-mono text-sm font-bold text-ink/60 uppercase tracking-widest">Principal Investigator</span>
                                    </div>
                                    <p className="text-base text-ink/80 mb-6 leading-relaxed">{project.authorBio}</p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="inline-flex items-center text-xs font-mono font-bold text-ink/60 bg-stone/5 border border-ink/10 px-4 py-2 rounded-full">
                                            <Building2 size={14} className="mr-2 text-ink/40" />
                                            {project.institution}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Open Position / Recruitment Placeholder */}
                            <div className="flex flex-col sm:flex-row items-center p-8 border-2 border-dashed border-ink/10 bg-stone/5 text-center sm:text-left group hover:border-ink/20 transition-colors">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-ink/10 flex items-center justify-center mr-0 sm:mr-8 mb-6 sm:mb-0 bg-paper group-hover:border-ink/20 transition-colors">
                                    <UserPlus size={28} className="text-ink/30 group-hover:text-ink/50 transition-colors" />
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3">
                                        <h4 className="font-bold text-xl text-ink/70">Co-Investigator / Assistant</h4>
                                        <span className="font-mono text-sm font-bold text-ink/40 uppercase tracking-widest bg-paper px-2 py-1 rounded-sm border border-ink/5">Position Open</span>
                                    </div>
                                    <p className="text-base text-ink/50 mb-0 leading-relaxed">
                                        We are actively recruiting qualified personnel to support the upcoming research phase. Applications will open via the institute portal.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
