
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Check, Users, User, HelpCircle, Plus, Edit2, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

// --- Configuration & Types ---
const GRID_LAYOUT = "grid-cols-[3fr_1.2fr_1.2fr_1.2fr_1fr_2.4fr]";

interface InviteRecord {
    id: string;
    user: string;
    avatar: string;
    type: 'REGISTER' | 'QUEST' | 'GRANT';
    status: 'COMPLETED' | 'PENDING';
    time: string;
    earnings: number;
    personalities?: string[];
}

const INITIAL_INVITE_HISTORY: InviteRecord[] = [
    { id: '1', user: 'Dr. Sarah Lin', avatar: 'https://i.pravatar.cc/150?u=30', type: 'REGISTER', status: 'COMPLETED', time: '2024-03-10', earnings: 5 },
    { id: '2', user: 'James Chen', avatar: 'https://i.pravatar.cc/150?u=12', type: 'QUEST', status: 'COMPLETED', time: '2024-03-12', earnings: 10 },
    { id: '3', user: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=60', type: 'REGISTER', status: 'PENDING', time: '2h ago', earnings: 0 },
    { id: '4', user: 'BioVis Studio', avatar: 'https://i.pravatar.cc/150?u=50', type: 'GRANT', status: 'COMPLETED', time: '1d ago', earnings: 25 },
    { id: '5', user: 'Laura Wu', avatar: 'https://i.pravatar.cc/150?u=40', type: 'REGISTER', status: 'COMPLETED', time: '2d ago', earnings: 5 },
    { id: '6', user: 'Quantum Labs', avatar: 'https://i.pravatar.cc/150?u=41', type: 'QUEST', status: 'COMPLETED', time: '3d ago', earnings: 15 },
    { id: '7', user: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=42', type: 'REGISTER', status: 'PENDING', time: '4d ago', earnings: 0 },
];

const MOCK_INVITED_ME: InviteRecord[] = [
    { id: '101', user: 'Prof. Marcus Thorne', avatar: 'https://i.pravatar.cc/150?u=2', type: 'REGISTER', status: 'COMPLETED', time: '2023-11-01', earnings: 0, personalities: ['Mentor'] },
    { id: '102', user: 'Dr. Emily Chen', avatar: 'https://i.pravatar.cc/150?u=9', type: 'QUEST', status: 'COMPLETED', time: '2023-10-15', earnings: 0, personalities: ['Collaborator'] },
    { id: '103', user: 'GreenEnergy Lab', avatar: 'https://i.pravatar.cc/150?u=42', type: 'GRANT', status: 'COMPLETED', time: '2023-09-20', earnings: 0, personalities: ['Supporter', 'Early Adopter'] },
];

// --- Sub Components ---

const EditPersonalityModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    initialTags: string[];
    onSave: (tags: string[]) => void;
}> = ({ isOpen, onClose, initialTags, onSave }) => {
    const [tags, setTags] = useState<string[]>([]);
    const [val, setVal] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTags(initialTags);
            setVal('');
            setIsAdding(false);
        }
    }, [isOpen, initialTags]);

    if (!isOpen) return null;

    const handleAdd = () => {
        const trimmed = val.trim();
        if (trimmed && tags.length < 3 && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setVal('');
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-md p-8 rounded-sm shadow-2xl relative border border-ink/10 animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone/10 rounded-full transition-colors">
                    <X size={20} className="text-ink/60 hover:text-red-600"/>
                </button>
                <h3 className="font-sans text-2xl font-bold text-ink mb-2">EDIT PERSONALITIES</h3>
                <p className="text-xs font-mono text-ink/50 mb-8 uppercase tracking-wider">ADD UP TO 3 TRAITS.</p>
                
                <div className="space-y-8">
                    <div className="min-h-[40px] flex flex-wrap gap-3">
                        {tags.map((tag, i) => (
                            <div key={i} className="group relative animate-in fade-in zoom-in duration-200">
                                <span className="h-10 px-4 flex items-center bg-white border border-ink/10 text-ink rounded-sm text-sm font-mono font-bold shadow-sm">{tag}</span>
                                <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 bg-ink text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-10"><X size={10}/></button>
                            </div>
                        ))}
                        {tags.length < 3 && !isAdding && (
                            <button onClick={() => setIsAdding(true)} className="h-10 px-4 border-2 border-dashed border-ink/20 text-ink/40 rounded-sm text-sm font-mono font-bold hover:text-ink hover:border-ink/40 transition-colors flex items-center gap-2">
                                <Plus size={14} /> ADD TAG
                            </button>
                        )}
                        {isAdding && (
                            <div className="h-10 flex items-center bg-white border border-ink/20 rounded-sm px-3 shadow-sm w-40 animate-in fade-in slide-in-from-left-2">
                                <input ref={inputRef} autoFocus className="bg-transparent text-sm font-mono p-0 outline-none w-full text-ink placeholder-ink/20" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setIsAdding(false); }} placeholder="ENTER TRAIT..." />
                                <button onClick={handleAdd} className="text-green-600 hover:text-green-700 ml-2"><Check size={14}/></button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 border-t border-ink/10 pt-6">
                        <button onClick={onClose} className="flex-1 border border-ink/10 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors">CANCEL</button>
                        <button onClick={() => onSave(tags)} className="flex-1 bg-ink text-paper py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-lg">SAVE CHANGES</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InviteStats: React.FC<{ inviteLink: string; onCopy: () => void; copied: boolean; totalInvites: number; totalEarnings: number; }> = ({ inviteLink, onCopy, copied, totalInvites, totalEarnings }) => (
    <div className="flex flex-col gap-6 h-full">
        <div className="bg-ink text-paper p-[30px] rounded-sm shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
                <div className="inline-flex items-center bg-paper/10 border border-paper/20 rounded-full px-4 py-1.5 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70" fill="none" className="w-4 h-4 mr-2">
                        <path d="M52.5 35C41.3777 38.581 37.7112 42.5685 35 52.5C32.2887 42.5685 28.6223 38.581 17.5 35C28.6223 31.419 32.2887 27.4315 35 17.5C37.7112 27.4315 41.3777 31.419 52.5 35Z" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M35 10V7.5" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M35 62.5V60" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M60 35H62.5" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.5 35H10" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M47.5 22.5L55 15" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22.5 22.5L15 15" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22.5 47.5L15 55" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M47.5 47.5L55 55" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-paper">Reward Rule</span>
                </div>
                <h3 className="font-sans text-3xl font-bold mb-4 leading-tight text-paper">Earn 5 CES per Friend</h3>
                <p className="text-paper/70 text-sm mb-8 leading-relaxed max-w-sm">
                    Invite researchers or backers. You receive 5 CES points for every successful registration, plus bonuses when they complete their first Quest.
                </p>
                <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-paper/40">Your Exclusive Link</label>
                    <div className="flex">
                        <div className="flex-1 bg-paper/10 border border-paper/20 p-4 font-mono text-xs text-paper truncate rounded-l-sm flex items-center">{inviteLink}</div>
                        <button onClick={onCopy} className="bg-paper text-ink px-6 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-paper transition-colors rounded-r-sm flex items-center justify-center min-w-[100px]">
                            {copied ? <Check size={16} /> : <Copy size={16} />} <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-surface border border-ink/10 p-8 rounded-sm grid grid-cols-2 gap-8">
            <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-2">Successful Invites</span>
                <div className="flex items-baseline gap-2"><span className="font-mono text-4xl font-bold text-ink">{totalInvites}</span></div>
            </div>
            <div>
                <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 mb-2">Total CES Earned</span>
                <div className="flex items-baseline gap-2"><span className="font-mono text-4xl font-bold text-accent">{totalEarnings}</span></div>
            </div>
        </div>
    </div>
);

const InviteHistoryTable: React.FC<{
    activeTab: 'INVITED_BY_ME' | 'INVITED_ME';
    setActiveTab: (tab: 'INVITED_BY_ME' | 'INVITED_ME') => void;
    records: InviteRecord[];
    onEditPersonality: (record: InviteRecord) => void;
}> = ({ activeTab, setActiveTab, records, onEditPersonality }) => (
    <div className="bg-paper border border-ink/10 rounded-sm h-[486px] flex flex-col">
        <div className="flex border-b border-ink/10 shrink-0">
            {['INVITED_BY_ME', 'INVITED_ME'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-5 text-sm font-mono font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-ink text-paper' : 'text-ink/40 hover:text-ink hover:bg-stone/5'}`}>
                    {tab.replace(/_/g, ' ')}
                </button>
            ))}
        </div>
        <div className={`grid ${GRID_LAYOUT} px-6 py-4 border-b border-ink/10 bg-stone/5 text-[10px] font-mono font-bold uppercase tracking-widest text-ink/40 shrink-0`}>
            <div>User</div><div>Type</div><div>Status</div><div>Time</div><div className="text-right">Earnings</div>{activeTab === 'INVITED_ME' && <div className="text-right">Personality</div>}
        </div>
        <div className="flex-1 overflow-y-auto">
            {records.length > 0 ? records.map(record => (
                <div key={record.id} className={`grid ${GRID_LAYOUT} px-6 py-5 border-b border-ink/5 items-center hover:bg-stone/5 transition-colors group`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full border border-ink/10 overflow-hidden bg-stone/5 shrink-0"><img src={record.avatar} alt={record.user} className="w-full h-full object-cover" /></div>
                        <div className="flex flex-col min-w-0"><span className="font-bold text-ink text-sm truncate pr-2">{record.user}</span>{activeTab === 'INVITED_ME' && <span className="text-[10px] font-mono text-ink/40 uppercase">Referrer</span>}</div>
                    </div>
                    <div><span className="bg-stone/10 border border-ink/5 px-2 py-1 rounded-sm text-[10px] font-mono font-bold uppercase text-ink/60">{record.type}</span></div>
                    <div>
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${record.status === 'COMPLETED' ? 'text-green-700' : 'text-amber-600'}`}>
                            {record.status === 'COMPLETED' ? <><Check size={12} strokeWidth={3} /> {activeTab === 'INVITED_ME' ? 'Active' : 'Done'}</> : 'Pending'}
                        </span>
                    </div>
                    <div className="text-xs font-mono text-ink/50 whitespace-nowrap">{record.time}</div>
                    <div className="text-right">{activeTab === 'INVITED_BY_ME' ? <><span className={`font-mono font-bold text-sm ${record.earnings > 0 ? 'text-accent' : 'text-ink/30'}`}>+{record.earnings}</span><span className="text-[9px] font-mono font-bold text-ink/30 ml-1">CES</span></> : <span className="text-xs font-mono font-bold text-ink/40">--</span>}</div>
                    {activeTab === 'INVITED_ME' && (
                        <div className="flex justify-end">
                            {record.personalities && record.personalities.length > 0 ? (
                                <div className="group/edit flex items-center gap-2 justify-end w-full">
                                    <div className="flex flex-wrap justify-end gap-1 max-w-[120px]">
                                        {record.personalities.slice(0, 2).map((p, i) => <span key={i} className="text-[9px] font-bold font-mono text-ink bg-stone/10 px-1.5 py-0.5 rounded-sm border border-ink/5 truncate">{p}</span>)}
                                        {record.personalities.length > 2 && <span className="text-[9px] text-ink/40">+{record.personalities.length - 2}</span>}
                                    </div>
                                    <button onClick={() => onEditPersonality(record)} className="text-ink/30 hover:text-ink opacity-0 group-hover/edit:opacity-100 transition-opacity"><Edit2 size={12} /></button>
                                </div>
                            ) : (
                                <button onClick={() => onEditPersonality(record)} className="text-[10px] font-bold font-mono uppercase text-ink/30 hover:text-accent border border-dashed border-ink/20 hover:border-accent px-2 py-1 rounded-sm flex items-center gap-1 transition-all"><Plus size={10} /> Add Tag</button>
                            )}
                        </div>
                    )}
                </div>
            )) : (
                <div className="flex flex-col items-center justify-center py-24 text-ink/40"><User size={48} className="mb-4 opacity-50" /><span className="font-mono text-sm uppercase tracking-widest">No records found</span></div>
            )}
        </div>
    </div>
);

const SocialProof: React.FC<{ cards: any[] }> = ({ cards }) => (
    <div className="mt-8">
        <h3 className="font-sans text-3xl font-bold text-ink mb-10">What Others Say About You</h3>
        {cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map(card => (
                    <div key={card.id} className="bg-paper border border-ink/10 p-8 rounded-sm hover:border-accent/50 hover:shadow-sm transition-all group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full border border-ink/10 overflow-hidden bg-stone/5"><img src={card.avatar} alt={card.user} className="w-full h-full object-cover" /></div>
                                <div><span className="font-bold text-lg text-ink block leading-tight">{card.user}</span><span className="text-[10px] font-mono text-ink/40 uppercase tracking-widest">Collaborator</span></div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-8 flex-1">{card.tags.map((tag: string, i: number) => <span key={i} className="bg-stone/5 text-ink/60 px-3 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wide border border-ink/5">{tag}</span>)}</div>
                        <button className="w-full bg-ink text-paper py-3 rounded-sm font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-sm mt-auto">Show in My Profile</button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-stone/5 border border-dashed border-ink/10 rounded-sm p-12 text-center"><Users size={32} className="mx-auto text-ink/20 mb-4" /><p className="text-ink/40 font-mono text-sm uppercase tracking-widest">No social proof yet. Add tags to your friends!</p></div>
        )}
    </div>
);

// --- Main Page ---

export const InviteFriends: React.FC = () => {
    const { wallet } = useWallet();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'INVITED_BY_ME' | 'INVITED_ME'>('INVITED_BY_ME');
    const [copied, setCopied] = useState(false);
    const [inviteHistory] = useState<InviteRecord[]>(INITIAL_INVITE_HISTORY);
    const [invitedMeHistory, setInvitedMeHistory] = useState<InviteRecord[]>(MOCK_INVITED_ME);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<InviteRecord | null>(null);

    const handleCopy = () => {
        if (!wallet) return;
        navigator.clipboard.writeText(`${window.location.origin}/#/accept-invite?ref=${wallet.address.slice(0,8)}`);
        setCopied(true);
        showToast("Invite link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePersonality = (tags: string[]) => {
        if (editingRecord) {
            setInvitedMeHistory(prev => prev.map(item => item.id === editingRecord.id ? { ...item, personalities: tags } : item));
            setIsEditModalOpen(false);
            setEditingRecord(null);
            showToast("Personalities updated");
        }
    };

    const totalInvites = inviteHistory.length;
    const totalEarnings = inviteHistory.reduce((sum, item) => sum + item.earnings, 0);
    const socialProofCards = invitedMeHistory.filter(item => item.personalities?.length).map(item => ({
        id: item.id,
        user: item.user,
        avatar: item.avatar,
        tags: item.personalities || [],
    }));

    return (
        <div className="min-h-screen bg-paper pb-24">
            <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/" className="flex items-center text-sm font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-8 uppercase tracking-widest w-fit p-2 -ml-2"><ArrowLeft size={16} className="mr-2" /> Back to Home</Link>
                    <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-4">Invite Friends</h1>
                    <p className="font-sans text-ink/70 max-w-2xl text-xl leading-relaxed">Share the experience with your friends and earn rewards together.</p>
                </div>
            </div>
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-4"><InviteStats inviteLink={wallet ? `${window.location.origin}/#/accept-invite?ref=${wallet.address.slice(0,8)}` : 'Please connect wallet'} onCopy={handleCopy} copied={copied} totalInvites={totalInvites} totalEarnings={totalEarnings} /></div>
                    <div className="lg:col-span-8"><InviteHistoryTable activeTab={activeTab} setActiveTab={setActiveTab} records={activeTab === 'INVITED_BY_ME' ? inviteHistory : invitedMeHistory} onEditPersonality={(r) => { setEditingRecord(r); setIsEditModalOpen(true); }} /></div>
                </div>
                <SocialProof cards={socialProofCards} />
            </div>
            <EditPersonalityModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialTags={editingRecord?.personalities || []} onSave={handleSavePersonality} />
        </div>
    );
};
