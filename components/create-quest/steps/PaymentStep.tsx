import React from 'react';
import { Shield } from 'lucide-react';

interface PaymentStepProps {
    budget: string;
    onInitiatePayment: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
    budget, onInitiatePayment
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-xl mx-auto">
            <div className="bg-paper border-2 border-ink/10 p-10 rounded-sm shadow-xl">
                <h3 className="font-sans text-2xl font-bold text-ink mb-8 text-center">Fund Escrow</h3>

                <div className="space-y-4 font-mono text-sm border-b border-ink/10 pb-8 mb-8">
                    <div className="flex justify-between">
                        <span className="text-ink/60">Quest Budget</span>
                        <span className="font-bold text-ink">{budget} USDC</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-ink/60">Protocol Fee (2%)</span>
                        <span className="font-bold text-ink">{(parseFloat(budget) * 0.02).toFixed(2)} USDC</span>
                    </div>
                    <div className="flex justify-between text-lg pt-4 border-t border-ink/10 mt-4">
                        <span className="font-bold uppercase tracking-widest">Total Stake</span>
                        <span className="font-bold text-accent">{(parseFloat(budget) * 1.02).toFixed(2)} USDC</span>
                    </div>
                </div>

                <button
                    onClick={onInitiatePayment}
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
    );
};
