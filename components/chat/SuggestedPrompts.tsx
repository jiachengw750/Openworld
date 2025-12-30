import React from 'react';
import { MessageSquareQuote, Zap, ArrowRight } from 'lucide-react';
import { AiPrompt } from '../../types';

interface SuggestedPromptsProps {
    prompts: AiPrompt[];
    onPromptSelect: (content: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ prompts, onPromptSelect }) => {
    return (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4 text-ink/30">
                <MessageSquareQuote size={14} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Suggested capabilities</span>
            </div>
            <div className="flex flex-wrap gap-3">
                {prompts.map(p => (
                    <button
                        key={p.id}
                        onClick={() => onPromptSelect(p.content)}
                        className="group flex items-center gap-3 px-5 py-3 bg-white border border-ink/10 rounded-full hover:bg-ink hover:border-ink transition-all shadow-sm active:scale-95 text-left"
                    >
                        <Zap size={12} className="text-accent group-hover:text-paper" />
                        <span className="text-xs font-bold text-ink/70 group-hover:text-paper">{p.title}</span>
                        <ArrowRight size={12} className="text-ink/20 group-hover:text-paper group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>
        </div>
    );
};
