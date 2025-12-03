
import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { useWallet } from '../../context/WalletContext';
import { ReceiveModal } from './ReceiveModal';
import { PasswordVerificationModal } from './PasswordVerificationModal';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onSuccessUpdate: (amount: number, newDonation: any) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, project, onSuccessUpdate }) => {
    const { wallet, connect } = useWallet();
    const [donationAmount, setDonationAmount] = useState<string>('100');
    const [donationStep, setDonationStep] = useState<'INPUT' | 'PROCESSING' | 'SUCCESS'>('INPUT');
    const [successVoucher, setSuccessVoucher] = useState<{tokenId: string, hash: string} | null>(null);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    const usdcBalance = 5430.50;

    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const handleInitiateDonate = () => {
        const amount = parseFloat(donationAmount);
        if (isNaN(amount) || amount <= 0) return;
        setIsPasswordModalOpen(true);
    };

    const handleConfirmPassword = () => {
        setIsPasswordModalOpen(false);
        executeDonate();
    };

    const executeDonate = () => {
        const amount = parseFloat(donationAmount);
        setDonationStep('PROCESSING');

        setTimeout(() => {
            const newDonation = {
                id: `d-new-${Date.now()}`,
                donor: wallet?.name || "Anonymous",
                amount: amount,
                date: "Just now",
                avatar: wallet?.avatar || "https://i.pravatar.cc/150?u=99"
            };

            onSuccessUpdate(amount, newDonation);
            
            setSuccessVoucher({
                tokenId: `#${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                hash: "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
            });

            setDonationStep('SUCCESS');
        }, 2000);
    };

    const resetModal = () => {
        setDonationStep('INPUT');
        setDonationAmount('100');
        setSuccessVoucher(null);
        onClose();
    };

    // Prevent negative sign input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-lg p-10 shadow-2xl relative border border-ink/10 rounded-none animate-in zoom-in-95 duration-300 flex flex-col items-center">
                <button 
                    onClick={resetModal} 
                    className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                {donationStep === 'INPUT' && (
                    <>
                        <h2 className="font-sans text-3xl font-bold mb-2 text-center text-ink">Back this Project</h2>
                        <p className="font-sans text-ink/60 text-sm mb-10 text-center max-w-xs">
                            Your contribution directly funds research milestones.
                        </p>

                        <div className="w-full mb-8">
                            <div className="flex justify-between items-center w-full mb-6 px-2">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">Balance</span>
                                <div className="flex items-center space-x-3">
                                    <span className="font-mono text-xs font-bold text-ink">{formatCurrency(usdcBalance)} USDC</span>
                                    <button 
                                        onClick={() => setIsReceiveModalOpen(true)}
                                        className="text-[10px] bg-stone/10 text-ink/60 px-3 py-1 rounded-full hover:bg-ink hover:text-paper transition-colors font-mono font-bold uppercase tracking-wider"
                                    >
                                        Add Funds
                                    </button>
                                </div>
                            </div>
                            
                            <div className="relative w-full border-b-2 border-ink/10 py-4 group hover:border-ink/30 transition-colors">
                                <label className="block text-[10px] font-mono uppercase tracking-widest mb-2 text-ink/40 text-center">Amount (USDC)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    onKeyDown={preventNegative}
                                    className="w-full bg-transparent text-center font-mono text-6xl font-bold text-ink focus:outline-none placeholder-ink/10"
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="w-full bg-stone/5 p-4 rounded-sm mb-8 font-mono text-xs text-ink/60 space-y-2 border border-ink/5">
                            <div className="flex justify-between">
                                <span>Network Fee</span>
                                <span className="text-ink font-bold">&lt; 0.01 USDC</span>
                            </div>
                            <div className="flex justify-between border-t border-ink/5 pt-2">
                                <span className="font-bold text-ink uppercase tracking-wider">Total</span>
                                <span className="text-ink font-bold text-lg">{parseFloat(donationAmount) || 0} USDC</span>
                            </div>
                        </div>

                        {!wallet ? (
                            <button 
                                onClick={connect}
                                className="w-full bg-ink text-paper py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-ink/90 transition-all hover:scale-[1.02]"
                            >
                                Connect Wallet
                            </button>
                        ) : (
                            <button 
                                onClick={handleInitiateDonate}
                                className="w-full bg-accent text-paper py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent/90 transition-all hover:scale-[1.02] shadow-lg"
                            >
                                Confirm Donation
                            </button>
                        )}
                    </>
                )}

                {donationStep === 'PROCESSING' && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-ink/10 border-t-accent rounded-full animate-spin mb-8"></div>
                        <h3 className="font-sans text-2xl font-bold mb-2">Processing</h3>
                        <p className="font-mono text-xs text-ink/60 uppercase tracking-widest">Confirm in your wallet...</p>
                    </div>
                )}

                {donationStep === 'SUCCESS' && successVoucher && (
                    <div className="py-4 flex flex-col items-center w-full">
                        <h3 className="font-sans text-3xl font-bold mb-8">Success!</h3>
                        
                        {/* NFT Visual */}
                        <div className="relative w-64 h-64 bg-ink p-8 text-paper flex flex-col justify-between shadow-2xl rounded-none mb-8">
                             <div className="flex justify-between items-start">
                                <span className="font-sans font-bold text-xl tracking-tight">catalyst.</span>
                                <span className="font-mono text-[10px] border border-white/30 px-2 py-1 rounded opacity-70">
                                    {successVoucher.tokenId}
                                </span>
                             </div>
                             
                             <div className="text-center">
                                <span className="block font-mono text-3xl font-bold">{formatCurrency(parseFloat(donationAmount))}</span>
                                <span className="text-[10px] uppercase tracking-widest opacity-60">Donation</span>
                             </div>

                             <div className="border-t border-white/10 pt-4">
                                <span className="block text-xs font-bold truncate mb-1">{project.title}</span>
                             </div>
                        </div>

                        <div className="flex gap-4 w-full">
                             <Link 
                                to="/my-donations"
                                className="flex-1 border border-ink/20 text-ink py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink/5 transition-colors text-center flex items-center justify-center"
                            >
                                View Receipt
                            </Link>
                             <button 
                                onClick={resetModal}
                                className="flex-1 bg-ink text-paper py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ReceiveModal 
                isOpen={isReceiveModalOpen} 
                onClose={() => setIsReceiveModalOpen(false)} 
                address={wallet?.address || ''} 
            />

            <PasswordVerificationModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onVerified={handleConfirmPassword}
            />
        </div>
    );
};
