
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { PasswordVerificationModal } from './PasswordVerificationModal';
import { useToast } from '../../context/ToastContext';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    idaBalance: number;
    projectName: string;
    onTransferSuccess: (amount: number) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, idaBalance, projectName, onTransferSuccess }) => {
    const { showToast } = useToast();
    const [transferAmount, setTransferAmount] = useState('');
    const [transferAddress, setTransferAddress] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const handleInitiateTransfer = () => {
        const amount = parseFloat(transferAmount);
        if (isNaN(amount) || amount <= 0) {
            showToast("Invalid amount");
            return;
        }
        if (amount > idaBalance) {
            showToast("Insufficient balance");
            return;
        }
        setIsPasswordModalOpen(true);
    };

    const handleConfirmPassword = () => {
        setIsPasswordModalOpen(false);
        executeTransfer();
    };

    const executeTransfer = () => {
        const amount = parseFloat(transferAmount);
        setIsTransferring(true);
        setTimeout(() => {
            setIsTransferring(false);
            onTransferSuccess(amount);
            setTransferAmount('');
        }, 2000);
    };

    // Prevent negative sign input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-md p-8 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
                
                <div className="flex items-center space-x-2 mb-6">
                    <div className="bg-accent/10 p-2 rounded-full text-accent">
                        <Send size={24} />
                    </div>
                    <h3 className="font-sans text-2xl font-bold text-ink">Transfer Funds</h3>
                </div>

                <div className="space-y-6">
                    <div className="bg-stone/10 p-4 rounded-sm border border-ink/5">
                        <span className="text-[10px] font-mono uppercase text-ink/40 block mb-1">From IDA</span>
                        <span className="font-bold text-ink">{projectName}</span>
                        <div className="mt-2 flex justify-between text-xs">
                            <span className="text-ink/60">Available Balance:</span>
                            <span className="font-mono font-bold text-ink">{formatCurrency(idaBalance)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2">Recipient Address</label>
                        <input 
                            type="text" 
                            value={transferAddress}
                            onChange={(e) => setTransferAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2">Amount (USDC)</label>
                        <input 
                            type="number" 
                            min="0"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            onKeyDown={preventNegative}
                            placeholder="0.00"
                            className="w-full bg-surface border border-ink/20 p-3 font-mono text-xl font-bold text-ink focus:outline-none focus:border-accent rounded-sm"
                        />
                    </div>

                    <button 
                        onClick={handleInitiateTransfer}
                        disabled={isTransferring}
                        className="w-full bg-ink text-paper py-4 font-mono text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors flex justify-center items-center space-x-2 mt-4 rounded-full"
                    >
                        {isTransferring ? (
                            <>
                                <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Confirm Transfer</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <PasswordVerificationModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onVerified={handleConfirmPassword}
            />
        </div>
    );
};
