import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface PublishProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const PublishProtocolModal: React.FC<PublishProtocolModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [agreedToProtocol, setAgreedToProtocol] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!agreedToProtocol) return;
        onConfirm();
    };

    return (
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
                        {agreedToProtocol && <CheckCircle size={14} className="text-paper" />}
                    </div>
                    <span className="text-sm font-bold text-ink select-none">I have read and agree to the Protocol</span>
                </div>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 text-xs font-bold uppercase text-ink/50 hover:text-ink">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!agreedToProtocol}
                        className="bg-ink text-paper px-8 py-3 rounded-full font-bold text-xs uppercase hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};
