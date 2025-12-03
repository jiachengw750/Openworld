
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { PasswordVerificationModal } from './PasswordVerificationModal';

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
    assets: any[];
    onSendSuccess: (amount: string, symbol: string, address: string) => void;
}

export const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, assets, onSendSuccess }) => {
    const { showToast } = useToast();
    const [sendAmount, setSendAmount] = useState('');
    const [sendAddress, setSendAddress] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(assets[0]);
    const [isSending, setIsSending] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    if (!isOpen) return null;

    const handleInitiateSend = () => {
        if (!sendAddress || !sendAmount) return;
        if (parseFloat(sendAmount) <= 0) {
            showToast("Amount must be greater than 0");
            return;
        }
        setIsPasswordModalOpen(true);
    };

    const handleConfirmPassword = () => {
        setIsPasswordModalOpen(false);
        executeSend();
    };

    const executeSend = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            onSendSuccess(sendAmount, selectedAsset.symbol, sendAddress);
            setSendAmount('');
            setSendAddress('');
        }, 2000);
    };

    // Prevent negative sign input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-md p-8 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h3 className="font-sans text-2xl font-bold mb-6 text-ink">Send Assets</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-3">Select Asset</label>
                        <div className="flex space-x-3">
                            {assets.map((asset) => (
                                <button 
                                    key={asset.symbol}
                                    onClick={() => setSelectedAsset(asset)}
                                    className={`px-6 py-2 rounded-full text-sm font-mono font-bold uppercase tracking-wider transition-colors border-2 flex items-center space-x-2 ${
                                        selectedAsset.symbol === asset.symbol 
                                        ? 'bg-ink text-paper border-ink' 
                                        : 'text-ink/60 border-transparent hover:border-ink/20'
                                    }`}
                                >
                                    <img src={asset.icon} alt={asset.symbol} className="w-5 h-5 object-contain" />
                                    <span>{asset.symbol}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2">Recipient Address</label>
                        <input 
                            type="text" 
                            value={sendAddress}
                            onChange={(e) => setSendAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2">Amount</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                min="0"
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                onKeyDown={preventNegative}
                                placeholder="0.00"
                                className="w-full bg-surface border border-ink/20 p-3 font-mono text-xl font-bold text-ink focus:outline-none focus:border-accent rounded-sm pr-16"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-ink/40 font-bold">{selectedAsset.symbol}</span>
                        </div>
                        <span className="text-[10px] font-mono text-ink/40 mt-1 block text-right">
                            Balance: {selectedAsset.balance} {selectedAsset.symbol}
                        </span>
                    </div>

                    <button 
                        onClick={handleInitiateSend}
                        disabled={isSending}
                        className="w-full bg-ink text-paper py-4 font-mono text-sm font-semibold uppercase tracking-widest hover:bg-ink/90 transition-colors flex justify-center items-center space-x-2 mt-4 rounded-full shadow-lg"
                    >
                        {isSending ? "Processing..." : "Confirm Transaction"}
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
