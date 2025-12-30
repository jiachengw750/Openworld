import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Copy, Upload, Send, CheckCircle, Clock } from 'lucide-react';
import { PROJECTS } from '../constants';
import { useToast } from '../context/ToastContext';
import { Donation } from '../types';

import { TransferModal } from '../components/modals/TransferModal';
import { UploadModal } from '../components/modals/UploadModal';
import { DonationHistoryModal } from '../components/modals/DonationHistoryModal';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

const generateMockDonations = (baseDonations: Donation[], count: number): Donation[] => {
    const extra: Donation[] = Array.from({ length: count }).map((_, i) => ({
        id: `mock-manage-${i}`,
        donor: i % 3 === 0 ? 'Anonymous' : i % 3 === 1 ? 'Science Fund' : 'Crypto Whale',
        amount: Math.floor(Math.random() * 5000) + 100,
        date: `${Math.floor(Math.random() * 30) + 1} days ago`,
        avatar: `https://i.pravatar.cc/150?u=${300 + i}`
    }));
    return [...baseDonations, ...extra];
};

const MOCK_IDA_TXS = [
    { id: 1, type: 'Received', amount: 12000, date: '2024-03-15', hash: '0x123...abc' },
    { id: 2, type: 'Sent', amount: 500, date: '2024-03-10', hash: '0x456...def' },
    { id: 3, type: 'Received', amount: 4500, date: '2024-03-01', hash: '0x789...ghi' },
];

export const ProjectManagement: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const initialProject = PROJECTS.find(p => p.id === id);
    const [project, setProject] = useState(initialProject);
    const { showToast } = useToast();

    // State
    const [idaBalance, setIdaBalance] = useState(project ? 0 : 0);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
    const [milestoneUploadStatus, setMilestoneUploadStatus] = useState<Record<string, string>>({});
    const [historyData, setHistoryData] = useState<Donation[]>([]);
    
    // Claim State
    const [isClaiming, setIsClaiming] = useState(false);
    const [hasClaimed, setHasClaimed] = useState(false);

    if (!project) return <div>Project not found</div>;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const shortenAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleTransferSuccess = (amount: number) => {
        setIdaBalance(prev => prev - amount);
        setIsTransferModalOpen(false);
        showToast(`Transferred ${formatCurrency(amount)} successfully`);
    };

    const handleInitiateClaim = () => {
        if (project.raised <= 0) {
             showToast("No funds to claim");
             return;
        }
        setIsPasswordModalOpen(true);
    };

    const executeClaim = () => {
        setIsClaiming(true);
        setTimeout(() => {
            setIdaBalance(prev => prev + project.raised);
            setHasClaimed(true);
            setIsClaiming(false);
            showToast(`Successfully claimed ${formatCurrency(project.raised)} to IDA`);
        }, 2000);
        setIsPasswordModalOpen(false);
    };

    const handleOpenUploadModal = (milestoneId: string) => {
        setActiveMilestoneId(milestoneId);
        setIsUploadModalOpen(true);
    };

    const handleSubmitMilestone = () => {
        if (!activeMilestoneId) return;
        setMilestoneUploadStatus(prev => ({...prev, [activeMilestoneId]: 'PENDING_REVIEW'}));
        setIsUploadModalOpen(false);
        showToast("Progress submitted. Pending Admin Review.");
    };

    const handleOpenHistory = () => {
        const fullHistory = generateMockDonations(project.donations || [], 40); 
        setHistoryData(fullHistory);
        setIsHistoryModalOpen(true);
    };

    const canClaim = project.status === 'RESEARCH' && !hasClaimed;

    return (
        <div className="min-h-screen bg-paper pb-24">
            <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/my-projects" className="flex items-center text-sm font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-8 w-fit uppercase tracking-widest p-2 -ml-2">
                        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between">
                        <div>
                             <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-3 block border border-ink/20 w-fit px-3 py-1 rounded-full bg-paper">{project.status.replace('_', ' ')}</span>
                             <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-4">Manage Project</h1>
                             <span className="font-mono text-sm font-bold text-ink/60 tracking-wider">ID: {project.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                <div className="lg:col-span-8 space-y-16">
                    
                    {/* Project Info Card */}
                    <section className="bg-paper border border-ink/10 group">
                        <div className="flex flex-col md:flex-row items-stretch">
                             <div className="w-full md:w-56 h-48 md:h-auto bg-stone/5 relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-ink/10">
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/>
                             </div>
                             <div className="flex-1 p-8">
                                <h2 className="font-sans text-3xl font-bold text-ink mb-3 leading-tight">{project.title}</h2>
                                <p className="font-sans text-base text-ink/70 mb-6 line-clamp-2 leading-relaxed max-w-2xl">{project.shortDescription}</p>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-ink/5 tracking-wide border border-ink/10 px-3 py-1.5 rounded-full text-ink/80 font-medium">{tag}</span>
                                        ))}
                                    </div>
                                    <Link to={`/project/${project.id}`} className="text-xs font-mono font-bold text-ink hover:text-accent uppercase tracking-widest flex items-center bg-stone/5 hover:bg-ink/5 px-4 py-2 rounded-full transition-colors border border-ink/5">
                                        Public Page <ExternalLink size={14} className="ml-2"/>
                                    </Link>
                                </div>
                             </div>
                        </div>
                    </section>

                    {/* Milestones Section */}
                    <section className="border-t-2 border-ink/10 pt-12">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
                            <h3 className="font-sans text-3xl font-bold text-ink">Milestones</h3>
                            <span className="text-xs font-mono font-bold text-ink/60 uppercase tracking-widest bg-stone/5 px-4 py-2 rounded-sm border border-ink/10 self-start sm:self-auto">
                                {project.milestones.filter(m => m.status === 'COMPLETED').length} / {project.milestones.length} Completed
                            </span>
                        </div>

                        <div className="space-y-0 relative border-l-2 border-ink/10 ml-3">
                             {project.milestones.map((milestone) => (
                                 <div key={milestone.id} className="pl-12 pb-16 relative last:pb-0">
                                    <div className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full ring-4 ring-paper flex items-center justify-center z-10 ${
                                        milestone.status === 'COMPLETED' ? 'bg-green-600' :
                                        milestone.status === 'IN_PROGRESS' ? 'bg-paper border-2 border-blue-600 shadow-[0_0_0_2px_rgba(37,99,235,0.1)]' :
                                        'bg-paper border-2 border-dashed border-ink/30'
                                    }`}>
                                        {milestone.status === 'COMPLETED' && (
                                            <div className="w-1.5 h-1.5 bg-paper rounded-full" />
                                        )}
                                        {milestone.status === 'IN_PROGRESS' && (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                                        <h5 className="font-sans text-2xl font-bold text-ink">{milestone.title}</h5>
                                        <span className="text-sm font-mono font-bold text-ink/50 bg-stone/5 px-2 py-0.5 rounded-sm w-fit">{milestone.date}</span>
                                    </div>
                                    <p className="text-base text-ink/70 mb-6 max-w-2xl leading-relaxed">{milestone.description}</p>
                                    
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-surface rounded-none border border-ink/10 gap-4">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-mono font-bold uppercase px-3 py-1.5 rounded-full border border-transparent ${
                                                milestone.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                                                milestone.status === 'IN_PROGRESS' ? 'bg-ink text-paper' :
                                                'bg-stone-200 text-ink/40'
                                            }`}>
                                                {milestone.status.replace('_', ' ')}
                                            </span>
                                            {milestoneUploadStatus[milestone.id] === 'PENDING_REVIEW' && (
                                                <span className="text-xs font-mono font-bold uppercase px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 flex items-center border border-amber-200">
                                                    <Clock size={12} className="mr-2"/> Reviewing
                                                </span>
                                            )}
                                        </div>

                                        {milestone.status === 'IN_PROGRESS' && milestoneUploadStatus[milestone.id] !== 'PENDING_REVIEW' && (
                                            <button
                                                onClick={() => handleOpenUploadModal(milestone.id)}
                                                className="text-xs font-mono font-bold uppercase inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border border-ink/10 text-ink bg-white hover:bg-ink hover:text-paper transition-all hover:scale-[1.02] shadow-sm"
                                            >
                                                <Upload size={14} />
                                                <span>Upload Evidence</span>
                                            </button>
                                        )}
                                    </div>
                                 </div>
                             ))}
                        </div>
                    </section>

                    {/* Donations Section */}
                    <section className="border-t-2 border-ink/10 pt-12">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-sans text-3xl font-bold text-ink">Recent Donations</h3>
                            <button 
                                onClick={handleOpenHistory}
                                className="text-xs font-mono font-bold text-ink/60 hover:text-accent uppercase tracking-widest border-b border-transparent hover:border-accent transition-all pb-1"
                            >
                                View All
                            </button>
                        </div>

                        <div className="overflow-hidden border border-ink/10 rounded-sm">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-mono uppercase tracking-widest text-ink/50 bg-stone/5 border-b border-ink/10">
                                        <th className="py-4 pl-6 font-bold">Donor</th>
                                        <th className="py-4 text-right font-bold">Amount</th>
                                        <th className="py-4 pr-6 text-right font-bold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-sm">
                                    {(project.donations || []).slice(0, 10).map((donation) => (
                                        <tr key={donation.id} className="border-b border-ink/5 last:border-0 hover:bg-stone/5 transition-colors">
                                            <td className="py-5 pl-6 font-bold text-ink text-base">{donation.donor}</td>
                                            <td className="py-5 text-right text-ink text-base font-bold">{formatCurrency(donation.amount)}</td>
                                            <td className="py-5 pr-6 text-right text-ink/50 font-bold">{donation.date}</td>
                                        </tr>
                                    ))}
                                    {(!project.donations || project.donations.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="py-8 text-center text-ink/40 italic font-bold">No donations received yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-12">
                    
                    {/* Funding Overview Card */}
                    <section className="border-2 border-ink/10 p-10 rounded-none bg-paper shadow-sm">
                         <h3 className="font-sans font-bold text-xl text-ink mb-8 pb-4 border-b border-ink/10">Funding Overview</h3>
                         
                         <div className="space-y-8">
                            <div>
                                <span className="font-mono text-5xl font-bold text-ink tracking-tight">{formatCurrency(project.raised)}</span>
                                <span className="block font-mono text-xs text-ink/60 mt-2 uppercase font-bold tracking-wider">Raised of {formatCurrency(project.goal)}</span>
                            </div>
                            
                            <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden">
                                <div className="h-full bg-ink" style={{ width: `${Math.min(100, (project.raised / project.goal) * 100)}%` }}></div>
                            </div>
                            
                            <div className="flex justify-between text-sm font-mono text-ink/70 font-bold">
                                <span>{project.backers} Backers</span>
                                <span>{(project.raised / project.goal * 100).toFixed(0)}% Funded</span>
                            </div>

                            <div className="pt-8 border-t border-ink/5">
                                {canClaim ? (
                                    <button 
                                        onClick={handleInitiateClaim}
                                        disabled={isClaiming}
                                        className="w-full py-5 bg-ink text-paper hover:bg-ink/90 transition-colors font-mono text-sm font-bold uppercase tracking-widest flex justify-center items-center space-x-2 rounded-full shadow-lg hover:scale-[1.02]"
                                    >
                                        {isClaiming ? "Processing..." : `Claim Funds to IDA`}
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-stone/5 text-ink/40 font-mono text-xs font-bold uppercase tracking-wider text-center border-2 border-ink/5 rounded-full cursor-not-allowed">
                                        {hasClaimed 
                                            ? "Funds Claimed" 
                                            : project.status === 'FUNDING' 
                                                ? "Funding Active" 
                                                : "Unavailable"
                                        }
                                    </div>
                                )}
                                {hasClaimed && (
                                    <div className="mt-4 flex items-center justify-center text-sm text-green-700 font-mono font-bold">
                                        <CheckCircle size={16} className="mr-2"/> Transferred to IDA
                                    </div>
                                )}
                            </div>
                         </div>
                    </section>

                    {/* IDA Wallet Card */}
                    <section className="bg-surface border-2 border-ink/10 p-10 rounded-none shadow-sm">
                        <h3 className="font-sans font-bold text-xl text-ink mb-8 pb-4 border-b border-ink/10">IDA Wallet</h3>

                        <div className="space-y-8">
                            
                            <div className="space-y-3">
                                <span className="text-xs font-mono font-bold uppercase text-ink/50 block tracking-widest">Contract Address</span>
                                <div className="flex items-center justify-between bg-paper border border-ink/10 px-4 py-3 rounded-sm cursor-pointer hover:border-ink transition-colors group" onClick={() => {navigator.clipboard.writeText(project.ida?.contractAddress || ''); showToast('Copied')}}>
                                    <span className="font-mono text-sm font-bold text-ink truncate mr-3">{shortenAddress(project.ida?.contractAddress || '')}</span>
                                    <Copy size={14} className="text-ink/30 group-hover:text-ink"/>
                                </div>
                            </div>

                            <div className="py-8 border-t border-b border-ink/10 text-center bg-stone/5 -mx-10 px-10">
                                <span className="text-xs font-mono font-bold uppercase opacity-50 tracking-widest block mb-3">Available Balance</span>
                                <div className="text-4xl font-mono font-bold text-ink">{formatCurrency(idaBalance)}</div>
                            </div>

                            <button 
                                onClick={() => setIsTransferModalOpen(true)}
                                className="w-full py-4 border-2 border-ink/10 hover:bg-ink hover:text-paper transition-colors font-mono text-sm font-bold uppercase tracking-widest flex justify-center items-center space-x-2 rounded-full hover:scale-[1.02]"
                            >
                                <Send size={16} />
                                <span>Transfer Funds</span>
                            </button>

                            <div className="pt-4">
                                <div className="flex justify-between items-end mb-4">
                                    <h4 className="font-bold text-xs text-ink/50 uppercase tracking-widest">Recent Activity</h4>
                                     <a href="https://etherscan.io/" target="_blank" rel="noreferrer" className="text-[10px] font-mono font-bold text-ink/60 hover:text-accent uppercase tracking-widest flex items-center border-b border-transparent hover:border-accent transition-all">
                                        View all <ExternalLink size={10} className="ml-1" />
                                    </a>
                                </div>
                                <div className="space-y-3">
                                    {MOCK_IDA_TXS.map(tx => (
                                        <div key={tx.id} className="flex items-center justify-between text-sm font-mono border-b border-ink/5 pb-3 last:border-0 font-bold">
                                            <span className="text-ink">{tx.type}</span>
                                            <span className={`${tx.type === 'Received' ? 'text-green-700' : 'text-ink'}`}>
                                                {tx.type === 'Received' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <TransferModal 
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                idaBalance={idaBalance}
                projectName={project.ida?.name || 'IDA Wallet'}
                onTransferSuccess={handleTransferSuccess}
            />

            <UploadModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleSubmitMilestone}
            />

            <DonationHistoryModal 
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                donations={historyData}
            />

            <PasswordVerificationModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onVerified={executeClaim}
            />
        </div>
    );
};