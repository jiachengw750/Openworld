
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, CheckCircle, Clock } from 'lucide-react';
import { Project } from '../../types';

interface ProjectHeroProps {
    project: Project;
    onShare: () => void;
    isShared: boolean;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project, onShare, isShared }) => {
    return (
        <div className="relative w-full h-[500px] bg-ink overflow-hidden group">
            <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>
            
            <div className="absolute inset-0">
                <div className="max-w-[1512px] mx-auto w-full h-full p-8 md:p-16 flex flex-col justify-between">
                    
                    <div className="flex justify-between items-start">
                        <Link to="/" className="flex items-center text-[10px] font-mono font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest bg-black/20 backdrop-blur-sm px-4 py-2 rounded-sm border border-white/10 hover:border-white/30">
                            <ArrowLeft size={14} className="mr-2" /> BACK TO PROJECTS
                        </Link>
                        <button 
                            onClick={onShare}
                            className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all rounded-sm text-white/80 backdrop-blur-sm bg-black/20"
                            title="Share Project"
                        >
                            {isShared ? <CheckCircle size={18} /> : <Share2 size={18} strokeWidth={1.5}/>}
                        </button>
                    </div>

                    <div className="max-w-4xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-white/20">
                                {project.category}
                            </span>
                            <div className="flex items-center text-white/80 text-xs font-mono uppercase tracking-widest">
                                <Clock size={12} className="mr-2" />
                                {project.status === 'PRE_LAUNCH' ? 'Coming Soon' : 
                                project.status === 'COMPLETED' ? 'Completed' : 
                                project.daysLeft > 0 ? `${project.daysLeft} days left` : 'Ended'}
                            </div>
                        </div>
                        
                        <h1 className="font-sans text-5xl md:text-7xl leading-[0.95] mb-8 text-white tracking-tight text-shadow-lg">
                        {project.title}
                        </h1>

                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5">
                                <img src={project.authorAvatar} alt={project.author} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div className="flex flex-col text-white">
                                <span className="font-sans font-bold text-sm">By {project.author}</span>
                                <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest">{project.institution}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
