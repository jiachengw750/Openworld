import React from 'react';
import { ListChecks, CheckCircle, FileText, Save } from 'lucide-react';
import { QuestFormData } from '../../../types';

interface PreviewStepProps {
    formData: QuestFormData;
    onSubmit: () => void;
    onSaveDraft: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
    formData, onSubmit, onSaveDraft
}) => {
    return (
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

                <div className="space-y-8">
                    <div>
                        <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink mb-2">Description</h4>
                        <div
                            className="text-sm text-ink/80 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                            dangerouslySetInnerHTML={{ __html: formData.description }}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-stone/5 p-6 rounded-sm">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink mb-2 flex items-center gap-2"><ListChecks size={14} /> Deliverables</h4>
                            <div
                                className="text-xs text-ink/70 leading-relaxed font-mono [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                dangerouslySetInnerHTML={{ __html: formData.deliverables }}
                            />
                        </div>
                        <div className="bg-stone/5 p-6 rounded-sm">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink mb-2 flex items-center gap-2"><CheckCircle size={14} /> Acceptance</h4>
                            <div
                                className="text-xs text-ink/70 leading-relaxed font-mono [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                dangerouslySetInnerHTML={{ __html: formData.acceptanceCriteria }}
                            />
                        </div>
                    </div>
                    {formData.attachments.length > 0 && (
                        <div>
                            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink mb-2">Attachments</h4>
                            <div className="flex gap-4">
                                {formData.attachments.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-mono bg-stone/5 px-3 py-2 rounded-sm border border-ink/5">
                                        <FileText size={12} /> {f.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <button
                    onClick={onSaveDraft}
                    className="flex items-center gap-2 border border-ink/20 text-ink/60 px-6 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:border-ink hover:text-ink hover:bg-stone/5 transition-all"
                >
                    <Save size={16} /> <span className="hidden sm:inline">Save Draft</span>
                </button>
                <button
                    onClick={onSubmit}
                    className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02]"
                >
                    Submit & Agree
                </button>
            </div>
        </div>
    );
};
