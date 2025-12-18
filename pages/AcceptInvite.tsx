
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, X, ChevronRight, Check } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

const PRESET_TAGS = [
    "Mentor", "Visionary", "Collaborator", 
    "Supporter", "Strategist", "Executor", 
    "Early Adopter", "Connector"
];

export const AcceptInvite: React.FC = () => {
    const { wallet, connect } = useWallet();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [isAccepting, setIsAccepting] = useState(false);
    const [showTagModal, setShowTagModal] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSubmittingTags, setIsSubmittingTags] = useState(false);
    
    const inviterName = "Dr. Aris Kothari";
    const inviterAvatar = "https://i.pravatar.cc/150?u=3";
    const refCode = searchParams.get('ref') || '0x71C...9A23';

    const handleConnect = (method: string) => {
        setIsAccepting(true);
        setTimeout(() => {
            if (method.includes('Wallet') || method === 'MetaMask' || method === 'Coinbase Wallet') {
                connect();
            }
            setIsAccepting(false);
            setShowTagModal(true);
        }, 1500);
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 2) {
                setSelectedTags(prev => [...prev, tag]);
            } else {
                showToast("You can only select up to 2 tags");
            }
        }
    };

    const handleConfirmTags = () => {
        if (selectedTags.length === 0) return;
        setIsSubmittingTags(true);
        setTimeout(() => {
            showToast("Feedback submitted! 5 CES credited.");
            navigate('/');
        }, 1000);
    };

    const handleSkip = () => {
        showToast("Welcome to OpenSCI! 5 CES credited.");
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
            <div className="w-full max-w-5xl bg-paper shadow-2xl rounded-sm overflow-hidden flex flex-col lg:flex-row lg:h-[600px]"> 
                
                {/* Left Panel */}
                <div className="lg:w-5/12 bg-[#0F172A] relative overflow-hidden flex flex-col justify-between p-10 text-paper">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-500 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center text-[10px] font-mono font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest mb-12 w-fit">
                            <ArrowLeft size={14} className="mr-2" /> Back to Home
                        </Link>
                        
                        <h1 className="font-sans text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            Join the future of <br/> scientific funding.
                        </h1>
                        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                            OpenSCI connects researchers with global backers. Decentralized, transparent, and impact-driven.
                        </p>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-sm">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/30 mb-3 block">Invited By</span>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-white/5">
                                    <img src={inviterAvatar} alt={inviterName} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-white">{inviterName}</h3>
                                    <span className="text-[10px] font-mono text-white/50 block mt-0.5">Ref: {refCode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="lg:w-7/12 bg-paper flex flex-col justify-center p-12 relative">
                    <Link to="/" className="absolute top-6 right-6 p-2 text-ink/40 hover:text-ink transition-colors">
                        <X size={20} />
                    </Link>

                    <div className="w-full max-w-sm mx-auto">
                        <h2 className="font-sans text-3xl font-bold text-ink mb-2">Connect Wallet</h2>
                        <p className="text-ink/60 text-sm mb-8">Choose a wallet to connect and start exploring</p>

                        <div className="space-y-3">
                            <button 
                                onClick={() => handleConnect('Google')}
                                className="w-full bg-[#0F172A] text-white h-12 rounded-full flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-transform hover:scale-[1.01]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/><path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/><path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"/><path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/></svg>
                                CONTINUE WITH GOOGLE
                            </button>

                            <button 
                                onClick={() => handleConnect('Email')}
                                className="w-full bg-white border border-stone-200 text-ink h-12 rounded-full flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition-transform hover:scale-[1.01]"
                            >
                                <Mail size={16} />
                                CONTINUE WITH EMAIL
                            </button>
                        </div>

                        <div className="relative my-8 text-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
                            <span className="relative bg-paper px-4 text-[10px] font-bold text-ink/30 uppercase tracking-widest">OR CONNECT WALLET</span>
                        </div>

                        <div className="space-y-3">
                            <button onClick={() => handleConnect('MetaMask')} className="w-full bg-white border border-stone-200 h-14 rounded-full flex items-center justify-between px-6 hover:border-ink/20 transition-all hover:shadow-sm group">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-full h-full object-contain" /></div>
                                    <span className="font-bold text-ink font-sans text-sm">MetaMask</span>
                                </div>
                                <ChevronRight size={16} className="text-stone-300 group-hover:text-ink transition-colors" />
                            </button>

                            <button onClick={() => handleConnect('Coinbase Wallet')} className="w-full bg-white border border-stone-200 h-14 rounded-full flex items-center justify-between px-6 hover:border-ink/20 transition-all hover:shadow-sm group">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-[#0052FF] rounded-full flex items-center justify-center"><div className="w-2.5 h-2.5 bg-white rounded-sm"></div></div>
                                    <span className="font-bold text-ink font-sans text-sm">Coinbase Wallet</span>
                                </div>
                                <ChevronRight size={16} className="text-stone-300 group-hover:text-ink transition-colors" />
                            </button>
                        </div>

                        <p className="text-center text-ink/30 text-[10px] mt-8">
                            By connecting, you agree to the Terms of Service
                        </p>
                    </div>
                </div>
            </div>

            {/* Tag Modal */}
            {showTagModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-lg p-10 rounded-sm shadow-2xl relative border border-ink/10 animate-in zoom-in-95">
                        <button onClick={handleSkip} className="absolute top-4 right-4 p-2 text-ink/40 hover:text-ink transition-colors rounded-full"><X size={20} /></button>
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full mx-auto mb-6 p-1 bg-gradient-to-br from-accent to-blue-500 shadow-xl">
                                <img src={inviterAvatar} alt={inviterName} className="w-full h-full rounded-full object-cover border-4 border-paper" />
                            </div>
                            <h3 className="font-sans text-2xl font-bold text-ink leading-tight mb-3">Your friend {inviterName} invited you to OpenSci!</h3>
                            <p className="text-ink/60 text-sm leading-relaxed">How would you describe them? Choose 1-2 tags to help build their reputation.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {PRESET_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button key={tag} onClick={() => toggleTag(tag)} className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wide transition-all border ${isSelected ? 'bg-ink text-paper border-ink scale-105 shadow-md' : 'bg-stone/5 text-ink/60 border-ink/10 hover:border-ink/40 hover:text-ink'}`}>
                                        {isSelected && <Check size={12} className="inline mr-2 -mt-0.5" />}
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleSkip} className="flex-1 py-4 border border-ink/10 rounded-full font-mono text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-ink hover:bg-stone/5 transition-colors">Skip</button>
                            <button onClick={handleConfirmTags} disabled={selectedTags.length === 0 || isSubmittingTags} className={`flex-1 py-4 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${selectedTags.length === 0 ? 'bg-stone/20 text-ink/40 cursor-not-allowed shadow-none' : 'bg-ink text-paper hover:bg-accent'}`}>
                                {isSubmittingTags ? 'Submitting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
