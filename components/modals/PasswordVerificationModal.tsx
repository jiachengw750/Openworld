import React, { useState } from 'react';
import { X, Key, Mail, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PasswordVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
}

export const PasswordVerificationModal: React.FC<PasswordVerificationModalProps> = ({ isOpen, onClose, onVerified }) => {
    const { showToast } = useToast();
    const [passwordInput, setPasswordInput] = useState('');
    const [isForgotMode, setIsForgotMode] = useState(false);
    
    // Forgot Password State
    const [resetStep, setResetStep] = useState<'EMAIL' | 'VERIFY'>('EMAIL');
    const [resetEmail, setResetEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [isSendingReset, setIsSendingReset] = useState(false);

    if (!isOpen) return null;

    const handleConfirmPassword = () => {
        if (passwordInput.length > 0) {
            onVerified();
            setPasswordInput('');
        } else {
            showToast("Incorrect password");
        }
    };

    const handleSendResetCode = () => {
        if (!resetEmail) { showToast("Enter email"); return; }
        setIsSendingReset(true);
        setTimeout(() => {
            setIsSendingReset(false);
            setResetStep('VERIFY');
            showToast(`Code sent to ${resetEmail}`);
        }, 1500);
    };

    const handleResetPassword = () => {
        if (!resetCode || !resetNewPassword) { showToast("Fill all fields"); return; }
        setIsSendingReset(true);
        setTimeout(() => {
            setIsSendingReset(false);
            setIsForgotMode(false);
            setResetStep('EMAIL');
            setResetEmail('');
            setResetCode('');
            setResetNewPassword('');
            showToast("Password reset successfully");
        }, 1500);
    };

    const handleClose = () => {
        setIsForgotMode(false);
        setPasswordInput('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-sm p-8 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                {/* Editorial Left-Aligned Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                         <Key size={24} className="text-accent"/>
                         <h3 className="font-sans text-2xl font-bold">
                             {isForgotMode ? "Reset Password" : "Confirm Action"}
                         </h3>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="-mr-2 -mt-2 p-3 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {!isForgotMode ? (
                    <div className="flex flex-col">
                        <p className="text-ink/60 text-sm mb-6 leading-relaxed">
                            Please enter your wallet signature password to proceed.
                        </p>

                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Signature Password</label>
                        <input 
                            type="password" 
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm mb-4"
                            autoFocus
                        />

                        <div className="flex justify-end mb-6">
                            <button 
                                onClick={() => setIsForgotMode(true)}
                                className="text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-accent transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button 
                            onClick={handleConfirmPassword}
                            className="w-full bg-ink text-paper py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full shadow-lg hover:scale-[1.02]"
                        >
                            Authorize
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-ink/60 text-sm mb-6">
                            {resetStep === 'EMAIL' ? 'Enter email to receive a code.' : 'Enter code and new password.'}
                        </p>

                        {resetStep === 'EMAIL' ? (
                            <div className="w-full space-y-4">
                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Email Address</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                                        <input 
                                            type="email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="researcher@institute.edu"
                                            className="w-full bg-surface border border-ink/20 py-3 pl-10 pr-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSendResetCode}
                                    disabled={isSendingReset}
                                    className="w-full bg-ink text-paper py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full flex justify-center items-center"
                                >
                                    {isSendingReset ? <Loader2 size={14} className="animate-spin" /> : "Send Code"}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full space-y-4 text-left">
                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Verification Code</label>
                                    <input 
                                        type="text"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        placeholder="123456"
                                        className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm text-center uppercase tracking-widest font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">New Password</label>
                                    <input 
                                        type="password"
                                        value={resetNewPassword}
                                        onChange={(e) => setResetNewPassword(e.target.value)}
                                        placeholder="********"
                                        className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm text-center"
                                    />
                                </div>
                                <button 
                                    onClick={handleResetPassword}
                                    disabled={isSendingReset}
                                    className="w-full bg-ink text-paper py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full flex justify-center items-center"
                                >
                                    {isSendingReset ? <Loader2 size={14} className="animate-spin" /> : "Reset Password"}
                                </button>
                            </div>
                        )}
                        
                        <div className="mt-6 border-t border-ink/10 pt-4 text-center">
                            <button 
                                onClick={() => {
                                    setIsForgotMode(false);
                                    setResetStep('EMAIL');
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-ink/40 hover:text-ink"
                            >
                                Back to Confirm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};