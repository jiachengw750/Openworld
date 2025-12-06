
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Check, X, Edit3, Trash2, Building2, 
  ArrowUpToLine, Eye, EyeOff, ThumbsUp, MessageSquare, Star 
} from 'lucide-react';
import { ProjectCard } from '../ProjectCard';

// --- Types ---
export interface StoryItem { id: string; date: string; title: string; description: string; }
export interface IdaArticle { id: string; title: string; description: string; tags: string[]; isFeatured: boolean; publicationDate: string; likes: number; comments: number; isPinned: boolean; isHidden: boolean; }
export interface ReviewItem { id: string; status: string; rating: number; title: string; description: string; publicationDate: string; }

// --- TagSection ---
export const TagSection: React.FC<{ 
    title: string; 
    tags: string[]; 
    onAdd: (tag: string) => void; 
    onRemove: (index: number) => void;
    bgClass?: string;
}> = ({ title, tags, onAdd, onRemove, bgClass = 'bg-stone/5' }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [val, setVal] = useState('');
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setIsAdding(false);
            }
        };
        if (isAdding) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isAdding]);

    const submit = () => {
        if (val.trim()) onAdd(val.trim());
        setVal('');
        setIsAdding(false);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink/50">{title}</h3>
                <button onClick={() => setIsAdding(true)} className="text-ink/40 hover:text-ink transition-colors"><Plus size={14}/></button>
                {isAdding && (
                    <div ref={inputRef} className="flex items-center bg-white border border-ink/10 rounded-sm px-2 py-0.5 animate-in fade-in slide-in-from-left-2 duration-200">
                        <input autoFocus className="bg-transparent text-xs font-mono p-1 outline-none w-32 text-ink" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); if(e.key === 'Escape') setIsAdding(false); }} placeholder="Add..." />
                        <button onClick={submit} className="text-green-600 hover:text-green-700 ml-1"><Check size={14}/></button>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                    <div key={i} className="group relative">
                        <span className={`px-3 py-1.5 border ${title === 'Subjects' ? 'border-ink/10 text-ink/70' : 'border-ink/10 text-ink/70'} rounded-sm text-xs font-mono font-bold cursor-default block ${bgClass}`}>{t}</span>
                        <button onClick={() => onRemove(i)} className={`absolute -top-1 -right-1 bg-ink text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}><X size={10}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Tabs ---

export const StoryTab: React.FC<{ 
    stories: StoryItem[]; 
    onAdd: () => void; 
    onEdit: (item: StoryItem) => void; 
    onDelete: (id: string) => void; 
}> = ({ stories, onAdd, onEdit, onDelete }) => (
    <div className="relative border-l-2 border-ink/10 ml-4 md:ml-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
        
        {/* Add Button Node */}
        <div className="relative pl-12 mb-12 flex items-center h-10">
            <div className="absolute -left-[20px] top-0 z-10">
                <button 
                    onClick={onAdd} 
                    className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-accent transition-colors shadow-lg group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
            <button onClick={onAdd} className="text-sm font-mono font-bold text-ink/40 uppercase tracking-widest hover:text-ink transition-colors ml-2">
                Add New Event
            </button>
        </div>

        {stories.map((story) => (
            <div key={story.id} className="relative pl-12 mb-12 last:mb-0 group">
                {/* Dot aligned with top content */}
                <div className="absolute -left-[8px] top-9 w-4 h-4 rounded-full bg-paper border-4 border-ink group-hover:border-accent transition-colors z-10"></div>
                
                <div className="bg-transparent border border-ink/10 p-8 rounded-sm hover:bg-stone/5 transition-all relative">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs font-bold text-ink/50 uppercase tracking-widest">{story.date}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(story)} className="p-2 hover:bg-stone/10 rounded-full text-ink/60 hover:text-ink"><Edit3 size={14}/></button>
                            <button onClick={() => onDelete(story.id)} className="p-2 hover:bg-stone/10 rounded-full text-ink/60 hover:text-ink"><Trash2 size={14}/></button>
                        </div>
                    </div>
                    <h3 className="font-sans text-xl font-bold text-ink mb-3 leading-tight">{story.title}</h3>
                    <p className="font-sans text-ink/70 leading-relaxed">{story.description}</p>
                </div>
            </div>
        ))}
    </div>
);

export const ProjectsTab: React.FC<{ projects: any[] }> = ({ projects }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 gap-6">
            {projects.length > 0 ? (
                projects.map(project => <ProjectCard key={project.id} project={project} variant="card" />)
            ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-ink/10 bg-stone/5 rounded-sm">
                    <Building2 size={40} className="mx-auto text-ink/20 mb-4" />
                    <h3 className="font-bold text-ink/40 uppercase tracking-widest">No Projects Yet</h3>
                </div>
            )}
        </div>
    </div>
);

export const IdaTab: React.FC<{ 
    articles: IdaArticle[]; 
    onTogglePin: (id: string) => void; 
    onToggleHide: (id: string) => void; 
}> = ({ articles, onTogglePin, onToggleHide }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {articles.map(article => (
            <div key={article.id} className={`bg-transparent border border-ink/10 p-8 rounded-sm hover:bg-stone/5 transition-all group ${article.isHidden ? 'opacity-50 grayscale' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {article.isPinned && <ArrowUpToLine size={16} className="text-accent" />}
                        <div className="flex gap-2">
                            {article.tags.map(tag => (
                                <span key={tag} className="inline-block px-4 py-1.5 border-2 border-[#CCCCCC] rounded-sm text-xs font-mono font-bold uppercase tracking-widest text-ink bg-white w-fit">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onTogglePin(article.id)} className={`p-2 rounded-full hover:bg-stone/10 ${article.isPinned ? 'text-accent' : 'text-ink/40'}`} title="Pin"><ArrowUpToLine size={16}/></button>
                        <button onClick={() => onToggleHide(article.id)} className="p-2 rounded-full hover:bg-stone/10 text-ink/40 hover:text-ink" title={article.isHidden ? "Show" : "Hide"}>{article.isHidden ? <Eye size={16}/> : <EyeOff size={16}/>}</button>
                    </div>
                </div>
                <h3 className="font-sans text-2xl font-bold text-ink mb-3 group-hover:text-accent transition-colors cursor-pointer">{article.title}</h3>
                <p className="font-sans text-ink/70 leading-relaxed mb-6 line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between text-sm text-ink/40 font-mono font-bold">
                    <span>{article.publicationDate}</span>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5"><ThumbsUp size={14}/> {article.likes}</span>
                        <span className="flex items-center gap-1.5"><MessageSquare size={14}/> {article.comments}</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const ReviewsTab: React.FC<{ reviews: ReviewItem[] }> = ({ reviews }) => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {reviews.map(review => (
            <div key={review.id} className="bg-transparent border border-ink/10 p-8 rounded-sm hover:bg-stone/5 transition-all group flex flex-col gap-6 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="inline-block px-4 py-1.5 border-2 border-[#CCCCCC] rounded-sm text-xs font-mono font-bold uppercase tracking-widest text-ink bg-white w-fit">{review.status}</span>
                        <div className="flex items-center gap-1.5 text-ink">
                            <Star size={16} className="fill-current text-yellow-500" />
                            <span className="font-mono text-sm font-bold pt-0.5">{review.rating}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-mono font-bold text-ink/40">
                        <span>{review.publicationDate}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-sans text-2xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">{review.title}</h3>
                    <p className="font-sans text-ink/70 text-base leading-relaxed">{review.description}</p>
                </div>
            </div>
        ))}
    </div>
);
