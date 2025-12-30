
import React from 'react';
import { Project } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Copy, ExternalLink, Clock } from 'lucide-react';

interface ProjectSidebarProps {
    project: Project;
    isOwner: boolean;
    canClaim: boolean;
    hasClaimed: boolean;
    isClaiming: boolean;
    onClaim: () => void;
    onDonate: () => void;
    onViewDonationHistory: () => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ 
    project, isOwner, canClaim, hasClaimed, isClaiming, onClaim, onDonate, onViewDonationHistory 
}) => {
    const { showToast } = useToast();
    const isResearchOrCompleted = project.status === 'RESEARCH' || project.status === 'COMPLETED';
    const isPreLaunch = project.status === 'PRE_LAUNCH';
    
    const percent = Math.round((project.raised / project.goal) * 100);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const shortenAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const copyToClipboard = (text: string, msg: string) => {
        if (text) {
            navigator.clipboard.writeText(text);
            showToast(msg);
        }
    };

    return (
        <div className="sticky top-24 p-8 space-y-12">
            
            {/* Main Action Card */}
            <div className="bg-paper border-2 border-ink/10 p-10 shadow-sm rounded-none">
                {isResearchOrCompleted ? (
                    <>
                        <div className="flex justify-between items-end mb-6">
                            <span className="font-mono text-sm font-bold uppercase tracking-widest text-ink/60">Current Status</span>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-ink text-paper'
                            }`}>
                                {project.status === 'COMPLETED' ? 'Completed' : 'Research Phase'}
                            </span>
                        </div>
                        
                        {/* Milestone Progress Bars */}
                        <div className="flex items-center space-x-1 mb-10 h-2 rounded-full overflow-hidden">
                            {project.milestones?.map((m, idx) => (
                                <div key={idx} className={`h-full flex-1 ${
                                    m.status === 'COMPLETED' ? 'bg-green-500' :
                                    m.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                                    'bg-ink/10'
                                }`}></div>
                            ))}
                        </div>

                        {canClaim ? (
                            <button 
                                onClick={onClaim}
                                disabled={hasClaimed || isClaiming || project.raised === 0}
                                className={`w-full py-5 rounded-full font-mono text-base font-bold uppercase tracking-wider transition-all shadow-lg ${
                                    hasClaimed 
                                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' 
                                        : 'bg-ink text-paper hover:bg-accent hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isClaiming ? "Processing..." : hasClaimed ? "Funds Claimed" : `Claim ${formatCurrency(project.raised)}`}
                            </button>
                        ) : !isOwner ? (
                            <button className="w-full border-2 border-ink/10 text-ink/50 py-5 rounded-full font-mono text-sm font-bold uppercase tracking-wider cursor-default bg-stone-50">
                                Funding Closed
                            </button>
                        ) : null}
                    </>
                ) : isPreLaunch ? (
                    <>
                        <div className="mb-2">
                             <span className="font-mono text-5xl font-bold text-ink">{formatCurrency(project.goal)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-base font-sans text-ink/70 font-medium">Fundraising Goal</span>
                        </div>
                        
                        {/* Placeholder Bar */}
                        <div className="w-full h-2 bg-ink/5 mb-10 rounded-full overflow-hidden border border-ink/5">
                            <div className="h-full bg-ink/10 w-0"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 mb-10 border-t-2 border-ink/5 pt-8">
                            <div className="flex flex-col">
                                <span className="font-bold text-3xl font-sans text-ink flex items-center gap-3">
                                    {project.startTime || 'TBA'}
                                </span>
                                <span className="text-xs font-mono uppercase tracking-widest text-ink/60 mt-2 font-bold">Project Launch</span>
                            </div>
                        </div>

                        {!isOwner ? (
                            <button 
                                disabled
                                className="w-full bg-stone/5 text-ink/40 py-5 rounded-full font-mono text-base font-bold uppercase tracking-widest cursor-not-allowed border-2 border-ink/5 flex items-center justify-center gap-2"
                            >
                                <Clock size={16} /> Coming Soon
                            </button>
                        ) : (
                            <div className="w-full py-4 bg-stone/5 border border-ink/10 rounded-full text-center font-mono text-sm font-bold text-ink/60 uppercase tracking-widest">
                                Owner View (Pre-Launch)
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="mb-2">
                             <span className="font-mono text-5xl font-bold text-ink">{formatCurrency(project.raised)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-base font-sans text-ink/70 font-medium">pledged of {formatCurrency(project.goal)} goal</span>
                            <span className="text-base font-bold font-mono text-ink">{percent}%</span>
                        </div>
                        
                        <div className="w-full h-2 bg-ink/10 mb-10 rounded-full overflow-hidden">
                            <div className="h-full bg-ink" style={{ width: `${Math.min(100, percent)}%` }}></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 mb-10 border-t-2 border-ink/5 pt-8">
                            <div className="flex flex-col">
                                <span className="font-bold text-3xl font-sans text-ink">{project.backers}</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-ink/60 mt-2 font-bold">Backers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-3xl font-sans text-ink">{project.daysLeft}</span>
                                <span className="text-xs font-mono uppercase tracking-widest text-ink/60 mt-2 font-bold">Days Left</span>
                            </div>
                        </div>

                        {!isOwner ? (
                            <button 
                                onClick={onDonate}
                                className="w-full bg-accent text-paper py-5 rounded-full font-mono text-base font-bold uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Back this Project
                            </button>
                        ) : (
                            <div className="w-full py-4 bg-stone/5 border border-ink/10 rounded-full text-center font-mono text-sm font-bold text-ink/60 uppercase tracking-widest">
                                Owner View
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* IDA Details - Clean Layout */}
            <div className="py-8 border-t border-b border-ink/10">
                <h4 className="font-sans font-bold text-xl mb-6 text-ink">IDA Configuration</h4>
                <div className="space-y-6 font-mono text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-ink/60 uppercase tracking-wide text-xs font-bold">Contract</span>
                        <div 
                            className="flex items-center space-x-2 text-ink hover:text-accent cursor-pointer transition-colors group bg-stone/5 px-3 py-1 rounded-sm border border-transparent hover:border-ink/20"
                            onClick={() => copyToClipboard(project.ida?.contractAddress || '', 'Contract address copied')}
                        >
                            <span className="font-bold">{project.ida?.contractAddress ? shortenAddress(project.ida.contractAddress) : 'N/A'}</span>
                            <Copy size={14} className="opacity-50 group-hover:opacity-100 transition-opacity"/>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-ink/60 uppercase tracking-wide text-xs font-bold">Owner</span>
                        <div 
                            className="flex items-center space-x-2 text-ink hover:text-accent cursor-pointer transition-colors group bg-stone/5 px-3 py-1 rounded-sm border border-transparent hover:border-ink/20"
                            onClick={() => copyToClipboard(project.ida?.ownerAddress || '', 'Owner address copied')}
                        >
                            <span className="font-bold">{project.ida?.ownerAddress ? shortenAddress(project.ida.ownerAddress) : 'N/A'}</span>
                            <Copy size={14} className="opacity-50 group-hover:opacity-100 transition-opacity"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Donors - Clean List */}
            {/* Hide recent donors for PRE_LAUNCH since there are none */}
            {!isPreLaunch && (
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="font-sans font-bold text-xl text-ink">Recent Support</h4>
                        <button 
                            onClick={onViewDonationHistory}
                            className="text-xs font-mono font-bold text-ink/60 hover:text-accent uppercase tracking-widest transition-colors border-b border-transparent hover:border-accent"
                        >
                            View All
                        </button>
                    </div>
                    
                    <div className="space-y-5">
                        {project.donations && project.donations.slice(0, 5).map((donation) => (
                            <div key={donation.id} className="flex items-center justify-between group p-2 hover:bg-stone/5 rounded-sm transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-stone/20 overflow-hidden border border-transparent group-hover:border-ink/10 transition-colors">
                                        <img src={donation.avatar} className="w-full h-full object-cover" alt="donor"/>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-ink group-hover:text-accent transition-colors">{donation.donor}</span>
                                        <span className="text-xs text-ink/60 font-mono">{donation.date}</span>
                                    </div>
                                </div>
                                <span className="font-mono text-sm text-ink font-bold group-hover:text-accent transition-colors">+{formatCurrency(donation.amount)}</span>
                            </div>
                        ))}
                        {(!project.donations || project.donations.length === 0) && (
                            <p className="text-sm text-ink/60 italic">No donations yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
