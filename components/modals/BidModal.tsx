
import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Minus, Plus, Paperclip, FileText, Loader2, Save, Bold, Italic, List as ListIcon, ListOrdered, Lock, Maximize2, Minimize2, Check, User, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon } from 'lucide-react';
import { PasswordVerificationModal } from './PasswordVerificationModal';
import { useToast } from '../../context/ToastContext';

// --- Helper Component: Rich Text Editor ---
const RichTextEditor = ({ value, onChange, placeholder, initialHeight = 300 }: { value: string, onChange: (val: string) => void, placeholder?: string, initialHeight?: number }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [height, setHeight] = useState(initialHeight);

    useEffect(() => {
        if (editorRef.current && !editorRef.current.innerHTML && value) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    // Full Screen Body Scroll Lock
    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullScreen]);

    // Resize Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;
        const startHeight = height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newHeight = Math.max(initialHeight, Math.min(1200, startHeight + (moveEvent.clientY - startY)));
            setHeight(newHeight);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div 
            ref={containerRef}
            className={`flex flex-col border transition-all duration-200 bg-surface ${
                isFullScreen 
                ? 'fixed inset-0 z-[100] rounded-none border-0' 
                : `rounded-sm ${isFocused ? 'border-accent' : 'border-ink/20'} relative`
            }`}
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-ink/10 bg-stone/5 shrink-0">
                <div className="flex items-center gap-1 flex-wrap">
                    {/* Headings Selector */}
                    <select 
                        onChange={(e) => execCmd('formatBlock', e.target.value)}
                        className="text-[10px] font-mono font-bold bg-transparent border-none outline-none mr-1 cursor-pointer hover:bg-ink/5 p-1 rounded transition-colors"
                        defaultValue="p"
                    >
                        <option value="p">Body</option>
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                    </select>
                    
                    <div className="w-px h-4 bg-ink/10 mx-1"></div>

                    {/* Basic Style */}
                    <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bold"><Bold size={14}/></button>
                    <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Italic"><Italic size={14}/></button>
                    
                    <div className="w-px h-4 bg-ink/10 mx-1"></div>
                    
                    {/* Lists */}
                    <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bullet List"><ListIcon size={14}/></button>
                    <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Numbered List"><ListOrdered size={14}/></button>
                    
                    <div className="w-px h-4 bg-ink/10 mx-1"></div>

                    {/* Alignment */}
                    <button type="button" onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Align Left"><AlignLeft size={14}/></button>
                    <button type="button" onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Align Center"><AlignCenter size={14}/></button>
                    <button type="button" onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Align Right"><AlignRight size={14}/></button>
                    
                    <div className="w-px h-4 bg-ink/10 mx-1"></div>

                    {/* Image (Placeholder) */}
                    <button 
                        type="button" 
                        onClick={() => alert("Image insertion feature is being scheduled.")} 
                        className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" 
                        title="Paste Image"
                    >
                        <ImageIcon size={14}/>
                    </button>
                </div>
                
                <button 
                    type="button" 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors"
                    title={isFullScreen ? "Minimize" : "Full Screen"}
                >
                    {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
            </div>
            
            {/* Editor Area */}
            <div
                ref={editorRef}
                className={`w-full p-4 overflow-auto outline-none font-sans text-sm text-ink empty:before:content-[attr(data-placeholder)] empty:before:text-ink/30 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 flex-1`}
                style={{ height: isFullScreen ? '100%' : `${height}px`, minHeight: isFullScreen ? 'auto' : `${initialHeight}px` }}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
            />

            {/* Resize Handle */}
            {!isFullScreen && (
                <div 
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 z-10 group"
                    onMouseDown={handleMouseDown}
                    title="Drag to resize"
                >
                    <svg viewBox="0 0 10 10" className="w-3 h-3 text-ink/30 group-hover:text-ink/60 transition-colors pointer-events-none">
                        <path d="M8 2 L8 8 L2 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
        </div>
    );
};

interface BidData {
    amount: string;
    duration: string;
    proposal: string;
    contact: string;
    isPublic: boolean;
    files?: File[];
}

interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    questTitle: string;
    maxReward: number;
    currency: string;
    exchangeRate?: number;
    onBidSubmit: (data: any) => void;
    initialData?: BidData; 
}

type Step = 'CHECK' | 'FORM' | 'VERIFY' | 'SUCCESS';

export const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, questTitle, maxReward, currency, exchangeRate = 1, onBidSubmit, initialData }) => {
    const { showToast } = useToast();
    const [step, setStep] = useState<Step>('CHECK');
    
    // Form Data
    const [amount, setAmount] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [proposal, setProposal] = useState<string>('');
    const [contact, setContact] = useState<string>('researcher@institute.edu');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [files, setFiles] = useState<File[]>([]); 

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password Modal State
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // Exchange Rate Logic
    const convertedAmount = amount && !isNaN(parseFloat(amount)) 
        ? (parseFloat(amount) * exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00';

    useEffect(() => {
        if (isOpen) {
            setStep('CHECK');
            
            // Populate form if editing
            if (initialData) {
                setAmount(initialData.amount);
                setDuration(initialData.duration);
                setProposal(initialData.proposal);
                setContact(initialData.contact);
                setAgreedToTerms(true);
                if (initialData.files) setFiles(initialData.files);
            } else {
                // Reset defaults for new bid
                setAmount('');
                setDuration('');
                setProposal('');
                setContact('researcher@institute.edu'); 
                setAgreedToTerms(false);
                setFiles([]);
            }

            // Auto-run check simulation
            setTimeout(() => {
                setStep('FORM');
            }, 1000);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = () => {
        // Validation
        if (!amount || !duration || !proposal) {
            showToast("Please fill in all required fields");
            return;
        }
        if (!agreedToTerms) {
            showToast("Please agree to the protocol terms");
            return;
        }
        if (parseFloat(amount) > maxReward) {
            showToast(`Bid cannot exceed max reward of ${maxReward}`);
            return;
        }
        if (parseFloat(amount) < 0 || parseFloat(duration) < 0) {
            showToast("Values cannot be negative");
            return;
        }

        // Trigger Password Modal
        setIsPasswordOpen(true);
    };

    const handleVerified = () => {
        setIsPasswordOpen(false);
        setStep('SUCCESS');
        
        // Simulate network request
        setTimeout(() => {
            onBidSubmit({
                amount,
                duration,
                proposal,
                contact,
                files,
                isPublic: false
            });
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1500);
    };

    // Prevent negative sign input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-2xl shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 flex flex-col rounded-sm overflow-hidden max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-start p-8 border-b border-ink/10 bg-surface">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 block mb-1">
                            {step === 'CHECK' ? 'System Check' : step === 'SUCCESS' ? 'Completed' : initialData ? 'Edit Proposal' : 'New Proposal'}
                        </span>
                        <h3 className="font-sans text-2xl font-bold text-ink leading-tight pr-4">
                            {step === 'SUCCESS' ? (initialData ? 'Bid Updated' : 'Bid Submitted') : (initialData ? 'Update Quotation' : 'Submit Quotation')}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-8 bg-paper">
                    
                    {step === 'CHECK' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 size={48} className="text-accent animate-spin mb-6" />
                            <h4 className="font-sans text-lg font-bold text-ink mb-2">Verifying Eligibility</h4>
                            <div className="space-y-2 text-center">
                                <div className="flex items-center gap-2 text-sm text-ink/60 font-mono">
                                    <CheckCircle size={14} className="text-green-600" />
                                    <span>Wallet Connected</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-ink/60 font-mono">
                                    <CheckCircle size={14} className="text-green-600" />
                                    <span>Reputation Score &gt; 500</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-ink/60 font-mono">
                                    <CheckCircle size={14} className="text-green-600" />
                                    <span>Stake Balance Sufficient</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'FORM' && (
                        <div className="space-y-8">
                            {/* Profile Alert */}
                            <div className="bg-green-50 border border-green-200 p-4 rounded-sm flex items-center gap-3">
                                <CheckCircle size={18} className="text-green-700" />
                                <span className="text-xs font-mono font-bold text-green-800 uppercase tracking-wide">
                                    PROFILE VERIFIED • LEX SCORE 850+
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Amount Input */}
                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                        Bid Amount ({currency})
                                    </label>
                                    <div className="relative flex items-center bg-surface border border-ink/20 rounded-sm overflow-hidden group hover:border-ink/40 transition-colors">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const current = parseFloat(amount) || 0;
                                                const next = Math.max(0, current - 100);
                                                setAmount(next.toString());
                                            }}
                                            className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-ink/40 hover:text-ink hover:bg-stone/5 transition-colors z-10 border-r border-ink/10"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input 
                                            type="number" 
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            onKeyDown={preventNegative}
                                            className="w-full bg-transparent border-none py-4 px-12 font-mono text-lg font-bold text-ink focus:outline-none placeholder-ink/20 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const current = parseFloat(amount) || 0;
                                                const next = current + 100;
                                                if (next > maxReward) {
                                                    setAmount(maxReward.toString());
                                                    showToast(`Cannot exceed max budget of ${maxReward}`);
                                                } else {
                                                    setAmount(next.toString());
                                                }
                                            }}
                                            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-ink/40 hover:text-ink hover:bg-stone/5 transition-colors z-10 border-l border-ink/10"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="flex justify-end items-center mt-2">
                                        {amount && (
                                            <span className="text-[10px] font-mono font-bold text-ink/60 bg-stone/5 px-2 py-0.5 rounded-sm border border-ink/5">
                                                ≈ ${convertedAmount} USD
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Duration Input */}
                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                        Est. Duration (Days)
                                    </label>
                                    <div className="relative flex items-center bg-surface border border-ink/20 rounded-sm overflow-hidden group hover:border-ink/40 transition-colors">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const current = parseFloat(duration) || 0;
                                                const next = Math.max(0, current - 1);
                                                setDuration(next.toString());
                                            }}
                                            className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-ink/40 hover:text-ink hover:bg-stone/5 transition-colors z-10 border-r border-ink/10"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input 
                                            type="number" 
                                            placeholder="0"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            onKeyDown={preventNegative}
                                            className="w-full bg-transparent border-none py-4 px-12 font-mono text-lg font-bold text-ink focus:outline-none placeholder-ink/20 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const current = parseFloat(duration) || 0;
                                                setDuration((current + 1).toString());
                                            }}
                                            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center text-ink/40 hover:text-ink hover:bg-stone/5 transition-colors z-10 border-l border-ink/10"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Proposal Text (Rich Text Editor) */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 font-bold">
                                        Proposal Plan
                                    </label>
                                </div>
                                <RichTextEditor 
                                    value={proposal}
                                    onChange={setProposal}
                                    placeholder="Briefly describe your approach, methodology, and key milestones..."
                                    initialHeight={300}
                                />
                            </div>

                            {/* Attachments */}
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                    Attachments
                                </label>
                                <div 
                                    className="border-2 border-dashed border-ink/20 rounded-sm p-6 text-center cursor-pointer hover:border-accent hover:bg-stone/5 transition-all group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                    <div className="flex items-center justify-center gap-2 text-ink/40 group-hover:text-accent transition-colors">
                                        <Paperclip size={16} />
                                        <span className="font-mono text-xs font-bold uppercase">Upload Files</span>
                                    </div>
                                </div>
                                {files.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs font-mono bg-stone/5 p-2 rounded-sm border border-ink/5">
                                                <div className="flex items-center gap-2 truncate">
                                                    <FileText size={12} className="text-ink/40" />
                                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                                </div>
                                                <button onClick={() => handleRemoveFile(idx)} className="text-ink/40 hover:text-red-500">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Contact Info - Locked */}
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                    Contact Email
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="email" 
                                        value={contact}
                                        readOnly
                                        className="w-full bg-stone/10 border border-ink/10 p-4 pl-10 font-mono text-sm text-ink/60 focus:outline-none rounded-sm cursor-not-allowed select-none"
                                    />
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                                </div>
                            </div>

                            {/* Agreement Section */}
                            <div className="space-y-4 pt-4 border-t border-ink/5">
                                <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                                    <div 
                                        className={`w-5 h-5 shrink-0 border-2 rounded-sm flex items-center justify-center transition-colors ${agreedToTerms ? 'bg-ink border-ink' : 'bg-paper border-ink/20 group-hover:border-ink/40'}`}
                                    >
                                        {agreedToTerms && <Check size={14} className="text-paper" strokeWidth={3} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-ink leading-tight">
                                            I have read and agree to the <span className="underline hover:text-accent">Solver Protocol</span> and <span className="underline hover:text-accent">Escrow Terms</span>.
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-ink/40">
                                    <div className="w-5 h-5 shrink-0 flex items-center justify-center opacity-40">
                                        <User size={14} />
                                    </div>
                                    <p className="text-[11px] leading-relaxed font-medium">
                                        Your profile identity, including avatar and reputation score, will be visible to the task publisher to facilitate the selection process.
                                    </p>
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border border-green-100">
                                <CheckCircle size={40} />
                            </div>
                            <h4 className="font-sans text-2xl font-bold text-ink mb-2">{initialData ? 'Bid Updated Successfully!' : 'Bid Submitted Successfully!'}</h4>
                            <p className="text-ink/60 max-w-sm mb-8 leading-relaxed">
                                Your proposal for <span className="font-bold text-ink">{questTitle}</span> has been sent to the researcher. You will be notified once a decision is made.
                            </p>
                            
                            <div className="bg-stone/5 p-6 rounded-sm border border-ink/5 w-full max-w-md mb-8">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-ink/60">Bid Amount</span>
                                    <span className="font-mono font-bold">{amount} {currency}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-ink/60">Est. Duration</span>
                                    <span className="font-mono font-bold">{duration} Days</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                {step === 'FORM' && (
                    <div className="p-8 border-t border-ink/10 bg-surface flex justify-between items-center">
                        <button 
                            className="px-6 py-3 border border-ink/10 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors flex items-center gap-2"
                            onClick={onClose}
                        >
                            <Save size={14} /> Save Draft
                        </button>
                        <button 
                            onClick={handleFormSubmit}
                            className={`px-8 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${agreedToTerms ? 'bg-ink text-paper hover:bg-accent hover:scale-[1.02]' : 'bg-stone/20 text-ink/30 cursor-not-allowed shadow-none'}`}
                        >
                            {initialData ? 'Update Proposal' : 'Submit Proposal'}
                        </button>
                    </div>
                )}
            </div>

            <PasswordVerificationModal 
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={handleVerified}
            />
        </div>
    );
};
