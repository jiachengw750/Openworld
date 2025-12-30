import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Activity, MessageCircle, FileCode, Heart, ArrowRight, Flame, Zap } from 'lucide-react';
import { AiTool } from '../../types';
import { getCategoryIcon } from '../../utils/aiTools';
import { MOCK_COMMUNITY_PROMPTS } from '../../constants';

interface ToolCardProps {
    tool: AiTool;
    isFavorited: boolean;
    onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorited, onToggleFavorite }) => {
    const isTrending = tool.useCount > 80000;
    const isNew = tool.id === 'ut-1' || tool.id === 'ai-4';
    const IconComponent = getCategoryIcon(tool.category);
    const promptCount = tool.prompts.length + (MOCK_COMMUNITY_PROMPTS[tool.id]?.length || 0);

    return (
        <Link
            to={`/ai-market/${tool.id}`}
            className="group flex flex-col bg-white rounded-sm overflow-hidden border border-ink/5 hover:border-ink/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-full relative"
        >
            {/* Activity Badges */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                {isTrending && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent text-paper rounded-sm shadow-lg animate-in fade-in zoom-in duration-700">
                        <Flame size={10} className="fill-current" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Trending</span>
                    </div>
                )}
                {isNew && !isTrending && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-ink text-ink rounded-sm shadow-sm animate-in fade-in slide-in-from-left-4 duration-700">
                        <Zap size={10} className="fill-current text-yellow-500" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest">New</span>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-8 pb-4 flex-1">
                <div className="flex justify-between items-start mb-8 mt-4">
                    <div className="w-16 h-16 bg-ink rounded-sm shadow-sm flex items-center justify-center group-hover:rotate-3 group-hover:scale-110 transition-all duration-700 ease-out">
                        <IconComponent size={28} className="text-paper" strokeWidth={1.5} />
                    </div>
                    <div className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-widest ${tool.sourceType === 'OFFICIAL' ? 'bg-ink text-paper' : 'text-ink/40 border border-ink/10'}`}>
                        {tool.sourceType === 'OFFICIAL' ? 'Native' : 'External'}
                    </div>
                </div>

                <h3 className="font-sans text-2xl font-bold text-ink mb-3 group-hover:text-accent transition-colors leading-tight">{tool.name}</h3>
                <p className="text-sm text-ink/60 leading-relaxed line-clamp-3 mb-6 font-sans">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tool.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-mono font-bold uppercase text-ink/40 tracking-wider">#{tag}</span>
                    ))}
                </div>
            </div>

            {/* Meta Footer */}
            <div className="px-8 py-5 bg-white border-t border-ink/5 flex items-center justify-between group-hover:bg-stone/5 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-ink font-mono text-[10px] font-bold">
                        <Star size={12} className="text-yellow-500 fill-current" />
                        <span>{tool.rating}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-mono text-[10px] font-bold transition-colors ${isTrending ? 'text-accent' : 'text-ink/30'}`}>
                        <Activity size={10} />
                        <span>{(tool.useCount / 1000).toFixed(tool.useCount > 100000 ? 0 : 1)}k</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-ink/30">
                        <MessageCircle size={10} />
                        <span>{tool.reviewCount}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-ink/30">
                        <FileCode size={10} />
                        <span>{promptCount}</span>
                    </div>
                    <div className="w-px h-3 bg-ink/10"></div>
                    <button
                        onClick={(e) => onToggleFavorite(e, tool.id)}
                        className={`flex items-center gap-1 transition-all duration-300 ${isFavorited ? 'text-red-500' : 'text-ink/20 hover:text-ink/40'}`}
                        title={isFavorited ? "Remove from Laboratory" : "Add to Laboratory"}
                    >
                        <Heart size={12} className={isFavorited ? 'fill-current' : ''} />
                    </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-ink group-hover:text-accent transition-all">
                    <span>{tool.sourceType === 'LINK' ? 'Visit' : 'Deploy'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

