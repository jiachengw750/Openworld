
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Star, User, MessageSquare, Shield, ChevronDown, ChevronUp, Building2, Trophy, Activity, Briefcase } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';
import { MOCK_BIDDERS } from '../constants'; // Import shared data

export const QuestSelection: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    // Local state for immediate selection if needed, though mostly handled in details page now
    // We can keep quick select or just rely on the details page
    const [selectedBidderId, setSelectedBidderId] = useState<string | null>(null);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock Quest Info
    const quest = {
        title: "High-Fidelity 3D Rendering of Molecular Docking Interactions",
        budget: 5000,
        currency: 'USDC',
        deadline: '10 Days',
        bidsCount: 12
    };

    // Quick select handler (optional, but good to keep if user wants to bypass details)
    // For now, let's make the whole card clickable to go to details
    const handleCardClick = (bidderId: string) => {
        navigate(`/workspace/quest/${id}/selection/${bidderId}`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/workspace" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest mb-6 w-fit">
                        <ArrowLeft size={14} className="mr-2" /> Back to Workspace
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-accent text-paper px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
                                    Recruiting
                                </span>
                                <span className="font-mono text-xs font-bold text-ink/40 uppercase tracking-widest">
                                    Quest #{id}
                                </span>
                            </div>
                            <h1 className="font-sans text-3xl md:text-4xl font-bold text-ink mb-4 max-w-3xl leading-tight">
                                {quest.title}
                            </h1>
                        </div>
                        
                        <div className="flex gap-8 border-t lg:border-t-0 border-ink/10 pt-6 lg:pt-0">
                            <div>
                                <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Budget</span>
                                <span className="font-sans text-2xl font-bold text-ink">{formatCurrency(quest.budget)}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Applicants</span>
                                <span className="font-sans text-2xl font-bold text-ink">{quest.bidsCount}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Time Left</span>
                                <span className="font-sans text-2xl font-bold text-ink">4D 12H</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bidders List */}
            <div className="max-w-[1000px] mx-auto px-6 md:px-12 mt-12 space-y-6">
                
                {/* Sort / Filter Bar */}
                <div className="flex justify-between items-center pb-4 border-b border-ink/10">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/40">Applicant Ranking</span>
                    <div className="flex gap-4">
                        <button className="text-xs font-mono font-bold uppercase text-ink hover:text-accent flex items-center gap-1">
                            Lex Score <ChevronDown size={12}/>
                        </button>
                        <button className="text-xs font-mono font-bold uppercase text-ink/40 hover:text-ink flex items-center gap-1">
                            Bid Amount <ChevronDown size={12}/>
                        </button>
                    </div>
                </div>

                {MOCK_BIDDERS.map((bidder, index) => (
                    <div 
                        key={bidder.id}
                        className={`bg-paper border transition-all duration-300 group overflow-hidden border-ink/10 hover:border-ink/30 hover:shadow-sm rounded-sm cursor-pointer`}
                        onClick={() => handleCardClick(bidder.id)}
                    >
                        {/* Compact Row */}
                        <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                            
                            {/* Rank & Avatar */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <span className="font-mono text-ink/20 font-bold text-lg w-6">#{index + 1}</span>
                                <img src={bidder.avatar} alt={bidder.name} className="w-12 h-12 rounded-full object-cover border border-ink/10" />
                                <div>
                                    <h4 className="font-bold text-ink text-sm flex items-center gap-2">
                                        {bidder.name}
                                        {bidder.lex > 800 && <Shield size={12} className="text-blue-500 fill-current" />}
                                    </h4>
                                    <span className="text-xs text-ink/50 font-mono">{bidder.institution}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex-1 flex flex-wrap gap-2">
                                {bidder.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-stone/5 border border-ink/5 rounded-sm text-[10px] font-mono font-bold text-ink/60 uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-8 text-right min-w-[200px] justify-between md:justify-end">
                                <div>
                                    <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold">Lex Score</span>
                                    <span className="font-bold text-ink font-mono text-lg">{bidder.lex}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold">Bid</span>
                                    <span className="font-bold text-ink font-mono text-lg">{formatCurrency(bidder.amount)}</span>
                                </div>
                                <div className="hidden md:block text-ink/20 group-hover:text-ink/60 transition-colors">
                                    <ArrowLeft className="rotate-180" size={16}/>
                                </div>
                            </div>
                        </div>
                        
                        {/* Short Proposal Snippet */}
                        <div className="px-6 pb-6 pt-0">
                             <div className="bg-stone/5 p-4 rounded-sm border border-ink/5">
                                 <p className="text-sm text-ink/60 line-clamp-1 italic">"{bidder.proposal}"</p>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
