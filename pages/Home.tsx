import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectStatus } from '../types';
import { Hero } from '../components/home/Hero';
import { FeaturedProject } from '../components/home/FeaturedProject';
import { useToast } from '../context/ToastContext';
import { Box, Ghost, AlertTriangle } from 'lucide-react';

type FilterType = 'ALL' | ProjectStatus | 'EMPTY' | '404';

const STATUS_FILTERS: { value: FilterType, label: string }[] = [
    { value: 'ALL', label: 'ALL' },
    { value: 'PRE_LAUNCH', label: 'COMING SOON' },
    { value: 'FUNDING', label: 'FUNDING' },
    { value: 'RESEARCH', label: 'IN PROGRESS' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'EMPTY', label: 'EMPTY' },
    { value: '404', label: '404' }
];

export const Home: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<FilterType>('ALL');
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = activeStatus === 'ALL' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.status === activeStatus);

  const featuredProject = PROJECTS.find(p => p.status === 'FUNDING') || PROJECTS[0];

  const handleSubscribe = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) {
          showToast('Please enter an email address');
          return;
      }
      if (!email.includes('@')) {
          showToast('Please enter a valid email');
          return;
      }
      showToast('Subscribed successfully');
      setEmail('');
  };

  return (
    <main className="min-h-screen bg-paper">
      
      <Hero />

      <FeaturedProject project={featuredProject} />

      {/* Sticky Status Navigation */}
      <div 
        className={`sticky z-40 bg-paper border-b border-ink/10 backdrop-blur-sm bg-opacity-95 transition-all duration-500 ease-in-out shadow-sm ${
            isScrolled ? 'top-[72px]' : 'top-[88px]'
        }`}
      >
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-10 h-16 items-center justify-center md:justify-start text-sm font-bold font-mono uppercase tracking-widest">
            <span className="text-ink/60 hidden md:inline-block">STATUS:</span>
            {STATUS_FILTERS.map(filter => (
              <button
                key={filter.value}
                onClick={() => setActiveStatus(filter.value)}
                className={`transition-colors duration-200 shrink-0 ${
                  activeStatus === filter.value 
                    ? 'text-accent border-b-2 border-accent' 
                    : 'text-ink/60 hover:text-ink'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-[1512px] mx-auto min-h-[500px]">
        {activeStatus === 'EMPTY' ? (
            // EMPTY STATE
            <div className="w-full h-[600px] flex flex-col items-center justify-center border-l border-r border-b border-ink/10 bg-stone/5">
                <div className="w-24 h-24 bg-paper border border-ink/10 rounded-full flex items-center justify-center mb-8 shadow-sm">
                    <Box size={48} className="text-ink/30" strokeWidth={1.5} />
                </div>
                <h3 className="font-sans text-4xl text-ink mb-4 font-bold">No Data Available</h3>
                <p className="font-sans text-ink/70 max-w-lg text-center leading-relaxed text-lg">
                    There are currently no items to display in this category. Check back later for new scientific endeavors.
                </p>
            </div>
        ) : activeStatus === '404' ? (
            // 404 STATE - HIGH LEGIBILITY REPLACEMENT
            <div className="w-full h-[750px] flex flex-col items-center justify-center border-l border-r border-b border-ink/10 relative overflow-hidden bg-paper">
                <div className="flex flex-col items-center justify-center text-center p-12">
                     <h1 className="text-[160px] font-sans font-black text-ink leading-none tracking-tighter mb-4">404</h1>
                     <h2 className="text-5xl font-sans font-bold text-ink mb-8">Page Not Found</h2>
                     <p className="text-xl text-ink/70 max-w-xl leading-relaxed">
                        The page you are looking for does not exist or has been moved. 
                     </p>
                     <button 
                        onClick={() => setActiveStatus('ALL')}
                        className="mt-12 bg-ink text-paper px-10 py-4 rounded-full font-mono text-base font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                     >
                        Reset Filters
                     </button>
                </div>
            </div>
        ) : (
            // PROJECT GRID
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-r border-ink/10">
              {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
              ) : (
                  // Fallback for empty filter results that aren't the "Empty" page
                  <div className="col-span-full py-32 flex flex-col items-center justify-center bg-stone/5">
                     <span className="font-mono text-base text-ink/60 uppercase tracking-widest font-bold">No projects found</span>
                  </div>
              )}
            </div>
        )}
      </section>

      <section className="py-24 px-6 border-b border-ink/10 text-center">
        <h3 className="font-sans text-4xl md:text-6xl mb-8 leading-tight font-bold text-ink">
          Science changes the world,<br />
          We are changing the way science happens.
        </h3>
        <p className="font-sans text-ink/70 max-w-3xl mx-auto mb-12 text-xl leading-relaxed">
            This is a reconstruction of civilization — from the bricklayers of Babel,<br className="hidden md:block" />
            to building the future engine of research for all humankind.
        </p>
        
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center items-stretch max-w-lg mx-auto">
            <input 
                type="email"
                placeholder="EMAIL ADDRESS" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 bg-surface border border-ink/20 px-6 py-5 font-mono text-base text-ink focus:outline-none focus:border-accent focus:z-10 placeholder-ink/40 transition-colors rounded-none"
            />
            <button 
                type="submit"
                className="bg-ink text-paper px-10 py-5 font-mono text-base font-bold hover:bg-accent transition-colors uppercase tracking-widest whitespace-nowrap"
            >
                Subscribe
            </button>
        </form>
      </section>
    </main>
  );
};