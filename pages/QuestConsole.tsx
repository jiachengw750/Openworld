
import React, { useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
    ArrowLeft, Clock, FileText, Upload, CheckCircle,
    Briefcase, LifeBuoy, User, ExternalLink,
    History, AlertCircle, Check, Edit3, DollarSign,
    Calendar, MessageSquare, Trash2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { BidModal } from '../components/modals/BidModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { QuestFormData } from '../components/modals/EditQuestModal';

// --- Types ---

type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

interface SubmissionRecord {
    version: number;
    files: { name: string; size?: string }[];
    message: string;
    submittedAt: string;
    status: SubmissionStatus;
    feedback?: string;
}

const MOCK_SOLVER_PROFILE = {
    name: "Dr. Sarah Lin",
    role: "Visual Computation Lead",
    institution: "MIT Media Lab",
    avatar: "https://i.pravatar.cc/150?u=30",
    bio: "Specializing in molecular visualization and 3D rendering of complex biological structures.",
    researchFields: ['Molecular Bio', '3D Visualization', 'Python'],
};

const MOCK_MAKER_PROFILE = {
    name: "Dr. Aris Kothari",
    role: "Principal Investigator",
    institution: "Perimeter Institute",
    avatar: "https://i.pravatar.cc/150?u=3",
    bio: "Leading researcher in quantum biology and neural coherence.",
    researchFields: ['Quantum Physics', 'Neuroscience', 'Consciousness'],
};

// Mock History Templates
const MOCK_HISTORY_REJECTED: SubmissionRecord[] = [
    {
        version: 1,
        files: [
            { name: 'render_preview_v1.png', size: '2.4 MB' },
            { name: 'methodology_draft.pdf', size: '1.1 MB' }
        ],
        message: "Initial draft based on the PDB file provided.",
        submittedAt: "2 days ago",
        status: 'REJECTED',
        feedback: "The visualization style doesn't match our lab's publication standards. Please use the 'Viridis' color map."
    }
];

const MOCK_HISTORY_UNDER_REVIEW: SubmissionRecord[] = [
    {
        version: 1,
        files: [
            { name: 'final_render_v1.png', size: '3.2 MB' },
            { name: 'methodology_complete.pdf', size: '1.8 MB' }
        ],
        message: "Completed render using the Viridis color map as requested.",
        submittedAt: "3 hours ago",
        status: 'PENDING'
    }
];

const MOCK_HISTORY_COMPLETED: SubmissionRecord[] = [
    {
        version: 1,
        files: [
            { name: 'final_render_v1.png', size: '3.2 MB' },
            { name: 'methodology_complete.pdf', size: '1.8 MB' }
        ],
        message: "Completed render using the Viridis color map as requested.",
        submittedAt: "1 week ago",
        status: 'ACCEPTED',
        feedback: "Excellent work! Funds released."
    }
];

const getInitialHistory = (status?: string): SubmissionRecord[] => {
    switch (status) {
        case 'REJECTED': return MOCK_HISTORY_REJECTED;
        case 'UNDER_REVIEW': return MOCK_HISTORY_UNDER_REVIEW;
        case 'COMPLETED': return MOCK_HISTORY_COMPLETED;
        case 'IN_PROGRESS':
        case 'BIDDING':
        default: return [];
    }
};

export const QuestConsole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Navigation State
    const [role] = useState<'MAKER' | 'SOLVER'>((location.state as any)?.role || 'SOLVER');
    const initialStatus = (location.state as any)?.initialStatus || 'IN_PROGRESS';

    // Quest Info State (Full form data for editing)
    const [quest, setQuest] = useState<QuestFormData>({
        title: (location.state as any)?.title || 'High-Fidelity 3D Rendering of Molecular Docking Interactions',
        subject: 'Computer',
        tags: ['Python', 'C++', 'Optimization', 'Machine Learning'],
        description: "We are looking for a researcher with strong optimization background to implement a novel heuristic algorithm for solving large-scale convex optimization problems. The task involves coding the algorithm in Python/C++, comparing it with standard solvers (CVXPY, Gurobi) on a provided dataset, and writing a technical report on the convergence properties.",
        attachments: [],
        deliverables: "<ul><li>Python codebase including all scripts</li><li>Technical Report (PDF)</li><li>Experimental results (CSV)</li></ul>",
        acceptanceCriteria: "<ul><li>Code must run on Python 3.9+ without errors</li><li>Model accuracy must exceed 85% on validation set</li><li>Documentation must be clear and complete</li></ul>",
        budget: (location.state as any)?.value || 5000,
        currency: (location.state as any)?.currency || 'USDC',
        deadline: '2024-02-15',
        deliveryTime: '30 days',
        ipRights: 'OPEN_SOURCE',
    });

    // Modal States
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    // Bid State for Solver (when BIDDING)
    const [myBidData, setMyBidData] = useState<any>(
        initialStatus === 'BIDDING' ? {
            amount: ((location.state as any)?.value || 5000).toString(),
            duration: '14',
            proposal: 'I can complete this task efficiently using my expertise in optimization algorithms...',
            contact: 'researcher@institute.edu',
            isPublic: false
        } : null
    );

    // Core Workflow State
    const [history, setHistory] = useState<SubmissionRecord[]>(() => getInitialHistory(initialStatus));
    const [workflowStatus, setWorkflowStatus] = useState<'BIDDING' | 'IN_PROGRESS' | 'COMPLETED'>(
        initialStatus === 'COMPLETED' ? 'COMPLETED' :
            initialStatus === 'BIDDING' ? 'BIDDING' : 'IN_PROGRESS'
    );

    // UI State
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newCommitMessage, setNewCommitMessage] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Computed Properties
    const latestSubmission = history.length > 0 ? history[history.length - 1] : null;
    const isPendingReview = latestSubmission?.status === 'PENDING';
    const nextVersion = history.length + 1;

    // Display Status
    const displayStatus = React.useMemo(() => {
        if (workflowStatus === 'COMPLETED') return { label: 'COMPLETED', style: 'bg-green-100 text-green-700 border-green-200' };
        if (workflowStatus === 'BIDDING') return { label: 'BIDDING', style: 'bg-purple-50 text-purple-700 border-purple-200' };

        if (latestSubmission) {
            if (latestSubmission.status === 'REJECTED') return { label: 'REJECTED', style: 'bg-red-50 text-red-700 border-red-200' };
            if (latestSubmission.status === 'PENDING') return { label: 'UNDER REVIEW', style: 'bg-amber-50 text-amber-700 border-amber-200' };
        }

        return { label: 'IN PROGRESS', style: 'bg-blue-50 text-blue-700 border-blue-200' };
    }, [workflowStatus, latestSubmission]);

    // --- Handlers ---

    const handleWithdrawProposal = () => {
        setIsWithdrawModalOpen(true);
    };

    const confirmWithdrawProposal = () => {
        setIsWithdrawModalOpen(false);
        showToast('Proposal withdrawn successfully');
        navigate('/workspace');
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setNewFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    };

    const handleSubmit = () => {
        if (newFiles.length === 0) {
            showToast("Please upload at least one file.");
            return;
        }
        const newRecord: SubmissionRecord = {
            version: nextVersion,
            files: newFiles.map(f => ({ name: f.name, size: 'Unknown' })),
            message: newCommitMessage,
            submittedAt: 'Just now',
            status: 'PENDING'
        };
        setHistory(prev => [...prev, newRecord]);
        setNewFiles([]);
        setNewCommitMessage('');
        showToast("Version " + nextVersion + " submitted successfully.");
    };

    const handleOpenRejectModal = () => {
        if (!rejectReason.trim()) {
            showToast("Please provide a rejection reason.");
            return;
        }
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = () => {
        setIsRejectModalOpen(false);
        setHistory(prev => prev.map((item, idx) =>
            idx === prev.length - 1 ? { ...item, status: 'REJECTED', feedback: rejectReason } : item
        ));
        setRejectReason('');
        showToast("Submission rejected.");
    };

    const handleConfirmAccept = () => {
        setIsAcceptModalOpen(false);
        setHistory(prev => prev.map((item, idx) =>
            idx === prev.length - 1 ? { ...item, status: 'ACCEPTED', feedback: 'Approved. Funds released.' } : item
        ));
        setWorkflowStatus('COMPLETED');
        showToast("Submission accepted! Contract completed.");
    };

    const handleBidSubmit = (bidData: any) => {
        setMyBidData(bidData);
        showToast("Proposal updated successfully.");
    };

    const handleContactSupport = () => {
        window.location.href = `mailto:support@opensci.io?subject=Issue with Quest ${id}`;
    };

    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

    const getIpRightsLabel = (rights: string | null) => {
        switch (rights) {
            case 'WORK_FOR_HIRE': return 'Work for Hire';
            case 'OPEN_SOURCE': return 'Open Source';
            case 'ATTRIBUTION': return 'Attribution';
            default: return 'Not Set';
        }
    };

    // --- Timeline Renderer ---
    const renderTimelineItem = (record: SubmissionRecord, isLatest: boolean) => {
        const isRejected = record.status === 'REJECTED';
        const isAccepted = record.status === 'ACCEPTED';

        return (
            <div key={record.version} className="relative pl-10 pb-8 last:pb-0">
                {!isLatest && <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-ink/10"></div>}

                <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-paper ${isRejected ? 'border-red-500 text-red-500' :
                    isAccepted ? 'border-green-600 text-green-600' :
                        'border-ink/20 text-ink/40'
                    }`}>
                    {isRejected ? <AlertCircle size={16} /> :
                        isAccepted ? <CheckCircle size={16} /> :
                            <History size={16} />}
                </div>

                <div className={`border rounded-sm ${isRejected ? 'border-red-200 bg-red-50/10' :
                    isAccepted ? 'border-green-200 bg-green-50/10' :
                        'border-ink/10 bg-paper'
                    }`}>
                    <div className="flex justify-between items-start p-4 border-b border-ink/5 bg-stone/5">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-ink">Version {record.version}</span>
                                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${isRejected ? 'bg-red-100 text-red-700 border-red-200' :
                                    isAccepted ? 'bg-green-100 text-green-700 border-green-200' :
                                        'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                    {record.status}
                                </span>
                            </div>
                            <span className="text-xs text-ink/40 font-mono mt-1 block">{record.submittedAt}</span>
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="text-sm text-ink/70 italic bg-stone/5 p-3 rounded-sm border border-ink/5">
                            "{record.message}"
                        </div>

                        <div className="space-y-2">
                            {record.files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between text-xs font-mono bg-white border border-ink/10 p-2 rounded-sm">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-ink/40" />
                                        <span>{f.name}</span>
                                    </div>
                                    <span className="text-ink/30">{f.size || 'N/A'}</span>
                                </div>
                            ))}
                        </div>

                        {record.feedback && (
                            <div className={`p-3 rounded-sm border text-sm ${isRejected ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'
                                }`}>
                                <span className="font-bold uppercase text-xs tracking-wider block mb-1 opacity-70">
                                    {isRejected ? 'Rejection Reason' : 'Feedback'}
                                </span>
                                {record.feedback}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // --- Main Render ---
    return (
        <div className="min-h-screen bg-paper pb-24">

            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/workspace" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest mb-6 w-fit">
                        <ArrowLeft size={14} className="mr-2" /> Back to Workspace
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest border ${displayStatus.style}`}>
                                    {displayStatus.label}
                                </span>
                                <span className="font-mono text-xs font-bold text-ink/40 uppercase tracking-widest">
                                    {role === 'MAKER' ? 'Management Console' : 'Delivery Console'}
                                </span>
                            </div>
                            <h1 className="font-sans text-3xl md:text-4xl font-bold text-ink mb-2 max-w-3xl leading-tight">
                                {quest.title}
                            </h1>
                        </div>

                        <div className="flex gap-8 border-t lg:border-t-0 border-ink/10 pt-6 lg:pt-0">
                            <div>
                                <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Total Amount</span>
                                <span className="font-sans text-2xl font-bold text-ink">{formatNumber(quest.budget)} {quest.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Task Details Section (Read-only with Edit button) */}
                    <div className="bg-paper border border-ink/10 rounded-sm overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-ink/10 bg-stone/5">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Briefcase size={18} className="text-ink/40" /> Task Details
                            </h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-2">Description</label>
                                <div
                                    className="text-sm text-ink/70 leading-relaxed line-clamp-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                                    dangerouslySetInnerHTML={{ __html: quest.description }}
                                />
                                <Link
                                    to={`/quest/${id}`}
                                    state={{ role }}
                                    className="text-xs font-mono font-bold text-accent mt-3 flex items-center gap-1 hover:underline"
                                >
                                    <ExternalLink size={12} /> View Full Details
                                </Link>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-2">Required Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {quest.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-stone/5 border border-ink/10 rounded-sm text-[10px] font-mono font-bold uppercase text-ink/70">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Info Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-ink/10">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-1 flex items-center gap-1">
                                        <DollarSign size={10} /> Budget
                                    </label>
                                    <span className="font-mono font-bold text-ink text-sm">{formatNumber(quest.budget)} {quest.currency}</span>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-1 flex items-center gap-1">
                                        <Calendar size={10} /> Deadline
                                    </label>
                                    <span className="font-mono font-bold text-ink text-sm">{quest.deadline}</span>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-1 flex items-center gap-1">
                                        <Clock size={10} /> Delivery
                                    </label>
                                    <span className="font-mono font-bold text-ink text-sm">{quest.deliveryTime}</span>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-1">IP Rights</label>
                                    <span className="font-mono font-bold text-ink text-sm">{getIpRightsLabel(quest.ipRights)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BIDDING State: My Proposal Section (Solver Only) */}
                    {role === 'SOLVER' && workflowStatus === 'BIDDING' && myBidData && (
                        <div className="bg-blue-50/30 border border-blue-200 rounded-sm overflow-hidden">
                            <div className="flex justify-between items-center p-6 border-b border-blue-200 bg-blue-50/50">
                                <h2 className="font-bold text-lg flex items-center gap-2 text-blue-800">
                                    <MessageSquare size={18} /> My Proposal
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsBidModalOpen(true)}
                                        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors px-3 py-1.5 border border-blue-300 rounded-sm hover:border-blue-500 bg-white"
                                    >
                                        <Edit3 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={handleWithdrawProposal}
                                        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors px-3 py-1.5 border border-red-300 rounded-sm hover:border-red-500 bg-white hover:bg-red-50"
                                    >
                                        <Trash2 size={12} /> Withdraw
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 mb-1">My Quote</label>
                                        <span className="font-mono font-bold text-lg text-blue-800">{formatNumber(parseInt(myBidData.amount))} {quest.currency}</span>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 mb-1">Est. Duration</label>
                                        <span className="font-mono font-bold text-lg text-blue-800">{myBidData.duration} Days</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 mb-1">Plan</label>
                                    <p className="text-sm text-blue-800/80 bg-white p-3 rounded-sm border border-blue-100" dangerouslySetInnerHTML={{ __html: myBidData.proposal }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery Timeline Section */}
                    {workflowStatus !== 'BIDDING' && (
                        <div className="bg-paper border border-ink/10 rounded-sm overflow-hidden">
                            <div className="p-6 border-b border-ink/10 bg-stone/5">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <History size={18} className="text-ink/40" /> Delivery Timeline
                                </h2>
                            </div>
                            <div className="p-6">
                                {/* History */}
                                {history.length > 0 ? (
                                    <div className="mb-8">
                                        {history.map((record, idx) => renderTimelineItem(record, idx === history.length - 1 && role === 'MAKER'))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-ink/40 font-mono text-sm">
                                        No submissions yet
                                    </div>
                                )}

                                {/* SOLVER: Upload New Version */}
                                {role === 'SOLVER' && workflowStatus !== 'COMPLETED' && !isPendingReview && (
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-ink bg-ink text-paper flex items-center justify-center z-10 shadow-lg">
                                            <span className="font-mono font-bold text-xs">{nextVersion}</span>
                                        </div>

                                        <div className="bg-white border-2 border-dashed border-ink/20 rounded-sm p-6">
                                            <h3 className="font-bold text-base text-ink mb-4">New Submission (Version {nextVersion})</h3>

                                            <div
                                                className="border border-ink/10 bg-stone/5 rounded-sm p-6 text-center cursor-pointer hover:border-accent hover:bg-ink/5 transition-colors mb-4"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
                                                <Upload size={20} className="mx-auto text-ink/30 mb-2" />
                                                <span className="font-mono text-xs font-bold text-ink/60 uppercase tracking-widest block">Upload Deliverables</span>
                                                {newFiles.length > 0 && (
                                                    <div className="mt-3 text-left space-y-2">
                                                        {newFiles.map((f, i) => (
                                                            <div key={i} className="flex items-center gap-2 text-xs font-mono bg-white p-2 rounded-sm border border-ink/10">
                                                                <CheckCircle size={12} className="text-green-600" /> {f.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <textarea
                                                className="w-full bg-surface border border-ink/20 p-3 font-sans text-sm rounded-sm h-20 focus:outline-none focus:border-accent mb-4"
                                                placeholder="Describe changes in this version..."
                                                value={newCommitMessage}
                                                onChange={(e) => setNewCommitMessage(e.target.value)}
                                            />

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="bg-ink text-paper px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
                                                >
                                                    Submit Version {nextVersion}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* MAKER: Review Submission */}
                                {role === 'MAKER' && workflowStatus !== 'COMPLETED' && isPendingReview && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-sm p-6">
                                        <h3 className="font-bold text-base text-ink mb-2">Review Pending Submission</h3>
                                        <p className="text-ink/60 text-sm mb-4">Review Version {history.length} above.</p>

                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setIsAcceptModalOpen(true)}
                                                className="w-full bg-green-600 text-white py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-green-700 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={16} /> Accept & Release Funds
                                            </button>

                                            <div className="pt-3 border-t border-amber-200">
                                                <label className="block text-xs font-bold text-red-700 mb-2">Request Changes</label>
                                                <textarea
                                                    className="w-full border border-red-200 bg-white p-3 text-sm rounded-sm focus:outline-none focus:border-red-400 mb-3 h-20"
                                                    placeholder="Explain what needs to be fixed..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                />
                                                <button
                                                    onClick={handleOpenRejectModal}
                                                    className="w-full border border-red-200 text-red-700 bg-red-50 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-100"
                                                >
                                                    Reject Submission
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Waiting States */}
                                {workflowStatus !== 'COMPLETED' && (
                                    (role === 'SOLVER' && isPendingReview) || (role === 'MAKER' && !isPendingReview && history.length > 0)
                                ) && (
                                        <div className="bg-stone/5 border border-dashed border-ink/20 p-6 rounded-sm text-center">
                                            <Clock size={20} className="mx-auto text-ink/30 mb-2" />
                                            <span className="font-mono text-xs font-bold uppercase text-ink/40 tracking-widest">
                                                {role === 'SOLVER' ? 'Waiting for Maker Review...' : 'Waiting for Solver to Upload...'}
                                            </span>
                                        </div>
                                    )}

                                {workflowStatus === 'COMPLETED' && (
                                    <div className="bg-green-50 border border-green-200 p-6 rounded-sm text-center">
                                        <Check size={24} className="mx-auto text-green-600 mb-2" />
                                        <h3 className="font-bold text-green-800 mb-1">Project Completed</h3>
                                        <p className="text-green-700/80 text-sm">All milestones achieved and funds have been transferred.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Profile Card */}
                    <div className="bg-paper border border-ink/10 p-6 rounded-sm">
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User size={16} className="text-ink/40" />
                            {role === 'MAKER' ? 'Solver Profile' : 'Publisher Profile'}
                        </h4>

                        {(() => {
                            const profile = role === 'MAKER' ? MOCK_SOLVER_PROFILE : MOCK_MAKER_PROFILE;
                            return (
                                <>
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={profile.avatar} alt={profile.name} className="w-14 h-14 rounded-full object-cover border border-ink/10" />
                                        <div>
                                            <h3 className="font-sans font-bold text-base text-ink leading-tight">{profile.name}</h3>
                                            <p className="text-xs font-mono text-ink/60">{profile.role}</p>
                                            <p className="text-xs font-mono text-ink/40">{profile.institution}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-ink/70 leading-relaxed mb-4">{profile.bio}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {profile.researchFields.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-stone/5 border border-ink/5 rounded-sm text-[10px] font-mono font-bold text-ink/70">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3 pt-4 border-t border-ink/5">
                                        <button className="w-full text-xs font-mono font-bold uppercase tracking-widest text-ink/60 hover:text-ink transition-colors flex items-center justify-center gap-2 py-2 border border-dashed border-ink/10 rounded-sm hover:border-ink/20">
                                            View Full Profile <ExternalLink size={12} />
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `mailto:contact@${profile.name.replace(/\s+/g, '').toLowerCase()}.edu`}
                                            className="w-full text-xs font-mono font-bold uppercase tracking-widest bg-ink text-paper hover:bg-ink/90 transition-colors flex items-center justify-center gap-2 py-2.5 rounded-sm shadow-lg"
                                        >
                                            Contact <MessageSquare size={12} />
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>

                    {/* Contract Details */}
                    <div className="bg-paper border border-ink/10 p-6 rounded-sm">
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Briefcase size={16} className="text-ink/40" /> Contract Details
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-ink/5 pb-2">
                                <span className="text-ink/60">ID</span>
                                <span className="font-mono">{id}</span>
                            </div>
                            <div className="flex justify-between border-b border-ink/5 pb-2">
                                <span className="text-ink/60">Escrow</span>
                                <span className="font-mono font-bold text-green-600">Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ink/60">IP Rights</span>
                                <span className="font-mono">{getIpRightsLabel(quest.ipRights)}</span>
                            </div>

                        </div>
                    </div>
                </div>



            </div>

            {/* Accept Confirmation Modal */}
            {isAcceptModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-paper w-full max-w-md rounded-sm shadow-2xl border border-ink/10 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-ink/10 flex items-center justify-between">
                            <h2 className="font-sans text-xl font-bold text-ink">Accept Submission</h2>
                            <button 
                                onClick={() => setIsAcceptModalOpen(false)}
                                className="p-1 hover:bg-stone/10 rounded-sm text-ink/40 hover:text-ink transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-sm">
                                <CheckCircle size={24} className="text-green-600 shrink-0" />
                                <p className="text-sm text-green-800">
                                    Are you sure you want to accept this submission? Funds will be released to the solver.
                                </p>
                            </div>
                            
                            {latestSubmission && (
                                <div className="bg-stone/5 border border-ink/5 p-4 rounded-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-mono text-sm font-bold text-ink">Version {latestSubmission.version}</span>
                                        <span className="text-xs text-ink/40 font-mono">{latestSubmission.submittedAt}</span>
                                    </div>
                                    <p className="text-sm text-ink/60 italic">"{latestSubmission.message}"</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Actions */}
                        <div className="p-6 border-t border-ink/10 flex gap-3">
                            <button
                                onClick={() => setIsAcceptModalOpen(false)}
                                className="flex-1 py-3 bg-paper border border-ink/10 text-ink rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAccept}
                                className="flex-1 py-3 bg-green-600 text-white rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-green-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-paper w-full max-w-md rounded-sm shadow-2xl border border-ink/10 animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-ink/10 flex items-center justify-between">
                            <h2 className="font-sans text-xl font-bold text-ink">Reject Submission</h2>
                            <button 
                                onClick={() => setIsRejectModalOpen(false)}
                                className="p-1 hover:bg-stone/10 rounded-sm text-ink/40 hover:text-ink transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-sm">
                                <AlertCircle size={24} className="text-red-600 shrink-0" />
                                <p className="text-sm text-red-800">
                                    Are you sure you want to reject this submission? The solver will be notified with your feedback.
                                </p>
                            </div>
                            
                            <div className="bg-stone/5 border border-ink/5 p-4 rounded-sm">
                                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-2">Rejection Reason</label>
                                <p className="text-sm text-ink/70">{rejectReason}</p>
                            </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="p-6 border-t border-ink/10 flex gap-3">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="flex-1 py-3 bg-paper border border-ink/10 text-ink rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReject}
                                className="flex-1 py-3 bg-red-600 text-white rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BidModal
                isOpen={isBidModalOpen}
                onClose={() => setIsBidModalOpen(false)}
                questTitle={quest.title}
                maxReward={quest.budget}
                currency={quest.currency}
                exchangeRate={1}
                onBidSubmit={handleBidSubmit}
                initialData={myBidData}
            />

            <DeleteConfirmationModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onConfirm={confirmWithdrawProposal}
                title="Withdraw Proposal"
                message="Are you sure you want to withdraw your proposal? This action cannot be undone and you will need to submit a new bid."
            />

            {/* Floating Support Layout - Sticky to avoid footer overlap */}
            <div className="sticky bottom-0 w-full flex justify-end pr-8 pb-8 z-50 pointer-events-none">
                <button
                    onClick={handleContactSupport}
                    className="w-14 h-14 bg-ink text-paper rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform ring-4 ring-paper pointer-events-auto"
                    title="Contact Support"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                        <g clipPath="url(#clip0_698_936)">
                            <path d="M4 7.9999V5.3699C4.00781 4.85293 4.11755 4.34259 4.32294 3.8681C4.52832 3.39362 4.82532 2.96433 5.1969 2.60482C5.56848 2.24532 6.00735 1.96266 6.48836 1.77306C6.96936 1.58346 7.48306 1.49063 8 1.4999C8.51694 1.49063 9.03064 1.58346 9.51164 1.77306C9.99265 1.96266 10.4315 2.24532 10.8031 2.60482C11.1747 2.96433 11.4717 3.39362 11.6771 3.8681C11.8824 4.34259 11.9922 4.85293 12 5.3699V7.9999" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.5 6.49988H3.5C3.63261 6.49988 3.75979 6.55256 3.85355 6.64633C3.94732 6.74009 4 6.86727 4 6.99988V9.99988C4 10.1325 3.94732 10.2597 3.85355 10.3534C3.75979 10.4472 3.63261 10.4999 3.5 10.4999H2.5C2.23478 10.4999 1.98043 10.3945 1.79289 10.207C1.60536 10.0194 1.5 9.7651 1.5 9.49988V7.49988C1.5 7.23466 1.60536 6.98031 1.79289 6.79277C1.98043 6.60524 2.23478 6.49988 2.5 6.49988Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.5 10.4999H12.5C12.3674 10.4999 12.2402 10.4472 12.1464 10.3534C12.0527 10.2597 12 10.1325 12 9.99988V6.99988C12 6.86727 12.0527 6.74009 12.1464 6.64633C12.2402 6.55256 12.3674 6.49988 12.5 6.49988H13.5C13.7652 6.49988 14.0196 6.60524 14.2071 6.79277C14.3946 6.98031 14.5 7.23466 14.5 7.49988V9.49988C14.5 9.7651 14.3946 10.0194 14.2071 10.207C14.0196 10.3945 13.7652 10.4999 13.5 10.4999Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 13.2499C10.5304 13.2499 11.0391 13.0392 11.4142 12.6641C11.7893 12.289 12 11.7803 12 11.2499V8.99988" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 13.2499C10 13.5814 9.8683 13.8994 9.63388 14.1338C9.39946 14.3682 9.08152 14.4999 8.75 14.4999H7.25C6.91848 14.4999 6.60054 14.3682 6.36612 14.1338C6.1317 13.8994 6 13.5814 6 13.2499C6 12.9184 6.1317 12.6004 6.36612 12.366C6.60054 12.1316 6.91848 11.9999 7.25 11.9999H8.75C9.08152 11.9999 9.39946 12.1316 9.63388 12.366C9.8683 12.6004 10 12.9184 10 13.2499Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_698_936">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>

        </div>
    );
};
