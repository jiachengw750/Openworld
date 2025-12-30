
import React, { useState, useRef, useEffect } from 'react';
import { 
    X, Upload, FileText, Calendar, DollarSign, 
    CheckCircle, Plus, ChevronDown,
    Shield, Briefcase, Globe, User,
    Bold, Italic, List as ListIcon, ListOrdered, Save
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// --- Types ---
export interface QuestFormData {
    title: string;
    subject: string;
    tags: string[];
    description: string;
    attachments: File[];
    deliverables: string;
    acceptanceCriteria: string;
    budget: number;
    currency: string;
    deadline: string;
    deliveryTime: string;
    ipRights: 'WORK_FOR_HIRE' | 'OPEN_SOURCE' | 'ATTRIBUTION' | null;
}

interface EditQuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: QuestFormData) => void;
    initialData: QuestFormData;
}

const SUBJECT_OPTIONS = ['Math', 'Computer', 'Statistics', 'Physics', 'Chemistry', 'Biology', 'Medicine', 'Engineering'];

// --- Rich Text Editor ---
const RichTextEditor = ({ value, onChange, placeholder, height = "h-32" }: { value: string, onChange: (val: string) => void, placeholder?: string, height?: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && value) {
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
                className={`w-full p-3 overflow-auto outline-none ${height} font-sans text-sm text-ink empty:before:content-[attr(data-placeholder)] empty:before:text-ink/30 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5`}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
            />
        </div>
    );
};

export const EditQuestModal: React.FC<EditQuestModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState<QuestFormData>(initialData);
    const [tagInput, setTagInput] = useState('');
    const [activeTab, setActiveTab] = useState<'BASICS' | 'STANDARDS' | 'TERMS'>('BASICS');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setActiveTab('BASICS');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

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

    const handleSave = () => {
        // Validation
        if (!formData.title || !formData.subject || !formData.description) {
            showToast("Please fill in all required basic info.");
            setActiveTab('BASICS');
            return;
        }
        if (!formData.deliverables || !formData.acceptanceCriteria) {
            showToast("Please define deliverables and acceptance criteria.");
            setActiveTab('STANDARDS');
            return;
        }
        if (!formData.budget || !formData.deadline || !formData.ipRights) {
            showToast("Please complete budget, deadline and IP rights.");
            setActiveTab('TERMS');
            return;
        }

        onSave(formData);
        onClose();
    };

    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) e.preventDefault();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-3xl shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 flex flex-col rounded-sm overflow-hidden max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-ink/10 bg-surface">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 block mb-1">Edit Task</span>
                        <h3 className="font-sans text-xl font-bold text-ink">{formData.title || 'Untitled Task'}</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-ink/10 bg-stone/5">
                    {(['BASICS', 'STANDARDS', 'TERMS'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-colors ${
                                activeTab === tab 
                                    ? 'text-ink border-b-2 border-ink bg-paper' 
                                    : 'text-ink/40 hover:text-ink/60'
                            }`}
                        >
                            {tab === 'BASICS' ? 'Basic Info' : tab === 'STANDARDS' ? 'Deliverables' : 'Terms'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6 bg-paper">
                    
                    {/* BASICS Tab */}
                    {activeTab === 'BASICS' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Title */}
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Task Title *</label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    placeholder="e.g. Optimization of Multi-Agent Reinforcement Learning"
                                    className="w-full bg-surface border border-ink/20 p-3 font-sans text-base font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                                />
                            </div>

                            {/* Subject & Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Subject *</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.subject}
                                            onChange={(e) => updateField('subject', e.target.value)}
                                            className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm appearance-none cursor-pointer"
                                        >
                                            <option value="">Select...</option>
                                            {SUBJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Technical Tags</label>
                                    <div className="flex items-center border border-ink/20 bg-surface rounded-sm p-1.5 focus-within:border-accent transition-colors">
                                        <input 
                                            type="text" 
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Type & Enter..."
                                            className="flex-1 bg-transparent p-1.5 font-mono text-sm text-ink focus:outline-none"
                                        />
                                        <button onClick={addTag} className="p-1.5 hover:bg-stone/10 rounded-sm text-ink/60"><Plus size={14}/></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-stone/10 border border-ink/5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                                                {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10}/></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Description *</label>
                                <RichTextEditor 
                                    value={formData.description}
                                    onChange={(val) => updateField('description', val)}
                                    placeholder="Describe the background, objectives, and context..."
                                    height="h-40"
                                />
                            </div>

                            {/* Attachments */}
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Attachments</label>
                                <div 
                                    className="border-2 border-dashed border-ink/20 rounded-sm p-6 text-center cursor-pointer hover:border-accent hover:bg-stone/5 transition-all"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
                                    <Upload size={20} className="mx-auto text-ink/30 mb-2" />
                                    <span className="block font-mono text-[10px] font-bold text-ink/60 uppercase tracking-widest">
                                        Click to upload files
                                    </span>
                                </div>
                                {formData.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {formData.attachments.map((file, i) => (
                                            <div key={i} className="flex justify-between items-center bg-stone/5 border border-ink/10 p-2 rounded-sm">
                                                <span className="text-xs font-mono truncate max-w-xs flex items-center gap-2">
                                                    <FileText size={12} /> {file.name}
                                                </span>
                                                <button onClick={() => removeFile(i)} className="text-ink/40 hover:text-red-600"><X size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STANDARDS Tab */}
                    {activeTab === 'STANDARDS' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Deliverables List *</label>
                                <p className="text-[10px] text-ink/40 mb-2">What files or outcomes are expected?</p>
                                <RichTextEditor 
                                    value={formData.deliverables}
                                    onChange={(val) => updateField('deliverables', val)}
                                    placeholder="- Python codebase&#10;- Technical Report (PDF)&#10;- Dataset"
                                    height="h-32"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Acceptance Criteria *</label>
                                <p className="text-[10px] text-ink/40 mb-2">Conditions for work to be accepted.</p>
                                <RichTextEditor 
                                    value={formData.acceptanceCriteria}
                                    onChange={(val) => updateField('acceptanceCriteria', val)}
                                    placeholder="- Code must run without errors&#10;- Accuracy > 85%&#10;- Clear documentation"
                                    height="h-32"
                                />
                            </div>
                        </div>
                    )}

                    {/* TERMS Tab */}
                    {activeTab === 'TERMS' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Budget & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">
                                        Budget <span className="text-ink/30">(Locked)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                                            <input 
                                                type="number"
                                                value={formData.budget}
                                                disabled
                                                className="w-full bg-ink/5 border border-ink/10 p-3 pl-8 font-mono text-sm font-bold text-ink/50 cursor-not-allowed rounded-sm"
                                                placeholder="0"
                                            />
                                        </div>
                                        <select 
                                            value={formData.currency}
                                            disabled
                                            className="bg-ink/5 border border-ink/10 p-3 font-mono text-sm text-ink/50 cursor-not-allowed rounded-sm"
                                        >
                                            <option value="USDC">USDC</option>
                                            <option value="SCI">SCI</option>
                                        </select>
                                    </div>
                                    <p className="text-[9px] text-ink/40 mt-1">Budget cannot be modified after creation</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Deadline *</label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                                        <input 
                                            type="date" 
                                            value={formData.deadline}
                                            onChange={(e) => updateField('deadline', e.target.value)}
                                            className="w-full bg-surface border border-ink/20 p-3 pl-8 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Delivery Time</label>
                                    <input 
                                        type="text" 
                                        value={formData.deliveryTime}
                                        onChange={(e) => updateField('deliveryTime', e.target.value)}
                                        placeholder="e.g. 30 days"
                                        className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* IP Rights - Locked */}
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">
                                    IP Rights <span className="text-ink/30">(Locked)</span>
                                </label>
                                <p className="text-[9px] text-ink/40 mb-4">IP rights cannot be modified after creation</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div 
                                        className={`p-4 border-2 rounded-sm cursor-not-allowed transition-all relative opacity-60 ${formData.ipRights === 'WORK_FOR_HIRE' ? 'border-ink/50 bg-ink/10 text-ink' : 'border-ink/10 bg-ink/5'}`}
                                    >
                                        <Briefcase size={20} className="mb-2 opacity-50" />
                                        <h4 className="font-bold text-xs mb-1">Work for Hire</h4>
                                        <p className={`text-[10px] leading-relaxed text-ink/40`}>
                                            Complete ownership transfer.
                                        </p>
                                        {formData.ipRights === 'WORK_FOR_HIRE' && <CheckCircle size={14} className="absolute top-3 right-3 opacity-50"/>}
                                    </div>

                                    <div 
                                        className={`p-4 border-2 rounded-sm cursor-not-allowed transition-all relative opacity-60 ${formData.ipRights === 'OPEN_SOURCE' ? 'border-ink/50 bg-ink/10 text-ink' : 'border-ink/10 bg-ink/5'}`}
                                    >
                                        <Globe size={20} className="mb-2 opacity-50" />
                                        <h4 className="font-bold text-xs mb-1">Open Source</h4>
                                        <p className={`text-[10px] leading-relaxed text-ink/40`}>
                                            MIT/CC0 license.
                                        </p>
                                        {formData.ipRights === 'OPEN_SOURCE' && <CheckCircle size={14} className="absolute top-3 right-3 opacity-50"/>}
                                    </div>

                                    <div 
                                        className={`p-4 border-2 rounded-sm cursor-not-allowed transition-all relative opacity-60 ${formData.ipRights === 'ATTRIBUTION' ? 'border-ink/50 bg-ink/10 text-ink' : 'border-ink/10 bg-ink/5'}`}
                                    >
                                        <User size={20} className="mb-2 opacity-50" />
                                        <h4 className="font-bold text-xs mb-1">Attribution</h4>
                                        <p className={`text-[10px] leading-relaxed text-ink/40`}>
                                            Solver retains moral rights.
                                        </p>
                                        {formData.ipRights === 'ATTRIBUTION' && <CheckCircle size={14} className="absolute top-3 right-3 opacity-50"/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-ink/10 bg-surface flex justify-between items-center">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 border border-ink/20 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-8 py-2.5 bg-ink text-paper rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Save size={14} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

