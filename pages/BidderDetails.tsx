
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Star, User, MessageSquare, Shield, Download, FileText, Eye, X, Image as ImageIcon, Video, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { MOCK_BIDDERS } from '../constants';

export const BidderDetails: React.FC = () => {
    const { id, bidderId } = useParams<{ id: string; bidderId: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewFile, setPreviewFile] = useState<any | null>(null);

    // Cast bidder type to include email since we just added it to constants
    const bidder = MOCK_BIDDERS.find(b => b.id === bidderId) as typeof MOCK_BIDDERS[0] & { email?: string };

    if (!bidder) return <div className="p-12 text-center text-ink/40">Bidder not found</div>;

    const handleSelect = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirmSelection = () => {
        setIsConfirmOpen(false);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            showToast("Bidder selected successfully. Project started.");
            // Navigate back to quest details with selected state
            navigate(`/quest/${id}`, { 
                state: { 
                    role: 'MAKER', 
                    bidderSelected: true,
                    selectedBidder: {
                        id: bidder.id,
                        name: bidder.name,
                        avatar: bidder.avatar,
                        amount: bidder.amount,
                        days: bidder.days
                    }
                } 
            }); 
        }, 2000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const getFileIcon = (type: string) => {
        switch(type) {
            case 'PDF': return <FileText size={20} className="text-red-500" />;
            case 'IMAGE': return <ImageIcon size={20} className="text-blue-500" />;
            case 'VIDEO': return <Video size={20} className="text-purple-500" />;
            case 'CODE': return <FileText size={20} className="text-green-500" />;
            default: return <FileText size={20} className="text-ink/40" />;
        }
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1512px] mx-auto flex justify-between items-center">
                    <Link to={`/workspace/quest/${id}/selection`} className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} className="mr-2" /> Back to Applicants
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">Application ID</span>
                        <span className="font-mono text-xs font-bold text-ink">#{bidder.id}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Profile & Proposal */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* Profile Header */}
                    <div className="flex items-start gap-6 pb-8 border-b border-ink/10">
                        <img src={bidder.avatar} alt={bidder.name} className="w-24 h-24 rounded-full object-cover border-2 border-ink/10" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="font-sans text-3xl font-bold text-ink">{bidder.name}</h1>
                                {bidder.lex > 800 && <Shield size={20} className="text-blue-500 fill-current" />}
                            </div>
                            <p className="font-mono text-sm text-ink/60 mb-4">{bidder.institution}</p>
                            <div className="flex flex-wrap gap-2">
                                {bidder.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-stone/5 border border-ink/5 rounded-sm text-xs font-mono font-bold uppercase tracking-wide text-ink/70">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <div className="mb-2">
                                <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold tracking-widest">Lex Score</span>
                                <span className="font-mono text-4xl font-bold text-ink">{bidder.lex}</span>
                            </div>
                        </div>
                    </div>

                    {/* Proposal Content */}
                    <div>
                        <h3 className="font-sans text-xl font-bold text-ink mb-6 flex items-center gap-2">
                            <MessageSquare size={18} className="text-ink/60"/> Detailed Proposal
                        </h3>
                        <div className="prose prose-stone max-w-none font-sans text-ink/80 text-lg leading-relaxed whitespace-pre-wrap">
                            {bidder.fullProposal || bidder.proposal}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6 bg-stone/5 p-8 rounded-sm border border-ink/5">
                        <div>
                            <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold tracking-widest mb-1">Success Rate</span>
                            <span className="font-bold text-2xl text-green-600">{bidder.stats.successRate}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold tracking-widest mb-1">Completed Tasks</span>
                            <span className="font-bold text-2xl text-ink">{bidder.stats.completed}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold tracking-widest mb-1">Global Rank</span>
                            <span className="font-bold text-2xl text-accent">{bidder.stats.rank}</span>
                        </div>
                    </div>

                </div>

                {/* Right Column: Actions & Attachments */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Offer Card */}
                    <div className="bg-paper border-2 border-ink/10 p-8 rounded-sm shadow-sm sticky top-32">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold tracking-widest mb-1">Bid Amount</span>
                                <span className="font-mono text-4xl font-bold text-ink">{formatCurrency(bidder.amount)}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-mono text-ink/40 uppercase font-bold tracking-widest mb-1">Delivery</span>
                                <span className="font-mono text-xl font-bold text-ink">{bidder.days} Days</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSelect}
                            className="w-full bg-ink text-paper py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg flex items-center justify-center gap-2 mb-4"
                        >
                            Select Applicant <CheckCircle size={16} />
                        </button>
                        
                        <a 
                            href={`mailto:${bidder.email || 'researcher@opensci.io'}`}
                            className="w-full bg-paper border border-ink/10 text-ink py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Mail size={16} /> Send Email
                        </a>
                    </div>

                    {/* Attachments Card */}
                    {bidder.attachments && bidder.attachments.length > 0 && (
                        <div className="bg-paper border border-ink/10 p-8 rounded-sm">
                            <h4 className="font-sans text-sm font-bold text-ink uppercase tracking-widest mb-6">Attachments ({bidder.attachments.length})</h4>
                            <div className="space-y-3">
                                {bidder.attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-stone/5 border border-ink/5 rounded-sm hover:bg-stone/10 transition-colors group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {getFileIcon(file.type)}
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-mono text-xs font-bold text-ink truncate max-w-[150px]">{file.name}</span>
                                                <span className="font-mono text-[10px] text-ink/40">{file.size}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setPreviewFile(file)}
                                                className="p-1.5 text-ink/40 hover:text-ink hover:bg-white rounded-sm transition-colors"
                                                title="Preview"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button 
                                                className="p-1.5 text-ink/40 hover:text-ink hover:bg-white rounded-sm transition-colors"
                                                title="Download"
                                            >
                                                <Download size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Confirm Selection Modal */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-paper w-full max-w-md rounded-sm shadow-2xl border border-ink/10 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-ink/10">
                            <h2 className="font-sans text-xl font-bold text-ink">Confirm Selection</h2>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Prompt Text */}
                            <p className="text-sm text-ink/70 leading-relaxed">
                                Are you sure you want to select <span className="font-bold text-ink">{bidder.name}</span> as the winner? Other bidders will be notified that they were not selected.
                            </p>
                            
                            {/* Bidder Info Card */}
                            <div className="flex items-center gap-4 p-4 bg-stone/5 border border-ink/5 rounded-sm">
                                <img 
                                    src={bidder.avatar} 
                                    alt={bidder.name} 
                                    className="w-14 h-14 rounded-full object-cover border border-ink/10" 
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-ink text-sm flex items-center gap-2 mb-1">
                                        {bidder.name}
                                        {bidder.lex > 800 && <Shield size={12} className="text-blue-500 fill-current" />}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs font-mono text-ink/60">
                                        <span>
                                            <span className="text-ink/40">Bid: </span>
                                            <span className="font-bold text-ink">{formatCurrency(bidder.amount)}</span>
                                        </span>
                                        <span>
                                            <span className="text-ink/40">Duration: </span>
                                            <span className="font-bold text-ink">{bidder.days} Days</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="p-6 border-t border-ink/10 flex gap-3">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="flex-1 py-3 bg-paper border border-ink/10 text-ink rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSelection}
                                className="flex-1 py-3 bg-ink text-paper rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-4xl h-[80vh] flex flex-col rounded-sm shadow-2xl relative">
                        <div className="flex justify-between items-center p-4 border-b border-ink/10 bg-surface">
                            <span className="font-mono text-sm font-bold text-ink">{previewFile.name}</span>
                            <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-stone/10 rounded-full text-ink/60 hover:text-red-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-stone/10 p-8 overflow-hidden">
                            {previewFile.type === 'IMAGE' ? (
                                <img src={`https://placehold.co/800x600?text=${previewFile.name}`} alt="Preview" className="max-w-full max-h-full shadow-lg" />
                            ) : previewFile.type === 'VIDEO' ? (
                                <div className="w-full max-w-2xl aspect-video bg-black flex items-center justify-center text-white">
                                    Video Player Placeholder
                                </div>
                            ) : (
                                <div className="text-center">
                                    <FileText size={64} className="mx-auto text-ink/20 mb-4" />
                                    <p className="font-mono text-ink/60">Preview not available for {previewFile.type} files.</p>
                                    <button className="mt-4 px-6 py-2 bg-ink text-paper rounded-sm font-mono text-xs font-bold uppercase">Download to View</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
