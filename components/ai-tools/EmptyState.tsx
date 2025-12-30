import React from 'react';
import { FolderHeart, SearchX, Sparkles } from 'lucide-react';
import { MarketCategory } from '../../utils/aiTools';

interface EmptyStateProps {
    type: 'FAVORITES' | 'SEARCH' | 'EMPTY';
    searchQuery?: string;
    onClearSearch?: () => void;
    onRequestTool?: () => void;
    onBrowseTools?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery, onClearSearch, onRequestTool, onBrowseTools }) => {
    if (type === 'FAVORITES') {
        return (
            <div className="max-w-sm mx-auto animate-in fade-in zoom-in duration-500">
                <FolderHeart size={48} className="mx-auto text-ink/10 mb-6" />
                <h3 className="font-sans text-xl font-bold text-ink mb-3 uppercase tracking-tight">Your Toolbox is Empty</h3>
                <p className="text-ink/40 text-sm leading-relaxed mb-8">Add specialized tools to your private laboratory for easier access.</p>
                <button
                    onClick={onBrowseTools}
                    className="px-8 py-3 bg-ink text-paper rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all"
                >
                    Browse Tools
                </button>
            </div>
        );
    }

    if (type === 'SEARCH') {
        return (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-ink/5">
                    <SearchX size={32} className="text-ink/20" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-ink mb-6 uppercase tracking-tighter">No results found for "{searchQuery}"</h3>
                <button
                    onClick={onClearSearch}
                    className="px-10 py-4 border border-ink/10 text-ink/60 hover:text-ink rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all hover:border-ink/30"
                >
                    Clear Search
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-sm mx-auto animate-in fade-in duration-500">
            <Sparkles size={40} className="mx-auto text-ink/10 mb-6" />
            <h3 className="font-sans text-xl font-bold text-ink/20 uppercase tracking-widest">No matching agents found</h3>
            <p className="text-ink/30 text-sm mt-4">Adjust your filters to see more specialized tools.</p>
        </div>
    );
};

