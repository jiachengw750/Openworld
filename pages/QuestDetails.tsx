
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, CheckCircle, Verified, X, MessageSquare, Briefcase, FileText, DollarSign, ExternalLink, Code, Terminal, Layers, Edit3, XCircle, Download } from 'lucide-react';
import { QUESTS } from '../constants';
import { useToast } from '../context/ToastContext';
import { BidModal } from '../components/modals/BidModal';

export const QuestDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [quest, setQuest] = useState(QUESTS.find(q => q.id === id));
    const { showToast } = useToast();
    
    // UI State
    const [activeTab, setActiveTab] = useState<'REQUIREMENT' | 'COMMENT'>('REQUIREMENT');
    const [isShared, setIsShared] = useState(false);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    
    // Bid Management State
    const [hasActiveBid, setHasActiveBid] = useState(false);
    const [myBidData, setMyBidData] = useState<any>(null);

    // Comment Reply State
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    // Calculated Exchange Rate (USD value per 1 unit of currency)
    const exchangeRate = quest && quest.reward.amount > 0 
        ? quest.reward.usdValue / quest.reward.amount 
        : 1;

    useEffect(() => {
        // Check if we navigated here with known bid state (from Workspace)
        if (location.state?.hasActiveBid) {
            setHasActiveBid(true);
            setMyBidData({
                amount: location.state.currentBidValue?.toString() || '1500',
                duration: '14',
                proposal: 'I can complete this task...',
                contact: 'researcher@institute.edu',
                isPublic: false
            });
        }
    }, [location.state]);

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
        // Update local state to reflect new bidder (Simulation) or Updated bid
        setQuest(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                bidderCount: hasActiveBid ? prev.bidderCount : prev.bidderCount + 1,
                bidders: hasActiveBid ? prev.bidders : ['https://i.pravatar.cc/150?u=999', ...prev.bidders]
            };
        });
        setHasActiveBid(true);
        setMyBidData(bidData); // Save the data to local state for "Edit" pre-filling
        showToast(hasActiveBid ? "Bid updated successfully" : "Bid submitted successfully");
    };

    const handleWithdrawBid = () => {
        if (window.confirm("Are you sure you want to withdraw your proposal? This action cannot be undone.")) {
            setHasActiveBid(false);
            setMyBidData(null);
            showToast("Bid withdrawn successfully");
            // Optional: navigate back to workspace if desired, or stay here
            navigate('/workspace');
        }
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

                    {/* Tabs Navigation */}
                    <div className="flex space-x-8 mb-8 border-b border-ink/10">
                        <button 
                            onClick={() => setActiveTab('REQUIREMENT')}
                            className={`pb-4 text-sm font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative ${
                                activeTab === 'REQUIREMENT' ? 'text-ink' : 'text-ink/40 hover:text-ink'
                            }`}
                        >
                            <FileText size={16} /> Requirement
                            {activeTab === 'REQUIREMENT' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ink"></div>}
                        </button>
                        <button 
                            onClick={() => setActiveTab('COMMENT')}
                            className={`pb-4 text-sm font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative ${
                                activeTab === 'COMMENT' ? 'text-ink' : 'text-ink/40 hover:text-ink'
                            }`}
                        >
                            <MessageSquare size={16} /> Comment({quest.commentsCount})
                            {activeTab === 'COMMENT' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ink"></div>}
                        </button>
                    </div>

                    {/* Tab Contents */}
                    {activeTab === 'REQUIREMENT' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            
                            {/* Task Instructions */}
                            <div>
                                <h3 className="font-sans text-lg font-bold text-ink mb-4 flex items-center gap-2">
                                    Task Instructions
                                </h3>
                                <div className="bg-stone/5 p-6 rounded-sm border border-ink/5 text-ink/80 font-sans leading-relaxed">
                                    <p>Please implement the solution following these guidelines:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-2">
                                        <li>Analyze the provided dataset for outliers.</li>
                                        <li>Implement the heuristic in Python 3.8+.</li>
                                        <li>Ensure code is well-documented and follows PEP 8.</li>
                                        <li>Compare convergence rates with CVXPY.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Attachment */}
                            <div>
                                <h3 className="font-sans text-lg font-bold text-ink mb-4 flex items-center gap-2">
                                    Attachment
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-paper border border-ink/10 rounded-sm hover:bg-stone/5 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-50 text-red-600 p-2 rounded-sm">
                                                <FileText size={20}/>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-ink group-hover:text-accent">Dataset_Sample.csv</span>
                                                <span className="text-[10px] font-mono text-ink/40 uppercase tracking-wider">24.5 MB</span>
                                            </div>
                                        </div>
                                        <Download size={16} className="text-ink/30 group-hover:text-ink transition-colors"/>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-paper border border-ink/10 rounded-sm hover:bg-stone/5 cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-50 text-blue-600 p-2 rounded-sm">
                                                <FileText size={20}/>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-ink group-hover:text-accent">Style_Guide.pdf</span>
                                                <span className="text-[10px] font-mono text-ink/40 uppercase tracking-wider">1.2 MB</span>
                                            </div>
                                        </div>
                                        <Download size={16} className="text-ink/30 group-hover:text-ink transition-colors"/>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Instructions */}
                            <div>
                                <h3 className="font-sans text-lg font-bold text-ink mb-4 flex items-center gap-2">
                                    Delivery Instructions
                                </h3>
                                <div className="bg-stone/5 p-6 rounded-sm border border-ink/5 text-ink/80 font-sans leading-relaxed">
                                    <p>Deliverables should be submitted as a ZIP archive containing source code, documentation, and the technical report. Please verify integrity before submission.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'COMMENT' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="font-sans text-2xl font-bold text-ink mb-6">Discussion</h3>
                            <div className="border border-ink/10 rounded-sm p-4 h-32 text-ink/40 font-mono text-sm bg-stone/5 mb-4 focus-within:border-ink/30 focus-within:bg-paper transition-colors">
                                <textarea 
                                    className="w-full h-full bg-transparent outline-none resize-none placeholder-ink/30 text-ink"
                                    placeholder="Ask a question or leave a comment..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-ink text-paper px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors">
                                    Post Comment
                                </button>
                            </div>
                            
                            {/* Mock Comments List */}
                            <div className="mt-8 space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-4 p-4 border-b border-ink/5 last:border-0">
                                        <div className="w-8 h-8 rounded-full bg-stone/20 shrink-0">
                                            <img src={`https://i.pravatar.cc/150?u=${50+i}`} className="w-full h-full rounded-full object-cover" alt="user"/>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-ink text-sm">Researcher_{i}</span>
                                                <span className="text-xs text-ink/40 font-mono">{i} days ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 leading-relaxed mb-3">
                                                Could you clarify the specific constraints on the algorithm's runtime complexity?
                                            </p>
                                            
                                            {/* Reply Button */}
                                            <button 
                                                onClick={() => setReplyingTo(replyingTo === i ? null : i)}
                                                className="text-xs font-mono font-bold text-ink/40 hover:text-ink uppercase tracking-wider transition-colors"
                                            >
                                                Reply
                                            </button>

                                            {/* Reply Input Area */}
                                            {replyingTo === i && (
                                                <div className="mt-4 pl-4 border-l-2 border-ink/10 animate-in fade-in slide-in-from-top-1 duration-200">
                                                     <div className="border border-ink/10 rounded-sm p-3 bg-stone/5 mb-2 focus-within:border-ink/30 transition-colors">
                                                        <textarea 
                                                            className="w-full bg-transparent outline-none resize-none placeholder-ink/30 text-ink text-sm h-20"
                                                            placeholder="Write your reply..."
                                                            autoFocus
                                                        ></textarea>
                                                     </div>
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => setReplyingTo(null)}
                                                            className="px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50 hover:text-ink transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                showToast("Reply posted");
                                                                setReplyingTo(null);
                                                            }}
                                                            className="bg-ink text-paper px-4 py-2 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column: Sidebar (Non-sticky as per request) */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Award Box */}
                    <div className="bg-white border border-ink/10 p-8 rounded-sm shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-ink/60">
                            <span className="font-bold font-mono text-xs uppercase tracking-widest">Task Award</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold font-mono text-ink bg-ink text-paper px-2 py-0.5 rounded-sm">{quest.reward.currency}</span>
                            <span className="text-4xl font-bold font-mono text-ink">{formatNumber(quest.reward.amount)}</span>
                        </div>
                        <div className="text-ink/40 font-mono text-lg font-bold mb-6">≈ ${quest.reward.usdValue}</div>
                        
                        <p className="text-xs text-ink/40 leading-relaxed border-t border-ink/10 pt-4">
                            Support and settlement are out of scope for this phase
                        </p>
                    </div>

                    {/* Actions Panel */}
                    {hasActiveBid ? (
                        // Manage Bid View
                        <div className="bg-white border border-ink/10 p-6 rounded-sm">
                            <div className="flex items-center gap-2 mb-4 text-green-700">
                                <CheckCircle size={16} />
                                <span className="font-bold font-mono text-xs uppercase tracking-widest">Proposal Submitted</span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6 text-sm">
                                <span className="text-ink/60 font-mono">Your Quote:</span>
                                <span className="font-bold text-ink font-mono">{myBidData?.amount ? `${formatNumber(parseInt(myBidData.amount))} ${quest.reward.currency}` : '---'}</span>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => setIsBidModalOpen(true)}
                                    className="w-full bg-white border border-ink/20 text-ink py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:border-ink hover:bg-stone/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={14} /> Update Proposal
                                </button>
                                <button 
                                    onClick={handleWithdrawBid}
                                    className="w-full text-red-600 py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={14} /> Withdraw Bid
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Standard Bid View
                        <div className="space-y-3">
                            <button 
                                onClick={() => setIsBidModalOpen(true)}
                                className="w-full bg-ink text-paper py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg"
                            >
                                Bid Now
                            </button>
                            <button className="w-full bg-white border border-ink/10 text-ink py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors">
                                View Publisher's Profile
                            </button>
                        </div>
                    )}

                    {/* Tech Stack / Requirements Card */}
                    <div className="bg-white border border-ink/10 p-6 rounded-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-sans text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                Required Skills
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
                    <div className="bg-white border border-ink/10 p-6 rounded-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-sans text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                General Info
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
                    <div className="bg-white p-6 rounded-sm border border-ink/10 flex gap-3">
                        <p className="text-[10px] font-bold text-ink/50 leading-relaxed font-mono">
                            After awarding, the bidding will automatically close and notify the relevant candidates.
                        </p>
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
                initialData={myBidData} // Pass existing bid data if managing
            />
        </div>
    );
};
