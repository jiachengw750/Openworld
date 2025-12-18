
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
    ArrowLeft, Clock, FileText, Upload, CheckCircle, 
    AlertTriangle, Download, Briefcase, LifeBuoy, User, ExternalLink,
    History, AlertCircle, ChevronDown, Check, Mail, X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

// --- Types ---

type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

interface SubmissionRecord {
    version: number;
    files: { name: string; size?: string }[];
    message: string;
    submittedAt: string;
    status: SubmissionStatus;
    feedback?: string; // Rejection reason or Acceptance note
}

const MOCK_SOLVER_PROFILE = {
    name: "Dr. Sarah Lin",
    role: "Visual Computation Lead",
    institution: "MIT Media Lab",
    email: "sarah.lin@mit.edu",
    avatar: "https://i.pravatar.cc/150?u=30",
    bio: "Specializing in molecular visualization and 3D rendering of complex biological structures. Over 10 years of experience integrating Python scripting with Blender for accurate scientific representation.",
    researchFields: ['Molecular Bio', '3D Visualization', 'Python'],
    subjects: ['Biology', 'Computer Science']
};

const MOCK_MAKER_PROFILE = {
    name: "Dr. Aris Kothari",
    role: "Principal Investigator",
    institution: "Perimeter Institute",
    email: "aris.kothari@perimeter.ca",
    avatar: "https://i.pravatar.cc/150?u=3",
    bio: "Leading researcher in quantum biology and neural coherence. Exploring the intersection of quantum mechanics and consciousness through the Orch OR theory. My lab focuses on microtubule resonance.",
    researchFields: ['Quantum Physics', 'Neuroscience', 'Consciousness'],
    subjects: ['Physics', 'Biology']
};

// Initial Mock History: Version 1 was rejected
const INITIAL_HISTORY: SubmissionRecord[] = [
    {
        version: 1,
        files: [
            { name: 'render_preview_v1.png', size: '2.4 MB' },
            { name: 'methodology_draft.pdf', size: '1.1 MB' }
        ],
        message: "Initial draft based on the PDB file provided. Note: I used the default color scheme for now.",
        submittedAt: "2 days ago",
        status: 'REJECTED',
        feedback: "The visualization style doesn't match our lab's publication standards. Please use the 'Viridis' color map and ensure the background is transparent (Alpha channel). See attached style guide."
    }
];

// Mock History for Pending Review state (Task q5)
const PENDING_REVIEW_HISTORY: SubmissionRecord[] = [
    {
        version: 1,
        files: [
            { name: 'simulation_results_raw.csv', size: '45 MB' },
            { name: 'analysis_report_final.pdf', size: '2.8 MB' },
            { name: 'quantum_circuit_diagrams.png', size: '1.2 MB' }
        ],
        message: "Here are the optimization results. I achieved a 15% reduction in error rates compared to the baseline surface code. Please check the PDF for the full breakdown.",
        submittedAt: "5 mins ago",
        status: 'PENDING'
    }
];

export const QuestConsole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { showToast } = useToast();
    
    // Derived state from navigation
    const [role] = useState<'MAKER' | 'SOLVER'>((location.state as any)?.role || 'SOLVER');
    
    // Core Logic State
    const [history, setHistory] = useState<SubmissionRecord[]>(id === 'q5' ? PENDING_REVIEW_HISTORY : INITIAL_HISTORY);
    const [workflowStatus, setWorkflowStatus] = useState<'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');

    // UI State for New Submission / Review
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newCommitMessage, setNewCommitMessage] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<'SUBMIT' | 'ACCEPT' | 'REJECT' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Computed Properties
    const latestSubmission = history.length > 0 ? history[history.length - 1] : null;
    const isPendingReview = latestSubmission?.status === 'PENDING';
    const nextVersion = history.length + 1;

    // Quest Info
    const quest = {
        id: id || '101',
        title: (location.state as any)?.title || 'Heuristic Solution and Experimental Comparison of Convex Optimization Problems',
        budget: (location.state as any)?.value ? new Intl.NumberFormat('en-US').format((location.state as any).value) + ' ' + ((location.state as any)?.currency || 'USDC') : '200,000 SCI',
    };

    // --- Handlers ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setNewFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    };

    const triggerVerification = (type: typeof pendingAction) => {
        if (type === 'SUBMIT' && newFiles.length === 0) {
            showToast("Please upload at least one file.");
            return;
        }
        if (type === 'REJECT' && !rejectReason.trim()) {
            showToast("Please provide a rejection reason.");
            return;
        }
        setPendingAction(type);
        setIsPasswordOpen(true);
    };

    const executeAction = () => {
        setIsPasswordOpen(false);
        setTimeout(() => {
            if (pendingAction === 'SUBMIT') {
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
            } else if (pendingAction === 'REJECT') {
                setHistory(prev => prev.map((item, idx) => 
                    idx === prev.length - 1 ? { ...item, status: 'REJECTED', feedback: rejectReason } : item
                ));
                setRejectReason('');
                showToast("Submission rejected.");
            } else if (pendingAction === 'ACCEPT') {
                setHistory(prev => prev.map((item, idx) => 
                    idx === prev.length - 1 ? { ...item, status: 'ACCEPTED', feedback: 'Approved. Funds released.' } : item
                ));
                setWorkflowStatus('COMPLETED');
                showToast("Submission accepted! Contract completed.");
            }
            setPendingAction(null);
        }, 1000);
    };

    const handleSendEmail = (email: string) => {
        const subject = encodeURIComponent(`[OpenSci] Quest: ${quest.title}`);
        window.location.href = `mailto:${email}?subject=${subject}`;
    };

    // --- Timeline Renderer ---
    const renderTimelineItem = (record: SubmissionRecord, isLatest: boolean) => {
        const isRejected = record.status === 'REJECTED';
        const isAccepted = record.status === 'ACCEPTED';
        const isPending = record.status === 'PENDING';

        return (
            <div key={record.version} className="relative pl-10 pb-12 last:pb-0">
                {/* Connector Line */}
                <div className="absolute left-[17px] top-8 bottom-0 w-[1px] bg-ink/10"></div>
                
                {/* Node Icon */}
                <div className={`absolute left-0 top-0 w-9 h-9 rounded-full border-2 flex items-center justify-center z-10 bg-white ${
                    isRejected ? 'border-red-500 text-red-500' :
                    isAccepted ? 'border-green-600 text-green-600' :
                    'border-ink/20 text-ink/40'
                }`}>
                    {isRejected ? <AlertCircle size={18} /> :
                     isAccepted ? <CheckCircle size={18} /> :
                     <History size={18} />}
                </div>

                {/* Content Card */}
                <div className="bg-white border border-ink/10 rounded-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex items-baseline gap-3 p-5 border-b border-ink/5">
                        <span className="font-sans text-base font-bold text-ink">Version {record.version}</span>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                            isRejected ? 'bg-red-50 text-red-600 border-red-100' :
                            isAccepted ? 'bg-green-50 text-green-700 border-green-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                            {record.status}
                        </span>
                        <span className="text-[10px] text-ink/30 font-mono uppercase tracking-widest ml-auto">{record.submittedAt}</span>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-5">
                        <div className="text-sm text-ink/70 font-sans border border-ink/10 p-4 rounded-sm bg-stone/5">
                            "{record.message}"
                        </div>
                        
                        <div className="space-y-2">
                            {record.files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between text-xs font-mono bg-paper border border-ink/5 p-3 rounded-sm">
                                    <div className="flex items-center gap-3">
                                        <FileText size={14} className="text-ink/30"/>
                                        <span className="text-ink/80 font-bold">{f.name}</span>
                                    </div>
                                    <span className="text-ink/20">{f.size || 'N/A'}</span>
                                </div>
                            ))}
                        </div>

                        {/* Rejection Feedback */}
                        {record.feedback && isRejected && (
                            <div className="mt-6 border-t border-red-100 bg-red-50/50 -mx-6 -mb-6 p-6">
                                <span className="font-mono font-bold uppercase text-[10px] tracking-[0.2em] text-red-800 block mb-3 opacity-60">
                                    REASON FOR REJECTION
                                </span>
                                <p className="text-sm text-red-900/80 leading-relaxed font-medium">
                                    {record.feedback}
                                </p>
                            </div>
                        )}

                        {/* Acceptance Note */}
                        {record.feedback && isAccepted && (
                            <div className="mt-6 border-t border-green-100 bg-green-50/50 -mx-6 -mb-6 p-6">
                                <span className="font-mono font-bold uppercase text-[10px] tracking-[0.2em] text-green-800 block mb-2 opacity-60">
                                    APPROVAL NOTE
                                </span>
                                <p className="text-sm text-green-900/80 leading-relaxed">
                                    {record.feedback}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Header - Non-sticky as requested */}
            <div className="bg-white border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/workspace" className="flex items-center text-xs font-mono font-bold text-ink/40 hover:text-ink transition-colors uppercase tracking-widest mb-10 w-fit">
                        <ArrowLeft size={14} className="mr-2" /> BACK TO WORKSPACE
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-6 mb-4">
                                <span className="inline-flex items-center px-3 py-1 border border-blue-200 text-blue-600 bg-blue-50 text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm">
                                    IN PROGRESS
                                </span>
                                <div className="flex items-center text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/30">
                                    <span className="hover:text-ink cursor-pointer">DELIVERY</span>
                                    <span className="mx-3 opacity-50">/</span>
                                    <span className="text-ink">CONSOLE</span>
                                </div>
                            </div>
                            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black text-ink leading-none tracking-tight max-w-4xl">
                                {quest.title}
                            </h1>
                        </div>
                        
                        <div className="text-right min-w-[200px]">
                            <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ink/40 mb-2">TOTAL BUDGET</span>
                            <span className="font-mono text-3xl font-bold text-ink tracking-tight">{quest.budget}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    {/* Left: Main Action Area */}
                    <div className="lg:col-span-8">
                        
                        {/* History Timeline */}
                        <div className="mb-12">
                            {history.map((record, idx) => renderTimelineItem(record, idx === history.length - 1))}
                            
                            {/* Connector Line to Active Node */}
                            {workflowStatus !== 'COMPLETED' && (
                                <div className="relative pl-10 h-10">
                                    <div className="absolute left-[17px] top-0 bottom-0 w-[1px] bg-ink/10 border-l border-dashed border-ink/30"></div>
                                </div>
                            )}
                        </div>

                        {/* Current Action View */}
                        
                        {/* SOLVER VIEW: Upload New Version */}
                        {role === 'SOLVER' && workflowStatus !== 'COMPLETED' && !isPendingReview && (
                            <div className="relative pl-10 animate-in fade-in slide-in-from-bottom-2">
                                <div className="absolute left-0 top-0 w-9 h-9 rounded-full border-2 border-ink bg-ink text-paper flex items-center justify-center z-10 shadow-lg">
                                    <span className="font-mono font-bold text-xs">{nextVersion}</span>
                                </div>

                                <div className="bg-white border-2 border-dashed border-ink/20 rounded-sm p-10">
                                    <h3 className="font-bold text-2xl text-ink mb-6">New Submission</h3>
                                    
                                    <div 
                                        className="border border-ink/5 bg-stone/5 rounded-sm p-12 text-center cursor-pointer hover:border-accent hover:bg-stone/10 transition-all mb-8 group"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={20} className="text-ink/30" />
                                        </div>
                                        <span className="font-mono text-xs font-bold text-ink/60 uppercase tracking-widest block">Upload Deliverables</span>
                                        <span className="text-[10px] text-ink/30 font-mono mt-1 block">Drag and drop files or click to browse</span>
                                        
                                        {newFiles.length > 0 && (
                                            <div className="mt-8 text-left space-y-2 max-w-sm mx-auto">
                                                {newFiles.map((f, i) => (
                                                    <div key={i} className="flex items-center justify-between text-xs font-mono bg-white p-3 rounded-sm border border-ink/10">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle size={14} className="text-green-600"/> <span className="truncate max-w-[180px]">{f.name}</span>
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); setNewFiles(f => f.filter((_, idx) => idx !== i)); }} className="text-ink/30 hover:text-red-500 transition-colors">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-3">SUBMISSION MESSAGE</label>
                                        <textarea 
                                            className="w-full bg-paper border border-ink/10 p-5 font-sans text-sm rounded-sm h-32 focus:outline-none focus:border-accent transition-colors resize-none"
                                            placeholder="Provide technical context for this version..."
                                            value={newCommitMessage}
                                            onChange={(e) => setNewCommitMessage(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button 
                                            onClick={() => triggerVerification('SUBMIT')}
                                            className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Submit Version {nextVersion}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MAKER VIEW: Review Pending */}
                        {role === 'MAKER' && workflowStatus !== 'COMPLETED' && isPendingReview && (
                            <div className="relative pl-10 animate-in fade-in slide-in-from-bottom-2">
                                <div className="absolute left-0 top-0 w-9 h-9 rounded-full border-2 border-amber-500 bg-amber-50 text-amber-600 flex items-center justify-center z-10 shadow-lg animate-pulse">
                                    <Clock size={18} />
                                </div>

                                <div className="bg-white border-2 border-amber-100 rounded-sm p-10">
                                    <h3 className="font-bold text-2xl text-ink mb-2">Review Submission</h3>
                                    <p className="text-ink/60 text-base mb-10 leading-relaxed">Please evaluate the deliverables provided in Version {history.length}. Once approved, the escrowed funds will be released to the researcher.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button 
                                            onClick={() => triggerVerification('ACCEPT')}
                                            className="w-full bg-green-600 text-white py-5 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-3"
                                        >
                                            <CheckCircle size={20} /> Approve & Release
                                        </button>
                                        
                                        <div className="md:col-span-2 pt-6 mt-4 border-t border-ink/5">
                                            <label className="block text-[10px] font-mono font-bold text-red-800 uppercase tracking-widest mb-3">REQUEST CHANGES</label>
                                            <textarea 
                                                className="w-full border border-red-100 bg-red-50/20 p-5 text-sm rounded-sm focus:outline-none focus:border-red-400 mb-6 h-32 resize-none leading-relaxed"
                                                placeholder="Detail the necessary corrections..."
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            />
                                            <button 
                                                onClick={() => triggerVerification('REJECT')}
                                                className="w-full border border-red-200 text-red-700 bg-white py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-red-50 transition-colors"
                                            >
                                                Reject Submission
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        
                        {/* Profile Section */}
                        <div className="bg-white border border-ink/10 p-8 rounded-sm shadow-sm">
                            <div className="flex items-center gap-2 mb-8">
                                <User size={16} className="text-ink/40" />
                                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink/60">PUBLISHER PROFILE</h4>
                            </div>
                            
                            <div className="flex items-center gap-5 mb-8">
                                <img src={MOCK_MAKER_PROFILE.avatar} alt={MOCK_MAKER_PROFILE.name} className="w-16 h-16 rounded-full object-cover border border-ink/10 shadow-sm" />
                                <div>
                                    <h3 className="font-sans font-bold text-xl text-ink leading-tight">{MOCK_MAKER_PROFILE.name}</h3>
                                    <p className="text-xs font-mono text-ink/50 mt-1">{MOCK_MAKER_PROFILE.role}</p>
                                    <p className="text-xs font-mono text-ink/40 uppercase tracking-tight">{MOCK_MAKER_PROFILE.institution}</p>
                                </div>
                            </div>

                            <p className="text-sm text-ink/60 leading-relaxed mb-10 font-sans">
                                {MOCK_MAKER_PROFILE.bio}
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase text-ink/30 tracking-[0.1em] block mb-4">RESEARCH FIELDS</span>
                                    <div className="flex flex-wrap gap-2">
                                        {MOCK_MAKER_PROFILE.researchFields.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-stone/5 border border-ink/5 rounded-sm text-[10px] font-mono font-bold text-ink/70">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support / Help */}
                        <div className="bg-white border border-ink/10 p-8 rounded-sm shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Briefcase size={16} className="text-ink/40" />
                                <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink/60">PROTOCOL INFO</h4>
                            </div>
                            <div className="space-y-5 text-sm font-sans">
                                <div className="flex justify-between items-center border-b border-ink/5 pb-3">
                                    <span className="text-ink/50">Contract ID</span>
                                    <span className="font-mono font-bold text-xs">{quest.id}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-ink/5 pb-3">
                                    <span className="text-ink/50">Escrow</span>
                                    <span className="font-mono font-bold text-xs text-green-600">Active Locked</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-ink/50">IP Model</span>
                                    <span className="font-mono font-bold text-xs">Open Source</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => window.location.href = 'mailto:support@opensci.io'}
                                className="w-full flex items-center justify-center gap-3 text-xs font-mono font-bold uppercase tracking-widest text-ink/40 hover:text-ink transition-colors border border-dashed border-ink/20 hover:border-ink/40 py-4 rounded-sm bg-stone/5 hover:bg-stone/10 mt-8"
                            >
                                <LifeBuoy size={16} /> Contact Support
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <PasswordVerificationModal 
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={executeAction}
            />
        </div>
    );
};
