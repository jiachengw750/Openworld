
import React, { useEffect, useState, useRef } from 'react';
import { Beaker, Sun, Moon, Wallet, ChevronDown, Check, Copy, LogOut, Heart, Settings, FlaskConical, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

export const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : false;
    }
    return false;
  });

  const { wallet, connect, disconnect } = useWallet();
  const { showToast } = useToast();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isScientist, setIsScientist] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyError, setVerifyError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleDisconnect = () => {
    disconnect();
    setIsMenuOpen(false);
    setIsScientist(false);
    navigate('/');
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      showToast('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleVerifyScientist = () => {
      if (verificationCode.trim().toUpperCase() === 'SCIENCE') {
          setIsScientist(true);
          setVerifyError(false);
          showToast('Scientist verified successfully');
      } else {
          setVerifyError(true);
      }
  };

  const isActive = (path: string) => location.pathname === path ? 'text-ink' : 'text-ink/70 hover:text-ink';

  return (
    <nav 
        className={`sticky top-0 z-50 bg-paper/95 border-b border-ink/5 backdrop-blur-md transition-all duration-500 ease-in-out ${
            isScrolled ? 'h-[72px]' : 'h-[88px]'
        }`}
    >
      <div className="max-w-[1512px] mx-auto flex items-center justify-between h-full px-6 md:px-12">
        
        {/* Left: Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center rounded-sm shadow-sm">
            <Beaker size={20} strokeWidth={2.5} />
          </div>
          <span className="font-sans text-2xl font-bold tracking-tight text-ink">
            catalyst.
          </span>
        </Link>

        {/* Center: Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-bold font-mono uppercase tracking-widest text-ink/70">
          <Link to="/" className={`${isActive('/')} transition-colors`}>HOME</Link>
          <a href="#" className="hover:text-ink transition-colors">GRANTS</a>
          <Link to="/quest" className={`${isActive('/quest')} transition-colors`}>QUEST</Link>
          <a href="#" className="hover:text-ink transition-colors">AI TOOLS</a>
          
          <a href="#" className="hover:text-ink transition-colors flex items-center group">
             WLS
             <span className="ml-2 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full group-hover:bg-red-500/20 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold text-red-600 tracking-wider leading-none">LIVE</span>
             </span>
          </a>

          <a href="#" className="hover:text-ink transition-colors">PRIZE</a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* 1. Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="text-ink/60 hover:text-ink transition-colors p-2 hidden sm:block"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          
          {/* 2. Connect Wallet / User Profile */}
          {!wallet ? (
            <button 
              onClick={connect}
              className="flex items-center space-x-2 bg-ink text-paper px-7 py-3 rounded-full font-mono text-sm font-bold uppercase tracking-widest hover:bg-ink/90 transition-all hover:scale-105 active:scale-95"
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
                {/* Create Quest Button (Scientist Only) */}
                {isScientist && (
                    <Link
                        to="/create-quest"
                        className={`flex items-center space-x-2 px-4 py-2 rounded-sm font-mono text-xs font-bold uppercase tracking-widest transition-all border border-ink/10 hover:bg-ink hover:text-paper group ${isActive('/create-quest')}`}
                    >
                        <PlusCircle size={16} />
                        <span className="hidden sm:inline">Create</span>
                    </Link>
                )}

                {/* Workspace Button */}
                <Link 
                    to="/workspace"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-sm font-mono text-xs font-bold uppercase tracking-widest transition-all border border-ink/10 hover:bg-ink hover:text-paper group ${isActive('/workspace')}`}
                >
                    <LayoutDashboard size={16} />
                    <span className="hidden sm:inline">Workspace</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={menuRef}>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-3 group bg-stone/5 hover:bg-stone/10 px-2 pl-2 pr-4 py-1.5 rounded-full border border-ink/5 transition-all"
                >
                    <img 
                        src={wallet.avatar} 
                        alt="User" 
                        className="w-9 h-9 rounded-full border border-ink/10 group-hover:border-accent transition-colors object-cover" 
                    />
                    <div className="text-left hidden sm:flex flex-col">
                        <span className="block text-sm font-sans font-bold text-ink group-hover:text-accent transition-colors leading-tight">{wallet.name}</span>
                        <span className="block text-[10px] font-mono font-medium text-ink/50 tracking-wide">{wallet.address.slice(0, 5)}...</span>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-4 w-[360px] bg-paper border border-ink/10 shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50 flex flex-col">
                        
                        {/* User Info */}
                        <div className="p-6 pb-4">
                            <div className="flex items-start space-x-4 mb-5">
                                <img src={wallet.avatar} alt="User" className="w-14 h-14 rounded-full object-cover border border-ink/10 grayscale" />
                                <div className="flex flex-col pt-1">
                                    <span className="font-sans font-bold text-xl text-ink leading-tight">{wallet.name}</span>
                                    <span className="font-mono text-sm text-ink/60 tracking-wide mt-1">{isScientist ? 'Researcher' : 'Backer'}</span>
                                </div>
                            </div>
                            <div 
                                className="bg-stone/5 border border-ink/10 p-4 flex justify-between items-center rounded-sm group/copy cursor-pointer hover:border-ink/30 transition-colors"
                                onClick={copyAddress}
                            >
                                <span className="font-mono text-sm text-ink/80 group-hover/copy:text-ink transition-colors tracking-wide">
                                    {shortenAddress(wallet.address)}
                                </span>
                                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-ink/40 group-hover/copy:text-accent transition-colors" />}
                            </div>
                        </div>

                        <div className="h-px bg-ink/10 mx-6"></div>

                        {/* Navigation List */}
                        <div className="py-2">
                            <Link 
                                to="/profile" 
                                onClick={() => setIsMenuOpen(false)}
                                className="px-6 py-4 flex justify-between items-center group hover:bg-stone/5 transition-colors"
                            >
                                <span className="font-mono text-base font-bold text-ink/80 group-hover:text-ink">My Profile</span>
                                <User size={20} strokeWidth={1.5} className="text-ink/40 group-hover:text-ink transition-colors" />
                            </Link>
                            
                            <Link 
                                to="/my-wallet" 
                                onClick={() => setIsMenuOpen(false)}
                                className="px-6 py-4 flex justify-between items-center group hover:bg-stone/5 transition-colors"
                            >
                                <span className="font-mono text-base font-bold text-ink/80 group-hover:text-ink">My Wallet</span>
                                <Wallet size={20} strokeWidth={1.5} className="text-ink/40 group-hover:text-ink transition-colors" />
                            </Link>
                            
                            <Link 
                                to="/my-donations" 
                                onClick={() => setIsMenuOpen(false)}
                                className="px-6 py-4 flex justify-between items-center group hover:bg-stone/5 transition-colors"
                            >
                                <span className="font-mono text-base font-bold text-ink/80 group-hover:text-ink">Donations</span>
                                <Heart size={20} strokeWidth={1.5} className="text-ink/40 group-hover:text-ink transition-colors" />
                            </Link>

                            <div 
                                onClick={() => {
                                    if (isScientist) {
                                        navigate('/my-projects');
                                        setIsMenuOpen(false);
                                    }
                                }}
                                className={`px-6 py-4 flex justify-between items-center group transition-colors ${
                                    isScientist ? 'hover:bg-stone/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                                }`}
                            >
                                <span className="font-mono text-base font-bold text-ink/80 group-hover:text-ink">My Project</span>
                                <FlaskConical size={20} strokeWidth={1.5} className="text-ink/40 group-hover:text-ink transition-colors" />
                            </div>
                            
                            <Link 
                                to="/settings"
                                onClick={() => setIsMenuOpen(false)}
                                className="px-6 py-4 flex justify-between items-center group hover:bg-stone/5 transition-colors"
                            >
                                 <span className="font-mono text-base font-bold text-ink/80 group-hover:text-ink">Settings</span>
                                 <Settings size={20} strokeWidth={1.5} className="text-ink/40 group-hover:text-ink transition-colors" />
                            </Link>
                        </div>

                        {/* Verification Section */}
                        {!isScientist && (
                            <>
                                 <div className="h-px bg-ink/10 mx-6"></div>
                                 <div className="p-6">
                                    <p className="text-xs font-bold font-mono text-ink/60 uppercase tracking-widest mb-3">Researcher Access Code</p>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            placeholder="CODE" 
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className={`bg-stone/5 border ${verifyError ? 'border-red-400' : 'border-ink/10'} text-sm px-4 py-3 font-mono focus:outline-none focus:border-accent text-ink w-full rounded-sm transition-all placeholder:text-ink/30`}
                                        />
                                        <button 
                                            onClick={handleVerifyScientist}
                                            className="bg-ink text-paper px-5 py-3 hover:bg-ink/90 transition-colors font-mono text-xs font-bold uppercase rounded-sm tracking-wider"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Footer */}
                        <div className="p-4 bg-stone/5 border-t border-ink/10 flex justify-center">
                             <button 
                                onClick={handleDisconnect}
                                className="flex items-center space-x-2 text-xs font-bold font-mono text-ink/60 hover:text-red-600 transition-colors uppercase tracking-widest py-2"
                             >
                                <LogOut size={14} />
                                <span>Disconnect</span>
                             </button>
                        </div>
                    </div>
                )}
                </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
