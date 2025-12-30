import React, { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface EscrowProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    budget: string;
}

export const EscrowProtocolModal: React.FC<EscrowProtocolModalProps> = ({
    isOpen, onClose, onConfirm, budget
}) => {
    const [agreedToEscrow, setAgreedToEscrow] = useState(false);

    if (!isOpen) return null;

    const totalStake = (parseFloat(budget || '0') * 1.02).toFixed(2);

    const handleConfirm = () => {
        if (!agreedToEscrow) return;
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-paper w-full max-w-lg p-8 rounded-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4 text-green-700">
                    <Shield size={24} />
                    <h3 className="font-sans text-2xl font-bold text-ink">Funds Escrow Agreement</h3>
                </div>
                <p className="text-ink/60 text-sm mb-6">
                    You are about to deposit <strong>{totalStake} USDC</strong> into the OpenSci Smart Contract.
                </p>
                <div className="bg-stone/5 border border-ink/10 p-4 rounded-sm mb-6 text-xs text-ink/70 font-mono space-y-2">
                    <div className="flex gap-2"><CheckCircle size={12} className="mt-0.5 text-green-600" /> Funds are locked until you approve the work.</div>
                    <div className="flex gap-2"><CheckCircle size={12} className="mt-0.5 text-green-600" /> You can request a refund if no bidder is selected.</div>
                    <div className="flex gap-2"><CheckCircle size={12} className="mt-0.5 text-green-600" /> Arbitration committee handles disputes.</div>
                </div>

                <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => setAgreedToEscrow(!agreedToEscrow)}>
                    <div className={`w-5 h-5 border-2 border-ink rounded-sm flex items-center justify-center ${agreedToEscrow ? 'bg-ink' : 'bg-transparent'}`}>
                        {agreedToEscrow && <CheckCircle size={14} className="text-paper" />}
                    </div>
                    <span className="text-sm font-bold text-ink select-none">I authorize the staking of funds</span>
                </div>

                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 text-xs font-bold uppercase text-ink/50 hover:text-ink">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!agreedToEscrow}
                        className="bg-accent text-paper px-8 py-3 rounded-full font-bold text-xs uppercase hover:bg-accent/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sign Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};
