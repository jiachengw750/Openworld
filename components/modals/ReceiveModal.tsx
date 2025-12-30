import React from 'react';
import { X, QrCode, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ReceiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({ isOpen, onClose, address }) => {
    const { showToast } = useToast();

    if (!isOpen) return null;

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            showToast('Address copied to clipboard');
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-sm p-8 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h3 className="font-sans text-2xl font-bold mb-2">Receive Assets</h3>
                <p className="text-ink/60 text-sm mb-6">Scan QR code or copy address</p>
                
                <div className="bg-white p-4 border border-ink/10 rounded-sm mb-6">
                    <QrCode size={160} className="text-ink" />
                </div>

                <div 
                    onClick={copyAddress}
                    className="w-full bg-stone/10 p-3 rounded-sm border border-ink/5 cursor-pointer hover:bg-stone/20 transition-colors group"
                >
                    <span className="block text-[10px] font-mono text-ink/40 uppercase mb-1">Your Address</span>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="font-mono text-xs font-bold text-ink truncate max-w-[200px]">{address}</span>
                        <Copy size={12} className="text-ink/40 group-hover:text-accent" />
                    </div>
                </div>
            </div>
        </div>
    );
};