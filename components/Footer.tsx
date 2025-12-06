
import React from 'react';
import { Beaker } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-accent dark:bg-surface text-paper dark:text-ink pt-20 pb-8 px-6 md:px-12 border-t border-paper/10 dark:border-ink/10 transition-colors duration-300">
      <div className="max-w-[1512px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="col-span-1 md:col-span-2 pr-8">
          <Link to="/" className="flex items-center space-x-3 group mb-8 w-fit">
            <div className="w-10 h-10 bg-paper dark:bg-ink text-accent dark:text-surface flex items-center justify-center rounded-sm shadow-sm transition-colors">
              <Beaker size={24} strokeWidth={2.5} />
            </div>
            <span className="font-sans text-3xl font-semibold tracking-tight text-paper dark:text-ink group-hover:opacity-80 transition-opacity">
              catalyst.
            </span>
          </Link>
          
          <p className="font-sans text-paper/60 dark:text-ink/60 max-w-md mb-6 leading-relaxed">
            Building the World's Largest Decentralized Research Funding Platform An Open Global and Engine for Scientific Collaboration, Redefining the Discovery and Flow of Scientific Value.
          </p>

          <p className="font-mono text-paper dark:text-ink text-xs uppercase tracking-widest font-bold">
            FOUNDED BY WLA
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="font-mono text-paper dark:text-ink text-base font-semibold uppercase tracking-widest">Docs & Resources</h4>
          <div className="flex flex-col space-y-3 text-sm font-medium text-paper/70 dark:text-ink/60">
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">Navigation</span>
            <Link to="/" className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors w-fit">Home</Link>
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">Active Grants</span>
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">About WLA</span>
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">Test Net</span>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-mono text-paper dark:text-ink text-base font-semibold uppercase tracking-widest">Community & Contact</h4>
          <div className="flex flex-col space-y-3 text-sm font-medium text-paper/70 dark:text-ink/60">
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">X</span>
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">Telegram</span>
            <span className="hover:text-paper dark:hover:text-ink hover:opacity-100 transition-colors cursor-pointer w-fit">Discord</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1512px] mx-auto mt-24 pt-8 border-t border-paper/10 dark:border-ink/10 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-paper/40 dark:text-ink/40">
        <p>&copy; OpenSCI 2025 All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span className="hover:text-paper dark:hover:text-ink transition-colors cursor-pointer">PRIVACY POLICY</span>
          <span className="hover:text-paper dark:hover:text-ink transition-colors cursor-pointer">TERMS OF SERVICE</span>
        </div>
      </div>
    </footer>
  );
};
