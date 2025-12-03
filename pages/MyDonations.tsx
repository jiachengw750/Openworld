import React, { useState } from 'react';
import { USER_DONATIONS } from '../constants';
import { DonationVoucher } from '../types';
import { ArrowLeft, ExternalLink, X, Copy, Check, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const MyDonations: React.FC = () => {
  const [selectedVoucher, setSelectedVoucher] = useState<DonationVoucher | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const totalDonated = USER_DONATIONS.reduce((sum, v) => sum + v.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-paper pb-24">
      {/* Header */}
      <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-[1512px] mx-auto">
            <Link to="/" className="flex items-center text-sm font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-8 uppercase tracking-widest w-fit p-2 -ml-2">
                <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
            <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-4">My Donations</h1>
            <p className="font-sans text-ink/70 max-w-2xl text-xl leading-relaxed">
                Your contribution history and impact certificates.
            </p>

            {/* Stats Row - Clean Typography, No Icons */}
            <div className="flex flex-col sm:flex-row gap-16 mt-16 items-start">
                <div className="flex flex-col">
                    <span className="block font-mono text-5xl text-ink font-bold mb-2">{formatCurrency(totalDonated)}</span>
                    <span className="block text-xs font-mono font-bold uppercase text-ink/60 tracking-widest">Total Donated</span>
                </div>
                <div className="flex flex-col">
                    <span className="block font-mono text-5xl text-ink font-bold mb-2">{USER_DONATIONS.length}</span>
                    <span className="block text-xs font-mono font-bold uppercase text-ink/60 tracking-widest">Projects Backed</span>
                </div>
                <div className="flex flex-col">
                    <span className="block font-mono text-5xl text-ink font-bold mb-2">{USER_DONATIONS.length}</span>
                    <span className="block text-xs font-mono font-bold uppercase text-ink/60 tracking-widest">Vouchers Minted</span>
                </div>
            </div>
        </div>
      </div>

      {/* Donation Vouchers Grid */}
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-16">
        <h2 className="font-sans text-2xl font-bold text-ink mb-10">Voucher Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-r border-t border-ink/10">
            {USER_DONATIONS.map((voucher) => (
                <div 
                    key={voucher.id} 
                    onClick={() => setSelectedVoucher(voucher)}
                    className="group flex flex-col border-b md:border-r border-ink/10 bg-paper hover:bg-surface transition-colors duration-300 relative h-full rounded-none cursor-pointer"
                >
                    <div className="relative aspect-square bg-stone/5 p-12 flex items-center justify-center border-b border-ink/5">
                        {/* Mock NFT Visual */}
                        <div className="w-full h-full bg-ink p-8 text-paper flex flex-col justify-between shadow-xl transform group-hover:scale-[1.02] transition-transform duration-500 rounded-none">
                            <div className="flex justify-between items-start">
                                <span className="font-sans font-bold text-2xl tracking-tight">catalyst.</span>
                                <span className="font-mono text-xs font-bold opacity-70 bg-white/10 px-2 py-1">{voucher.tokenId}</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-mono text-4xl font-bold mb-2">{formatCurrency(voucher.amount)}</span>
                            </div>
                            <div className="border-t border-white/20 pt-4">
                                <span className="block text-sm font-bold truncate">{voucher.projectTitle}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <h3 className="font-bold text-ink truncate mb-2 text-lg group-hover:text-accent transition-colors">{voucher.projectTitle}</h3>
                        <div className="flex justify-between items-center mt-auto pt-4">
                            <span className="font-mono text-base font-bold text-ink/70">{formatCurrency(voucher.amount)}</span>
                            <span className="text-xs font-mono font-bold text-ink/60 uppercase tracking-widest group-hover:text-ink transition-colors flex items-center">
                                Details <ArrowLeft className="rotate-180 ml-2" size={12}/>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-5xl max-h-[90vh] grid grid-cols-1 md:grid-cols-2 rounded-none shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
                <button 
                    onClick={() => setSelectedVoucher(null)}
                    className="absolute top-6 right-6 z-10 p-3 rounded-full backdrop-blur-md transition-colors text-white bg-white/10 hover:bg-white/20 hover:text-red-400 md:text-ink/60 md:bg-ink/5 md:hover:bg-ink/10 md:hover:text-red-600"
                >
                    <X size={24} />
                </button>

                {/* Left: Visual */}
                <div className="bg-ink p-16 flex items-center justify-center h-full relative overflow-hidden">
                     <div className="w-full max-w-sm aspect-[3/4] bg-gradient-to-br from-gray-900 to-black border-2 border-white/10 p-10 text-white flex flex-col justify-between shadow-2xl relative rounded-none">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <span className="font-sans font-bold text-3xl tracking-tighter">catalyst.</span>
                                <span className="font-mono text-sm font-bold border border-white/30 px-3 py-1 rounded opacity-80">{selectedVoucher.tokenId}</span>
                            </div>
                            
                            <div className="text-center mb-12">
                                <span className="block text-xs font-mono font-bold uppercase tracking-[0.2em] mb-6 opacity-60">Contribution</span>
                                <span className="block font-sans text-6xl font-bold mb-2 tracking-tighter font-mono">{formatCurrency(selectedVoucher.amount)}</span>
                            </div>

                            <div className="space-y-3">
                                <span className="block text-2xl font-bold leading-tight">{selectedVoucher.projectTitle}</span>
                                <span className="block text-sm font-mono opacity-60 font-bold">{selectedVoucher.date}</span>
                            </div>
                        </div>
                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                            <div className="w-10 h-10 bg-white rounded-none"></div>
                            <span className="font-mono text-xs font-bold opacity-50 tracking-wider">ON-CHAIN VERIFIED</span>
                        </div>
                     </div>
                </div>

                {/* Right: Details */}
                <div className="p-16 bg-surface flex flex-col justify-center h-full overflow-y-auto">
                    <span className="font-mono text-ink/50 text-xs font-bold uppercase tracking-widest mb-4">Voucher Details</span>
                    <h2 className="font-sans text-4xl font-bold text-ink mb-12">Transaction Record</h2>
                    
                    <div className="space-y-10 font-mono text-base">
                        <div>
                            <span className="block text-ink/50 text-xs font-bold uppercase tracking-widest mb-2">Project</span>
                            <Link to={`/project/${selectedVoucher.projectId}`} className="text-ink font-bold hover:underline text-xl truncate block">
                                {selectedVoucher.projectTitle}
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <span className="block text-ink/50 text-xs font-bold uppercase tracking-widest mb-2">Amount</span>
                                <span className="text-ink font-bold text-2xl">{formatCurrency(selectedVoucher.amount)}</span>
                            </div>
                            <div>
                                <span className="block text-ink/50 text-xs font-bold uppercase tracking-widest mb-2">Date</span>
                                <span className="text-ink font-bold text-2xl">{selectedVoucher.date}</span>
                            </div>
                        </div>

                        <div className="p-8 bg-stone/5 rounded-none space-y-6 border border-ink/10">
                            <div>
                                <span className="block text-ink/50 text-xs font-bold uppercase tracking-widest mb-2">Contract Address</span>
                                <div className="flex items-center justify-between group cursor-pointer" onClick={() => copyToClipboard(selectedVoucher.contractAddress)}>
                                    <span className="text-sm font-medium text-ink/80 truncate mr-3">{selectedVoucher.contractAddress}</span>
                                    {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16} className="text-ink/40 group-hover:text-accent"/>}
                                </div>
                            </div>
                            <div>
                                <span className="block text-ink/50 text-xs font-bold uppercase tracking-widest mb-2">Transaction Hash</span>
                                <a href="#" className="flex items-center text-sm text-ink font-bold hover:text-accent transition-colors">
                                    {selectedVoucher.transactionHash} <ExternalLink size={14} className="ml-2"/>
                                </a>
                            </div>
                        </div>
                    </div>

                    <button className="mt-12 w-full flex items-center justify-center space-x-3 bg-ink text-paper py-5 rounded-full hover:bg-accent transition-colors font-bold text-sm uppercase tracking-widest shadow-lg">
                        <Share2 size={16} />
                        <span>Share Certificate</span>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};