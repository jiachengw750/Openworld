
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';

interface FeaturedProjectProps {
    project: Project;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project }) => {
    const featuredPercent = Math.min(100, Math.round((project.raised / project.goal) * 100));
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-ink/10 group relative">
            <Link 
                to={`/project/${project.id}`}
                className="bg-accent text-paper p-12 md:p-20 flex flex-col justify-center relative overflow-hidden transition-colors duration-500 hover:bg-accent/95"
            >
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] mix-blend-overlay"></div>
                
                <span className="font-mono text-xs font-bold mb-8 inline-block px-4 py-2 rounded-full w-fit bg-paper/10 text-paper tracking-widest uppercase border border-paper/10">
                    Recommended Project
                </span>
                
                <h2 className="font-sans font-medium text-4xl md:text-6xl mb-8 leading-tight group-hover:translate-x-2 transition-transform duration-500 text-paper">
                {project.title}
                </h2>
                <p className="font-sans text-paper/70 text-lg mb-10 max-w-md leading-relaxed font-light">
                {project.shortDescription}
                </p>

                <div className="flex items-center space-x-4 mb-10 max-w-md">
                    <img src={project.authorAvatar} alt={project.author} className="w-12 h-12 rounded-full border-2 border-paper/20 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-bold font-sans text-paper text-sm">{project.author}</span>
                        <span className="font-sans text-xs text-paper/50 tracking-widest uppercase">{project.institution}</span>
                    </div>
                </div>
                
                <div className="bg-paper/5 p-8 rounded-sm backdrop-blur-sm border border-paper/10 group-hover:bg-paper/10 transition-colors">
                    <div className="flex justify-between items-end mb-4 font-mono text-paper">
                        <span className="text-3xl font-bold font-mono">{featuredPercent}%</span>
                        <span className="text-xs opacity-60 font-mono font-bold tracking-widest">FUNDED</span>
                    </div>
                    <div className="w-full h-1 bg-paper/20 mb-6 rounded-full overflow-hidden">
                        <div className="h-full bg-paper transition-all duration-1000 ease-out" style={{ width: `${featuredPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-paper/60 font-bold tracking-widest">
                        <span>{formatCurrency(project.raised)} RAISED</span>
                        <span>{project.backers} DONORS</span>
                    </div>
                </div>
            </Link>
            
            <div className="h-[500px] lg:h-auto relative overflow-hidden bg-ink">
                <Link to={`/project/${project.id}`} className="block w-full h-full">
                    <img 
                        src={project.image} 
                        className="w-full h-full object-cover grayscale opacity-80 mix-blend-overlay transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal" 
                        alt={project.title} 
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </Link>
            </div>

            <div className="absolute top-8 right-8 text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 mix-blend-difference">
                <ArrowUpRight size={48} strokeWidth={1} />
            </div>
        </section>
    );
};
