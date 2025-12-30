import React, { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Donation } from '../../types';

interface DonationHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    donations: Donation[];
}

export const DonationHistoryModal: React.FC<DonationHistoryModalProps> = ({ isOpen, onClose, donations }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    if (!isOpen) return null;

    const totalPages = Math.ceil(donations.length / ITEMS_PER_PAGE);
    const paginatedData = donations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-4xl max-h-[85vh] rounded-none shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-ink/10 flex justify-between items-center bg-surface">
                    <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-ink/40 block mb-1">All Records</span>
                        <h3 className="font-sans text-2xl font-bold text-ink">Donation History</h3>
                    </div>
                    <div className="flex space-x-4">
                        <button className="p-3 hover:bg-ink/5 rounded-full text-ink/60 hover:text-accent transition-colors" title="Export CSV">
                            <Download size={24} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-3 hover:bg-ink/5 rounded-full text-ink/60 hover:text-red-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-ink/10 text-[10px] font-mono uppercase tracking-widest text-ink/40 bg-ink/5">
                                <th className="py-3 pl-4 font-normal rounded-tl-sm">Donor</th>
                                <th className="py-3 font-normal">Date</th>
                                <th className="py-3 font-normal hidden sm:table-cell">Tx Hash</th>
                                <th className="py-3 pr-4 font-normal text-right rounded-tr-sm">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {paginatedData.map((donation, idx) => (
                                <tr key={idx} className="border-b border-ink/5 hover:bg-ink/5 transition-colors">
                                    <td className="py-4 pl-4 flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-stone/20 overflow-hidden">
                                            <img src={donation.avatar} className="w-full h-full object-cover" alt="donor"/>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-ink">{donation.donor}</span>
                                            <span className="text-[10px] text-ink/40 sm:hidden">{donation.id.substring(0,8)}...</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-ink/60">{donation.date}</td>
                                    <td className="py-4 text-xs text-ink/40 font-mono hidden sm:table-cell">
                                        0x{Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('')}...
                                    </td>
                                    <td className="py-4 pr-4 text-right font-bold text-accent">{formatCurrency(donation.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-ink/10 bg-surface flex justify-between items-center">
                    <span className="text-xs font-mono text-ink/40">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, donations.length)} of {donations.length} records
                    </span>
                    
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-ink/10 rounded-full disabled:opacity-30 hover:bg-ink/5 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-mono font-bold text-ink px-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-ink/10 rounded-full disabled:opacity-30 hover:bg-ink/5 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};