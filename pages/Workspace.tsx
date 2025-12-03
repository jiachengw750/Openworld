
import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, Briefcase, Clock, ThumbsUp, ThumbsDown, 
    Gavel, Upload, Bell, AlertCircle, CheckCircle, FileText, Plus,
    XCircle
} from 'lucide-react';

export type WorkflowStatus = 'BIDDING' | 'RECRUITING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'REJECTED' | 'ARBITRATION' | 'COMPLETED' | 'FAILED';

export interface WorkspaceTask {
    id: string;
    title: string;
    role: 'MAKER' | 'SOLVER';
    value: number;
    currency: string;
    status: WorkflowStatus;
    lastUpdate: string;
    countdown?: string;
    bidsCount?: number;
    rejectionCount?: number;
}

export interface Notification {
    id: string;
    type: 'URGENT' | 'BUSINESS' | 'NORMAL';
    category: 'TRANSACTION' | 'SYSTEM' | 'INTERACTION';
    message: string;
    time: string;
    read: boolean;
}

const INITIAL_TASKS: WorkspaceTask[] = [
    {
        id: 'q1',
        title: 'Heuristic Solution and Experimental Comparison of Convex Optimization Problems',
        role: 'SOLVER',
        value: 200000,
        currency: 'SCI',
        status: 'IN_PROGRESS',
        lastUpdate: '2 hours ago',
        countdown: '2 Days Left'
    },
    {
        id: 'q3',
        title: 'Systematic Literature Review on Algae-Based Biofuels (2020-2024)',
        role: 'SOLVER',
        value: 15000,
        currency: 'SCI',
        status: 'UNDER_REVIEW',
        lastUpdate: '1 day ago'
    },
    {
        id: 'q2',
        title: 'High-Fidelity 3D Rendering of Molecular Docking Interactions',
        role: 'MAKER',
        value: 50000,
        currency: 'SCI',
        status: 'RECRUITING',
        lastUpdate: '5 hours ago',
        bidsCount: 12
    },
    {
        id: '202',
        title: 'Data Analysis for Ocean Acidification Study',
        role: 'MAKER',
        value: 800,
        currency: 'USDC',
        status: 'UNDER_REVIEW',
        lastUpdate: '30 mins ago'
    },
    {
        id: 'q4',
        title: 'Parallelization of Monte Carlo Simulations for Particle Physics',
        role: 'SOLVER',
        value: 500000,
        currency: 'SCI',
        status: 'REJECTED',
        lastUpdate: '1 hour ago',
        rejectionCount: 1
    },
    {
        id: '104',
        title: 'Translation of Biophysics Paper',
        role: 'SOLVER',
        value: 200,
        currency: 'USDC',
        status: 'COMPLETED',
        lastUpdate: '1 week ago'
    },
    {
        id: '203',
        title: 'Smart Contract Audit for Research DAO',
        role: 'MAKER',
        value: 4500,
        currency: 'USDC',
        status: 'IN_PROGRESS',
        lastUpdate: '3 days ago',
        countdown: '5 Days Left'
    },
    {
        id: 'm4',
        title: 'Autonomous Drone Swarm Navigation',
        role: 'MAKER',
        status: 'IN_PROGRESS',
        value: 65000,
        currency: 'SCI',
        countdown: '5d 12h',
        lastUpdate: '2d ago',
    },
    {
        id: '105',
        title: 'Visualizing Protein Folding with AI',
        role: 'SOLVER',
        value: 1500,
        currency: 'USDC',
        status: 'BIDDING',
        lastUpdate: '3 hours ago',
    }
];

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        type: 'URGENT',
        category: 'INTERACTION',
        message: 'Submission Rejected: Task #q4 requires revision.',
        time: '1h ago',
        read: false
    },
    {
        id: 'n2',
        type: 'BUSINESS',
        category: 'TRANSACTION',
        message: 'Payment Received: 200 USDC for Task #104',
        time: '1d ago',
        read: true
    },
    {
        id: 'n3',
        type: 'NORMAL',
        category: 'SYSTEM',
        message: 'New bid received for Task #q2',
        time: '2h ago',
        read: false
    },
    {
        id: 'n4',
        type: 'NORMAL',
        category: 'INTERACTION',
        message: 'Solver submitted work for Task #202',
        time: '30m ago',
        read: false
    }
];

export const Workspace: React.FC = () => {
    const { wallet } = useWallet();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [viewMode, setViewMode] = useState<'MAKER' | 'SOLVER'>('SOLVER');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
    const [notificationFilter, setNotificationFilter] = useState<'ALL' | 'TRANSACTION' | 'SYSTEM' | 'INTERACTION'>('ALL');
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [isFeedOpen, setIsFeedOpen] = useState(true);

    const unreadCount = notifications.filter(n => !n.read).length;

    // --- Action Handlers ---
    const handleWithdrawBid = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to withdraw this bid?")) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
            showToast("Bid withdrawn successfully.");
        }
    };

    const handleTaskClick = (task: WorkspaceTask) => {
        // 1. Selection Console
        if (task.role === 'MAKER' && task.status === 'RECRUITING') {
            navigate(`/workspace/quest/${task.id}/selection`);
            return;
        }
        
        // 2. Main Quest Console (Delivery & Acceptance)
        if (['IN_PROGRESS', 'UNDER_REVIEW', 'REJECTED', 'ARBITRATION', 'COMPLETED'].includes(task.status)) {
            navigate(`/workspace/quest/${task.id}/console`, { 
                state: { 
                    role: task.role, 
                    initialStatus: task.status,
                    rejectionCount: task.rejectionCount || 0,
                    title: task.title,
                    value: task.value,
                    currency: task.currency,
                    countdown: task.countdown || '23h 59m'
                } 
            });
            return;
        }

        // 3. Fallback for Bidding
        if (task.status === 'BIDDING') {
            showToast("Bid is currently active. Waiting for Maker selection.");
        }
    };

    // --- Sorting & Filtering ---
    const getStatusPriority = (status: WorkflowStatus): number => {
        switch (status) {
            case 'IN_PROGRESS': return 1;
            case 'UNDER_REVIEW': return 1;
            case 'REJECTED': return 1;
            case 'ARBITRATION': return 1;
            case 'RECRUITING': return 2;
            case 'BIDDING': return 3;
            case 'COMPLETED': return 4;
            case 'FAILED': return 4;
            default: return 99;
        }
    };

    const filteredTasks = tasks
        .filter(t => {
            if (t.role !== viewMode) return false;
            if (filterStatus === 'ALL') return true;
            const isCompleted = t.status === 'COMPLETED' || t.status === 'FAILED';
            if (filterStatus === 'COMPLETED') return isCompleted;
            if (filterStatus === 'ACTIVE') return !isCompleted;
            return true;
        })
        .sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));

    const filteredNotifications = notifications.filter(n => {
        if (notificationFilter === 'ALL') return true;
        return n.category === notificationFilter;
    });

    const formatCurrency = (val: number, curr: string) => {
        return new Intl.NumberFormat('en-US').format(val) + ' ' + curr;
    };

    const getStatusConfig = (status: WorkflowStatus, task: WorkspaceTask) => {
        switch (status) {
            case 'BIDDING': return { label: 'Bidding', color: 'bg-stone/10 text-ink/60 border-stone/20' };
            case 'RECRUITING': return { label: `Recruiting (${task.bidsCount})`, color: 'bg-ink text-paper border-ink animate-pulse' };
            case 'IN_PROGRESS': return { label: `In Progress`, color: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'UNDER_REVIEW': return { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' };
            case 'REJECTED': return { label: `Rejected (${task.rejectionCount || 0}/3)`, color: 'bg-red-50 text-red-700 border-red-200 font-bold' };
            case 'ARBITRATION': return { label: 'In Arbitration', color: 'bg-purple-50 text-purple-700 border-purple-200' };
            case 'COMPLETED': return { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' };
            case 'FAILED': return { label: 'Failed', color: 'bg-stone-200 text-ink/40 border-stone-300' };
            default: return { label: 'Unknown', color: 'bg-stone/5 text-ink/40' };
        }
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="min-h-screen bg-paper flex flex-col">
            {/* Header Area */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1512px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
                    
                    {/* View Switcher Tabs */}
                    <div>
                        <span className="text-xs font-mono font-bold text-ink/40 uppercase tracking-widest block mb-4">Workspace View</span>
                        <div className="flex gap-8">
                            <button 
                                onClick={() => setViewMode('SOLVER')}
                                className={`text-4xl md:text-5xl font-serif transition-colors ${viewMode === 'SOLVER' ? 'text-ink font-bold' : 'text-ink/20 hover:text-ink/40'}`}
                            >
                                As Solver
                            </button>
                            <button 
                                onClick={() => setViewMode('MAKER')}
                                className={`text-4xl md:text-5xl font-serif transition-colors ${viewMode === 'MAKER' ? 'text-ink font-bold' : 'text-ink/20 hover:text-ink/40'}`}
                            >
                                As Maker
                            </button>
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col md:items-end gap-6">
                        <div className="flex gap-12 font-mono">
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-ink/40 font-bold mb-1">
                                    {viewMode === 'SOLVER' ? 'Total Income' : 'Total Spend'}
                                </span>
                                <span className="text-2xl font-bold text-ink">
                                    {viewMode === 'SOLVER' ? '$12,450' : '$5,200'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-ink/40 font-bold mb-1">Active Tasks</span>
                                <span className="text-2xl font-bold text-ink">3</span>
                            </div>
                        </div>
                        
                        {viewMode === 'MAKER' && (
                            <Link 
                                to="/create-quest"
                                className="bg-ink text-paper px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center gap-2"
                            >
                                <Plus size={14} /> Create Task
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex max-w-[1512px] mx-auto w-full">
                
                {/* Main Ledger Content */}
                <div className="flex-1 p-6 md:p-12 border-r border-ink/10">
                    
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-4">
                            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(filter => (
                                <button 
                                    key={filter} 
                                    onClick={() => setFilterStatus(filter)}
                                    className={`text-xs font-mono font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${
                                        filterStatus === filter 
                                            ? 'text-ink border-ink' 
                                            : 'text-ink/40 border-transparent hover:text-ink hover:border-ink/20'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        <button className="text-xs font-mono font-bold uppercase tracking-widest text-ink hover:text-accent flex items-center gap-2">
                            Filter <ChevronRight size={12} className="rotate-90"/>
                        </button>
                    </div>

                    {/* Task Ledger Table */}
                    <div className="flex flex-col">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-ink/10 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 px-2">
                            <div className="col-span-5">Task</div>
                            <div className="col-span-2">Value</div>
                            <div className="col-span-2">Time</div>
                            <div className="col-span-3 text-right">Status / Actions</div>
                        </div>

                        {/* Rows */}
                        {filteredTasks.map((task) => {
                            const status = getStatusConfig(task.status, task);
                            return (
                                <div 
                                    key={task.id} 
                                    onClick={() => handleTaskClick(task)}
                                    className="grid grid-cols-12 gap-4 py-6 border-b border-ink/5 items-center hover:bg-stone/5 px-2 transition-colors group cursor-pointer"
                                >
                                    <div className="col-span-5">
                                        <Link 
                                            to={`/quest/${task.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="font-sans font-bold text-lg text-ink hover:text-accent transition-colors truncate pr-4 block"
                                        >
                                            {task.title}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono font-bold text-ink/40 uppercase tracking-wider flex items-center">
                                                <Briefcase size={10} className="mr-1"/> 
                                                {task.role === 'SOLVER' ? 'Grant #' + task.id : 'Quest #' + task.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 font-mono font-bold text-ink">
                                        {formatCurrency(task.value, task.currency)}
                                    </div>
                                    <div className="col-span-2">
                                        {task.countdown ? (
                                            <div className="flex items-center text-red-600 font-mono text-xs font-bold bg-red-50 w-fit px-2 py-1 rounded-sm">
                                                <Clock size={12} className="mr-1.5" />
                                                {task.countdown}
                                            </div>
                                        ) : (
                                            <span className="text-xs font-mono text-ink/40">{task.lastUpdate}</span>
                                        )}
                                    </div>
                                    <div className="col-span-3 flex justify-end items-center gap-2">
                                        {/* Status Badge */}
                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${status.color}`}>
                                            {status.label}
                                        </span>

                                        {/* Actions */}
                                        {viewMode === 'MAKER' && (
                                            <>
                                                {task.status === 'UNDER_REVIEW' && (
                                                    <div className="flex gap-1 ml-2">
                                                        <div className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center text-ink/40 group-hover:bg-ink group-hover:text-paper transition-colors">
                                                            <ChevronRight size={14} />
                                                        </div>
                                                    </div>
                                                )}
                                                {(task.status === 'IN_PROGRESS' || task.status === 'REJECTED') && (
                                                    <div className="ml-2 text-ink/20 group-hover:text-ink/60 transition-colors">
                                                        <Gavel size={16} />
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {viewMode === 'SOLVER' && (
                                            <>
                                                {task.status === 'IN_PROGRESS' && (
                                                    <div className="ml-2 bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        <Upload size={14} />
                                                    </div>
                                                )}
                                                {/* PRD 2.3: Bidder Withdraw Action */}
                                                {task.status === 'BIDDING' && (
                                                    <button 
                                                        onClick={(e) => handleWithdrawBid(e, task.id)}
                                                        className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-ink/20 hover:text-red-600 transition-colors"
                                                        title="Withdraw Bid"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        
                        {filteredTasks.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="font-mono text-ink/40 text-sm">No tasks found in this view.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Notification Feed */}
                <div className={`w-80 border-l border-ink/10 bg-surface flex flex-col transition-all duration-300 ${isFeedOpen ? 'mr-0' : '-mr-80 hidden'}`}>
                    <div className="p-6 border-b border-ink/10 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bell size={16} />
                                <span className="font-mono text-xs font-bold uppercase tracking-widest">Live Feed</span>
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[1.25rem] text-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button onClick={markAllRead} className="text-[10px] text-ink/40 hover:text-ink uppercase font-bold tracking-wider">
                                Mark Read
                            </button>
                        </div>
                        
                        {/* Notification Filters */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                            {(['ALL', 'TRANSACTION', 'SYSTEM', 'INTERACTION'] as const).map(filter => (
                                <button 
                                    key={filter}
                                    onClick={() => setNotificationFilter(filter)}
                                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-sm border transition-colors whitespace-nowrap ${
                                        notificationFilter === filter 
                                            ? 'bg-ink text-paper border-ink' 
                                            : 'bg-stone/5 text-ink/60 border-ink/5 hover:border-ink/20'
                                    }`}
                                >
                                    {filter === 'ALL' ? 'ALL' : filter.slice(0,4)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((note) => (
                                <div 
                                    key={note.id} 
                                    className={`p-6 border-b border-ink/5 hover:bg-stone/5 transition-colors cursor-pointer relative ${!note.read ? 'bg-stone/5' : ''}`}
                                >
                                    {!note.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>
                                    )}
                                    <div className="flex items-start gap-3 mb-2">
                                        {note.type === 'URGENT' && <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />}
                                        {note.type === 'BUSINESS' && <CheckCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />}
                                        {note.type === 'NORMAL' && <FileText size={16} className="text-ink/40 mt-0.5 shrink-0" />}
                                        
                                        <p className={`text-sm font-medium leading-snug ${note.type === 'URGENT' ? 'text-red-700' : 'text-ink'}`}>
                                            {note.message}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-mono text-ink/40 pl-7 block">{note.time}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-[10px] font-mono text-ink/30 uppercase">No notifications</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
