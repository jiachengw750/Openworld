import React from 'react';
import { ListChecks, CheckCircle, Save } from 'lucide-react';
import { QuestFormData } from '../../../types';
import { RichTextEditor } from '../../RichTextEditor';

interface StandardsStepProps {
    formData: QuestFormData;
    updateField: (field: keyof QuestFormData, value: any) => void;
    onNext: () => void;
    onSaveDraft: () => void;
}

export const StandardsStep: React.FC<StandardsStepProps> = ({
    formData, updateField, onNext, onSaveDraft
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <ListChecks size={16} className="text-ink/60" />
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
                    <CheckCircle size={16} className="text-ink/60" />
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
                <button
                    onClick={onSaveDraft}
                    className="flex items-center gap-2 border border-ink/20 text-ink/60 px-6 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:border-ink hover:text-ink hover:bg-stone/5 transition-all"
                >
                    <Save size={16} /> <span className="hidden sm:inline">Save Draft</span>
                </button>
                <button onClick={onNext} className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg">Next: Terms</button>
            </div>
        </div>
    );
};
