import React from 'react';
import { AiSourceType } from '../../types';
import { SOURCE_FILTERS, SORT_OPTIONS } from '../../utils/aiTools';

interface FilterBarProps {
    sourceFilter: AiSourceType | 'ALL';
    sortBy: 'HOT' | 'RATING';
    onSourceChange: (source: AiSourceType | 'ALL') => void;
    onSortChange: (sort: 'HOT' | 'RATING') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ sourceFilter, sortBy, onSourceChange, onSortChange }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <div className="flex items-center gap-10 flex-wrap">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/30">SOURCE</span>
                    <div className="flex bg-stone/5 p-1 rounded-full">
                        {SOURCE_FILTERS.map(source => (
                            <button
                                key={source}
                                onClick={() => onSourceChange(source)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${sourceFilter === source ? 'bg-white text-ink shadow-sm' : 'text-ink/40 hover:text-ink/60'}`}
                            >
                                {source === 'OFFICIAL' ? 'Native' : source === 'LINK' ? 'External' : 'All'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/30">SORT BY</span>
                <div className="flex gap-4">
                    {SORT_OPTIONS.map(sort => (
                        <button
                            key={sort}
                            onClick={() => onSortChange(sort)}
                            className={`text-[11px] font-sans font-black uppercase tracking-wider transition-all px-4 py-1.5 rounded-full border-2 ${sortBy === sort ? 'bg-ink text-paper border-ink' : 'border-ink/5 text-ink/40 hover:border-ink/20'}`}
                        >
                            {sort === 'HOT' ? 'Popularity' : 'Rating'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

