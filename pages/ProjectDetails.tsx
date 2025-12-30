
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, CheckCircle } from 'lucide-react';
import { PROJECTS } from '../constants';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { Donation } from '../types';

// Components
import { ProjectHero } from '../components/project/ProjectHero';
import { ProjectContent } from '../components/project/ProjectContent';
import { ProjectSidebar } from '../components/project/ProjectSidebar';
import { DonationModal } from '../components/modals/DonationModal';
import { DonationHistoryModal } from '../components/modals/DonationHistoryModal';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';

// Helper to generate mock donations for the modal
const generateMockDonations = (baseDonations: Donation[], count: number): Donation[] => {
    const extra: Donation[] = Array.from({ length: count }).map((_, i) => ({
        id: `mock-detail-${i}`,
        donor: i % 3 === 0 ? 'Anonymous' : i % 3 === 1 ? 'Science Fund' : 'Crypto Whale',
        amount: Math.floor(Math.random() * 5000) + 100,
        date: `${Math.floor(Math.random() * 30) + 1} days ago`,
        avatar: `https://i.pravatar.cc/150?u=${200 + i}`
    }));
    return [...baseDonations, ...extra];
};

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const initialProject = PROJECTS.find(p => p.id === id) || PROJECTS[0];
  const [project, setProject] = useState(initialProject);
  const { wallet } = useWallet();
  const { showToast } = useToast();
  
  const isOwner = wallet?.name === project.author || (!wallet && project.author === "Dr. Aris Kothari"); 
  const isResearchOrCompleted = project.status === 'RESEARCH' || project.status === 'COMPLETED';
  const canClaim = isOwner && isResearchOrCompleted;

  // Modals State
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<Donation[]>([]);

  // Claim State
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  // UI State
  const [isShared, setIsShared] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyNav(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShared(true);
    showToast('Project link copied to clipboard');
    setTimeout(() => setIsShared(false), 2000);
  };

  const handleOpenHistory = () => {
      const fullHistory = generateMockDonations(project.donations, 30); 
      setHistoryData(fullHistory);
      setIsHistoryModalOpen(true);
  };

  const handleSuccessDonation = (amount: number, newDonation: any) => {
        setProject(prev => ({
            ...prev,
            raised: prev.raised + amount,
            backers: prev.backers + 1,
            donations: [newDonation, ...(prev.donations || [])]
        }));
  };

  const handleInitiateClaim = () => {
      if (project.raised <= 0) return;
      setIsPasswordModalOpen(true);
  };

  const executeClaim = () => {
      setIsClaiming(true);
      setTimeout(() => {
          setHasClaimed(true);
          setIsClaiming(false);
          showToast(`Successfully claimed to IDA`);
      }, 2000);
      setIsPasswordModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-paper transition-colors duration-300">
      
      {/* Sticky Sub-Navigation */}
      <div 
        className={`fixed top-[72px] left-0 right-0 z-40 h-[48px] bg-paper/90 backdrop-blur-md border-b border-ink/10 flex items-center transition-all duration-500 ${
            showStickyNav ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="max-w-[1512px] mx-auto w-full px-6 md:px-12 flex justify-between items-center">
             <div className="flex items-center">
                 <Link 
                    to="/" 
                    className="flex items-center text-ink/60 hover:text-accent transition-colors mr-4"
                    title="Back to Projects"
                 >
                    <ArrowLeft size={18} />
                 </Link>
                 <div className="h-4 w-[1px] bg-ink/10 mx-4 hidden md:block"></div>
                 <span className="font-sans font-bold text-ink truncate max-w-[200px] md:max-w-md text-sm">
                    {project.title}
                 </span>
             </div>

             <button 
                onClick={handleShare}
                className="flex items-center justify-center text-ink/60 hover:text-ink transition-colors"
                title="Share Project"
             >
                {isShared ? <CheckCircle size={18} className="text-green-600" /> : <Share2 size={18} />}
             </button>
        </div>
      </div>

      <ProjectHero project={project} onShare={handleShare} isShared={isShared} />

      <div className="max-w-[1512px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-8 p-8 md:p-16 border-r border-ink/10">
                <ProjectContent project={project} />
            </div>

            <div className="lg:col-span-4 relative">
                <ProjectSidebar 
                    project={project}
                    isOwner={isOwner}
                    canClaim={canClaim}
                    hasClaimed={hasClaimed}
                    isClaiming={isClaiming}
                    onClaim={handleInitiateClaim}
                    onDonate={() => setIsDonationModalOpen(true)}
                    onViewDonationHistory={handleOpenHistory}
                />
            </div>
        </div>
      </div>

      <DonationModal 
          isOpen={isDonationModalOpen} 
          onClose={() => setIsDonationModalOpen(false)} 
          project={project}
          onSuccessUpdate={handleSuccessDonation}
      />

      <DonationHistoryModal 
          isOpen={isHistoryModalOpen} 
          onClose={() => setIsHistoryModalOpen(false)} 
          donations={historyData} 
      />

      <PasswordVerificationModal 
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onVerified={executeClaim}
      />
    </div>
  );
};
