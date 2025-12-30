import React from 'react';
import { BookOpen, FileText, Shield, DollarSign } from 'lucide-react';

interface GuideStepProps {
    onStart: () => void;
}

export const GuideStep: React.FC<GuideStepProps> = ({ onStart }) => {
    return (
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
                onClick={onStart}
                className="bg-ink text-paper px-12 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02]"
            >
                Start Creating
            </button>
        </div>
    );
};
