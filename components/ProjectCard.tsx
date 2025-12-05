
import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { Hourglass, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  customLink?: string;
  showManageAction?: boolean;
  variant?: 'grid' | 'card';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, customLink, showManageAction, variant = 'grid' }) => {
  const percent = Math.min(100, Math.round((project.raised / project.goal) * 100));

  const getStatusInfo = (status: ProjectStatus) => {
    switch (status) {
      case 'PRE_LAUNCH': return { label: 'Coming Soon', icon: Clock };
      case 'FUNDING': return { label: 'Funding', icon: Hourglass };
      case 'RESEARCH': return { label: 'In Progress', icon: Hourglass };
      case 'COMPLETED': return { label: 'Completed', icon: CheckCircle };
      default: return { label: 'Unknown', icon: AlertCircle };
    }
  };

  const { label, icon: StatusIcon } = getStatusInfo(project.status);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const baseClasses = "group flex flex-col p-8 transition-all duration-300 relative h-full justify-between";
  const gridClasses = "border-b md:border-r border-ink/10 bg-paper hover:bg-stone/5 rounded-none";
  const cardClasses = "bg-surface border border-ink/10 rounded-sm hover:border-ink/30";

  return (
    <Link 
        to={customLink || `/project/${project.id}`} 
        className={`${baseClasses} ${variant === 'grid' ? gridClasses : cardClasses}`}
    >
      <div>
        {/* 1. Status Pill */}
        <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1.5 border border-ink/20 rounded-sm text-xs font-mono font-bold uppercase tracking-widest text-ink bg-white group-hover:border-ink/40 transition-colors">
                <StatusIcon size={14} className="mr-2" />
                {label}
            </div>
        </div>

        {/* 2. Title & Desc */}
        <div className="mb-8">
            <h3 className="font-sans text-2xl font-bold text-ink mb-3 leading-tight group-hover:text-accent transition-colors">
                {project.title}
            </h3>
            <p className="font-sans text-base text-ink/60 leading-relaxed line-clamp-3">
                {project.shortDescription}
            </p>
        </div>
      </div>

      {/* 3. Bottom Section: Goals & Footer */}
      <div>
        {/* Goals Row */}
        <div className="flex justify-between items-end mb-3 font-sans font-bold text-ink">
            <span className="text-sm">Goals</span>
            <span className="text-base font-mono">{formatCurrency(project.raised)}/{formatCurrency(project.goal)} USD</span>
        </div>
        
        {/* Progress Bar - Thicker Black Line */}
        <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden mb-8">
            <div 
                className="h-full bg-ink" 
                style={{ width: `${percent}%` }}
            ></div>
        </div>

        {/* 4. Footer: Avatars + Count */}
        <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {/* Use Initials for Avatars to match the text-heavy/editorial design */}
                {(project.donations && project.donations.length > 0 ? project.donations.slice(0, 3) : [
                    { donor: 'Zoe' }, { donor: 'Liam' }, { donor: 'William' } // Mock names for Z, L, W
                ]).map((d: any, i) => {
                    const initial = d.donor ? d.donor.charAt(0).toUpperCase() : '?';
                    return (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-paper bg-stone/20 flex items-center justify-center overflow-hidden">
                            <span className="font-mono text-xs font-bold text-ink/60">{initial}</span>
                        </div>
                    );
                })}
            </div>
            <span className="text-sm font-sans text-ink/60 font-medium">
                {project.backers} Bidder count
            </span>
        </div>

        {/* Optional Manage Button */}
        {showManageAction && (
            <div className="mt-6 pt-6 border-t border-ink/10">
                <div className="w-full flex items-center justify-center bg-stone/5 text-ink hover:bg-ink hover:text-paper transition-colors py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest">
                    <span>Manage Project</span>
                </div>
            </div>
        )}
      </div>
    </Link>
  );
};
