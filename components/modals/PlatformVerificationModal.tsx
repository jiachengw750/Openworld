
import React, { useState } from 'react';
import { X, Link as LinkIcon, Loader2 } from 'lucide-react';

interface PlatformVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    platformName: string;
    onVerify: (link: string) => void;
}

export const PlatformVerificationModal: React.FC<PlatformVerificationModalProps> = ({ isOpen, onClose, platformName, onVerify }) => {
    const [link, setLink] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    if (!isOpen) return null;

    const handleVerify = () => {
        if (!link.trim()) return;
        setIsVerifying(true);
        setTimeout(() => {
            onVerify(link);
            setIsVerifying(false);
            onClose();
        }, 1500);
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-md p-8 rounded-sm shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
                
                <h3 className="font-sans text-2xl font-bold text-ink mb-2">Verify {platformName}</h3>
                <p className="text-ink/60 text-sm mb-8 leading-relaxed">
                    Please provide your public profile URL to verify your academic credentials on this platform.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Profile URL</label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-surface border border-ink/20 p-4 pl-10 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                                autoFocus
                            />
                            <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                        </div>
                    </div>

                    <button 
                        onClick={handleVerify}
                        disabled={isVerifying || !link}
                        className="w-full bg-ink text-paper py-4 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isVerifying && <Loader2 size={14} className="animate-spin" />}
                        {isVerifying ? "Verifying..." : "Confirm & Verify"}
                    </button>
                </div>
            </div>
        </div>
    );
};
