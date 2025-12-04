
import React from 'react';
import { Link } from 'react-router-dom';
import { Quest, QuestStatus } from '../../types';
import { MessageSquare, Verified, ArrowRight } from 'lucide-react';

interface QuestCardProps {
    quest: Quest;
    onClick?: () => void; // Optional now
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
    
    const getStatusStyle = (status: QuestStatus) => {
        switch(status) {
            case 'RECRUITING': return 'bg-transparent border border-ink text-ink';
            case 'IN_PROGRESS': return 'bg-stone/10 border border-ink/10 text-ink/60';
            case 'COMPLETED': return 'bg-green-50 border border-green-200 text-green-700';
            default: return 'border border-ink/10 text-ink/40';
        }
    };

    const getStatusIcon = (status: QuestStatus) => {
        switch(status) {
            case 'RECRUITING': return <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2"></span>;
            case 'IN_PROGRESS': return <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>;
            case 'COMPLETED': return <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>;
            default: return null;
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    return (
        <Link 
            to={`/quest/${quest.id}`}
            className="block group bg-paper border border-ink/10 p-6 md:p-8 hover:border-ink/40 hover:shadow-lg transition-all duration-300 cursor-pointer relative"
        >
            {/* Header: Status & Tags */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className={`flex items-center px-3 py-1.5 rounded-sm text-xs font-mono font-bold uppercase tracking-widest w-fit ${getStatusStyle(quest.status)}`}>
                    {getStatusIcon(quest.status)}
                    {quest.status.replace('_', ' ')}
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {/* Subjects - Prominent Style */}
                    {quest.subjects?.map((subject, idx) => (
                        <span key={`subj-${idx}`} className="px-2 py-1 bg-paper border border-ink text-[10px] font-mono text-ink font-bold uppercase tracking-wide">
                            {subject}
                        </span>
                    ))}
                    
                    {/* Tags - Subtle Style */}
                    {quest.tags.map((tag, idx) => (
                        <span key={`tag-${idx}`} className="px-2 py-1 bg-stone/5 border border-ink/5 rounded-sm text-[10px] font-mono text-ink/60 font-bold uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="mb-8">
                <h3 className="text-2xl font-sans font-bold text-ink mb-3 leading-tight group-hover:text-accent transition-colors">
                    {quest.title}
                </h3>
                <p className="text-ink/60 font-sans text-base leading-relaxed line-clamp-2">
                    {quest.shortDescription}
                </p>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 border-t border-b border-ink/5 py-6">
                <div>
                    <span className="block text-[10px] font-mono font-bold text-ink/40 uppercase tracking-widest mb-1">End Time</span>
                    <span className="block font-mono text-sm font-bold text-ink">{quest.endTime.split(' ')[0]}</span>
                </div>
                <div>
                    <span className="block text-[10px] font-mono font-bold text-ink/40 uppercase tracking-widest mb-1">Delivery Time</span>
                    <span className="block font-mono text-sm font-bold text-ink">{quest.deliveryTime.split(' ')[0]}</span>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <span className="block text-[10px] font-mono font-bold text-ink/40 uppercase tracking-widest mb-1">Reward Amount</span>
                    <div className="flex items-baseline gap-2">
                        <span className="block font-mono text-lg font-bold text-ink">{quest.reward.currency} {formatNumber(quest.reward.amount)}</span>
                        <span className="text-xs font-mono text-ink/40">≈ ${quest.reward.usdValue}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between h-10">
                <div className="flex items-center gap-3">
                    <img src={quest.author.avatar} alt={quest.author.name} className="w-8 h-8 rounded-full bg-stone/10 border border-ink/10" />
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold font-sans text-ink uppercase tracking-wider">{quest.author.name}</span>
                        {quest.author.verified && <Verified size={12} className="text-blue-500 fill-current" />}
                        <span className="text-ink/40 text-xs ml-2 font-mono">{quest.bidderCount > 0 ? '• ' + quest.bidderCount + 'h ago' : ''}</span> 
                    </div>
                </div>

                {/* Interactive Right Side: Swaps content on hover */}
                <div className="relative h-full flex items-center justify-end min-w-[200px]">
                    {/* Default View: Bidders & Comments */}
                    <div className="flex items-center gap-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-4 absolute right-0">
                        <div className="flex -space-x-2">
                            {quest.bidders.slice(0, 3).map((url, i) => (
                                <img key={i} src={url} className="w-6 h-6 rounded-full border border-paper" alt="bidder" />
                            ))}
                        </div>
                        {quest.bidderCount > 0 && (
                            <span className="text-xs font-mono font-bold text-ink/50">{quest.bidderCount}+ Bidders</span>
                        )}
                        
                        <div className="flex items-center gap-1.5 bg-ink text-paper px-3 py-1.5 rounded-full">
                             <MessageSquare size={12} fill="currentColor" />
                             <span className="text-xs font-bold font-mono">{quest.commentsCount}</span>
                        </div>
                    </div>

                    {/* Hover View: Action Button */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4 pointer-events-none group-hover:pointer-events-auto">
                         <button className="bg-ink text-paper pl-4 pr-3 py-2 rounded-sm font-mono text-xs font-bold uppercase tracking-widest flex items-center shadow-sm hover:bg-accent transition-colors whitespace-nowrap">
                            Request Access <ArrowRight size={14} className="ml-2" />
                         </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};
