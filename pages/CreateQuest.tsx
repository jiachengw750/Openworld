
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Upload, FileText, Calendar, DollarSign, 
    CheckCircle, Loader2, ListChecks, X, Plus, ChevronRight, 
    Shield, Briefcase, Globe, User, BookOpen,
    Bold, Italic, List as ListIcon, ListOrdered, Save,
    AlignLeft, AlignCenter, AlignRight, Image as ImageIcon,
    Check
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

type WizardStep = 'GUIDE' | 'BASICS' | 'STANDARDS' | 'TERMS' | 'PREVIEW' | 'PAYMENT';

interface QuestFormData {
    title: string;
    subject: string;
    tags: string[];
    description: string;
    attachments: File[];
    deliverables: string;
    acceptanceCriteria: string;
    budget: string;
    deadline: string;
    ipRights: 'WORK_FOR_HIRE' | 'OPEN_SOURCE' | 'ATTRIBUTION' | null;
}

const SUBJECT_OPTIONS = ['Math', 'Computer', 'Statistics', 'Physics', 'Chemistry', 'Biology', 'Medicine', 'Engineering'];

// --- Helper Component: Rich Text Editor ---
const RichTextEditor = ({ value, onChange, placeholder, height = "h-64" }: { value: string, onChange: (val: string) => void, placeholder?: string, height?: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

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

    return (
        <div className={`flex flex-col border rounded-sm bg-surface transition-colors overflow-hidden ${isFocused ? 'border-accent' : 'border-ink/20'}`}>
            <div className="flex items-center gap-1 p-2 border-b border-ink/10 bg-stone/5">
                {/* Text Style Selector */}
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

                <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bold"><Bold size={14}/></button>
                <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Italic"><Italic size={14}/></button>
                
                <div className="w-px h-4 bg-ink/10 mx-1"></div>
                
                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bullet List"><ListIcon size={14}/></button>
                <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Numbered List"><ListOrdered size={14}/></button>
                
                <div className="w-px h-4 bg-ink/10 mx-1"></div>

                <button type="button" onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Align Left"><AlignLeft size={14}/></button>
                <button type="button" onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Align Center"><AlignCenter size={14}/></button>
                <button type="button" onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Align Right"><AlignRight size={14}/></button>
                
                <div className="w-px h-4 bg-ink/10 mx-1"></div>

                <button type="button" onClick={() => alert('Image upload feature is being scheduled.')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Insert Image"><ImageIcon size={14}/></button>
            </div>
            <div
                ref={editorRef}
                className={`w-full p-4 overflow-auto outline-none ${height} font-sans text-base text-ink empty:before:content-[attr(data-placeholder)] empty:before:text-ink/30 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5`}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
            />
        </div>
    );
};

export const CreateQuest: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState<WizardStep>('GUIDE');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<QuestFormData>({
        title: '',
        subject: '',
        tags: [],
        description: '',
        attachments: [],
        deliverables: '',
        acceptanceCriteria: '',
        budget: '',
        deadline: '',
        ipRights: null
    });

    // Load Draft on Mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('opensci_quest_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // Merge draft with default state to ensure structure
                setFormData(prev => ({ ...prev, ...parsed, attachments: [] })); // Note: File objects cannot be restored from JSON
                if (parsed.title) showToast("Draft restored");
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // UI Helpers
    const [tagInput, setTagInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [agreedToProtocol, setAgreedToProtocol] = useState(false);
    const [agreedToEscrow, setAgreedToEscrow] = useState(false);
    
    // Modals
    const [isPublishProtocolOpen, setIsPublishProtocolOpen] = useState(false);
    const [isEscrowProtocolOpen, setIsEscrowProtocolOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    // --- Actions ---

    const handleSaveDraft = () => {
        // Exclude attachments from local storage as they are Files
        const { attachments, ...draftData } = formData;
        localStorage.setItem('opensci_quest_draft', JSON.stringify(draftData));
        showToast("Draft saved successfully");
    };

    const updateField = (field: keyof QuestFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            updateField('attachments', [...formData.attachments, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        updateField('attachments', formData.attachments.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            updateField('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        updateField('tags', formData.tags.filter(t => t !== tag));
    };

    // --- Navigation Helpers ---

    const validateStep = (step: WizardStep): boolean => {
        switch(step) {
            case 'BASICS':
                if (!formData.title || !formData.subject || !formData.description) {
                    showToast("Please fill in all required basic info.");
                    return false;
                }
                return true;
            case 'STANDARDS':
                if (!formData.deliverables || !formData.acceptanceCriteria) {
                    showToast("Please define deliverables and acceptance criteria.");
                    return false;
                }
                return true;
            case 'TERMS':
                if (!formData.budget || !formData.deadline || !formData.ipRights) {
                    showToast("Please complete budget, deadline and IP rights.");
                    return false;
                }
                if (parseFloat(formData.budget) <= 0) {
                    showToast("Budget must be greater than 0.");
                    return false;
                }
                return true;
            default: return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep === 'GUIDE') setCurrentStep('BASICS');
            else if (currentStep === 'BASICS') setCurrentStep('STANDARDS');
            else if (currentStep === 'STANDARDS') setCurrentStep('TERMS');
            else if (currentStep === 'TERMS') setCurrentStep('PREVIEW');
        }
    };

    const prevStep = () => {
        if (currentStep === 'BASICS') setCurrentStep('GUIDE');
        else if (currentStep === 'STANDARDS') setCurrentStep('BASICS');
        else if (currentStep === 'TERMS') setCurrentStep('STANDARDS');
        else if (currentStep === 'PREVIEW') setCurrentStep('TERMS');
        else if (currentStep === 'PAYMENT') setCurrentStep('PREVIEW');
    };

    // --- Agreement & Submission Logic ---

    const handleSubmitPreview = () => {
        setIsPublishProtocolOpen(true);
    };

    const handleConfirmProtocol = () => {
        if (!agreedToProtocol) {
            showToast("You must agree to the Publishing Protocol.");
            return;
        }
        setIsPublishProtocolOpen(false);
        setCurrentStep('PAYMENT');
    };

    const handleInitiatePayment = () => {
        setIsEscrowProtocolOpen(true);
    };

    const handleConfirmEscrow = () => {
        if (!agreedToEscrow) {
            showToast("You must agree to the Escrow Terms.");
            return;
        }
        setIsEscrowProtocolOpen(false);
        setIsPasswordOpen(true);
    };

    const onPasswordVerified = () => {
        setIsPasswordOpen(false);
        setIsProcessing(true);
        
        // Clear draft
        localStorage.removeItem('opensci_quest_draft');

        // Simulate On-Chain Transaction & Publishing
        setTimeout(() => {
            setIsProcessing(false);
            showToast("Quest published successfully!");
            navigate('/workspace'); // Redirect to Maker Workspace
        }, 2500);
    };

    // Prevent negative input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) e.preventDefault();
    };

    // --- Render Components ---

    const Stepper = () => {
        const steps = ['Basics', 'Standards', 'Terms', 'Preview', 'Payment'];
        const currentIdx = ['BASICS', 'STANDARDS', 'TERMS', 'PREVIEW', 'PAYMENT'].indexOf(currentStep);
        
        if (currentStep === 'GUIDE') return null;

        return (
            <div className="flex items-center justify-center space-x-4 mb-12">
                {steps.map((label, idx) => (
                    <div key={idx} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-mono text-xs font-bold transition-colors ${
                            idx <= currentIdx ? 'bg-ink border-ink text-paper' : 'border-ink/20 text-ink/30'
                        }`}>
                            {idx < currentIdx ? <Check size={14} strokeWidth={3} /> : idx + 1}
                        </div>
                        <span className={`ml-2 text-xs font-mono font-bold uppercase tracking-wider hidden md:block ${
                            idx <= currentIdx ? 'text-ink' : 'text-ink/30'
                        }`}>
                            {label}
                        </span>
                        {idx < steps.length - 1 && (
                            <div className={`w-8 h-[2px] mx-4 ${idx < currentIdx ? 'bg-ink' : 'bg-ink/10'}`}></div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const SaveDraftButton = () => (
        <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 border border-ink/20 text-ink/60 px-6 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:border-ink hover:text-ink hover:bg-stone/5 transition-all"
        >
            <Save size={16} /> <span className="hidden sm:inline">Save Draft</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Navbar Placeholder / Back Button */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-6 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1000px] mx-auto flex justify-between items-center">
                    <button onClick={() => currentStep === 'GUIDE' ? navigate('/') : prevStep()} className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} className="mr-2" /> {currentStep === 'GUIDE' ? 'EXIT' : 'BACK'}
                    </button>
                    <span className="font-sans font-bold text-ink text-xl uppercase tracking-tight">Create New Task</span>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 md:px-12 mt-12">
                
                <Stepper />

                {/* STEP 0: GUIDE */}
                {currentStep === 'GUIDE' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto text-center">
                        <div className="w-20 h-20 bg-ink text-paper rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <BookOpen size={32} />
                        </div>
                        <h1 className="font-sans text-4xl md:text-5xl font-bold text-ink mb-6">Quest Creation Guide</h1>
                        <p className="text-ink/60 text-lg mb-12 leading-relaxed">
                            Welcome to the OpenSci Task Protocol. To ensure high-quality research outcomes, 
                            please follow our standardized process to define your requirements, 
                            set acceptance criteria, and configure smart contract escrow.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
                            <div className="p-6 border border-ink/10 rounded-sm bg-stone/5">
                                <FileText className="mb-4 text-ink/40" />
                                <h3 className="font-bold text-ink mb-2">1. Define</h3>
                                <p className="text-xs text-ink/60">Clear deliverables and technical requirements.</p>
                            </div>
                            <div className="p-6 border border-ink/10 rounded-sm bg-stone/5">
                                <Shield className="mb-4 text-ink/40" />
                                <h3 className="font-bold text-ink mb-2">2. Protect</h3>
                                <p className="text-xs text-ink/60">Choose IP rights and set escrow terms.</p>
                            </div>
                            <div className="p-6 border border-ink/10 rounded-sm bg-stone/5">
                                <DollarSign className="mb-4 text-ink/40" />
                                <h3 className="font-bold text-ink mb-2">3. Fund</h3>
                                <p className="text-xs text-ink/60">Stake budget to activate the quest.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setCurrentStep('BASICS')}
                            className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02]"
                        >
                            Start Creating
                        </button>
                    </div>
                )}

                {/* STEP 1: BASICS */}
                {currentStep === 'BASICS' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Task Title</label>
                            <input 
                                type="text" 
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="e.g. Optimization of Multi-Agent Reinforcement Learning"
                                className="w-full bg-surface border border-ink/20 p-4 font-sans text-base text-ink focus:outline-none focus:border-accent rounded-sm"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Subject</label>
                                <div className="relative">
                                    <select 
                                        value={formData.subject}
                                        onChange={(e) => updateField('subject', e.target.value)}
                                        className="w-full bg-surface border border-ink/20 p-4 font-mono text-base text-ink focus:outline-none focus:border-accent rounded-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a subject...</option>
                                        {SUBJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-ink/40 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Technical Tags</label>
                                <div className="flex items-center border border-ink/20 bg-surface rounded-sm p-2 focus-within:border-accent transition-colors">
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                        placeholder="Type & Enter..."
                                        className="flex-1 bg-transparent p-2 font-mono text-sm text-ink focus:outline-none"
                                    />
                                    <button onClick={addTag} className="p-2 hover:bg-stone/10 rounded-sm text-ink/60"><Plus size={16}/></button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-stone/10 border border-ink/5 rounded-full text-xs font-mono font-bold flex items-center gap-2">
                                            {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10}/></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Task Description</label>
                            <RichTextEditor 
                                value={formData.description}
                                onChange={(val) => updateField('description', val)}
                                placeholder="Describe the background, objectives, and context of the research task..."
                                height="h-64"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Attachments</label>
                            <div 
                                className="border-2 border-dashed border-ink/20 rounded-sm p-8 text-center cursor-pointer hover:border-accent hover:bg-white/50 transition-all bg-stone/5"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
                                <Upload size={24} className="mx-auto text-ink/30 mb-3" />
                                <span className="block font-mono text-xs font-bold text-ink/60 uppercase tracking-widest">
                                    Click to upload supplementary files (PDF, DATA, ETC.)
                                </span>
                            </div>
                            {formData.attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {formData.attachments.map((file, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white border border-ink/10 p-3 rounded-sm">
                                            <span className="text-sm font-mono truncate max-w-xs">{file.name}</span>
                                            <button onClick={() => removeFile(i)} className="text-ink/40 hover:text-red-600"><X size={14}/></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <SaveDraftButton />
                            <button onClick={nextStep} className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg">Next: Deliverables</button>
                        </div>
                    </div>
                )}

                {/* STEP 2: STANDARDS */}
                {currentStep === 'STANDARDS' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ListChecks size={16} className="text-ink/60"/>
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">Deliverables List</label>
                            </div>
                            <p className="text-xs text-ink/40 mb-3">List exactly what files or outcomes are expected (e.g. "Source Code", "PDF Report", "Dataset").</p>
                            <RichTextEditor 
                                value={formData.deliverables}
                                onChange={(val) => updateField('deliverables', val)}
                                placeholder="- Python codebase including all scripts&#10;- Technical Report (PDF)&#10;- Experimental results (CSV)"
                                height="h-48"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle size={16} className="text-ink/60"/>
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60">Acceptance Criteria</label>
                            </div>
                            <p className="text-xs text-ink/40 mb-3">Define the conditions for the work to be accepted and funds released.</p>
                            <RichTextEditor 
                                value={formData.acceptanceCriteria}
                                onChange={(val) => updateField('acceptanceCriteria', val)}
                                placeholder="- Code must run on Python 3.9+ without errors&#10;- Model accuracy must exceed 85% on validation set&#10;- Documentation must be clear and complete"
                                height="h-48"
                            />
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <SaveDraftButton />
                            <button onClick={nextStep} className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg">Next: Terms</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: TERMS */}
                {currentStep === 'TERMS' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Budget (USDC)</label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                                    <input 
                                        type="number"
                                        min="0" 
                                        value={formData.budget}
                                        onChange={(e) => updateField('budget', e.target.value)}
                                        onKeyDown={preventNegative}
                                        className="w-full bg-surface border border-ink/20 p-4 pl-10 font-mono text-xl font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Submission Deadline</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                                    <input 
                                        type="date" 
                                        value={formData.deadline}
                                        onChange={(e) => updateField('deadline', e.target.value)}
                                        className="w-full bg-surface border border-ink/20 p-4 pl-10 font-mono text-base font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-6">Intellectual Property Rights</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Option 1 */}
                                <div 
                                    onClick={() => updateField('ipRights', 'WORK_FOR_HIRE')}
                                    className={`p-6 border-2 rounded-sm cursor-pointer transition-all relative ${formData.ipRights === 'WORK_FOR_HIRE' ? 'border-accent bg-ink text-paper' : 'border-ink/10 bg-white hover:border-ink/30'}`}
                                >
                                    <Briefcase size={24} className="mb-4" />
                                    <h4 className="font-bold text-sm mb-2">Work for Hire</h4>
                                    <p className={`text-xs leading-relaxed ${formData.ipRights === 'WORK_FOR_HIRE' ? 'opacity-80' : 'text-ink/60'}`}>
                                        Complete transfer of ownership. You own 100% of the copyright and results. The solver retains no rights.
                                    </p>
                                    {formData.ipRights === 'WORK_FOR_HIRE' && <div className="absolute top-4 right-4"><CheckCircle size={18}/></div>}
                                </div>

                                {/* Option 2 */}
                                <div 
                                    onClick={() => updateField('ipRights', 'OPEN_SOURCE')}
                                    className={`p-6 border-2 rounded-sm cursor-pointer transition-all relative ${formData.ipRights === 'OPEN_SOURCE' ? 'border-accent bg-ink text-paper' : 'border-ink/10 bg-white hover:border-ink/30'}`}
                                >
                                    <Globe size={24} className="mb-4" />
                                    <h4 className="font-bold text-sm mb-2">Open Source</h4>
                                    <p className={`text-xs leading-relaxed ${formData.ipRights === 'OPEN_SOURCE' ? 'opacity-80' : 'text-ink/60'}`}>
                                        Results are released under MIT/CC0 license. Both parties and the public can use and modify freely.
                                    </p>
                                    {formData.ipRights === 'OPEN_SOURCE' && <div className="absolute top-4 right-4"><CheckCircle size={18}/></div>}
                                </div>

                                {/* Option 3 */}
                                <div 
                                    onClick={() => updateField('ipRights', 'ATTRIBUTION')}
                                    className={`p-6 border-2 rounded-sm cursor-pointer transition-all relative ${formData.ipRights === 'ATTRIBUTION' ? 'border-accent bg-ink text-paper' : 'border-ink/10 bg-white hover:border-ink/30'}`}
                                >
                                    <User size={24} className="mb-4" />
                                    <h4 className="font-bold text-sm mb-2">Attribution</h4>
                                    <p className={`text-xs leading-relaxed ${formData.ipRights === 'ATTRIBUTION' ? 'opacity-80' : 'text-ink/60'}`}>
                                        You get usage rights, but the solver retains moral rights and must be credited in publications.
                                    </p>
                                    {formData.ipRights === 'ATTRIBUTION' && <div className="absolute top-4 right-4"><CheckCircle size={18}/></div>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <SaveDraftButton />
                            <button onClick={nextStep} className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg">Next: Preview</button>
                        </div>
                    </div>
                )}

                {/* STEP 4: PREVIEW */}
                {currentStep === 'PREVIEW' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="bg-paper border border-ink/10 rounded-sm p-8 md:p-12 mb-8 shadow-sm">
                            <div className="flex justify-between items-start mb-8 border-b border-ink/10 pb-6">
                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <span className="bg-stone/10 px-2 py-1 rounded-sm text-[10px] font-mono font-bold uppercase text-ink/60">{formData.subject}</span>
                                        <span className="bg-stone/10 px-2 py-1 rounded-sm text-[10px] font-mono font-bold uppercase text-ink/60">{formData.ipRights?.replace(/_/g, ' ')}</span>
                                    </div>
                                    <h2 className="font-sans text-3xl font-bold text-ink mb-2">{formData.title}</h2>
                                    <div className="flex gap-2 mt-2">
                                        {formData.tags.map(tag => <span key={tag} className="text-xs font-mono text-ink/40">#{tag}</span>)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-1">Budget</span>
                                    <span className="font-mono text-3xl font-bold text-ink">{formData.budget} USDC</span>
                                    <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mt-1">Deadline: {formData.deadline}</span>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-3">DESCRIPTION</h4>
                                    <div 
                                        className="text-sm text-ink/80 leading-relaxed font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                        dangerouslySetInnerHTML={{ __html: formData.description }} 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-ink/5">
                                    <div>
                                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-4">DELIVERABLES</h4>
                                        <div 
                                            className="text-sm text-ink/80 leading-relaxed font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                            dangerouslySetInnerHTML={{ __html: formData.deliverables }} 
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-4">ACCEPTANCE</h4>
                                        <div 
                                            className="text-sm text-ink/80 leading-relaxed font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                            dangerouslySetInnerHTML={{ __html: formData.acceptanceCriteria }} 
                                        />
                                    </div>
                                </div>

                                {formData.attachments.length > 0 && (
                                    <div className="pt-8 border-t border-ink/5">
                                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50 mb-4">ATTACHMENTS</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {formData.attachments.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs font-mono bg-stone/5 px-4 py-3 rounded-sm border border-ink/5 text-ink/70">
                                                    <FileText size={14} className="text-ink/30" /> {f.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <SaveDraftButton />
                            <button 
                                onClick={handleSubmitPreview}
                                className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02]"
                            >
                                Submit & Agree
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: PAYMENT */}
                {currentStep === 'PAYMENT' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-xl mx-auto">
                        <div className="bg-paper border-2 border-ink/10 p-10 rounded-sm shadow-xl">
                            <h3 className="font-sans text-2xl font-bold text-ink mb-8 text-center">Fund Escrow</h3>
                            
                            <div className="space-y-4 font-mono text-sm border-b border-ink/10 pb-8 mb-8">
                                <div className="flex justify-between">
                                    <span className="text-ink/60">Quest Budget</span>
                                    <span className="font-bold text-ink">{formData.budget} USDC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink/60">Protocol Fee (2%)</span>
                                    <span className="font-bold text-ink">{(parseFloat(formData.budget) * 0.02).toFixed(2)} USDC</span>
                                </div>
                                <div className="flex justify-between text-lg pt-4 border-t border-ink/10 mt-4">
                                    <span className="font-bold uppercase tracking-widest">Total Stake</span>
                                    <span className="font-bold text-accent">{(parseFloat(formData.budget) * 1.02).toFixed(2)} USDC</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleInitiatePayment}
                                className="w-full bg-accent text-paper py-5 rounded-full font-mono text-base font-bold uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <Shield size={18} />
                                Pay & Publish
                            </button>
                            <p className="text-center text-[10px] font-mono text-ink/40 mt-4 uppercase tracking-wider">
                                Secured by OpenSci Smart Contract
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* MODAL 1: PUBLISH PROTOCOL */}
            {isPublishProtocolOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in">
                    <div className="bg-paper w-full max-w-lg p-8 rounded-sm shadow-2xl">
                        <h3 className="font-sans text-2xl font-bold text-ink mb-4">Publishing Protocol</h3>
                        <div className="h-64 overflow-y-auto bg-stone/5 p-4 border border-ink/10 mb-6 text-sm text-ink/70 leading-relaxed font-mono">
                            <p className="mb-3">1. <strong>Accuracy</strong>: You confirm that the task description is accurate and the budget is sufficient for the scope of work.</p>
                            <p className="mb-3">2. <strong>Communication</strong>: You agree to respond to bidder inquiries within 48 hours.</p>
                            <p className="mb-3">3. <strong>Fairness</strong>: You will review submissions objectively based on the Acceptance Criteria defined.</p>
                            <p className="mb-3">4. <strong>Disputes</strong>: In case of disagreement, you agree to submit to the OpenSci Arbitration process.</p>
                            <p>5. <strong>Prohibited Content</strong>: The task does not involve illegal activities, academic fraud, or harmful research.</p>
                        </div>
                        <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => setAgreedToProtocol(!agreedToProtocol)}>
                            <div className={`w-5 h-5 border-2 border-ink rounded-sm flex items-center justify-center ${agreedToProtocol ? 'bg-ink' : 'bg-transparent'}`}>
                                {agreedToProtocol && <CheckCircle size={14} className="text-paper"/>}
                            </div>
                            <span className="text-sm font-bold text-ink select-none">I have read and agree to the Protocol</span>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsPublishProtocolOpen(false)} className="px-6 py-2 text-xs font-bold uppercase text-ink/50 hover:text-ink">Cancel</button>
                            <button onClick={handleConfirmProtocol} className="bg-ink text-paper px-8 py-3 rounded-full font-bold text-xs uppercase hover:bg-accent transition-colors">Confirm & Proceed</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: ESCROW AGREEMENT */}
            {isEscrowProtocolOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in">
                    <div className="bg-paper w-full max-w-lg p-8 rounded-sm shadow-2xl">
                        <div className="flex items-center gap-3 mb-4 text-green-700">
                            <Shield size={24} />
                            <h3 className="font-sans text-2xl font-bold text-ink">Funds Escrow Agreement</h3>
                        </div>
                        <p className="text-ink/60 text-sm mb-6">
                            You are about to deposit <strong>{(parseFloat(formData.budget) * 1.02).toFixed(2)} USDC</strong> into the OpenSci Smart Contract.
                        </p>
                        <div className="bg-stone/5 border border-ink/10 p-4 rounded-sm mb-6 text-xs text-ink/70 font-mono space-y-2">
                            <div className="flex gap-2"><CheckCircle size={12} className="mt-0.5 text-green-600"/> Funds are locked until you approve the work.</div>
                            <div className="flex gap-2"><CheckCircle size={12} className="mt-0.5 text-green-600"/> You can request a refund if no bidder is selected.</div>
                            <div className="flex gap-2"><CheckCircle size={12} className="mt-0.5 text-green-600"/> Arbitration committee handles disputes.</div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => setAgreedToEscrow(!agreedToEscrow)}>
                            <div className={`w-5 h-5 border-2 border-ink rounded-sm flex items-center justify-center ${agreedToEscrow ? 'bg-ink' : 'bg-transparent'}`}>
                                {agreedToEscrow && <CheckCircle size={14} className="text-paper"/>}
                            </div>
                            <span className="text-sm font-bold text-ink select-none">I authorize the staking of funds</span>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsEscrowProtocolOpen(false)} className="px-6 py-2 text-xs font-bold uppercase text-ink/50 hover:text-ink">Cancel</button>
                            <button onClick={handleConfirmEscrow} className="bg-accent text-paper px-8 py-3 rounded-full font-bold text-xs uppercase hover:bg-accent/90 transition-colors shadow-lg">Sign Transaction</button>
                        </div>
                    </div>
                </div>
            )}

            <PasswordVerificationModal 
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={onPasswordVerified}
            />
        </div>
    );
};
