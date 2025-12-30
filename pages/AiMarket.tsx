import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Sparkles, Heart } from 'lucide-react';
import { AI_TOOLS } from '../constants';
import { AiSourceType } from '../types';
import { useToast } from '../context/ToastContext';
import { MarketCategory, RESEARCH_DIRECTIONS, getResearchDirectionIcon } from '../utils/aiTools';
import { ToolCard } from '../components/ai-tools/ToolCard';
import { EmptyState } from '../components/ai-tools/EmptyState';
import { FilterBar } from '../components/ai-tools/FilterBar';

export const AiMarket: React.FC = () => {
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<MarketCategory>('ALL');
    const [sourceFilter, setSourceFilter] = useState<AiSourceType | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'HOT' | 'RATING'>('HOT');
    const [isScrolled, setIsScrolled] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const savedFavs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
        setFavorites(savedFavs);
    }, []);

    // Throttled scroll handler
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleToggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
        // CRITICAL: Stop event from bubbling to the parent Link
        e.preventDefault();
        e.stopPropagation();

        setFavorites(prevFavs => {
            const isFavorited = prevFavs.includes(id);
            const newFavs = isFavorited 
                ? prevFavs.filter((f: string) => f !== id)
                : [...prevFavs, id];
            
            localStorage.setItem('user_favorites', JSON.stringify(newFavs));
            showToast(isFavorited ? "Removed from Toolbox" : "Added to your Private Toolbox");
            return newFavs;
        });
    }, [showToast]);

    const handleRequestTool = useCallback(() => {
        const request = searchQuery ? `"${searchQuery}" capability` : "new specialized tool";
        showToast(`Request for ${request} received. Our lab is on it!`);
        setSearchQuery('');
    }, [searchQuery, showToast]);

    const filteredTools = useMemo(() => {
        let tools = [...AI_TOOLS];

        // 1. Filter by Category / Favorites
        if (activeCategory === 'FAVORITES') {
            tools = tools.filter(t => favorites.includes(t.id));
        } else if (activeCategory !== 'ALL') {
            tools = tools.filter(t => t.category === activeCategory);
        }

        // 2. Filter by Source
        if (sourceFilter !== 'ALL') tools = tools.filter(t => t.sourceType === sourceFilter);

        // 3. Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            tools = tools.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // 4. Sort
        if (sortBy === 'HOT') tools.sort((a, b) => b.useCount - a.useCount);
        if (sortBy === 'RATING') tools.sort((a, b) => b.rating - a.rating);

        return tools;
    }, [activeCategory, searchQuery, sourceFilter, sortBy, favorites]);

    return (
        <div className="min-h-screen bg-paper pb-24">

            {/* Hero & Search Area */}
            <div className="bg-white border-b border-ink/5 pt-24 pb-16 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/5 rounded-full mb-6">
                                <Sparkles size={12} className="text-accent" />
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Intelligent Infrastructure</span>
                            </div>
                            <h1 className="font-sans text-5xl md:text-7xl font-black text-ink leading-[0.95] tracking-tighter mb-6">
                                Scientific AI Market.
                            </h1>
                            <p className="text-xl text-ink/60 font-sans max-w-xl leading-relaxed">
                                Deploy advanced specialized agents to accelerate your research pipeline.
                            </p>
                        </div>
                        <div className="w-full max-w-md">
                            <div className="relative group">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search capabilities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-stone/5 border-2 border-transparent p-5 pl-14 rounded-full font-sans text-lg focus:outline-none focus:bg-white focus:border-ink transition-all placeholder:text-ink/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Research Directions & Stages Navigation */}
            <div
                className={`sticky z-40 bg-paper/95 border-b border-ink/5 backdrop-blur-md transition-all duration-500 ease-in-out ${isScrolled ? 'top-[72px] shadow-sm' : 'top-[88px]'
                    }`}
            >
                <div className="max-w-[1512px] mx-auto px-6 md:px-12">
                    <div className="flex items-center py-6 gap-3 overflow-x-auto scrollbar-hide">
                        {RESEARCH_DIRECTIONS.map((direction) => (
                            <button
                                key={direction.id}
                                onClick={() => {
                                    setActiveCategory(direction.id);
                                }}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 shrink-0 ${activeCategory === direction.id
                                    ? 'bg-ink text-paper border-ink shadow-md scale-105'
                                    : 'bg-white border-ink/5 text-ink/60 hover:border-ink/20 hover:text-ink hover:shadow-sm hover:-translate-y-0.5'
                                    }`}
                            >
                                {(() => {
                                    const Icon = getResearchDirectionIcon(direction.id);
                                    return <Icon size={16} className={`transition-colors ${activeCategory === direction.id ? (direction.id === 'FAVORITES' ? 'fill-current text-red-400' : 'text-paper') : 'text-ink/40 group-hover:text-ink'}`} strokeWidth={direction.id === 'FAVORITES' ? 0 : 2} />;
                                })()}
                                <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                                    {direction.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-16">

                <FilterBar
                    sourceFilter={sourceFilter}
                    sortBy={sortBy}
                    onSourceChange={setSourceFilter}
                    onSortChange={setSortBy}
                />

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTools.map(tool => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            isFavorited={favorites.includes(tool.id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}

                    {filteredTools.length === 0 && (
                        <div className="col-span-full py-24 md:py-32 text-center bg-stone/5 border-2 border-dashed border-ink/5 rounded-sm px-6">
                            <EmptyState
                                type={activeCategory === 'FAVORITES' ? 'FAVORITES' : searchQuery ? 'SEARCH' : 'EMPTY'}
                                searchQuery={searchQuery}
                                onClearSearch={() => setSearchQuery('')}
                                onRequestTool={handleRequestTool}
                                onBrowseTools={() => setActiveCategory('ALL')}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

