import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, MoreVertical, BookOpen, FileText, PenTool, Database, Palette } from 'lucide-react';
import { AiTool, AiToolCategory } from '../../types';

// Icon mapping based on tool category
const getCategoryIcon = (category: AiToolCategory) => {
    const iconMap: Record<AiToolCategory, React.ComponentType<any>> = {
        'Literature': BookOpen,
        'Reading': FileText,
        'Writing': PenTool,
        'Data': Database,
        'Design': Palette,
    };
    return iconMap[category] || Sparkles;
};

interface ChatHeaderProps {
    tool: AiTool;
    onClearHistory: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ tool, onClearHistory }) => {
    return (
        <div className="bg-surface border-b border-ink/10 px-6 md:px-12 py-4 shrink-0">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to={`/ai-market/${tool.id}`} className="p-2 text-ink/40 hover:text-ink transition-colors bg-stone/5 hover:bg-stone/10 rounded-full">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center">
                            {(() => {
                                const IconComponent = getCategoryIcon(tool.category);
                                return <IconComponent size={16} className="text-paper" strokeWidth={1.5} />;
                            })()}
                        </div>
                        <div>
                            <h1 className="font-bold text-sm text-ink">{tool.name}</h1>
                            <span className="text-[10px] font-mono text-ink/40 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles size={10} /> Powered by {tool.modelPoweredBy}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClearHistory}
                        className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                    >
                        Clear History
                    </button>
                    <button className="p-2 text-ink/40 hover:text-ink transition-colors"><MoreVertical size={18} /></button>
                </div>
            </div>
        </div>
    );
};
