import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';

interface ProjectCardProps {
  project: Project;
  customLink?: string;
  showManageAction?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, customLink, showManageAction }) => {
  const percent = Math.min(100, Math.round((project.raised / project.goal) * 100));

  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case 'PRE_LAUNCH': return { label: 'Coming Soon', color: 'bg-stone text-ink' };
      case 'FUNDING': return { label: 'Funding', color: 'bg-accent text-paper' };
      case 'RESEARCH': return { label: 'In Progress', color: 'bg-ink text-paper' };
      case 'COMPLETED': return { label: 'Completed', color: 'bg-green-600 text-white' };
      default: return { label: 'Unknown', color: 'bg-gray-500 text-white' };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const isResearchOrCompleted = project.status === 'RESEARCH' || project.status === 'COMPLETED';

  // Calculate research progress
  const totalMilestones = project.milestones ? project.milestones.length : 0;
  const completedMilestones = project.milestones ? project.milestones.filter(m => m.status === 'COMPLETED').length : 0;
  
  const currentMilestone = project.milestones?.find(m => m.status === 'IN_PROGRESS') || project.milestones?.find(m => m.status === 'UPCOMING') || project.milestones?.[project.milestones.length - 1];

  const phaseNumber = completedMilestones + (currentMilestone?.status === 'IN_PROGRESS' ? 1 : 0);
  const displayPhase = project.status === 'COMPLETED' ? totalMilestones : Math.min(phaseNumber, totalMilestones);

  return (
    <Link to={customLink || `/project/${project.id}`} className="group flex flex-col border-b md:border-r border-ink/10 bg-paper hover:bg-surface transition-colors duration-300 relative h-full rounded-none">
      
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        {/* Rounded Status Pill - Larger Text */}
        <div className={`absolute top-4 left-4 ${statusConfig.color} px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-full shadow-sm`}>
          {statusConfig.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        
        {/* Tags - Rounded Pills - Larger Text */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.slice(0, 3).map((tag, index) => (
             <span key={index} className="text-xs bg-ink/5 tracking-wide border border-ink/10 px-3 py-1.5 rounded-full text-ink/80 font-medium">
                {tag}
             </span>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="font-sans text-2xl font-bold mb-3 text-ink leading-tight group-hover:text-accent transition-colors line-clamp-2">
            {project.title}
          </h3>
          {/* Author info as clean text - Increased Size */}
          <div className="flex items-center space-x-2 text-sm text-ink/70 font-sans">
              <span className="font-bold text-ink">{project.author}</span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{project.institution}</span>
          </div>
        </div>

        {/* Stats Grid - Pure Text Layout, No Icons */}
        <div className="mt-auto pt-6 border-t border-ink/10">
          
          {project.status === 'PRE_LAUNCH' ? (
            <div className="flex justify-between items-end">
               <div className="flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-widest text-ink/60 mb-1.5 font-bold">Starts</span>
                  <span className="font-mono text-lg font-bold text-ink">
                    {project.startTime || 'TBA'}
                  </span>
               </div>
               <div className="flex flex-col text-right">
                   <span className="text-xs font-mono uppercase tracking-widest text-ink/60 mb-1.5 font-bold">Goal</span>
                   <span className="font-mono text-lg font-bold text-ink">{formatCurrency(project.goal)}</span>
               </div>
            </div>
          ) : isResearchOrCompleted ? (
            <div className="flex flex-col w-full">
               <div className="flex justify-between items-center mb-3">
                 <span className="font-mono text-sm font-bold text-ink uppercase tracking-wider">
                    Phase {displayPhase}/{totalMilestones}
                 </span>
                 <span className="text-xs font-mono text-ink/60 uppercase font-bold">
                    {project.status === 'COMPLETED' ? 'Complete' : 'In Progress'}
                 </span>
               </div>
               
               {/* Thicker Progress Bar */}
               <div className="flex items-center space-x-1 mb-5 h-2 rounded-full overflow-hidden">
                  {project.milestones?.map((m, idx) => (
                      <div key={idx} className={`h-full flex-1 ${
                          m.status === 'COMPLETED' ? 'bg-green-500' :
                          m.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                          'bg-ink/10'
                      }`}></div>
                  ))}
               </div>

               <div className="flex justify-between text-xs font-mono text-ink/60 uppercase tracking-widest font-bold">
                   <span>{project.backers} Donors</span>
                   <span>Updated {currentMilestone?.date || 'Recently'}</span>
               </div>
            </div>
          ) : (
            <>
               <div className="flex justify-between items-end mb-3">
                 <span className="font-mono text-3xl font-bold tracking-tighter text-ink">
                   {percent}%
                 </span>
                 <span className="text-xs font-mono uppercase tracking-widest text-ink/60 mb-1.5 font-bold">
                    Funded
                 </span>
               </div>
               
               {/* Thicker Progress Bar */}
               <div className="w-full h-2 bg-ink/10 mb-5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-accent"
                   style={{ width: `${percent}%` }}
                 ></div>
               </div>

               <div className="flex justify-between text-xs font-mono text-ink/60 uppercase tracking-widest font-bold">
                   <span className="text-ink">{formatCurrency(project.raised)} Raised</span>
                   <span>{project.daysLeft > 0 ? `${project.daysLeft} Days left` : 'Ended'}</span>
               </div>
            </>
          )}

          {/* Manage Button - Rounded - Larger Text */}
          {showManageAction && (
              <div className="mt-6">
                  <div className="w-full flex items-center justify-center bg-ink text-paper hover:bg-accent transition-colors py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest">
                      <span>Manage Project</span>
                  </div>
              </div>
          )}
        </div>
      </div>
    </Link>
  );
};