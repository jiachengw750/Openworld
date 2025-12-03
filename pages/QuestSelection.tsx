
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Star, User, MessageSquare, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

// Mock Bidders Data
const MOCK_BIDDERS = [
    {
        id: 'b1',
        name: 'Dr. Sarah Lin',
        avatar: 'https://i.pravatar.cc/150?u=30',
        lex: 890,
        amount: 4800,
        days: 7,
        proposal: "I have extensive experience with molecular rendering using Blender and PyMOL. I can deliver 4K renders and a 60fps animation. See my portfolio for similar protein docking visualizations.",
        tags: ['Expert', 'Top Rated']
    },
    {
        id: 'b2',
        name: 'James Chen',
        avatar: 'https://i.pravatar.cc/150?u=12',
        lex: 720,
        amount: 4500,
        days: 10,
        proposal: "I propose using a custom Python script to automate the frame generation from GROMACS trajectories, ensuring 100% accuracy in atomic positions.",
        tags: ['Fast Response']
    },
    {
        id: 'b3',
        name: 'BioVis Studio',
        avatar: 'https://i.pravatar.cc/150?u=50',
        lex: 650,
        amount: 5000,
        days: 5,
        proposal: "We are a team of scientific illustrators. We can prioritize this task and deliver within 5 days. Includes 2 rounds of revisions.",
        tags: ['Team']
    },
    {
        id: 'b4',
        name: 'Alex Rivera',
        avatar: 'https://i.pravatar.cc/150?u=60',
        lex: 450,
        amount: 4200,
        days: 12,
        proposal: "Recent grad with strong skills in Maya. Offering a lower rate to build my reputation on OpenSci.",
        tags: ['New']
    }
];

export const QuestSelection: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [selectedBidderId, setSelectedBidderId] = useState<string | null>(null);
    const [expandedBidderId, setExpandedBidderId] = useState<string | null>(null);
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

    const handleSelect = (bidderId: string) => {
        setSelectedBidderId(bidderId);
        setIsPasswordOpen(true);
    };

    const handleConfirmSelection = () => {
        setIsPasswordOpen(false);
        setIsProcessing(true);
        
        // Simulate On-Chain Transaction
        setTimeout(() => {
            setIsProcessing(false);
            showToast("Bidder selected successfully. Project started.");
            navigate('/workspace'); 
        }, 2000);
    };

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedBidderId(expandedBidderId === id ? null : id);
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
            <div className="max-w-[1000px] mx-auto px-6 md:px-12 mt-12">
                <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-ink/60 mb-6">
                    Review Proposals ({MOCK_BIDDERS.length})
                </h2>

                <div className="space-y-6">
                    {MOCK_BIDDERS.map((bidder) => (
                        <div 
                            key={bidder.id} 
                            className={`bg-paper border transition-all duration-300 rounded-sm relative group ${
                                selectedBidderId === bidder.id 
                                ? 'border-accent ring-1 ring-accent' 
                                : 'border-ink/10 hover:border-ink/30 hover:shadow-sm'
                            }`}
                        >
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                
                                {/* Avatar & Basic Info */}
                                <div className="flex items-start gap-4 md:w-1/4 min-w-[200px]">
                                    <img src={bidder.avatar} alt={bidder.name} className="w-12 h-12 rounded-full border border-ink/10 object-cover" />
                                    <div>
                                        <h3 className="font-bold text-lg text-ink leading-tight">{bidder.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                                <Star size={10} className="mr-1 fill-current" />
                                                LEX {bidder.lex}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {bidder.tags.map(tag => (
                                                <span key={tag} className="text-[9px] font-mono text-ink/50 bg-stone/5 px-2 py-0.5 rounded-sm border border-ink/5 uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Proposal Snippet */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-mono font-bold uppercase text-ink/40 mb-1 block">Proposal</span>
                                        <p className={`text-sm text-ink/80 leading-relaxed ${expandedBidderId === bidder.id ? '' : 'line-clamp-2'}`}>
                                            {bidder.proposal}
                                        </p>
                                        {bidder.proposal.length > 100 && (
                                            <button 
                                                onClick={(e) => toggleExpand(bidder.id, e)}
                                                className="text-[10px] font-bold text-ink/40 hover:text-ink mt-1 flex items-center gap-1 uppercase tracking-wide"
                                            >
                                                {expandedBidderId === bidder.id ? (
                                                    <>Show Less <ChevronUp size={10} /></>
                                                ) : (
                                                    <>Read More <ChevronDown size={10} /></>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Quote & Actions */}
                                <div className="md:w-1/4 flex flex-col items-end justify-between border-l border-ink/5 md:pl-6 min-w-[180px]">
                                    <div className="text-right mb-4">
                                        <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Quote</span>
                                        <div className="flex items-center justify-end gap-1 font-mono text-xl font-bold text-ink">
                                            {formatCurrency(bidder.amount)}
                                            <span className="text-xs text-ink/40 font-normal mt-1">USDC</span>
                                        </div>
                                        <span className="text-xs font-mono text-ink/60 font-bold block mt-1">
                                            {bidder.days} Days
                                        </span>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <button className="p-2 rounded-full border border-ink/10 text-ink/60 hover:text-ink hover:bg-stone/5 transition-colors">
                                            <MessageSquare size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleSelect(bidder.id)}
                                            className="flex-1 bg-ink text-paper py-2 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-sm"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isProcessing && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-paper/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-ink/10 border-t-accent rounded-full animate-spin mb-4"></div>
                        <p className="font-mono text-sm font-bold uppercase tracking-widest text-ink">Confirming Selection...</p>
                    </div>
                </div>
            )}

            <PasswordVerificationModal 
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={handleConfirmSelection}
            />
        </div>
    );
};