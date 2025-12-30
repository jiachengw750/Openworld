
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Star, ExternalLink, MessageSquare, Plus, Share2, Sparkles, BrainCircuit, Verified,
    Zap, ArrowRight, Info, Search, X, AlertCircle, ShieldAlert,
    ThumbsUp, MessageCircle, CheckCircle2, PlayCircle, Upload, Image, Video, ChevronDown, ChevronUp, Maximize2, Minimize2
} from 'lucide-react';
import { AI_TOOLS, MOCK_AI_REVIEWS, MOCK_COMMUNITY_PROMPTS } from '../constants';
import { useToast } from '../context/ToastContext';
import { useWallet } from '../context/WalletContext';
import { AiToolCategory, AiPrompt } from '../types';
import { WriteReviewModal } from '../components/modals/WriteReviewModal';
import { AskQuestionModal } from '../components/modals/AskQuestionModal';
import { RichTextEditor } from '../components/RichTextEditor';

type ReviewSort = 'RECENT' | 'HELPFUL' | 'HIGHEST';

import { getCategoryIcon, STAGE_MAP } from '../utils/aiTools';

// Constants
const REVIEW_SORT_OPTIONS: ReviewSort[] = ['HELPFUL', 'RECENT'];

export const AiToolDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { wallet } = useWallet();
    const tool = AI_TOOLS.find(t => t.id === id);
    const reviews = MOCK_AI_REVIEWS[id || ''] || [];
    const communityPrompts = MOCK_COMMUNITY_PROMPTS[id || ''] || [];

    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
    const [userExperienceText, setUserExperienceText] = useState('');
    const [userExperienceFiles, setUserExperienceFiles] = useState<File[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Reviews Sort State
    const [reviewSort, setReviewSort] = useState<ReviewSort>('HELPFUL');

    // Redirect Gateway State
    const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);

    // Write Review Modal State
    const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

    // Ask Question Modal State
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);

    const isNative = tool?.sourceType === 'OFFICIAL';
    const isAi = tool?.isAiTool ?? true;

    // Payment States
    const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PENDING' | 'FAILED' | 'SUCCESS'>('IDLE');

    // Combined prompts (official + community) - memoized
    const allPrompts = useMemo(() => [
        ...(tool?.prompts || []),
        ...communityPrompts
    ], [tool?.prompts, communityPrompts]);

    // Sorted reviews - memoized
    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
        if (reviewSort === 'HELPFUL') return (b.likes || 0) - (a.likes || 0);
        if (reviewSort === 'HIGHEST') return b.rating - a.rating;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    }, [reviews, reviewSort]);

    const canRate = wallet?.connected;

    // Memoize user avatars array
    const userAvatars = useMemo(() => [1, 2, 3, 4], []);

    // Check favorite status on mount
    useEffect(() => {
        if (!id) return;
        try {
        const favs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
            setIsFavorite(favs.includes(id));
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
        }
    }, [id]);

    if (!tool) return <div className="p-12 text-center font-sans text-ink/40">Tool not found</div>;

    const handleToggleFavorite = useCallback(() => {
        if (!id) return;
        try {
        const favs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
            const newFavs = isFavorite
                ? favs.filter((f: string) => f !== id)
                : [...favs, id];
            
            localStorage.setItem('user_favorites', JSON.stringify(newFavs));
            setIsFavorite(!isFavorite);
            showToast(isFavorite ? "Removed from Toolbox" : "Added to your Private Toolbox");
        } catch (error) {
            console.error('Error updating favorites:', error);
            showToast("Failed to update favorites");
        }
    }, [id, isFavorite, showToast]);

    const handleCopyPrompt = useCallback((content: string) => {
        navigator.clipboard.writeText(content).then(() => {
        showToast(isAi ? "Prompt copied to clipboard" : "Search template copied");
            if (!isNative && tool?.externalUrl) {
            setTimeout(() => {
                setIsRedirectModalOpen(true);
            }, 500);
        }
        }).catch(() => {
            showToast("Failed to copy to clipboard");
        });
    }, [isAi, isNative, tool?.externalUrl, showToast]);

    const handleUse = useCallback(() => {
        if (isNative) {
            // Simulate Payment Flow
            setPaymentStatus('PENDING');

            // 50% chance of failure for demonstration
            const shouldFail = Math.random() > 0.5;

            setTimeout(() => {
                if (shouldFail) {
                    setPaymentStatus('FAILED');
                } else {
                    setPaymentStatus('SUCCESS');
                    setTimeout(() => {
                        navigate(`/ai-market/${tool.id}/use`);
                    }, 500);
                }
            }, 2000);
        } else {
            setIsRedirectModalOpen(true);
        }
    }, [isNative, tool?.id, navigate]);

    const handleRetryPayment = useCallback(() => {
        setPaymentStatus('PENDING');
        setTimeout(() => {
            setPaymentStatus('SUCCESS');
            setTimeout(() => {
                navigate(`/ai-market/${tool.id}/use`);
            }, 500);
        }, 2000);
    }, [tool?.id, navigate]);

    const handleShareTool = useCallback(() => {
        if (!tool) return;
        // Construct link with referral if wallet is connected
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = wallet?.connected
            ? `${baseUrl}?ref=${wallet.address.slice(0, 8)}`
            : baseUrl;

        navigator.clipboard.writeText(shareUrl).then(() => {
        showToast(wallet?.connected ? "Referral link copied! Earn rewards when peers join." : "Shareable link copied to clipboard");
        }).catch(() => {
            showToast("Failed to copy link");
        });
    }, [tool, wallet, showToast]);

    const executeRedirect = useCallback(() => {
        if (tool?.externalUrl) {
            window.open(tool.externalUrl, '_blank', 'noopener,noreferrer');
            setIsRedirectModalOpen(false);
        }
    }, [tool?.externalUrl]);

    return (
        <div className="min-h-screen bg-paper pb-24">

            {/* Breadcrumb Area */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 pt-12 pb-6">
                <div className="flex items-center text-xs font-mono font-bold text-ink/40 uppercase tracking-widest">
                    <Link to="/ai-market" className="hover:text-ink transition-colors">AI Market</Link>
                    <span className="mx-2">/</span>
                    <span className="text-ink">Tool Detail</span>
                </div>
            </div>

            {/* Main Layout - Single Column Stack w/ Hero */}
            <div className="max-w-[1512px] mx-auto px-6 md:px-12">

                {/* Hero Media section with Embedded Actions */}
                <div className="w-full aspect-[21/9] bg-stone/10 mb-8 overflow-hidden rounded-sm border border-ink/10 relative group">
                    {tool.image ? (
                        <img src={tool.image} alt={tool.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone/5">
                            <Sparkles size={64} className="text-ink/10" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Hero Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row items-end justify-between gap-8">

                        {/* Provider Info */}
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-sm shadow-xl flex items-center justify-center">
                                {(() => {
                                    const IconComponent = getCategoryIcon(tool.category);
                                    return <IconComponent size={32} className="text-white" strokeWidth={1.5} />;
                                })()}
                            </div>
                            <div>
                                <span className="block text-[10px] font-mono font-bold text-white/60 uppercase tracking-[0.2em] mb-2">PROVIDER</span>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-bold text-2xl tracking-tight">
                                        {isNative ? 'Catalyst Native' : 'External Service'}
                                    </span>
                                    {isNative && <Verified size={18} className="text-blue-400 fill-current" />}
                                </div>
                                <div className={`inline-flex items-center px-2 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-widest border border-white/20 bg-white/5 text-white/80`}>
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isNative ? 'bg-green-400 animate-pulse' : 'bg-current'}`}></div>
                                    {isNative ? (isAi ? 'Online Agent' : 'Live Utility') : 'External Link'}
                                </div>
                            </div>
                        </div>

                        {/* Primary Interaction Buttons (Moved from Sidebar) */}
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleUse}
                                className={`flex-1 md:flex-none px-8 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-[0.15em] transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3 backdrop-blur-sm border border-white/10 ${isNative ? 'bg-white text-black hover:bg-stone-200' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isNative ? (isAi ? <BrainCircuit size={18} /> : <Search size={18} />) : <ExternalLink size={18} />}
                                <span>{isNative ? 'Start Using' : 'Direct Access'}</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all backdrop-blur-sm hover:bg-white/20 ${isFavorite ? 'bg-white text-black' : 'bg-black/30 text-white'
                                    }`}
                            >
                                {isFavorite ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                            </button>
                            <button
                                onClick={handleShareTool}
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all bg-black/30 text-white backdrop-blur-sm hover:bg-white/20"
                            >
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metadata Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-accent/5 text-accent text-[10px] font-mono font-bold uppercase tracking-widest border border-accent/10 rounded-full">
                                        <Sparkles size={10} className="fill-current" />
                                <span>Pipeline: {STAGE_MAP[tool.category] || 'TOOL'}</span>
                                    </span>

                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-current" />
                                <span className="font-bold text-sm text-ink">{tool.rating}</span>
                                <span className="text-xs text-ink/40">({tool.reviewCount})</span>
                            </div>
                        </div>

                        <h1 className="font-sans text-4xl md:text-6xl font-black text-ink mb-2 leading-tight tracking-tight">
                            {tool.name}
                        </h1>
                        <p className="font-mono text-xs text-ink/40 uppercase tracking-widest">
                            v1.2.4 • Updated yesterday
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {userAvatars.map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-paper bg-stone-200 overflow-hidden relative z-0 hover:z-10 transition-all hover:scale-110">
                                    <img src={`https://randomuser.me/api/portraits/thumb/men/${i * 10 + 20}.jpg`} className="w-full h-full object-cover" alt={`User ${i}`} loading="lazy" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-paper bg-ink text-paper flex items-center justify-center text-[10px] font-bold z-10">
                                +2k
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-ink">Trusted by experts</div>
                            <div className="text-[10px] text-ink/40 font-mono">from 150+ institutions</div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Full Width Vertical Stack */}
                    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-2 duration-300">

                        {/* 1. Introduction (Description) */}
                        <section>
                            <h3 className="font-sans text-2xl font-bold text-ink mb-6 flex items-center gap-2">
                                Introduction
                            </h3>
                            <div className="text-lg leading-relaxed whitespace-pre-wrap text-ink/80 font-serif">
                                {tool.fullDescription}
                            </div>
                        </section>

                        {/* 2. Quick Steps */}
                        <section className="bg-stone/5 p-8 rounded-sm border border-ink/5">
                            <h3 className="font-sans text-xl font-bold text-ink mb-8 flex items-center gap-2">
                                <Zap size={20} className="text-accent" /> How to use
                            </h3>
                            
                            {/* Demo Video */}
                            <div className="flex justify-center">
                                <div className="bg-black rounded-sm overflow-hidden text-white aspect-[21/9] max-h-[400px] w-full max-w-4xl relative group cursor-pointer shadow-2xl">
                                    <img src={tool.image || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop"} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <PlayCircle size={32} className="fill-white text-white/50" />
                                </div>
                                        <h4 className="font-sans text-xl font-bold tracking-tight">Watch the Masterclass</h4>
                                        <p className="font-mono text-xs uppercase tracking-widest opacity-80 mt-1">Duration: 4m 20s</p>
                                </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. How People Use It */}
                        <section className="space-y-8">
                            <h3 className="font-sans text-2xl font-bold text-ink mb-6 flex items-center gap-2">
                                How people use it
                            </h3>

                            {/* User Experience Input */}
                            <div className={`bg-stone/5 border border-ink/5 p-6 rounded-sm ${isFullscreen ? 'fixed inset-0 z-[200] bg-paper m-0 rounded-none' : 'relative'}`}>
                                {isFullscreen && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={() => setIsFullscreen(false)}
                                            className="p-2 bg-ink/10 hover:bg-ink/20 rounded-sm text-ink transition-colors"
                                        >
                                            <Minimize2 size={20} />
                                        </button>
                                    </div>
                                )}
                                
                                {/* Rich Text Editor */}
                                <div className="mb-4">
                                    <RichTextEditor
                                        value={userExperienceText}
                                        onChange={setUserExperienceText}
                                        placeholder="Share your experience with this tool..."
                                        height={isFullscreen ? "h-[calc(100vh-200px)]" : "h-64"}
                                        isFullscreen={isFullscreen}
                                        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                                        onUploadVideo={(file) => {
                                            setUserExperienceFiles([...userExperienceFiles, file]);
                                        }}
                                        onUploadImage={(file) => {
                                            setUserExperienceFiles([...userExperienceFiles, file]);
                                        }}
                                    />
                                </div>

                                {/* Uploaded Files Preview */}
                                {userExperienceFiles.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {userExperienceFiles.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-ink/10 rounded-sm">
                                                <span className="text-xs text-ink/60">{file.name}</span>
                                                <button
                                                    onClick={() => setUserExperienceFiles(userExperienceFiles.filter((_, i) => i !== index))}
                                                    className="text-ink/40 hover:text-ink"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            const textContent = userExperienceText.replace(/<[^>]*>/g, '').trim();
                                            if (textContent || userExperienceFiles.length > 0) {
                                                showToast("Experience shared successfully!");
                                                setUserExperienceText('');
                                                setUserExperienceFiles([]);
                                                setIsFullscreen(false);
                                            }
                                        }}
                                        className="px-6 py-2 bg-ink text-paper rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all"
                                    >
                                        Share Experience
                                    </button>
                                </div>
                            </div>

                            {/* User Experiences List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Experience Card 1 */}
                                <div className="bg-white border border-ink/10 rounded-sm p-6 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/ai-market/${tool.id}/review/exp-1`)}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src="https://i.pravatar.cc/150?u=1" alt="User" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-ink">Dr. Sarah Lin</span>
                                                <span className="text-[10px] font-mono text-ink/30">2 days ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 line-clamp-3 mb-3">
                                                This tool has been incredibly helpful for my research. The semantic search capabilities are outstanding and saved me hours of manual work.
                                            </p>
                                            <div className="mt-3 rounded-sm overflow-hidden border border-ink/10">
                                                <img
                                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop"
                                                    alt="Video thumbnail"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ai-market/${tool.id}/review/exp-1`);
                                        }}
                                        className="text-xs font-mono font-bold uppercase text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>

                                {/* Experience Card 2 */}
                                <div className="bg-white border border-ink/10 rounded-sm p-6 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/ai-market/${tool.id}/review/exp-2`)}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src="https://i.pravatar.cc/150?u=2" alt="User" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-ink">Prof. Michael Chen</span>
                                                <span className="text-[10px] font-mono text-ink/30">5 days ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 line-clamp-3 mb-3">
                                                The citation analysis feature is a game-changer. I can now track research lineages and identify key papers in my field much more efficiently.
                                            </p>
                                            <div className="mt-3 rounded-sm overflow-hidden border border-ink/10">
                                                <img
                                                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop"
                                                    alt="Article image"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ai-market/${tool.id}/review/exp-2`);
                                        }}
                                        className="text-xs font-mono font-bold uppercase text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>

                                {/* Experience Card 3 */}
                                <div className="bg-white border border-ink/10 rounded-sm p-6 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/ai-market/${tool.id}/review/exp-3`)}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src="https://i.pravatar.cc/150?u=3" alt="User" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-ink">Dr. Emily Zhang</span>
                                                <span className="text-[10px] font-mono text-ink/30">1 week ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 line-clamp-3 mb-3">
                                                Used this for my systematic review and it cut down my literature screening time by 70%. The filtering options are comprehensive and intuitive.
                                            </p>
                                            <div className="mt-3 rounded-sm overflow-hidden border border-ink/10">
                                                <img
                                                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop"
                                                    alt="Video thumbnail"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ai-market/${tool.id}/review/exp-3`);
                                        }}
                                        className="text-xs font-mono font-bold uppercase text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>

                                {/* Experience Card 4 */}
                                <div className="bg-white border border-ink/10 rounded-sm p-6 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/ai-market/${tool.id}/review/exp-4`)}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src="https://i.pravatar.cc/150?u=4" alt="User" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-ink">Dr. James Wilson</span>
                                                <span className="text-[10px] font-mono text-ink/30">1 week ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 line-clamp-3 mb-3">
                                                The export functionality is excellent. I can seamlessly integrate findings into my research workflow and citation managers.
                                            </p>
                                            <div className="mt-3 rounded-sm overflow-hidden border border-ink/10">
                                                <img
                                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                                                    alt="Article image"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ai-market/${tool.id}/review/exp-4`);
                                        }}
                                        className="text-xs font-mono font-bold uppercase text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>

                                {/* Experience Card 5 */}
                                <div className="bg-white border border-ink/10 rounded-sm p-6 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/ai-market/${tool.id}/review/exp-5`)}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src="https://i.pravatar.cc/150?u=5" alt="User" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-ink">Prof. Lisa Park</span>
                                                <span className="text-[10px] font-mono text-ink/30">2 weeks ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 line-clamp-3 mb-3">
                                                As a graduate student, this tool has been invaluable for literature reviews. The AI-powered summaries help me quickly identify relevant papers.
                                            </p>
                                            <div className="mt-3 rounded-sm overflow-hidden border border-ink/10">
                                                <img
                                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop"
                                                    alt="Video thumbnail"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ai-market/${tool.id}/review/exp-5`);
                                        }}
                                        className="text-xs font-mono font-bold uppercase text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>

                                {/* Experience Card 6 */}
                                <div className="bg-white border border-ink/10 rounded-sm p-6 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/ai-market/${tool.id}/review/exp-6`)}>
                                    <div className="flex items-start gap-4 mb-4">
                                        <img src="https://i.pravatar.cc/150?u=6" alt="User" className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-ink">Dr. Robert Taylor</span>
                                                <span className="text-[10px] font-mono text-ink/30">2 weeks ago</span>
                                            </div>
                                            <p className="text-sm text-ink/70 line-clamp-3 mb-3">
                                                The collaborative features allow my research team to share findings and annotations seamlessly. Highly recommended for group projects.
                                            </p>
                                            <div className="mt-3 rounded-sm overflow-hidden border border-ink/10">
                                                <img
                                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
                                                    alt="Article image"
                                                    className="w-full h-32 object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/ai-market/${tool.id}/review/exp-6`);
                                        }}
                                        className="text-xs font-mono font-bold uppercase text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                                    >
                                        View Details <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* 4. User Feedback & Discussion */}
                        <section className="space-y-10">

                            {/* Call to Action Banner (Weakened/Weaker visual style) */}
                            <div className="bg-stone/5 border border-ink/5 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <h4 className="font-bold text-lg text-ink mb-2 flex items-center gap-2"><MessageCircle size={20} className="text-ink/40" /> Join the Conversation</h4>
                                    <p className="text-sm text-ink/60 max-w-md">Share your workflow, ask questions, or review this tool.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsAskQuestionOpen(true)} className="px-6 py-3 bg-white hover:bg-stone-50 text-ink border border-ink/10 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap shadow-sm">Ask Question</button>
                                    <button onClick={() => setIsWriteReviewOpen(true)} className="px-6 py-3 bg-ink text-white hover:bg-ink/90 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-md whitespace-nowrap">Write Review</button>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-bold text-lg text-ink">Discussion ({reviews.length})</h4>
                                    <div className="flex bg-stone/5 p-1 rounded-full">
                                        {REVIEW_SORT_OPTIONS.map(sort => (
                                            <button
                                                key={sort}
                                                onClick={() => setReviewSort(sort)}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${reviewSort === sort ? 'bg-white text-ink shadow-sm' : 'text-ink/40 hover:text-ink/60'
                                                    }`}
                                            >
                                                {sort === 'HELPFUL' ? 'Top' : 'Newest'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {sortedReviews.map((review: any) => (
                                        <div key={review.id} className="p-0 bg-transparent transition-colors rounded-sm group">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover border border-ink/10 shadow-sm" />
                                                    <div className="w-0.5 flex-1 bg-ink/5 group-hover:bg-ink/10 transition-colors my-2"></div>
                                                </div>

                                                <div className="flex-1 pb-8 border-b border-ink/5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-ink text-sm">{review.user}</span>
                                                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[9px] font-mono font-bold uppercase">Verified User</span>
                                                            <span className="text-[10px] font-mono text-ink/30">• {review.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-0.5">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} size={10} fill={i < review.rating ? "#EAB308" : "none"} className={i < review.rating ? "text-yellow-500" : "text-stone-200"} />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <h5 className="font-bold text-ink mb-1 text-base">{review.title || "Review"}</h5>
                                                    <div className="mb-4">
                                                        {review.content.length > 200 && !expandedReviews.has(review.id) ? (
                                                            <>
                                                                <p className="text-sm text-ink/70 leading-relaxed">{review.content.substring(0, 200)}...</p>
                                                                <button
                                                                    onClick={() => setExpandedReviews(new Set([...expandedReviews, review.id]))}
                                                                    className="text-xs font-mono font-bold text-ink/60 hover:text-ink mt-2 flex items-center gap-1"
                                                                >
                                                                    Show more <ChevronDown size={12} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm text-ink/70 leading-relaxed">{review.content}</p>
                                                                {review.content.length > 200 && expandedReviews.has(review.id) && (
                                                                    <button
                                                                        onClick={() => {
                                                                            const newSet = new Set(expandedReviews);
                                                                            newSet.delete(review.id);
                                                                            setExpandedReviews(newSet);
                                                                        }}
                                                                        className="text-xs font-mono font-bold text-ink/60 hover:text-ink mt-2 flex items-center gap-1"
                                                                    >
                                                                        Show less <ChevronUp size={12} />
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <button className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-ink/40 hover:text-ink transition-colors group/btn">
                                                            <ThumbsUp size={12} className="group-hover/btn:scale-110 transition-transform" />
                                                            Helpful ({review.likes})
                                                        </button>
                                                        <button className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-ink/40 hover:text-ink transition-colors group/btn">
                                                            <MessageSquare size={12} className="group-hover/btn:scale-110 transition-transform" />
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
            </div>

            {/* Write Review Modal */}
            <WriteReviewModal
                isOpen={isWriteReviewOpen}
                onClose={() => setIsWriteReviewOpen(false)}
                toolName={tool.name}
                onSubmit={(review) => {
                    console.log('Review submitted:', review);
                    showToast('Thank you for your review!');
                }}
            />

            {/* Ask Question Modal */}
            <AskQuestionModal
                isOpen={isAskQuestionOpen}
                onClose={() => setIsAskQuestionOpen(false)}
                toolName={tool.name}
                onSubmit={(question) => {
                    console.log('Question submitted:', question);
                    showToast('Your question has been posted!');
                }}
            />

            {/* Payment Pending Overlay */}
            {paymentStatus === 'PENDING' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-ink rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Sparkles size={40} className="text-white animate-spin-slow" />
                        </div>
                        <h2 className="text-2xl font-black text-ink mb-2 tracking-tight">Processing Payment</h2>
                        <p className="text-ink/40 font-mono text-xs uppercase tracking-widest">
                            Confirming transaction on blockchain
                        </p>
                    </div>
                </div>
            )}

            {/* Payment Failed Overlay */}
            {paymentStatus === 'FAILED' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-red-50/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="text-center max-w-md p-8 animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={48} className="text-red-600" />
                        </div>
                        <h2 className="text-3xl font-black text-ink mb-4 tracking-tight">Payment Failed</h2>
                        <p className="text-ink/60 mb-8 leading-relaxed">
                            We couldn't confirm your transaction. This might be due to network congestion or insufficient funds.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRetryPayment}
                                className="w-full py-4 bg-ink text-white rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-ink/90 transition-all shadow-xl"
                            >
                                Retry Transaction
                            </button>
                            <button
                                onClick={() => setPaymentStatus('IDLE')}
                                className="w-full py-4 text-ink/40 hover:text-ink font-mono text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Redirect Gateway Modal */}
            {isRedirectModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-lg p-10 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
                        <button
                            onClick={() => setIsRedirectModalOpen(false)}
                            className="absolute top-4 right-4 text-ink/40 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-20 h-20 bg-stone/5 text-ink/20 rounded-full flex items-center justify-center mb-8 border border-ink/5">
                            <ShieldAlert size={40} />
                        </div>

                        <h3 className="font-sans text-3xl font-bold text-ink mb-4 leading-tight uppercase tracking-tight">Leaving Catalyst</h3>
                        <p className="text-ink/60 text-base mb-8 leading-relaxed max-w-sm">
                            You are about to access <span className="font-bold text-ink">{tool.name}</span>, which is an external research service.
                        </p>

                        <div className="w-full bg-stone/5 p-6 rounded-sm border border-ink/5 text-left mb-10 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1"><Info size={16} className="text-ink/40" /></div>
                                <p className="text-xs text-ink/50 font-mono leading-relaxed">
                                    Your data, privacy, and interactions will be subject to <strong className="text-ink/80">{tool.name}'s</strong> privacy policy and terms of service.
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1"><AlertCircle size={16} className="text-ink/40" /></div>
                                <p className="text-xs text-ink/50 font-mono leading-relaxed">
                                    Catalyst does not endorse or take responsibility for external content or processing results.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-4">
                            <button
                                onClick={executeRedirect}
                                className="w-full bg-ink text-paper py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-xl hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <span>Proceed to Site</span>
                                <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={() => setIsRedirectModalOpen(false)}
                                className="w-full text-xs font-mono font-bold uppercase tracking-widest text-ink/40 hover:text-ink py-4"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
