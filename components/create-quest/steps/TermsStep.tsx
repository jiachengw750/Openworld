import React from 'react';
import { DollarSign, Calendar, Briefcase, Globe, User, CheckCircle, Save } from 'lucide-react';
import { QuestFormData } from '../../../types';

interface TermsStepProps {
    formData: QuestFormData;
    updateField: (field: keyof QuestFormData, value: any) => void;
    onNext: () => void;
    onSaveDraft: () => void;
}

export const TermsStep: React.FC<TermsStepProps> = ({
    formData, updateField, onNext, onSaveDraft
}) => {

    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) e.preventDefault();
    };

    return (
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
                        className={`p-6 border-2 rounded-sm cursor-pointer transition-all relative ${formData.ipRights === 'WORK_FOR_HIRE' ? 'border-ink bg-ink text-paper' : 'border-ink/10 bg-white hover:border-ink/30'}`}
                    >
                        <Briefcase size={24} className="mb-4" />
                        <h4 className="font-bold text-sm mb-2">Work for Hire</h4>
                        <p className={`text-xs leading-relaxed ${formData.ipRights === 'WORK_FOR_HIRE' ? 'opacity-80' : 'text-ink/60'}`}>
                            Complete transfer of ownership. You own 100% of the copyright and results. The solver retains no rights.
                        </p>
                        {formData.ipRights === 'WORK_FOR_HIRE' && <div className="absolute top-4 right-4"><CheckCircle size={18} /></div>}
                    </div>

                    {/* Option 2 */}
                    <div
                        onClick={() => updateField('ipRights', 'OPEN_SOURCE')}
                        className={`p-6 border-2 rounded-sm cursor-pointer transition-all relative ${formData.ipRights === 'OPEN_SOURCE' ? 'border-ink bg-ink text-paper' : 'border-ink/10 bg-white hover:border-ink/30'}`}
                    >
                        <Globe size={24} className="mb-4" />
                        <h4 className="font-bold text-sm mb-2">Open Source</h4>
                        <p className={`text-xs leading-relaxed ${formData.ipRights === 'OPEN_SOURCE' ? 'opacity-80' : 'text-ink/60'}`}>
                            Results are released under MIT/CC0 license. Both parties and the public can use and modify freely.
                        </p>
                        {formData.ipRights === 'OPEN_SOURCE' && <div className="absolute top-4 right-4"><CheckCircle size={18} /></div>}
                    </div>

                    {/* Option 3 */}
                    <div
                        onClick={() => updateField('ipRights', 'ATTRIBUTION')}
                        className={`p-6 border-2 rounded-sm cursor-pointer transition-all relative ${formData.ipRights === 'ATTRIBUTION' ? 'border-ink bg-ink text-paper' : 'border-ink/10 bg-white hover:border-ink/30'}`}
                    >
                        <User size={24} className="mb-4" />
                        <h4 className="font-bold text-sm mb-2">Attribution</h4>
                        <p className={`text-xs leading-relaxed ${formData.ipRights === 'ATTRIBUTION' ? 'opacity-80' : 'text-ink/60'}`}>
                            You get usage rights, but the solver retains moral rights and must be credited in publications.
                        </p>
                        {formData.ipRights === 'ATTRIBUTION' && <div className="absolute top-4 right-4"><CheckCircle size={18} /></div>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8">
                <button
                    onClick={onSaveDraft}
                    className="flex items-center gap-2 border border-ink/20 text-ink/60 px-6 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:border-ink hover:text-ink hover:bg-stone/5 transition-all"
                >
                    <Save size={16} /> <span className="hidden sm:inline">Save Draft</span>
                </button>
                <button onClick={onNext} className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg">Next: Preview</button>
            </div>
        </div>
    );
};
