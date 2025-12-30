import React, { useRef, useState } from 'react';
import { ChevronRight, Plus, X, Upload, Save, ArrowRight } from 'lucide-react';
import { QuestFormData } from '../../../types';
import { RichTextEditor } from '../../RichTextEditor';

interface BasicsStepProps {
    formData: QuestFormData;
    updateField: (field: keyof QuestFormData, value: any) => void;
    onNext: () => void;
    onSaveDraft: () => void;
}

const SUBJECT_OPTIONS = ['Math', 'Computer', 'Statistics', 'Physics', 'Chemistry', 'Biology', 'Medicine', 'Engineering'];

export const BasicsStep: React.FC<BasicsStepProps> = ({
    formData, updateField, onNext, onSaveDraft
}) => {
    const [tagInput, setTagInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            updateField('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        updateField('tags', formData.tags.filter(t => t !== tag));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            updateField('attachments', [...formData.attachments, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        updateField('attachments', formData.attachments.filter((_, i) => i !== index));
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
            <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Task Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Optimization of Multi-Agent Reinforcement Learning"
                    className="w-full bg-surface border border-ink/20 p-4 font-sans text-xl font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
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
                            className="w-full bg-surface border border-ink/20 p-4 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm appearance-none cursor-pointer"
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
                        <button onClick={addTag} className="p-2 hover:bg-stone/10 rounded-sm text-ink/60"><Plus size={16} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-stone/10 border border-ink/5 rounded-full text-xs font-mono font-bold flex items-center gap-2">
                                {tag} <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={10} /></button>
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
                                <button onClick={() => removeFile(i)} className="text-ink/40 hover:text-red-600"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-8">
                <button
                    onClick={onSaveDraft}
                    className="flex items-center gap-2 border border-ink/20 text-ink/60 px-6 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:border-ink hover:text-ink hover:bg-stone/5 transition-all"
                >
                    <Save size={16} /> <span className="hidden sm:inline">Save Draft</span>
                </button>
                <button onClick={onNext} className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg">Next: Deliverables</button>
            </div>
        </div>
    );
};
