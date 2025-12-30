
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, Upload, FileText, Calendar, DollarSign, 
    CheckCircle, Loader2, ListChecks, X, Plus,
    Briefcase, Globe, User, Lock,
    Bold, Italic, List as ListIcon, ListOrdered, Save
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { QUESTS } from '../constants';

type EditStep = 'BASICS' | 'STANDARDS' | 'TERMS' | 'PREVIEW';

interface QuestFormData {
    title: string;
    subject: string;
    tags: string[];
    description: string;
    attachments: File[];
    deliverables: string;
    acceptanceCriteria: string;
    budget: string;
    currency: string;
    deadline: string;
    deliveryTime: string;
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

    const execCmd = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
    };

    return (
        <div className={`flex flex-col border rounded-sm bg-surface transition-colors overflow-hidden ${isFocused ? 'border-accent' : 'border-ink/20'}`}>
            <div className="flex items-center gap-1 p-2 border-b border-ink/10 bg-stone/5">
                <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bold"><Bold size={14}/></button>
                <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Italic"><Italic size={14}/></button>
                <div className="w-px h-4 bg-ink/10 mx-1"></div>
                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bullet List"><ListIcon size={14}/></button>
                <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Numbered List"><ListOrdered size={14}/></button>
            </div>
            <div
                ref={editorRef}
                className={`w-full p-4 overflow-auto outline-none ${height} font-sans text-base text-ink empty:before:content-[attr(data-placeholder)] empty:before:text-ink/30`}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
            />
        </div>
    );
};

export const EditQuest: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState<EditStep>('BASICS');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Get quest data
    const quest = QUESTS.find(q => q.id === id);
    
    // Form State - Pre-filled with existing data
    const [formData, setFormData] = useState<QuestFormData>({
        title: quest?.title || '',
        subject: 'Computer',
        tags: quest?.tags || [],
        description: quest?.fullDescription || '',
        attachments: [],
        deliverables: '<ul><li>Python codebase including all scripts</li><li>Technical Report (PDF)</li><li>Experimental results (CSV)</li></ul>',
        acceptanceCriteria: '<ul><li>Code must run on Python 3.9+ without errors</li><li>Model accuracy must exceed 85% on validation set</li><li>Documentation must be clear and complete</li></ul>',
        budget: quest?.reward.amount.toString() || '0',
        currency: quest?.reward.currency || 'USDC',
        deadline: quest?.endTime.split(' ')[0] || '',
        deliveryTime: quest?.deliveryTime || '30 days',
        ipRights: 'OPEN_SOURCE'
    });

    // UI Helpers
    const [tagInput, setTagInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!quest) {
        return <div className="p-12 text-center">Quest not found</div>;
    }

    // --- Actions ---
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
    const validateStep = (step: EditStep): boolean => {
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
                if (!formData.deadline) {
                    showToast("Please set a deadline.");
                    return false;
                }
                return true;
            default: return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep === 'BASICS') setCurrentStep('STANDARDS');
            else if (currentStep === 'STANDARDS') setCurrentStep('TERMS');
            else if (currentStep === 'TERMS') setCurrentStep('PREVIEW');
        }
    };

    const prevStep = () => {
        if (currentStep === 'STANDARDS') setCurrentStep('BASICS');
        else if (currentStep === 'TERMS') setCurrentStep('STANDARDS');
        else if (currentStep === 'PREVIEW') setCurrentStep('TERMS');
    };

    // --- Submission ---
    const handleSaveChanges = () => {
        setIsProcessing(true);
        
        // Simulate save
        setTimeout(() => {
            setIsProcessing(false);
            showToast("Task updated successfully!");
            navigate(`/quest/${id}`, { state: { role: 'MAKER' } });
        }, 1500);
    };

    // --- IP Rights Label ---
    const getIpRightsLabel = (value: string | null) => {
        switch(value) {
            case 'WORK_FOR_HIRE': return 'Work for Hire';
            case 'OPEN_SOURCE': return 'Open Source';
            case 'ATTRIBUTION': return 'Attribution';
            default: return 'Not Set';
        }
    };

    // --- Render Components ---
    const Stepper = () => {
        const steps = ['Basics', 'Standards', 'Terms', 'Preview'];
        const currentIdx = ['BASICS', 'STANDARDS', 'TERMS', 'PREVIEW'].indexOf(currentStep);

        return (
            <div className="flex items-center justify-center space-x-4 mb-12">
                {steps.map((label, idx) => (
                    <div key={idx} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-mono text-xs font-bold transition-colors ${
                            idx <= currentIdx ? 'bg-ink border-ink text-paper' : 'border-ink/20 text-ink/30'
                        }`}>
                            {idx < currentIdx ? <CheckCircle size={14} /> : idx + 1}
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

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-6 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1000px] mx-auto flex justify-between items-center">
                    <button onClick={() => currentStep === 'BASICS' ? navigate(`/quest/${id}`, { state: { role: 'MAKER' } }) : prevStep()} className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} className="mr-2" /> {currentStep === 'BASICS' ? 'Cancel' : 'Back'}
                    </button>
                    <span className="font-sans font-bold text-ink text-lg">Edit Task</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1000px] mx-auto px-6 md:px-12 pt-12">
                <Stepper />

                {/* STEP 1: BASICS */}
                {currentStep === 'BASICS' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Task Title *</label>
                            <input 
                                type="text" 
                                placeholder="e.g. High-Fidelity 3D Rendering of Protein Structures"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full bg-surface border border-ink/20 px-6 py-5 font-sans text-xl text-ink focus:outline-none focus:border-accent rounded-sm"
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Subject Area *</label>
                            <select 
                                value={formData.subject}
                                onChange={(e) => updateField('subject', e.target.value)}
                                className="w-full bg-surface border border-ink/20 px-6 py-4 font-mono text-base text-ink focus:outline-none focus:border-accent rounded-sm appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center' }}
                            >
                                <option value="" disabled>Select a subject area...</option>
                                {SUBJECT_OPTIONS.map(subj => (
                                    <option key={subj} value={subj}>{subj}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Skill Tags</label>
                            <div className="flex gap-3 mb-3">
                                <input 
                                    type="text" 
                                    placeholder="Add a skill tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 bg-surface border border-ink/20 px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                                />
                                <button type="button" onClick={addTag} className="px-5 border border-ink/20 hover:bg-stone/5 rounded-sm transition-colors"><Plus size={18} /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-stone/10 border border-ink/10 text-xs font-mono font-bold uppercase rounded-sm">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="text-ink/40 hover:text-red-500"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Task Description *</label>
                            <RichTextEditor 
                                value={formData.description}
                                onChange={(val) => updateField('description', val)}
                                placeholder="Describe the task in detail..."
                            />
                        </div>

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Attachments</label>
                            <div 
                                className="border-2 border-dashed border-ink/20 rounded-sm p-8 text-center cursor-pointer hover:border-accent hover:bg-stone/5 transition-all group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                <Upload size={24} className="mx-auto text-ink/40 group-hover:text-accent transition-colors mb-3"/>
                                <span className="block font-mono text-sm text-ink/60 group-hover:text-ink transition-colors">
                                    Drag & Drop or Click to Upload
                                </span>
                            </div>
                            {formData.attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {formData.attachments.map((file, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm font-mono bg-stone/5 p-3 rounded-sm border border-ink/5">
                                            <div className="flex items-center gap-2"><FileText size={14} className="text-ink/40" /> {file.name}</div>
                                            <button type="button" onClick={() => removeFile(idx)} className="text-ink/40 hover:text-red-500"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex justify-end pt-8 border-t border-ink/10">
                            <button onClick={nextStep} className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg hover:scale-[1.02]">
                                Next: Deliverables
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: STANDARDS */}
                {currentStep === 'STANDARDS' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
                        <div className="text-center mb-8">
                            <ListChecks size={32} className="mx-auto text-ink/40 mb-3"/>
                            <h2 className="font-sans text-2xl font-bold text-ink">Define Deliverables & Success</h2>
                            <p className="text-ink/60 mt-2">What exactly should the solver produce, and how will you verify it?</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Deliverables List *</label>
                            <p className="text-xs text-ink/40 mb-2">What files or outcomes are expected?</p>
                            <RichTextEditor 
                                value={formData.deliverables}
                                onChange={(val) => updateField('deliverables', val)}
                                placeholder="- Python codebase&#10;- Technical Report (PDF)&#10;- Dataset"
                                height="h-40"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Acceptance Criteria *</label>
                            <p className="text-xs text-ink/40 mb-2">Conditions for work to be accepted.</p>
                            <RichTextEditor 
                                value={formData.acceptanceCriteria}
                                onChange={(val) => updateField('acceptanceCriteria', val)}
                                placeholder="- Code must run without errors&#10;- Accuracy > 85%&#10;- Clear documentation"
                                height="h-40"
                            />
                        </div>
                        
                        <div className="flex justify-end pt-8 border-t border-ink/10">
                            <button onClick={nextStep} className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg hover:scale-[1.02]">
                                Next: Terms
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: TERMS */}
                {currentStep === 'TERMS' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-10">
                        <div className="text-center mb-8">
                            <DollarSign size={32} className="mx-auto text-ink/40 mb-3"/>
                            <h2 className="font-sans text-2xl font-bold text-ink">Terms & Conditions</h2>
                            <p className="text-ink/60 mt-2">Some fields are locked after task creation.</p>
                        </div>

                        {/* Locked Fields Notice */}
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
                            <Lock size={16} className="text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-800">Locked Fields</p>
                                <p className="text-xs text-amber-700">Budget, Currency, and IP Rights cannot be modified after task creation.</p>
                            </div>
                        </div>

                        {/* Budget & Currency - LOCKED */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-ink/40 mb-3 flex items-center gap-2">
                                    <Lock size={12} /> Budget (Locked)
                                </label>
                                <div className="relative">
                                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
                                    <input 
                                        type="text"
                                        value={formData.budget}
                                        disabled
                                        className="w-full bg-ink/5 border border-ink/10 px-6 pl-10 py-5 font-mono text-2xl font-bold text-ink/50 cursor-not-allowed rounded-sm"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-ink/40">{formData.currency}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Deadline *</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                                    <input 
                                        type="date" 
                                        value={formData.deadline}
                                        onChange={(e) => updateField('deadline', e.target.value)}
                                        className="w-full bg-surface border border-ink/20 px-6 pl-12 py-5 font-mono text-lg text-ink focus:outline-none focus:border-accent rounded-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Time */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/70 mb-3">Delivery Time</label>
                            <input 
                                type="text" 
                                value={formData.deliveryTime}
                                onChange={(e) => updateField('deliveryTime', e.target.value)}
                                placeholder="e.g. 30 days"
                                className="w-full bg-surface border border-ink/20 px-6 py-4 font-mono text-lg text-ink focus:outline-none focus:border-accent rounded-sm"
                            />
                        </div>

                        {/* IP Rights - LOCKED */}
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-ink/40 mb-4 flex items-center gap-2">
                                <Lock size={12} /> IP Rights (Locked)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`p-6 border-2 rounded-sm cursor-not-allowed transition-all relative opacity-60 ${formData.ipRights === 'WORK_FOR_HIRE' ? 'border-ink/50 bg-ink/10' : 'border-ink/10 bg-ink/5'}`}>
                                    <Briefcase size={24} className="mb-3 opacity-50" />
                                    <h4 className="font-bold text-sm mb-1">Work for Hire</h4>
                                    <p className="text-xs text-ink/40 leading-relaxed">Complete ownership transfer to publisher.</p>
                                    {formData.ipRights === 'WORK_FOR_HIRE' && <CheckCircle size={16} className="absolute top-4 right-4 opacity-50"/>}
                                </div>
                                <div className={`p-6 border-2 rounded-sm cursor-not-allowed transition-all relative opacity-60 ${formData.ipRights === 'OPEN_SOURCE' ? 'border-ink/50 bg-ink/10' : 'border-ink/10 bg-ink/5'}`}>
                                    <Globe size={24} className="mb-3 opacity-50" />
                                    <h4 className="font-bold text-sm mb-1">Open Source</h4>
                                    <p className="text-xs text-ink/40 leading-relaxed">MIT/CC0 license for public use.</p>
                                    {formData.ipRights === 'OPEN_SOURCE' && <CheckCircle size={16} className="absolute top-4 right-4 opacity-50"/>}
                                </div>
                                <div className={`p-6 border-2 rounded-sm cursor-not-allowed transition-all relative opacity-60 ${formData.ipRights === 'ATTRIBUTION' ? 'border-ink/50 bg-ink/10' : 'border-ink/10 bg-ink/5'}`}>
                                    <User size={24} className="mb-3 opacity-50" />
                                    <h4 className="font-bold text-sm mb-1">Attribution</h4>
                                    <p className="text-xs text-ink/40 leading-relaxed">Solver retains moral rights with credit.</p>
                                    {formData.ipRights === 'ATTRIBUTION' && <CheckCircle size={16} className="absolute top-4 right-4 opacity-50"/>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-8 border-t border-ink/10">
                            <button onClick={nextStep} className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg hover:scale-[1.02]">
                                Next: Preview
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: PREVIEW */}
                {currentStep === 'PREVIEW' && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center mb-12">
                            <CheckCircle size={32} className="mx-auto text-green-600 mb-3"/>
                            <h2 className="font-sans text-2xl font-bold text-ink">Review Your Changes</h2>
                            <p className="text-ink/60 mt-2">Confirm the updates before saving.</p>
                        </div>

                        <div className="bg-paper border border-ink/10 rounded-sm overflow-hidden shadow-lg">
                            {/* Preview Header */}
                            <div className="bg-stone/5 p-8 border-b border-ink/10">
                                <span className="text-[10px] font-mono font-bold text-ink/40 uppercase tracking-widest">Task Preview</span>
                                <h3 className="font-sans text-3xl font-bold text-ink mt-2">{formData.title || 'Untitled Task'}</h3>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="px-3 py-1 bg-ink text-paper text-[10px] font-mono font-bold uppercase rounded-sm">{formData.subject}</span>
                                    {formData.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-stone/10 text-ink/60 text-[10px] font-mono font-bold uppercase rounded-sm border border-ink/10">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Preview Body */}
                            <div className="p-8 space-y-8">
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-widest text-ink/40 mb-2">Description</h4>
                                    <div className="text-ink/70 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: formData.description }} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-ink/10 pt-8">
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-ink/40 mb-2">Deliverables</h4>
                                        <div className="text-ink/70 text-sm [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: formData.deliverables }} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase tracking-widest text-ink/40 mb-2">Acceptance Criteria</h4>
                                        <div className="text-ink/70 text-sm [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: formData.acceptanceCriteria }} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-ink/10 pt-8">
                                    <div>
                                        <span className="text-[10px] font-mono font-bold text-ink/40 uppercase">Budget</span>
                                        <p className="font-mono font-bold text-lg text-ink">{formData.budget} {formData.currency}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono font-bold text-ink/40 uppercase">Deadline</span>
                                        <p className="font-mono font-bold text-lg text-ink">{formData.deadline}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono font-bold text-ink/40 uppercase">Delivery</span>
                                        <p className="font-mono font-bold text-lg text-ink">{formData.deliveryTime}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono font-bold text-ink/40 uppercase">IP Rights</span>
                                        <p className="font-mono font-bold text-lg text-ink">{getIpRightsLabel(formData.ipRights)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-12">
                            <button 
                                onClick={handleSaveChanges}
                                disabled={isProcessing}
                                className="bg-accent text-paper px-16 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent/90 transition-all shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                            >
                                {isProcessing ? (
                                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                ) : (
                                    <><Save size={18} /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

