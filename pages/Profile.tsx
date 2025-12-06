
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, Github, Linkedin, Twitter,
  GraduationCap, Fingerprint, Verified, Camera
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { PROJECTS, INITIAL_PROFILE, INITIAL_STORIES, INITIAL_IDA, INITIAL_REVIEWS } from '../constants';
import { StoryItem, IdaArticle, ReviewItem, UserProfile } from '../types';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { AddStoryModal } from '../components/modals/AddStoryModal';
import { PlatformVerificationModal } from '../components/modals/PlatformVerificationModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { StoryTab, ProjectsTab, IdaTab, ReviewsTab } from '../components/profile/ProfileTabs';
import { TagSection } from '../components/profile/TagSection';

type TabType = 'MY_STORY' | 'PROJECTS' | 'IDA' | 'REVIEWS';

export const Profile: React.FC = () => {
    const { wallet } = useWallet();
    const { showToast } = useToast();
    
    // UI State
    const [activeTab, setActiveTab] = useState<TabType>('MY_STORY');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [isScholarModalOpen, setIsScholarModalOpen] = useState(false);
    
    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storyToDeleteId, setStoryToDeleteId] = useState<string | null>(null);
    
    // Data State
    const [profileData, setProfileData] = useState<UserProfile>(INITIAL_PROFILE);
    const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
    const [idaArticles, setIdaArticles] = useState<IdaArticle[]>(INITIAL_IDA);
    const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
    
    const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
    const [scholarLink, setScholarLink] = useState('');

    useEffect(() => {
        if (wallet?.connected) {
            setProfileData(prev => ({ ...prev, name: wallet.name, avatar: wallet.avatar }));
        }
    }, [wallet]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const myProjects = PROJECTS.filter(p => p.author === profileData.name || p.author === "Dr. Aris Kothari" || p.author === "Dr. Wei Zhang");

    // Handlers
    const handleStoryHandlers = {
        add: () => { setEditingStory(null); setIsStoryModalOpen(true); },
        edit: (item: StoryItem) => { setEditingStory(item); setIsStoryModalOpen(true); },
        delete: (id: string) => { 
            setStoryToDeleteId(id);
            setIsDeleteModalOpen(true);
        },
        save: (data: { time: string; title: string; description: string }) => {
            if (editingStory) setStories(prev => prev.map(s => s.id === editingStory.id ? { ...s, date: data.time, title: data.title, description: data.description } : s));
            else setStories(prev => [{ id: Date.now().toString(), date: data.time, title: data.title, description: data.description }, ...prev]);
            showToast(editingStory ? 'Updated' : 'Added');
            setIsStoryModalOpen(false);
        }
    };

    const confirmDeleteStory = () => {
        if (storyToDeleteId) {
            setStories(prev => prev.filter(s => s.id !== storyToDeleteId));
            showToast('Story deleted successfully');
            setIsDeleteModalOpen(false);
            setStoryToDeleteId(null);
        }
    };

    const handleIdaHandlers = {
        pin: (id: string) => {
            setIdaArticles(prev => prev.map(i => i.id === id ? { ...i, isPinned: !i.isPinned } : i).sort((a, b) => (b.isPinned === a.isPinned) ? 0 : b.isPinned ? 1 : -1));
            showToast('Updated pin');
        },
        hide: (id: string) => setIdaArticles(prev => prev.map(i => i.id === id ? { ...i, isHidden: !i.isHidden } : i))
    };

    const handleAddResearch = (tag: string) => {
        setProfileData(prev => ({ ...prev, researchFields: [...prev.researchFields, tag] }));
    };

    const handleAddSubject = (tag: string) => {
        setProfileData(prev => ({ ...prev, subjects: [...prev.subjects, tag] }));
    };

    if (isLoading) return <div className="min-h-screen bg-paper pb-24"><div className="pt-24 px-6 md:px-12 bg-surface"><div className="h-4 w-32 rounded bg-stone/10 animate-pulse mb-6"></div></div><div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-8"><div className="bg-surface h-[400px] border border-ink/5 rounded-sm animate-pulse"></div></div></div>;

    return (
        <div className="min-h-screen bg-paper pb-24">
            <div className="bg-surface border-b border-ink/10 pt-24 pb-12 px-6 md:px-12">
                <div className="max-w-[1512px] mx-auto">
                    <Link to="/" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest w-fit mb-8">
                        <ArrowLeft size={14} className="mr-2" /> Back to Home
                    </Link>
                    <h1 className="font-sans text-5xl md:text-7xl font-bold text-ink mb-4">Profile</h1>
                    <p className="font-sans text-ink/70 max-w-2xl text-xl leading-relaxed">
                        Manage your personal data
                    </p>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 pb-12 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        {/* Profile Card */}
                        <div className="bg-surface border border-ink/5 rounded-sm mb-12 p-8 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 relative z-10">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border border-ink/10 shadow-sm"><img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" /></div>
                                    <button className="absolute bottom-0 right-0 bg-ink text-paper p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-90" onClick={() => setIsEditProfileOpen(true)}><Camera size={14}/></button>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="font-sans text-3xl font-bold text-ink">{profileData.name}</h1>
                                        <Verified size={18} className="text-blue-500 fill-current" strokeWidth={0}/>
                                        <div className="flex items-center gap-1.5 ml-1">
                                            {['A', 'S', 'M'].map((b, i) => <div key={i} className={`w-5 h-5 rounded-full text-paper flex items-center justify-center text-[9px] font-bold border shadow-sm ${b === 'A' ? 'bg-red-800 border-red-900' : b === 'S' ? 'bg-blue-800 border-blue-900' : 'bg-amber-600 border-amber-700'}`}>{b}</div>)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0.5 text-ink/60">
                                        <span className="font-sans text-base font-medium">{profileData.role}</span>
                                        <span className="font-sans text-sm text-ink/50">{profileData.institution}</span>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditProfileOpen(true)} className="hidden md:flex items-center gap-2 px-5 py-2 bg-stone/5 hover:bg-ink hover:text-paper border border-ink/10 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all"><Edit3 size={14}/> Edit</button>
                            </div>

                            <div className="mb-8 max-w-4xl">
                                <p className="font-sans text-ink/80 text-base leading-relaxed mb-6">{profileData.bio}</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <a href="#" className="p-2.5 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Github size={18}/></a>
                                    <a href="#" className="p-2.5 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Fingerprint size={18}/></a>
                                    <button onClick={() => !scholarLink && setIsScholarModalOpen(true)} className={`p-2.5 border rounded-full transition-colors ${scholarLink ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-stone/5 border-ink/5 text-ink hover:bg-ink hover:text-paper'}`}><GraduationCap size={18}/></button>
                                    <a href="#" className="p-2.5 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Linkedin size={18}/></a>
                                    <a href="#" className="p-2.5 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Twitter size={18}/></a>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <TagSection title="Research Fields" tags={profileData.researchFields} onAdd={handleAddResearch} onRemove={i => setProfileData(p => ({...p, researchFields: p.researchFields.filter((_, idx) => idx !== i)}))} />
                                <TagSection title="Subjects" tags={profileData.subjects} onAdd={handleAddSubject} onRemove={i => setProfileData(p => ({...p, subjects: p.subjects.filter((_, idx) => idx !== i)}))} />
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="border-b border-ink/10 mb-12 flex space-x-10">
                            {(['MY_STORY', 'PROJECTS', 'IDA', 'REVIEWS'] as TabType[]).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-mono font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}>
                                    {tab.replace('_', ' ')}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent"></div>}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'MY_STORY' && <StoryTab stories={stories} onAdd={handleStoryHandlers.add} onEdit={handleStoryHandlers.edit} onDelete={handleStoryHandlers.delete} />}
                        {activeTab === 'PROJECTS' && <ProjectsTab projects={myProjects} />}
                        {activeTab === 'IDA' && <IdaTab articles={idaArticles} onTogglePin={handleIdaHandlers.pin} onToggleHide={handleIdaHandlers.hide} />}
                        {activeTab === 'REVIEWS' && <ReviewsTab reviews={reviews} />}
                    </div>
                </div>
            </div>

            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} initialData={profileData} onSave={(data) => { setProfileData(data); setIsEditProfileOpen(false); showToast('Profile updated'); }} />
            <AddStoryModal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} initialData={editingStory ? { time: editingStory.date, title: editingStory.title, description: editingStory.description } : null} onSave={handleStoryHandlers.save} />
            <PlatformVerificationModal isOpen={isScholarModalOpen} onClose={() => setIsScholarModalOpen(false)} platformName="Google Scholar" onVerify={(link) => { setScholarLink(link); showToast('Verified'); }} />
            
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={confirmDeleteStory} 
                title="Delete Story"
                message="Are you sure you want to remove this milestone from your story? This action cannot be undone."
            />
        </div>
    );
};
