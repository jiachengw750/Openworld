
import React, { useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
    ArrowLeft, Clock, FileText, Upload, CheckCircle, XCircle, 
    AlertTriangle, Gavel, Download, MessageSquare, Briefcase, ChevronRight,
    PenTool, FilePlus, Star, X, Paperclip, Trash2, ShieldAlert
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

// Types reuse
type WorkflowStatus = 'IN_PROGRESS' | 'UNDER_REVIEW' | 'REJECTED' | 'ARBITRATION' | 'COMPLETED';

export const QuestConsole: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { showToast } = useToast();
    
    // Derived state from navigation
    const [role] = useState<'MAKER' | 'SOLVER'>((location.state as any)?.role || 'SOLVER');
    const [status, setStatus] = useState<WorkflowStatus>((location.state as any)?.initialStatus || 'IN_PROGRESS');
    
    // Dynamic Quest Info from State
    const quest = {
        id: id || '101',
        title: (location.state as any)?.title || 'High-Fidelity 3D Rendering of Molecular Docking Interactions',
        budget: (location.state as any)?.value ? new Intl.NumberFormat('en-US').format((location.state as any).value) + ' ' + ((location.state as any)?.currency || 'USDC') : '5,000 USDC',
        deadline: (location.state as any)?.countdown || '23h 45m',
        bidsCount: 12,
        description: 'Create a series of 4K render images and a 30-second animation demonstrating the binding mechanism...',
    };

    // UI State
    const [files, setFiles] = useState<File[]>([]);
    const [commitMessage, setCommitMessage] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [rejectionCount, setRejectionCount] = useState((location.state as any)?.rejectionCount || 0); // PRD 2.4.B.2
    
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [actionType, setActionType] = useState<'SUBMIT' | 'ACCEPT' | 'REJECT' | 'DISPUTE' | 'SUPPLEMENT' | 'AMEND' | 'TERMINATE' | 'EVIDENCE' | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supplementFileRef = useRef<HTMLInputElement>(null);

    // Rating State (PRD 3.3)
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [ratingTags, setRatingTags] = useState<string[]>([]);
    const [ratingComment, setRatingComment] = useState('');

    // PRD 2.3.B Form States
    const [isSupplementModalOpen, setIsSupplementModalOpen] = useState(false);
    const [supplementData, setSupplementData] = useState({ title: '', details: '', files: [] as File[] });
    
    const [isAmendModalOpen, setIsAmendModalOpen] = useState(false);
    const [amendData, setAmendData] = useState({ 
        types: [] as string[], // 'BUDGET' | 'TIME' | 'SCOPE'
        increaseBudget: '',
        extendTime: '',
        reason: ''
    });

    // --- Handlers ---

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    };

    const handleSupplementFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSupplementData(prev => ({
                ...prev,
                files: [...prev.files, ...Array.from(e.target.files || [])]
            }));
        }
    };

    // Generic verification trigger
    const triggerVerification = (type: typeof actionType) => {
        if (type === 'AMEND') {
            if (amendData.increaseBudget && parseFloat(amendData.increaseBudget) < 0) {
                showToast("Budget increase cannot be negative");
                return;
            }
            if (amendData.extendTime && parseFloat(amendData.extendTime) < 0) {
                showToast("Time extension cannot be negative");
                return;
            }
        }
        setActionType(type);
        setIsPasswordOpen(true);
    };

    const handleAction = (type: 'SUBMIT' | 'ACCEPT' | 'REJECT' | 'DISPUTE' | 'SUPPLEMENT' | 'AMEND' | 'TERMINATE' | 'EVIDENCE') => {
        if (type === 'SUBMIT' && files.length === 0) {
            showToast("Please upload at least one file.");
            return;
        }
        if (type === 'REJECT' && !rejectReason) {
            showToast("Please provide a rejection reason.");
            return;
        }
        
        // Handle Forms before Verification
        if (type === 'SUPPLEMENT') {
            setIsSupplementModalOpen(true);
            return;
        }
        if (type === 'AMEND') {
            setIsAmendModalOpen(true);
            return;
        }

        // Direct Actions
        triggerVerification(type);
    };

    const confirmAction = () => {
        setIsPasswordOpen(false);
        
        setTimeout(() => {
            switch(actionType) {
                case 'SUBMIT':
                    setStatus('UNDER_REVIEW');
                    showToast("Work submitted successfully.");
                    break;
                case 'ACCEPT':
                    // Don't complete yet, show Rating
                    setIsRatingOpen(true);
                    break;
                case 'REJECT':
                    // PRD 2.4.B.2: Rejection Limit Logic
                    const newCount = rejectionCount + 1;
                    setRejectionCount(newCount);
                    if (newCount > 3) {
                        setStatus('ARBITRATION');
                        showToast("Rejection limit reached. Case moved to Arbitration.");
                    } else {
                        setStatus('REJECTED');
                        showToast(`Submission rejected (${newCount}/3).`);
                    }
                    break;
                case 'DISPUTE':
                    setStatus('ARBITRATION');
                    showToast("Arbitration case opened.");
                    break;
                case 'SUPPLEMENT':
                    setIsSupplementModalOpen(false);
                    showToast("Supplementary info sent to solver.");
                    break;
                case 'AMEND':
                    setIsAmendModalOpen(false);
                    showToast("Contract amendment proposal sent.");
                    break;
                case 'TERMINATE':
                    setStatus('COMPLETED'); // or FAILED in real app
                    showToast("Contract terminated.");
                    break;
                case 'EVIDENCE':
                    showToast("Evidence submitted to arbitration committee.");
                    break;
            }
            setActionType(null);
        }, 1000);
    };

    const submitRating = () => {
        setIsRatingOpen(false);
        setStatus('COMPLETED');
        showToast("Work accepted & Rating submitted! Funds released.");
    };

    // Prevent negative sign input
    const preventNegative = (e: React.KeyboardEvent) => {
        if (['-', 'e'].includes(e.key)) {
            e.preventDefault();
        }
    };

    // --- Render Views ---

    // Shared Arbitration View (PRD 2.4.C)
    const renderArbitrationView = () => (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-sm text-center">
            <ShieldAlert size={48} className="mx-auto text-amber-600 mb-4" />
            <h3 className="font-bold text-2xl text-amber-900 mb-2">In Arbitration</h3>
            <p className="text-amber-800 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Platform support has intervened. Funds are currently frozen in the escrow smart contract. 
                Please provide evidence to support your case.
            </p>
            
            <div className="bg-white p-6 rounded-sm border border-amber-100 max-w-md mx-auto mb-8 text-left">
                <h4 className="font-bold text-xs uppercase text-ink/60 mb-4">Case Status</h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Case ID</span>
                        <span className="font-mono">#ARB-{quest.id}-09</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Est. Resolution</span>
                        <span className="font-mono">48 Hours</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => triggerVerification('EVIDENCE')}
                className="bg-amber-600 text-white px-8 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors shadow-lg"
            >
                Submit Evidence
            </button>
        </div>
    );

    // 1. SOLVER: Delivery View
    const renderSolverView = () => {
        if (status === 'ARBITRATION') return renderArbitrationView();

        return (
            <div className="space-y-8">
                {/* Status Banner */}
                {status === 'REJECTED' && (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-sm flex items-start gap-4 animate-in slide-in-from-top-2">
                        <AlertTriangle className="text-red-600 mt-1" size={20} />
                        <div>
                            <h4 className="font-bold text-red-800 mb-1">Submission Rejected</h4>
                            <p className="text-red-700 text-sm">Feedback: "The animation frame rate is inconsistent in the second half. Please fix." (Attempt {rejectionCount}/3)</p>
                        </div>
                    </div>
                )}

                {/* Upload Area */}
                <div className={`bg-paper border-2 border-dashed rounded-sm p-12 text-center transition-all ${
                    status === 'UNDER_REVIEW' || status === 'COMPLETED' ? 'opacity-50 pointer-events-none' : 'border-ink/20 hover:border-accent hover:bg-stone/5 cursor-pointer'
                }`}
                onClick={() => status !== 'UNDER_REVIEW' && fileInputRef.current?.click()}
                >
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} disabled={status === 'UNDER_REVIEW'} />
                    <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-6 text-ink/40">
                        <Upload size={32} />
                    </div>
                    <h3 className="font-bold text-ink text-lg mb-2">Upload Deliverables</h3>
                    <p className="text-ink/50 text-sm font-mono">Drag & drop or click to browse</p>
                    
                    {files.length > 0 && (
                        <div className="mt-8 space-y-2 text-left max-w-md mx-auto">
                            {files.map((f, i) => (
                                <div key={i} className="bg-white border border-ink/10 p-3 rounded-sm flex items-center justify-between">
                                    <span className="text-sm font-mono truncate">{f.name}</span>
                                    <CheckCircle size={14} className="text-green-600" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Commit Message */}
                <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-3">Commit Message</label>
                    <textarea 
                        className="w-full bg-surface border border-ink/20 p-4 font-sans text-sm rounded-sm h-32 focus:outline-none focus:border-accent"
                        placeholder="Describe your submission details..."
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        disabled={status === 'UNDER_REVIEW' || status === 'COMPLETED'}
                    />
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center pt-6 border-t border-ink/10">
                    <button 
                        onClick={() => handleAction('DISPUTE')}
                        className="text-xs font-mono font-bold uppercase tracking-widest text-ink/40 hover:text-red-600 flex items-center gap-2"
                    >
                        <Gavel size={14} /> Report Issue
                    </button>

                    {(status === 'IN_PROGRESS' || status === 'REJECTED') && (
                        <button 
                            onClick={() => handleAction('SUBMIT')}
                            className="bg-ink text-paper px-10 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
                        >
                            Submit Work
                        </button>
                    )}
                    
                    {status === 'UNDER_REVIEW' && (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-6 py-3 rounded-full font-mono text-sm font-bold border border-amber-100">
                            <Clock size={16} /> Waiting for Review
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 2. MAKER: Acceptance View
    const renderMakerView = () => {
        if (status === 'ARBITRATION') return renderArbitrationView();

        return (
            <div className="space-y-8">
                {/* Status Overview */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-stone/5 p-6 border border-ink/10 rounded-sm">
                        <span className="text-[10px] font-mono font-bold uppercase text-ink/40 block mb-2">Escrow Status</span>
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                            <CheckCircle size={16} /> Funds Locked ({quest.budget})
                        </div>
                    </div>
                    <div className="bg-stone/5 p-6 border border-ink/10 rounded-sm">
                        <span className="text-[10px] font-mono font-bold uppercase text-ink/40 block mb-2">Auto-Accept In</span>
                        <div className="flex items-center gap-2 text-ink font-bold">
                            <Clock size={16} /> 6 Days 23 Hours
                        </div>
                    </div>
                </div>

                {/* Deliverables Review */}
                {status === 'UNDER_REVIEW' || status === 'COMPLETED' ? (
                    <div className="bg-paper border border-ink/10 rounded-sm p-8">
                        <h3 className="font-bold text-lg text-ink mb-6 flex items-center gap-2">
                            <FileText size={18} /> Submission v1.0
                        </h3>
                        <p className="text-ink/70 text-sm mb-6 leading-relaxed bg-stone/5 p-4 rounded-sm italic">
                            "Here is the final render pack. Included are the source blender files and the 4K PNG sequence."
                        </p>
                        
                        <div className="space-y-3 mb-8">
                            {['render_sequence_01.zip', 'molecular_source.blend', 'preview.mp4'].map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-ink/10 hover:bg-stone/5 transition-colors cursor-pointer group rounded-sm">
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-ink/40" />
                                        <span className="font-mono text-sm">{f}</span>
                                    </div>
                                    <Download size={16} className="text-ink/40 group-hover:text-ink" />
                                </div>
                            ))}
                        </div>

                        {status === 'UNDER_REVIEW' && (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleAction('ACCEPT')}
                                        className="flex-1 bg-green-600 text-white py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        Accept & Pay
                                    </button>
                                    <button 
                                        onClick={() => setActionType('REJECT')} // Just opens the input view below
                                        className="flex-1 border border-red-200 text-red-600 bg-red-50 py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                                
                                {/* PRD 2.4.B.3 Request Change Button */}
                                <button 
                                    onClick={() => handleAction('AMEND')}
                                    className="w-full text-xs font-mono font-bold text-ink/40 hover:text-ink uppercase tracking-widest py-2 hover:bg-stone/5 rounded-sm transition-colors"
                                >
                                    Request Change / Amendment
                                </button>

                                {/* Conditional Reject Input */}
                                {actionType === 'REJECT' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-ink/5 mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-bold text-red-700">Reason for Rejection</label>
                                            <span className="text-[10px] font-mono text-red-600 font-bold uppercase">Attempt {rejectionCount + 1}/3</span>
                                        </div>
                                        <textarea 
                                            className="w-full border border-red-200 bg-red-50/50 p-3 text-sm rounded-sm focus:outline-none focus:border-red-400 mb-4"
                                            placeholder="Explain what needs to be fixed..."
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => setActionType(null)} className="text-xs font-bold uppercase text-ink/40">Cancel</button>
                                            <button onClick={() => handleAction('REJECT')} className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wide">Confirm Rejection</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {status === 'COMPLETED' && (
                            <div className="bg-green-50 border border-green-200 p-4 text-center rounded-sm">
                                <span className="text-green-700 font-mono font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                                    <CheckCircle size={16} /> Transaction Complete
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-16 text-center border-2 border-dashed border-ink/10 rounded-sm bg-stone/5">
                        <Clock size={32} className="mx-auto text-ink/20 mb-4" />
                        <h3 className="font-bold text-ink/60">Waiting for Submission</h3>
                        <p className="text-ink/40 text-sm mt-2">Solver is working on the deliverables.</p>
                    </div>
                )}

                {/* Maker Actions for In Progress (PRD 2.3 Management) */}
                {status === 'IN_PROGRESS' && (
                    <div className="flex flex-col gap-4 border-t border-ink/10 pt-6">
                        <div className="flex justify-between items-center">
                            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-ink/40">Management</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <a href="mailto:solver@email.com" className="flex flex-col items-center justify-center p-4 border border-ink/10 bg-paper hover:bg-stone/5 rounded-sm transition-colors group">
                                <MessageSquare size={20} className="mb-2 text-ink/40 group-hover:text-ink"/>
                                <span className="text-[10px] font-bold uppercase">Contact</span>
                            </a>
                            <button 
                                onClick={() => handleAction('SUPPLEMENT')}
                                className="flex flex-col items-center justify-center p-4 border border-ink/10 bg-paper hover:bg-stone/5 rounded-sm transition-colors group"
                            >
                                <FilePlus size={20} className="mb-2 text-ink/40 group-hover:text-ink"/>
                                <span className="text-[10px] font-bold uppercase">Supplement Info</span>
                            </button>
                            <button 
                                onClick={() => handleAction('AMEND')}
                                className="flex flex-col items-center justify-center p-4 border border-ink/10 bg-paper hover:bg-stone/5 rounded-sm transition-colors group"
                            >
                                <PenTool size={20} className="mb-2 text-ink/40 group-hover:text-ink"/>
                                <span className="text-[10px] font-bold uppercase">Amend Contract</span>
                            </button>
                            <button 
                                onClick={() => handleAction('TERMINATE')} // PRD 2.4.B.4 Terminate
                                className="flex flex-col items-center justify-center p-4 border border-red-100 bg-red-50/20 hover:bg-red-50 rounded-sm transition-colors group"
                            >
                                <XCircle size={20} className="mb-2 text-red-400 group-hover:text-red-600"/>
                                <span className="text-[10px] font-bold uppercase text-red-600">Terminate</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Persistent Arbitration Button for Maker (All States except Arbitration) */}
                <div className="text-center pt-8 border-t border-ink/5">
                        <button 
                        onClick={() => handleAction('DISPUTE')}
                        className="text-xs font-mono font-bold uppercase text-ink/40 hover:text-red-600 inline-flex items-center gap-2 transition-colors"
                    >
                        <Gavel size={14} /> Report Issue / Dispute
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            
            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/workspace" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest mb-6 w-fit">
                        <ArrowLeft size={14} className="mr-2" /> Back to Workspace
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest border ${
                                    status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 
                                    status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                    status === 'ARBITRATION' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                    status === 'UNDER_REVIEW' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    {status.replace('_', ' ')}
                                </span>
                                <span className="font-mono text-xs font-bold text-ink/40 uppercase tracking-widest">
                                    {role === 'MAKER' ? 'Management Console' : 'Delivery Console'}
                                </span>
                            </div>
                            <h1 className="font-sans text-3xl md:text-4xl font-bold text-ink mb-2 max-w-3xl leading-tight">
                                {quest.title}
                            </h1>
                        </div>
                        
                        <div className="flex gap-12 border-t lg:border-t-0 border-ink/10 pt-6 lg:pt-0">
                            <div>
                                <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Budget</span>
                                <span className="font-sans text-2xl font-bold text-ink">{quest.budget}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-mono font-bold uppercase text-ink/40 mb-1">Deadline</span>
                                <span className="font-sans text-2xl font-bold text-ink text-red-600">{quest.deadline}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Action Area */}
                <div className="lg:col-span-2">
                    {role === 'SOLVER' ? renderSolverView() : renderMakerView()}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-paper border border-ink/10 p-6 rounded-sm">
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Briefcase size={16} className="text-ink/40"/> Contract Details
                        </h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-ink/5 pb-2">
                                <span className="text-ink/60">ID</span>
                                <span className="font-mono">{quest.id}</span>
                            </div>
                            <div className="flex justify-between border-b border-ink/5 pb-2">
                                <span className="text-ink/60">Escrow</span>
                                <span className={`font-mono font-bold ${status === 'ARBITRATION' ? 'text-amber-600' : 'text-green-600'}`}>
                                    {status === 'ARBITRATION' ? 'Frozen' : 'Active'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ink/60">IP Rights</span>
                                <span className="font-mono">Open Source</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-stone/5 p-6 rounded-sm border border-ink/5">
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-ink/60">Help & Support</h4>
                        <p className="text-xs text-ink/50 leading-relaxed mb-4">
                            If you encounter any issues with the counterparty, try to resolve via chat first. Arbitration is final.
                        </p>
                        <a href="#" className="text-xs font-bold text-ink underline hover:text-accent">Read Dispute Rules</a>
                    </div>
                </div>

            </div>

            <PasswordVerificationModal 
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={confirmAction}
            />

            {/* Supplement Modal (PRD 2.3.B) - FIXED: Added Attachment Input */}
            {isSupplementModalOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-lg p-8 rounded-sm shadow-2xl relative border border-ink/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-sans text-2xl font-bold text-ink">Supplement Info</h3>
                            <button onClick={() => setIsSupplementModalOpen(false)}><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Title</label>
                                <input type="text" className="w-full border border-ink/20 p-3 text-sm rounded-sm" placeholder="e.g. Additional API Docs" value={supplementData.title} onChange={e => setSupplementData({...supplementData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Details</label>
                                <textarea className="w-full border border-ink/20 p-3 text-sm rounded-sm h-32" placeholder="Describe the background info..." value={supplementData.details} onChange={e => setSupplementData({...supplementData, details: e.target.value})} />
                            </div>
                            
                            {/* ADDED: Attachment Upload Field */}
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Attachments</label>
                                <div 
                                    className="border-2 border-dashed border-ink/20 rounded-sm p-4 text-center cursor-pointer hover:border-accent hover:bg-stone/5 transition-all"
                                    onClick={() => supplementFileRef.current?.click()}
                                >
                                    <input type="file" ref={supplementFileRef} multiple className="hidden" onChange={handleSupplementFileSelect} />
                                    <div className="flex items-center justify-center gap-2 text-ink/60">
                                        <Paperclip size={14} />
                                        <span className="text-xs font-mono font-bold uppercase">Upload Files</span>
                                    </div>
                                </div>
                                {supplementData.files.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {supplementData.files.map((f, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs font-mono bg-stone/10 p-2 rounded-sm">
                                                <span>{f.name}</span>
                                                <button onClick={() => setSupplementData(prev => ({...prev, files: prev.files.filter((_, idx) => idx !== i)}))} className="text-red-500"><Trash2 size={12}/></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => triggerVerification('SUPPLEMENT')} className="w-full bg-ink text-paper py-3 rounded-sm font-bold uppercase text-sm hover:bg-accent transition-colors">Send Supplement</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Amend Contract Modal (PRD 2.3.B) */}
            {isAmendModalOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-lg p-8 rounded-sm shadow-2xl relative border border-ink/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-sans text-2xl font-bold text-ink">Amend Contract</h3>
                            <button onClick={() => setIsAmendModalOpen(false)}><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                {['BUDGET', 'TIME', 'SCOPE'].map(t => (
                                    <label key={t} className="flex items-center gap-2 cursor-pointer border px-3 py-2 rounded-sm border-ink/10 hover:bg-stone/5">
                                        <input type="checkbox" checked={amendData.types.includes(t)} onChange={e => {
                                            const newTypes = e.target.checked ? [...amendData.types, t] : amendData.types.filter(x => x !== t);
                                            setAmendData({...amendData, types: newTypes});
                                        }} />
                                        <span className="text-xs font-bold">{t}</span>
                                    </label>
                                ))}
                            </div>
                            {amendData.types.includes('BUDGET') && (
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Increase Budget (USDC)</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-full border border-ink/20 p-3 text-sm rounded-sm" 
                                        placeholder="Amount to add"
                                        value={amendData.increaseBudget}
                                        onChange={e => setAmendData({...amendData, increaseBudget: e.target.value})}
                                        onKeyDown={preventNegative}
                                    />
                                </div>
                            )}
                            {amendData.types.includes('TIME') && (
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2">Extend Time (Days)</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-full border border-ink/20 p-3 text-sm rounded-sm" 
                                        placeholder="Days to add"
                                        value={amendData.extendTime}
                                        onChange={e => setAmendData({...amendData, extendTime: e.target.value})}
                                        onKeyDown={preventNegative}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2">Reason for Amendment</label>
                                <textarea className="w-full border border-ink/20 p-3 text-sm rounded-sm h-32" placeholder="Why is this change necessary?" />
                            </div>
                            <button onClick={() => triggerVerification('AMEND')} className="w-full bg-ink text-paper py-3 rounded-sm font-bold uppercase text-sm hover:bg-accent transition-colors">Submit Proposal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rating Modal (PRD 3.3) - FIXED: Added Comment Textarea */}
            {isRatingOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-md p-8 rounded-none shadow-2xl relative border border-ink/10">
                        <h3 className="font-sans text-2xl font-bold text-ink mb-2 text-center">Rate the Bidder</h3>
                        <p className="text-center text-ink/60 text-sm mb-8">Your feedback helps maintain platform quality.</p>
                        
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="p-2 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        size={32} 
                                        className={rating >= star ? "fill-accent text-accent" : "text-ink/20"} 
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {['Professional', 'On Time', 'High Quality', 'Good Communication'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setRatingTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${
                                        ratingTags.includes(tag) 
                                        ? 'bg-ink text-paper border-ink' 
                                        : 'bg-paper text-ink/60 border-ink/20 hover:border-ink'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* ADDED: Written Review Field */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold uppercase mb-2 text-ink/60">Review (Optional)</label>
                            <textarea 
                                value={ratingComment}
                                onChange={(e) => setRatingComment(e.target.value)}
                                className="w-full border border-ink/20 p-3 text-sm rounded-sm h-24 focus:outline-none focus:border-accent"
                                placeholder="Share your experience (max 200 words)..."
                                maxLength={200}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={submitRating} 
                                className="flex-1 border border-ink/10 py-3 rounded-full font-mono text-xs font-bold uppercase text-ink/60 hover:text-ink hover:bg-stone/5"
                            >
                                Rate Later
                            </button>
                            <button 
                                onClick={submitRating}
                                disabled={rating === 0}
                                className="flex-1 bg-ink text-paper py-3 rounded-full font-mono text-xs font-bold uppercase shadow-lg hover:bg-accent disabled:opacity-50"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
