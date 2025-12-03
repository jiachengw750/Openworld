
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, CheckCircle, Verified, X, MessageSquare, Briefcase, FileText, DollarSign, ExternalLink, Code, Terminal, Layers } from 'lucide-react';
import { QUESTS } from '../constants';
import { useToast } from '../context/ToastContext';
import { BidModal } from '../components/modals/BidModal';

export const QuestDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [quest, setQuest] = useState(QUESTS.find(q => q.id === id));
    const { showToast } = useToast();
    
    // UI State
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'REQUIREMENT' | 'COMMENT'>('GENERAL');
    const [isShared, setIsShared] = useState(false);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    
    // Calculated Exchange Rate (USD value per 1 unit of currency)
    const exchangeRate = quest && quest.reward.amount > 0 
        ? quest.reward.usdValue / quest.reward.amount 
        : 1;

    if (!quest) {
        return <div className="p-12 text-center">Quest not found</div>;
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        showToast('Link copied');
        setTimeout(() => setIsShared(false), 2000);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const handleBidSubmit = (bidData: any) => {
        // Update local state to reflect new bidder (Simulation)
        setQuest(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                bidderCount: prev.bidderCount + 1,
                // Add a mock avatar to bidders list
                bidders: ['https://i.pravatar.cc/150?u=999', ...prev.bidders]
            };
        });
        showToast("Bid submitted successfully");
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Breadcrumb Area */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 pt-12 pb-6">
                 <div className="flex items-center text-xs font-mono font-bold text-ink/40 uppercase tracking-widest">
                    <Link to="/quest" className="hover:text-ink transition-colors">Quest</Link>
                    <span className="mx-2">/</span>
                    <Link to="/quest" className="hover:text-ink transition-colors">Reward Task</Link>
                    <span className="mx-2">/</span>
                    <span className="text-ink">Task detail</span>
                 </div>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Content */}
                <div className="lg:col-span-8">
                    
                    {/* Hero Image */}
                    <div className="w-full aspect-[21/9] bg-stone/10 mb-8 overflow-hidden rounded-sm border border-ink/10 relative">
                        {quest.image && (
                            <img src={quest.image} alt={quest.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Metadata Header (Status & Subjects) */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        {/* Status Pill */}
                        <div className={`inline-flex items-center px-3 py-1.5 border border-ink rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest ${
                            quest.status === 'RECRUITING' ? 'bg-paper text-ink' : 
                            quest.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-ink/60 border-ink/20'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${quest.status === 'RECRUITING' ? 'bg-accent animate-pulse' : 'bg-current'}`}></div>
                            {quest.status.replace('_', ' ')}
                        </div>

                        {/* Divider */}
                        <div className="w-px h-4 bg-ink/10 hidden sm:block"></div>

                        {/* Subject Pills */}
                        <div className="flex gap-2">
                            {quest.subjects?.map((subject) => (
                                <span key={subject} className="flex items-center px-3 py-1.5 bg-stone/5 text-ink text-[10px] font-mono font-bold uppercase tracking-widest border border-ink/5 rounded-sm hover:border-ink/20 transition-colors cursor-default">
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-sans text-4xl md:text-5xl font-bold text-ink mb-8 leading-tight">
                        {quest.title}
                    </h1>

                    {/* Author Card */}
                    <div className="bg-stone/5 border border-ink/5 p-6 rounded-sm flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <img src={quest.author.avatar} alt={quest.author.name} className="w-16 h-16 rounded-full border-2 border-paper" />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-xs font-mono text-ink/40 uppercase tracking-widest font-bold">Publisher</span>
                                    <div className="flex gap-1">
                                         <div className="w-4 h-4 rounded-full bg-stone/20"></div>
                                         <div className="w-4 h-4 rounded-full bg-stone/20"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-sans text-xl font-bold text-ink">{quest.author.name}</h3>
                                    {quest.author.verified && <Verified size={16} className="text-ink" />}
                                </div>
                                <span className="text-xs font-mono text-ink/50">Quantum Computing, Massachusetts Institute of Technology</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-amber-600 font-serif italic">
                            <span>🏆</span>
                            <span>Nobel Prize in 2020</span>
                        </div>
                    </div>

                    {/* Short Desc */}
                    <div className="prose prose-stone max-w-none font-sans text-ink/80 mb-12">
                         <p className="whitespace-pre-wrap leading-relaxed text-lg">{quest.fullDescription}</p>
                    </div>

                    {/* Tabs / Bottom Links */}
                    <div className="flex space-x-8 mb-12 border-t border-ink/10 pt-6">
                         <button className="text-sm font-mono font-bold text-ink/40 hover:text-ink uppercase tracking-widest flex items-center gap-2 transition-colors">
                            <FileText size={16} /> Requirement
                        </button>
                        <button className="text-sm font-mono font-bold text-ink/60 hover:text-ink uppercase tracking-widest flex items-center gap-2 transition-colors">
                            <MessageSquare size={16} /> Comment({quest.commentsCount})
                        </button>
                    </div>

                    {/* Comments Section Header */}
                    <div>
                        <h3 className="font-sans text-2xl font-bold text-ink mb-6">Comment ({quest.commentsCount})</h3>
                        <div className="border border-ink/10 rounded-sm p-4 h-32 text-ink/40 font-mono text-sm">
                            Write down your question or comment
                        </div>
                    </div>

                </div>

                {/* Right Column: Sticky Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 space-y-6">
                        
                        {/* Award Box */}
                        <div className="bg-paper border border-ink/10 p-8 rounded-sm shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-ink/60">
                                <DollarSign size={16} />
                                <span className="font-bold font-mono text-xs uppercase tracking-widest">Task Award</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-xl font-bold font-mono text-ink bg-ink text-paper px-2 py-0.5 rounded-sm">{quest.reward.currency}</span>
                                <span className="text-4xl font-bold font-mono text-ink">{formatNumber(quest.reward.amount)}</span>
                            </div>
                            <div className="text-ink/40 font-mono text-lg font-bold mb-6">≈ ${quest.reward.usdValue}</div>
                            
                            <p className="text-xs text-ink/40 leading-relaxed border-t border-ink/10 pt-4">
                                Support and settlement are out of scope for this phase
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button 
                                onClick={() => setIsBidModalOpen(true)}
                                className="w-full bg-ink text-paper py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg"
                            >
                                Bid Now
                            </button>
                            <button className="w-full bg-paper border border-ink/10 text-ink py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors">
                                View Publisher's Profile
                            </button>
                        </div>

                        {/* Tech Stack / Requirements Card */}
                        <div className="bg-paper border border-ink/10 p-6 rounded-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-sans text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                    <Terminal size={14} className="text-ink/60"/> Required Skills
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quest.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-stone/5 border border-ink/10 rounded-sm text-[10px] font-mono font-bold uppercase text-ink/70">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* General Info Section */}
                        <div className="bg-paper border border-ink/10 p-6 rounded-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-sans text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                    <Layers size={14} className="text-ink/60"/> General Info
                                </h4>
                            </div>

                            <div className="space-y-6">
                                {/* Bid Deadline */}
                                <div>
                                    <h5 className="font-sans text-xs font-bold text-ink/50 uppercase tracking-widest mb-1">Bid deadline</h5>
                                    <p className="font-mono text-sm font-bold text-ink mb-1">{quest.endTime.split(' ')[0]}</p>
                                    <p className="text-[10px] font-mono text-ink/40">Ends in 32D 00H</p>
                                </div>

                                {/* Delivery Time */}
                                <div>
                                    <h5 className="font-sans text-xs font-bold text-ink/50 uppercase tracking-widest mb-1">Delivery time</h5>
                                    <p className="font-mono text-sm font-bold text-ink mb-1">{quest.deliveryTime.split(' ')[0]}</p>
                                    <p className="text-[10px] font-mono text-ink/40">Negotiable</p>
                                </div>

                                {/* Bidders */}
                                <div className="pt-4 border-t border-ink/5">
                                    <h5 className="font-sans text-xs font-bold text-ink/50 uppercase tracking-widest mb-3">Recent Bidders ({quest.bidderCount})</h5>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {quest.bidders.slice(0, 4).map((avatar, idx) => (
                                            <div key={idx} className="flex items-center bg-stone/5 border border-ink/5 pr-3 rounded-full pl-1 py-1">
                                                <img src={avatar} className="w-5 h-5 rounded-full mr-2" alt="bidder"/>
                                                <span className="text-[10px] font-bold font-mono text-ink/70">Dr. {['Jack', 'Howhawrd', 'Li', 'Smith'][idx % 4]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-stone/5 p-6 rounded-sm border border-ink/5 flex gap-3">
                            <Briefcase size={16} className="text-ink/40 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-ink/50 leading-relaxed font-mono">
                                After awarding, the bidding will automatically close and notify the relevant candidates.
                            </p>
                        </div>

                    </div>
                </div>

            </div>

            <BidModal 
                isOpen={isBidModalOpen}
                onClose={() => setIsBidModalOpen(false)}
                questTitle={quest.title}
                maxReward={quest.reward.amount}
                currency={quest.reward.currency}
                exchangeRate={exchangeRate}
                onBidSubmit={handleBidSubmit}
            />
        </div>
    );
};
