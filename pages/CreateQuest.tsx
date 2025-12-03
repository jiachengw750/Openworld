
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Upload, FileText, Calendar, DollarSign, CheckCircle, Loader2, ListChecks } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

type WizardStep = 'MAGIC_BOX' | 'CONFIRMATION' | 'ESCROW';

interface QuestFormData {
    title: string;
    description: string;
    deliverables: string;
    acceptanceCriteria: string; // Added field per PRD
    budget: string;
    deadline: string;
    ipRights: 'WORK_FOR_HIRE' | 'OPEN_SOURCE' | 'ATTRIBUTION';
}

export const CreateQuest: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState<WizardStep>('MAGIC_BOX');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form Data
    const [rawData, setRawData] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<QuestFormData>({
        title: '',
        description: '',
        deliverables: '',
        acceptanceCriteria: '', // Init
        budget: '',
        deadline: '',
        ipRights: 'OPEN_SOURCE'
    });

    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Step 1: Magic Box Logic ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleMagicGenerate = () => {
        if (!rawData.trim() && files.length === 0) {
            showToast("Please enter a description or upload a file.");
            return;
        }

        setIsProcessing(true);
        // Simulate Gemini AI Processing
        setTimeout(() => {
            setFormData({
                title: "Optimization of Multi-Agent Reinforcement Learning",
                description: rawData || "Based on the uploaded documents, we need to develop a robust framework for multi-agent reinforcement learning that handles non-stationary environments.",
                deliverables: "- Python codebase\n- Simulation environment\n- Technical Report (PDF)",
                acceptanceCriteria: "- Code must run without errors on Python 3.9+\n- Model must achieve >85% accuracy on benchmark\n- Documentation must cover setup and API usage",
                budget: "5000",
                deadline: "2025-12-31",
                ipRights: "OPEN_SOURCE"
            });
            setIsProcessing(false);
            setCurrentStep('CONFIRMATION');
            showToast("Draft generated from your inputs.");
        }, 2000);
    };

    // --- Step 2: Confirmation Logic ---
    const handleConfirmationNext = () => {
        if (!formData.title || !formData.budget || !formData.deadline) {
            showToast("Please fill in all required fields.");
            return;
        }
        if (parseFloat(formData.budget) < 0) {
            showToast("Budget cannot be negative.");
            return;
        }
        setCurrentStep('ESCROW');
    };

    // --- Step 3: Publish Logic ---
    const handlePublish = () => {
        setIsPasswordOpen(true);
    };

    const onPasswordVerified = () => {
        setIsPasswordOpen(false);
        setIsProcessing(true);
        
        // Simulate On-Chain Transaction
        setTimeout(() => {
            setIsProcessing(false);
            showToast("Quest published successfully!");
            navigate('/workspace'); // Go to Workspace (Maker view)
        }, 2000);
    };

    // Prevent negative sign input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1512px] mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">
                            <ArrowLeft size={14} className="mr-2" /> Back
                        </Link>
                        <span className="font-mono text-xs font-bold text-ink/40 uppercase tracking-widest">
                            Step {currentStep === 'MAGIC_BOX' ? '1' : currentStep === 'CONFIRMATION' ? '2' : '3'} / 3
                        </span>
                    </div>
                    <h1 className="font-sans text-4xl md:text-5xl font-bold text-ink mb-2">Create New Quest</h1>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 md:px-12 mt-12">
                
                {/* STEP 1: MAGIC BOX */}
                {currentStep === 'MAGIC_BOX' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-br from-stone-100 to-white border border-ink/10 p-10 rounded-sm mb-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles size={120} className="text-accent" />
                            </div>
                            
                            <h2 className="font-sans text-2xl font-bold text-ink mb-4 flex items-center gap-3">
                                <Sparkles className="text-accent" size={24} />
                                Magic Box Input
                            </h2>
                            <p className="text-ink/60 text-lg mb-8 leading-relaxed max-w-2xl">
                                Describe your research needs roughly, or upload a draft PDF. 
                                Our AI will structure it into a standard Quest format automatically.
                            </p>

                            <div className="space-y-6 relative z-10">
                                <textarea 
                                    className="w-full h-48 bg-white border border-ink/10 p-6 font-sans text-lg text-ink focus:outline-none focus:border-accent rounded-sm resize-none shadow-sm placeholder:text-ink/20"
                                    placeholder="e.g., I need a Python script to analyze genomic data for CRISPR off-target effects..."
                                    value={rawData}
                                    onChange={(e) => setRawData(e.target.value)}
                                />
                                
                                <div 
                                    className="border-2 border-dashed border-ink/20 rounded-sm p-8 text-center cursor-pointer hover:border-accent hover:bg-white/50 transition-all"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                                    <Upload size={32} className="mx-auto text-ink/30 mb-3" />
                                    <span className="block font-mono text-sm font-bold text-ink/60 uppercase tracking-widest">
                                        {files.length > 0 ? `${files.length} file(s) selected` : "Upload Documents (PDF/Docx)"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                onClick={handleMagicGenerate}
                                disabled={isProcessing}
                                className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02] flex items-center gap-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>AI Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        <span>AI Generate Draft</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: CONFIRMATION */}
                {currentStep === 'CONFIRMATION' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12">
                        
                        {/* Section 1: Overview */}
                        <section>
                            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink/40 mb-6 border-b border-ink/10 pb-2">1. Overview</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block font-bold text-ink mb-2">Quest Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-surface border border-ink/20 p-4 font-sans text-xl font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-ink mb-2">Description</label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-surface border border-ink/20 p-4 font-sans text-base text-ink focus:outline-none focus:border-accent rounded-sm h-40"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Deliverables & Acceptance */}
                        <section>
                            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink/40 mb-6 border-b border-ink/10 pb-2">2. Standards</h3>
                            <div className="grid grid-cols-1 gap-8">
                                <div>
                                    <label className="block font-bold text-ink mb-2">Deliverables List</label>
                                    <textarea 
                                        value={formData.deliverables}
                                        onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                                        placeholder="- Source Code..."
                                        className="w-full bg-surface border border-ink/20 p-4 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm h-32"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-ink mb-2 flex items-center gap-2">
                                        <ListChecks size={16} /> Acceptance Criteria
                                    </label>
                                    <textarea 
                                        value={formData.acceptanceCriteria}
                                        onChange={(e) => setFormData({...formData, acceptanceCriteria: e.target.value})}
                                        placeholder="- Must pass unit tests..."
                                        className="w-full bg-surface border border-ink/20 p-4 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm h-32"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Terms */}
                        <section>
                            <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-ink/40 mb-6 border-b border-ink/10 pb-2">3. Terms & IP</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block font-bold text-ink mb-2">Budget (USDC)</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                                        <input 
                                            type="number"
                                            min="0" 
                                            value={formData.budget}
                                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                            onKeyDown={preventNegative}
                                            className="w-full bg-surface border border-ink/20 p-4 pl-10 font-mono text-lg font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold text-ink mb-2">Deadline</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                                        <input 
                                            type="date" 
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                            className="w-full bg-surface border border-ink/20 p-4 pl-10 font-mono text-lg font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-ink mb-4">Intellectual Property Rights</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(['WORK_FOR_HIRE', 'OPEN_SOURCE', 'ATTRIBUTION'] as const).map((type) => (
                                        <div 
                                            key={type}
                                            onClick={() => setFormData({...formData, ipRights: type})}
                                            className={`p-4 border cursor-pointer rounded-sm transition-all ${
                                                formData.ipRights === type 
                                                ? 'bg-ink text-paper border-ink' 
                                                : 'bg-paper border-ink/10 hover:border-ink/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono text-xs font-bold uppercase tracking-wider">{type.replace(/_/g, ' ')}</span>
                                                {formData.ipRights === type && <CheckCircle size={16} />}
                                            </div>
                                            <p className={`text-xs leading-relaxed ${formData.ipRights === type ? 'opacity-80' : 'text-ink/60'}`}>
                                                {type === 'WORK_FOR_HIRE' ? 'You own 100% of the output.' : 
                                                 type === 'OPEN_SOURCE' ? 'Shared under MIT License.' : 
                                                 'You use it, but author retains credit.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end pt-8 border-t border-ink/10">
                            <button 
                                onClick={handleConfirmationNext}
                                className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02]"
                            >
                                Next: Review & Pay
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: ESCROW */}
                {currentStep === 'ESCROW' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-2xl mx-auto">
                        
                        <div className="bg-paper border-2 border-ink/10 p-8 rounded-sm shadow-sm mb-8">
                            <h3 className="font-sans text-2xl font-bold text-ink mb-6 text-center">Summary & Escrow</h3>
                            
                            <div className="space-y-4 font-mono text-sm border-b border-ink/10 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-ink/60">Quest Budget</span>
                                    <span className="font-bold text-ink">{formData.budget} USDC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink/60">Platform Fee (2%)</span>
                                    <span className="font-bold text-ink">{(parseFloat(formData.budget) * 0.02).toFixed(2)} USDC</span>
                                </div>
                                <div className="flex justify-between text-lg pt-2 border-t border-ink/10">
                                    <span className="font-bold uppercase">Total Stake</span>
                                    <span className="font-bold text-accent">{(parseFloat(formData.budget) * 1.02).toFixed(2)} USDC</span>
                                </div>
                            </div>

                            <p className="text-center text-ink/60 text-sm leading-relaxed mb-8">
                                Funds will be locked in a smart contract escrow upon publishing.<br/>
                                You can release funds after approving the submission.
                            </p>

                            <button 
                                onClick={handlePublish}
                                className="w-full bg-accent text-paper py-5 rounded-full font-mono text-base font-bold uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg hover:scale-[1.02]"
                            >
                                {isProcessing ? "Publishing..." : "Stake & Publish Quest"}
                            </button>
                        </div>

                        <div className="text-center">
                            <button 
                                onClick={() => setCurrentStep('CONFIRMATION')}
                                className="text-xs font-mono font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors"
                            >
                                Back to Edit
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <PasswordVerificationModal 
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={onPasswordVerified}
            />
        </div>
    );
};
