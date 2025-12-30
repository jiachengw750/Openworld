
import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Plus } from 'lucide-react';

export type WorkflowStatus = 'BIDDING' | 'RECRUITING' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'REJECTED' | 'COMPLETED' | 'FAILED' | 'PAYMENT_PENDING' | 'PAYMENT_FAILED';

export interface WorkspaceTask {
    id: string;
    title: string;
    role: 'MAKER' | 'SOLVER';
    value: number;
    currency: string;
    status: WorkflowStatus;
    lastUpdate: string;
    bidsCount?: number;
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
    },
    {
        id: 'm4',
        title: 'Autonomous Drone Swarm Navigation',
        role: 'MAKER',
        status: 'IN_PROGRESS',
        value: 65000,
        currency: 'SCI',
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
    },
    {
        id: '106',
        title: 'Deep Learning for Genome Sequencing',
        role: 'MAKER',
        value: 300,
        currency: 'USDC',
        status: 'PAYMENT_PENDING',
        lastUpdate: 'Just now',
    },
    {
        id: '107',
        title: 'Data Vis - Climate Change',
        role: 'MAKER',
        value: 120,
        currency: 'USDC',
        status: 'PAYMENT_FAILED',
        lastUpdate: '10 min ago',
    }
];

export const Workspace: React.FC = () => {
    const { wallet } = useWallet();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [viewMode, setViewMode] = useState<'MAKER' | 'SOLVER'>('SOLVER');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CLOSED'>('ALL');

    // --- Action Handlers ---
    const handleTaskClick = (task: WorkspaceTask) => {
        // 1. Maker with RECRUITING task -> QuestDetails (Edit + View Bidders)
        if (task.role === 'MAKER' && task.status === 'RECRUITING') {
            navigate(`/quest/${task.id}`, {
                state: { role: 'MAKER' }
            });
            return;
        }

        // 2. Main Quest Console (Delivery, Acceptance & Bid Management)
        if (['IN_PROGRESS', 'UNDER_REVIEW', 'REJECTED', 'COMPLETED', 'BIDDING'].includes(task.status)) {
            navigate(`/workspace/quest/${task.id}/console`, {
                state: {
                    role: task.role,
                    initialStatus: task.status,
                    title: task.title,
                    value: task.value,
                    currency: task.currency,
                }
            });
            return;
        }
    };

    // --- Sorting & Filtering ---
    const getStatusPriority = (status: WorkflowStatus): number => {
        switch (status) {
            case 'IN_PROGRESS': return 1;
            case 'UNDER_REVIEW': return 1;
            case 'PAYMENT_PENDING': return 1;
            case 'REJECTED': return 1;
            case 'PAYMENT_FAILED': return 1;
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

            const isCompleted = t.status === 'COMPLETED';
            const isClosed = t.status === 'REJECTED' || t.status === 'FAILED' || t.status === 'PAYMENT_FAILED';

            if (filterStatus === 'COMPLETED') return isCompleted;
            if (filterStatus === 'CLOSED') return isClosed;
            if (filterStatus === 'ACTIVE') return !isCompleted && !isClosed;

            return true;
        })
        .sort((a, b) => getStatusPriority(a.status) - getStatusPriority(b.status));

    const formatCurrency = (val: number, curr: string) => {
        return new Intl.NumberFormat('en-US').format(val) + ' ' + curr;
    };

    const getStatusConfig = (status: WorkflowStatus, task: WorkspaceTask) => {
        switch (status) {
            case 'BIDDING': return { label: 'Bidding', color: 'bg-stone/10 text-ink/60 border-stone/20' };
            case 'RECRUITING': return { label: `Recruiting`, color: 'bg-ink text-paper border-ink animate-pulse' };
            case 'IN_PROGRESS': return { label: `In Progress`, color: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'UNDER_REVIEW': return { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' };
            case 'REJECTED': return { label: `Rejected`, color: 'bg-red-50 text-red-700 border-red-200 font-bold' };
            case 'COMPLETED': return { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200' };
            case 'FAILED': return { label: 'Failed', color: 'bg-stone-200 text-ink/40 border-stone-300' };
            case 'PAYMENT_PENDING': return { label: 'Payment Pending', color: 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' };
            case 'PAYMENT_FAILED': return { label: 'Payment Failed', color: 'bg-red-50 text-red-700 border-red-200 font-bold' };
            default: return { label: 'Unknown', color: 'bg-stone/5 text-ink/40' };
        }
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
                <div className="flex-1 p-6 md:p-12">

                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-4">
                            {(['ALL', 'ACTIVE', 'COMPLETED', 'CLOSED'] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setFilterStatus(filter)}
                                    className={`text-xs font-mono font-bold uppercase tracking-widest transition-all pb-1 border-b-2 ${filterStatus === filter
                                        ? 'text-ink border-ink'
                                        : 'text-ink/40 border-transparent hover:text-ink hover:border-ink/20'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Task Ledger Table */}
                    <div className="flex flex-col">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-ink/10 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 px-2">
                            <div className="col-span-5">Task</div>
                            <div className="col-span-2">Amount</div>
                            <div className="col-span-2">Last Update</div>
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
                                        <span
                                            onClick={(e) => { e.stopPropagation(); handleTaskClick(task); }}
                                            className="font-sans font-bold text-lg text-ink hover:text-accent transition-colors truncate pr-4 block"
                                        >
                                            {task.title}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono font-bold text-ink/40 uppercase tracking-wider flex items-center">
                                                <Briefcase size={10} className="mr-1" />
                                                {task.role === 'SOLVER' ? 'Grant #' + task.id : 'Quest #' + task.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 font-mono font-bold text-ink">
                                        {formatCurrency(task.value, task.currency)}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-xs font-mono text-ink/40">{task.lastUpdate}</span>
                                    </div>
                                    <div className="col-span-3 flex justify-end items-center gap-2">
                                        {/* Status Badge */}
                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${status.color}`}>
                                            {status.label}
                                        </span>

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
            </div>
        </div>
    );
};
