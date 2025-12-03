import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Shield, Wallet, Save, Mail, Key, CheckCircle, Loader2, Copy, ChevronRight, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

export const Settings: React.FC = () => {
    const { wallet } = useWallet();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'SECURITY'>('PROFILE');
    
    // Mock State for Form
    const [formData, setFormData] = useState({
        displayName: wallet?.name || 'Dr. Aris Kothari',
        bio: 'Leading researcher in quantum biology and neural coherence.',
        email: 'aris.kothari@institute.edu',
        publicProfile: true,
    });

    // Password Setup State (Modal)
    const [isPasswordSetupOpen, setIsPasswordSetupOpen] = useState(false);
    const [passwordStep, setPasswordStep] = useState<'INITIAL' | 'VERIFYING'>('INITIAL');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSave = () => {
        showToast("Settings saved successfully");
    };

    const handleSendCode = () => {
        // Use the bound email from formData
        setIsSendingCode(true);
        setTimeout(() => {
            setIsSendingCode(false);
            setPasswordStep('VERIFYING');
            showToast(`Verification code sent to ${formData.email}`);
        }, 1500);
    };

    const handleVerifyAndSetPassword = () => {
        if (!verificationCode || !newPassword) {
            showToast("Please fill in all fields");
            return;
        }
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setPasswordStep('INITIAL');
            setVerificationCode('');
            setNewPassword('');
            setIsPasswordSetupOpen(false); // Close modal on success
            showToast("Wallet signature password updated successfully");
        }, 1500);
    };

    const copyAddress = () => {
        if (wallet?.address) {
            navigator.clipboard.writeText(wallet.address);
            showToast("Address copied");
        }
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            {/* Header */}
            <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/" className="flex items-center text-sm font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-8 uppercase tracking-widest w-fit p-2 -ml-2">
                        <ArrowLeft size={16} className="mr-2" /> BACK TO HOME
                    </Link>
                    <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-4">Settings</h1>
                    <p className="font-sans text-ink/70 max-w-2xl text-xl leading-relaxed">
                        Manage your profile and account security.
                    </p>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3">
                    <nav className="space-y-4">
                        <button 
                            onClick={() => setActiveTab('PROFILE')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-none font-mono text-sm font-bold uppercase tracking-wider transition-colors border-l-4 ${
                                activeTab === 'PROFILE' ? 'bg-ink text-paper border-ink' : 'hover:bg-ink/5 text-ink/60 border-transparent'
                            }`}
                        >
                            <User size={18} />
                            <span>Profile</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('SECURITY')}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-none font-mono text-sm font-bold uppercase tracking-wider transition-colors border-l-4 ${
                                activeTab === 'SECURITY' ? 'bg-ink text-paper border-ink' : 'hover:bg-ink/5 text-ink/60 border-transparent'
                            }`}
                        >
                            <Shield size={18} />
                            <span>Security</span>
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 bg-surface border-2 border-ink/10 rounded-none p-10 md:p-16">
                    
                    {/* PROFILE SETTINGS */}
                    {activeTab === 'PROFILE' && (
                        <div className="space-y-10 animate-in fade-in duration-300">
                            <h2 className="font-sans text-3xl font-bold border-b border-ink/10 pb-6">Public Profile</h2>
                            
                            <div className="flex items-center space-x-8 mb-10">
                                <div className="w-28 h-28 rounded-full border-2 border-ink/10 overflow-hidden relative group cursor-pointer">
                                    <img src={wallet?.avatar || 'https://i.pravatar.cc/150?u=3'} alt="Avatar" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-mono font-bold uppercase">
                                        CHANGE
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-1">{formData.displayName}</h3>
                                    <span className="text-sm font-mono font-bold text-ink/60 uppercase tracking-widest">Researcher</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-3">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                        className="w-full bg-paper border border-ink/20 p-4 font-sans text-base text-ink focus:outline-none focus:border-accent rounded-sm shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-3">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-paper border border-ink/20 p-4 font-sans text-base text-ink focus:outline-none focus:border-accent rounded-sm shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-3">Bio</label>
                                    <textarea 
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        className="w-full bg-paper border border-ink/20 p-4 font-sans text-base text-ink focus:outline-none focus:border-accent rounded-sm h-40 resize-none leading-relaxed shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 pt-4">
                                <input 
                                    type="checkbox" 
                                    id="publicProfile"
                                    checked={formData.publicProfile}
                                    onChange={(e) => setFormData({...formData, publicProfile: e.target.checked})}
                                    className="w-5 h-5 accent-accent cursor-pointer"
                                />
                                <label htmlFor="publicProfile" className="text-base font-bold text-ink/80 cursor-pointer select-none">Make my profile visible to other researchers</label>
                            </div>

                            {/* Action Bar */}
                            <div className="mt-16 pt-10 border-t border-ink/10 flex justify-end">
                                <button 
                                    onClick={handleSave}
                                    className="bg-ink text-paper px-10 py-5 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full flex items-center space-x-3 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SECURITY SETTINGS */}
                    {activeTab === 'SECURITY' && (
                        <div className="max-w-4xl animate-in fade-in duration-300">
                             <h2 className="font-sans text-3xl font-bold mb-10 border-b border-ink/10 pb-6">Security & Wallet</h2>

                             <div className="bg-surface border-2 border-ink/10 rounded-none divide-y divide-ink/10">
                                
                                {/* 1. Email Row */}
                                <div className="p-10 flex flex-col md:flex-row md:items-center justify-between group hover:bg-ink/5 transition-colors gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/50 mb-3">Verified Email</span>
                                        <div className="flex items-center space-x-3">
                                            <Mail size={20} className="text-ink/60" />
                                            <span className="font-sans font-bold text-ink text-lg">{formData.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-ink/60 text-xs font-mono font-bold bg-stone/10 px-4 py-2 rounded-full border border-ink/5">
                                        <Shield size={14} className="mr-2" />
                                        <span>Not Editable</span>
                                    </div>
                                </div>

                                {/* 2. Address Row */}
                                <div className="p-10 flex flex-col md:flex-row md:items-center justify-between group hover:bg-ink/5 transition-colors gap-4">
                                     <div className="flex flex-col">
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/50 mb-3">Wallet Address</span>
                                        <div className="flex items-center space-x-3">
                                            <Wallet size={20} className="text-ink/60" />
                                            <span className="font-mono font-bold text-ink text-base">{wallet?.address || 'Not Connected'}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={copyAddress}
                                        className="flex items-center justify-center space-x-2 text-xs font-bold font-mono text-ink hover:text-white uppercase tracking-wider bg-white border border-ink/10 px-6 py-3 rounded-full hover:bg-accent hover:border-accent transition-all shadow-sm"
                                    >
                                        <Copy size={16} />
                                        <span>Copy</span>
                                    </button>
                                </div>

                                {/* 3. Transaction Password Row */}
                                <div className="p-10 flex flex-col md:flex-row md:items-center justify-between group hover:bg-ink/5 transition-colors gap-4">
                                     <div className="flex flex-col">
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink/50 mb-3">Transaction Password</span>
                                        <div className="flex items-center space-x-3">
                                            <Key size={20} className="text-ink/60" />
                                            <span className="font-sans font-bold text-ink text-2xl tracking-[0.2em] leading-none mt-1">••••••••</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsPasswordSetupOpen(true)}
                                        className="flex items-center justify-center space-x-2 text-xs font-bold font-mono text-paper bg-ink hover:bg-accent uppercase tracking-wider px-8 py-4 rounded-full transition-all shadow-md hover:scale-[1.02]"
                                    >
                                        <span>Change Password</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                             <div className="mt-16 pt-10 border-t border-ink/10 flex justify-end">
                                <button className="text-red-500 font-mono text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors flex items-center space-x-3 opacity-70 hover:opacity-100 p-2">
                                    <span>Disconnect Wallet</span>
                                </button>
                             </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Password Change Modal */}
            {isPasswordSetupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-paper w-full max-w-xl p-10 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                        {/* Header Flex Layout */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-3 pr-8">
                                <Key size={32} className="text-accent shrink-0"/>
                                <h3 className="font-sans text-3xl font-bold text-ink leading-tight">Change Signature Password</h3>
                            </div>
                            <button 
                                onClick={() => {
                                    setIsPasswordSetupOpen(false);
                                    setPasswordStep('INITIAL');
                                }}
                                className="-mr-2 -mt-2 p-3 bg-ink/5 hover:bg-ink/10 rounded-full text-ink/60 hover:text-red-600 transition-colors shrink-0"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <p className="text-base text-ink/70 mb-10 max-w-md leading-relaxed">
                            Protect your assets. This password will be required for all outgoing transactions.
                        </p>

                        {passwordStep === 'INITIAL' ? (
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-3 font-bold">Bound Email Address</label>
                                    <div className="bg-stone/10 border border-ink/10 p-5 rounded-sm flex items-center space-x-4">
                                        <Mail size={20} className="text-ink/60"/>
                                        <span className="font-mono text-base text-ink font-bold break-all">{formData.email}</span>
                                    </div>
                                    <p className="text-xs font-bold text-ink/40 mt-3 flex items-center">
                                        <CheckCircle size={12} className="mr-2" /> We will send a verification code to this email.
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={handleSendCode}
                                    disabled={isSendingCode}
                                    className="w-full bg-ink text-paper px-8 py-5 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full flex justify-center items-center shadow-lg hover:scale-[1.01]"
                                >
                                    {isSendingCode ? <Loader2 size={18} className="animate-spin mr-3"/> : null}
                                    {isSendingCode ? "Sending Code..." : "Send Verification Code"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div className="bg-green-100 text-green-800 px-5 py-4 rounded-sm text-sm font-mono flex items-start border border-green-200">
                                    <CheckCircle size={16} className="mr-3 mt-0.5 shrink-0"/>
                                    <span className="break-words w-full">Verification code sent to <strong className="ml-1 text-green-900">{formData.email}</strong></span>
                                </div>

                                {/* Inputs Vertical Layout */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-3 font-bold">Verification Code</label>
                                        <input 
                                            type="text" 
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="123456"
                                            className="w-full bg-surface border border-ink/20 p-4 font-mono text-xl text-ink focus:outline-none focus:border-accent rounded-sm uppercase tracking-[0.5em] text-center font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-ink/60 mb-3 font-bold">New Password</label>
                                        <input 
                                            type="password" 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="********"
                                            className="w-full bg-surface border border-ink/20 p-4 font-mono text-xl text-ink focus:outline-none focus:border-accent rounded-sm text-center font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6">
                                    <button 
                                        onClick={() => setPasswordStep('INITIAL')}
                                        className="text-xs font-mono font-bold uppercase tracking-widest text-ink/50 hover:text-ink px-4 py-3"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={handleVerifyAndSetPassword}
                                        disabled={isVerifying}
                                        className="bg-ink text-paper px-10 py-4 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors rounded-full flex items-center shadow-lg hover:scale-[1.02]"
                                    >
                                        {isVerifying ? <Loader2 size={16} className="animate-spin mr-3"/> : null}
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};