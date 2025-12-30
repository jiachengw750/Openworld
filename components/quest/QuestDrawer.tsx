import React from 'react';
import { X, Calendar, DollarSign, MessageSquare, Share2, Briefcase } from 'lucide-react';
import { Quest } from '../../types';

interface QuestDrawerProps {
    quest: Quest | null;
    isOpen: boolean;
    onClose: () => void;
}

export const QuestDrawer: React.FC<QuestDrawerProps> = ({ quest, isOpen, onClose }) => {
    // We keep the drawer rendered even if quest is null (it will slide out)
    // But content needs quest. The parent handles the delay of setting quest to null.
    const content = quest;

    return (
        <div 
            className={`fixed inset-0 z-[60] flex justify-end pointer-events-none`}
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-ink/20 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            ></div>

            {/* Drawer Panel */}
            <div 
                className={`relative w-full max-w-2xl h-full bg-paper shadow-2xl border-l border-ink/10 transform transition-transform duration-500 ease-in-out flex flex-col pointer-events-auto ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {content ? (
                    <>
                        {/* Header Actions */}
                        <div className="flex items-center justify-between p-6 border-b border-ink/10 bg-surface">
                            <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/40">Quest Details #{content.id}</span>
                            <div className="flex gap-4">
                                <button className="text-ink/60 hover:text-ink transition-colors p-2 hover:bg-stone/5 rounded-full">
                                    <Share2 size={18} />
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="text-ink/60 hover:text-red-600 transition-colors p-2 hover:bg-stone/5 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12">
                            
                            {/* Status Pill */}
                            <div className="mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-mono font-bold uppercase tracking-widest border ${
                                     content.status === 'RECRUITING' ? 'border-ink text-ink' : 
                                     content.status === 'COMPLETED' ? 'border-green-200 text-green-700 bg-green-50' : 
                                     'border-ink/20 text-ink/60'
                                }`}>
                                    {content.status.replace('_', ' ')}
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-sans font-bold text-ink mb-6 leading-tight">
                                {content.title}
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-10">
                                 {content.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-stone/5 border border-ink/5 rounded-sm text-xs font-mono text-ink/70 font-bold uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-10 p-6 bg-stone/5 rounded-sm border border-ink/5">
                                <div className="col-span-2 md:col-span-1">
                                    <span className="flex items-center text-xs font-mono font-bold text-ink/40 uppercase tracking-widest mb-2">
                                        <DollarSign size={14} className="mr-1"/> Reward
                                    </span>
                                    <span className="text-2xl font-mono font-bold text-ink">{content.reward.currency} {new Intl.NumberFormat('en-US').format(content.reward.amount)}</span>
                                    <span className="block text-xs font-mono text-ink/40 mt-1">≈ ${content.reward.usdValue} USD</span>
                                </div>
                                 <div className="col-span-2 md:col-span-1">
                                    <span className="flex items-center text-xs font-mono font-bold text-ink/40 uppercase tracking-widest mb-2">
                                        <Calendar size={14} className="mr-1"/> Deadlines
                                    </span>
                                    <div className="flex flex-col">
                                        <div className="flex justify-between text-sm font-mono text-ink font-bold border-b border-ink/5 pb-1 mb-1">
                                            <span className="opacity-60">End:</span>
                                            <span>{content.endTime}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-mono text-ink font-bold">
                                            <span className="opacity-60">Deliver:</span>
                                            <span>{content.deliveryTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Author Section */}
                            <div className="flex items-center space-x-4 mb-12 p-4 border border-ink/10 rounded-sm">
                                <img src={content.author.avatar} alt={content.author.name} className="w-12 h-12 rounded-full border border-ink/10" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono uppercase tracking-widest text-ink/40 font-bold">Published By</span>
                                    <span className="text-sm font-bold font-sans text-ink">{content.author.name}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-stone max-w-none font-sans">
                                <h3 className="text-xl font-bold uppercase font-mono tracking-widest text-ink mb-4">Description</h3>
                                <p className="text-ink/80 leading-loose whitespace-pre-wrap mb-8">
                                    {content.fullDescription}
                                </p>
                            </div>

                            {/* Activity */}
                            <div className="mt-12 pt-10 border-t border-ink/10">
                                <h3 className="text-sm font-bold uppercase font-mono tracking-widest text-ink mb-6">Recent Activity</h3>
                                <div className="flex items-center space-x-2 text-sm text-ink/60">
                                     <MessageSquare size={16} />
                                     <span className="font-bold">{content.commentsCount} Comments</span>
                                     <span className="mx-2">•</span>
                                     <Briefcase size={16} />
                                     <span className="font-bold">{content.bidderCount} Bids Submitted</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-ink/10 bg-paper sticky bottom-0">
                            <button className="w-full bg-ink text-paper py-5 rounded-sm font-mono text-base font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg flex items-center justify-center space-x-3">
                                 <Briefcase size={18} />
                                 <span>Apply for Quest</span>
                            </button>
                            <p className="text-center text-[10px] font-mono text-ink/40 mt-4 uppercase tracking-wider">
                                Requires Wallet Signature • 5 SCI Stake
                            </p>
                        </div>
                    </>
                ) : (
                    // Loading or Empty State if needed, though parent handles unmounting logic mostly
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-ink/10 border-t-ink rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
};