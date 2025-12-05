
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
                className="bg-stone/10 text-ink p-12 md:p-20 flex flex-col justify-center relative overflow-hidden transition-colors duration-500 group-hover:bg-stone/20"
            >
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] mix-blend-multiply"></div>
                
                <span className="font-sans text-sm mb-6 inline-block px-5 py-2 rounded-full w-fit bg-ink/5 text-ink font-medium tracking-tight">
                    RECOMMENDED PROJECT
                </span>
                
                <h2 className="font-sans font-medium text-4xl md:text-5xl mb-6 leading-tight group-hover:translate-x-1 transition-transform duration-500 text-ink">
                {project.title}
                </h2>
                <p className="font-sans text-ink/70 text-lg mb-8 max-w-md leading-relaxed">
                {project.shortDescription}
                </p>

                <div className="flex items-center space-x-4 mb-8 max-w-md">
                    <img src={project.authorAvatar} alt={project.author} className="w-12 h-12 rounded-full border-2 border-ink/10 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-bold font-sans text-ink text-sm">{project.author}</span>
                        <span className="font-sans text-xs text-ink/50 tracking-widest">{project.institution}</span>
                    </div>
                </div>
                
                <div className="bg-white/60 p-6 rounded-sm backdrop-blur-md mb-8 border border-ink/10 group-hover:bg-white/80 transition-colors shadow-sm">
                    <div className="flex justify-between items-end mb-2 font-mono text-ink">
                        <span className="text-2xl font-bold font-mono">{featuredPercent}%</span>
                        <span className="text-xs opacity-60 font-mono font-bold">FUNDED</span>
                    </div>
                    <div className="w-full h-1 bg-ink/10 mb-4 rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: `${featuredPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-ink/60 font-bold">
                        <span className="font-mono">{formatCurrency(project.raised)} RAISED</span>
                        <span className="font-mono">{project.backers} DONORS</span>
                    </div>
                </div>
            </Link>
            
            <div className="h-[400px] lg:h-auto relative overflow-hidden">
                <Link to={`/project/${project.id}`} className="block w-full h-full">
                    <img 
                        src={project.image} 
                        className="w-full h-full object-cover grayscale contrast-125 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" 
                        alt={project.title} 
                    />
                </Link>
            </div>

            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                <div className="w-12 h-12 bg-accent text-paper rounded-full flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-lg border border-paper/20">
                    <ArrowUpRight size={24} />
                </div>
            </div>
        </section>
    );
};
