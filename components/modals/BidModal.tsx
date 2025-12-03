
import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Clock, DollarSign, FileText, Loader2, Shield, Paperclip, Save } from 'lucide-react';
import { PasswordVerificationModal } from './PasswordVerificationModal';
import { useToast } from '../../context/ToastContext';

interface BidModalProps {
    isOpen: boolean;
    onClose: () => void;
    questTitle: string;
    maxReward: number;
    currency: string;
    exchangeRate?: number;
    onBidSubmit: (data: any) => void;
}

type Step = 'CHECK' | 'FORM' | 'VERIFY' | 'SUCCESS';

export const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, questTitle, maxReward, currency, exchangeRate = 1, onBidSubmit }) => {
    const { showToast } = useToast();
    const [step, setStep] = useState<Step>('CHECK');
    
    // Form Data
    const [amount, setAmount] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [proposal, setProposal] = useState<string>('');
    const [contact, setContact] = useState<string>('researcher@institute.edu');
    const [isPublic, setIsPublic] = useState(false);
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
            // Auto-run check simulation
            setTimeout(() => {
                setStep('FORM');
            }, 1000);
        }
    }, [isOpen]);

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
                isPublic
            });
            setTimeout(() => {
                onClose();
                // Reset form
                setAmount('');
                setDuration('');
                setProposal('');
                setFiles([]);
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
                            {step === 'CHECK' ? 'System Check' : step === 'SUCCESS' ? 'Completed' : 'New Proposal'}
                        </span>
                        <h3 className="font-sans text-2xl font-bold text-ink leading-tight pr-4">
                            {step === 'SUCCESS' ? 'Bid Submitted' : 'Submit Quotation'}
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
                                    <span>Reputation Score > 500</span>
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
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        onKeyDown={preventNegative}
                                        className="w-full border border-ink/20 p-4 font-mono text-lg font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] font-mono text-ink/40">Max Budget: {maxReward}</span>
                                        {/* EXCHANGE RATE LOGIC HERE */}
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
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            placeholder="0"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            onKeyDown={preventNegative}
                                            className="w-full border border-ink/20 p-4 font-mono text-lg font-bold text-ink focus:outline-none focus:border-accent rounded-sm pl-12"
                                        />
                                        <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
                                    </div>
                                </div>
                            </div>

                            {/* Proposal Text */}
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                    Proposal Plan
                                </label>
                                <textarea 
                                    value={proposal}
                                    onChange={(e) => setProposal(e.target.value)}
                                    className="w-full border border-ink/20 p-4 font-sans text-sm text-ink focus:outline-none focus:border-accent rounded-sm h-32 resize-none leading-relaxed placeholder:text-ink/20"
                                    placeholder="Briefly describe your approach, methodology, and key milestones..."
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

                            {/* Contact Info */}
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                    Contact Email
                                </label>
                                <input 
                                    type="email" 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full border border-ink/20 p-4 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                                />
                            </div>

                            {/* Privacy Toggle */}
                            <div className="flex items-center gap-3 pt-2">
                                <div 
                                    className={`w-5 h-5 border border-ink/20 rounded-sm cursor-pointer flex items-center justify-center ${isPublic ? 'bg-ink border-ink' : 'bg-white'}`}
                                    onClick={() => setIsPublic(!isPublic)}
                                >
                                    {isPublic && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <span className="text-xs font-bold text-ink/60 select-none cursor-pointer" onClick={() => setIsPublic(!isPublic)}>
                                    Make proposal visible to public (Default: Private)
                                </span>
                            </div>

                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border border-green-100">
                                <CheckCircle size={40} />
                            </div>
                            <h4 className="font-sans text-2xl font-bold text-ink mb-2">Bid Submitted Successfully!</h4>
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
                            className="px-8 py-3 bg-ink text-paper rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg hover:scale-[1.02]"
                        >
                            Submit Proposal
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
