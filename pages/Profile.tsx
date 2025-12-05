
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, RefreshCw, 
  Building2, Edit3, Github, Linkedin, Twitter,
  BadgeCheck, Award, GraduationCap, Fingerprint, 
  Plus, Trash2, X, Save, BookOpen, MessageSquare,
  Hourglass, Sparkles, User, ThumbsUp, EyeOff, ArrowUpToLine,
  Star, Image as ImageIcon, Camera, Upload, Check, Eye, Calendar
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { PROJECTS } from '../constants';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { AddStoryModal } from '../components/modals/AddStoryModal';

// Types for the Story/Timeline
interface StoryItem {
    id: string;
    date: string;
    title: string;
    description: string;
}

interface IdaArticle {
    id: string;
    title: string;
    description: string;
    tags: string[];
    isFeatured: boolean;
    publicationDate: string;
    likes: number;
    comments: number;
    isPinned: boolean;
    isHidden: boolean;
}

interface ReviewItem {
    id: string;
    status: string;
    rating: number;
    title: string;
    description: string;
    publicationDate: string;
}

type TabType = 'MY_STORY' | 'PROJECTS' | 'IDA' | 'REVIEWS';

export const Profile: React.FC = () => {
  const { wallet } = useWallet();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('REVIEWS');
  const [isLoading, setIsLoading] = useState(true);
  
  // -- Story State --
  const [stories, setStories] = useState<StoryItem[]>([
      { 
          id: '1', 
          date: 'Nov, 2023', 
          title: 'Published the first selected paper titled "Application of Deep Learning in Medical Image Diagnosis"', 
          description: 'This study proposed a new neural network architecture, which significantly improved the diagnostic accuracy for lung diseases.' 
      },
      { 
          id: '2', 
          date: 'Jun, 2022', 
          title: 'Obtained the National Natural Science Foundation of China\'s Outstanding Young Investigator Project', 
          description: 'Project Name: Precision Medicine Research Based on Machine Learning' 
      },
      { 
          id: '3', 
          date: 'Jul, 2020', 
          title: 'Received a Ph.D. in Computer Science from Tsinghua University', 
          description: 'Doctoral Dissertation: "Research on Medical Image Analysis Methods Based on Deep Learning", Supervisor: Professor Zhang San' 
      }
  ]);

  // -- IDA State --
  const [idaArticles, setIdaArticles] = useState<IdaArticle[]>([
      {
        id: '1',
        title: 'The Application and Challenges of Deep Learning in Medical Image Diagnosis',
        description: 'This article systematically reviews the latest advancements of deep learning technology in the field of medical image diagnosis, analyzes the main challenges currently faced, and proposes future research directions.This article systematically reviews the latest advancements...',
        tags: ['MEDICINE AI'],
        isFeatured: true,
        publicationDate: 'Nov, 2023',
        likes: 234,
        comments: 45,
        isPinned: false,
        isHidden: false,
      },
      {
        id: '2',
        title: 'The Application of Federated Learning in Protecting Privacy of Medical Data',
        description: 'Introduce how the federated learning technology enables AI model collaboration training among multiple medical institutions while protecting patient privacy.',
        tags: ['EXPLAINABLE AI'],
        isFeatured: false,
        publicationDate: 'Nov, 2023',
        likes: 234,
        comments: 45,
        isPinned: false,
        isHidden: false,
      },
      {
        id: '3',
        title: 'Deep Learning in Precision Medicine: A Comprehensive Survey',
        description: 'A deep dive into how AI is revolutionizing personalized treatment plans by analyzing genomic data and medical history with unprecedented accuracy.',
        tags: ['PRECISION MEDICINE'],
        isFeatured: false,
        publicationDate: 'Oct, 2023',
        likes: 189,
        comments: 32,
        isPinned: false,
        isHidden: false,
      }
  ]);

  // -- Reviews State --
  const [reviews, setReviews] = useState<ReviewItem[]>([
      {
          id: '1',
          status: 'PUBLISHED',
          rating: 4.2,
          title: 'A new method for protein structure prediction based on Transformer A new method for...',
          description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction. The experimental design is reasonable and the results are convincing. It is suggested that the authors should provide a detailed comparison with AlphaFold2 in the...',
          publicationDate: 'OCT,2023'
      },
      {
          id: '2',
          status: 'PUBLISHED',
          rating: 4.2,
          title: 'A new method for protein structure prediction based on Transformer',
          description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction. The experimental design is reasonable and the results are convincing.',
          publicationDate: 'OCT,2023'
      },
      {
          id: '3',
          status: 'PUBLISHED',
          rating: 4.2,
          title: 'A new method for protein structure prediction based on Transformer',
          description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction.',
          publicationDate: 'OCT,2023'
      }
  ]);
  
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  
  // -- Profile Data State --
  const [profileData, setProfileData] = useState({
      name: "Zhang Wei",
      role: "Associate Professor",
      institution: "School of Medicine, Tsinghua University",
      avatar: "https://i.pravatar.cc/300?u=zhangwei",
      banner: "https://picsum.photos/seed/science_banner/1200/400",
      bio: "Specializing in Medical Artificial Intelligence and the application of deep learning in medical imaging diagnostics. Dedicated to advancing the innovation and application of AI technologies in precision medicine, with over 50 SCI-indexed publications and leadership in three National Natural Science Foundation of China projects.",
      joinDate: "Jul, 2020",
      // These are managed inline on the profile page
      researchFields: ['Medical AI', 'Deep Learning', 'Precision Medicine', 'Medical Imaging'],
      subjects: ['Quantum mechanic', 'Introduction to Mathematics'],
      // Kept for modal compatibility if needed, though we primarily use the above two now
      fieldsOfStudy: ['Medical AI', 'Deep Learning', 'Precision Medicine', 'Medical Imaging']
  });

  // -- Edit Profile Modal State --
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(profileData);

  // -- Inline Tag Editing State --
  const [isAddingResearch, setIsAddingResearch] = useState(false);
  const [researchInput, setResearchInput] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');

  // Effect to sync wallet if connected
  useEffect(() => {
      if (wallet?.connected) {
          setProfileData(prev => ({
              ...prev,
              name: wallet.name,
              avatar: wallet.avatar
          }));
      }
  }, [wallet]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const myProjects = PROJECTS.filter(p => p.author === profileData.name || p.author === "Dr. Aris Kothari" || p.author === "Dr. Wei Zhang");

  // -- Handlers --

  const handleOpenAddStory = () => {
      setEditingStory(null);
      setIsStoryModalOpen(true);
  };

  const handleOpenEditStory = (item: StoryItem) => {
      setEditingStory(item);
      setIsStoryModalOpen(true);
  };

  const handleDeleteStory = (id: string) => {
      if (confirm('Are you sure you want to delete this entry?')) {
          setStories(prev => prev.filter(s => s.id !== id));
          showToast('Entry deleted');
      }
  };

  const handleSaveStory = (data: { time: string; title: string; description: string }) => {
      if (editingStory) {
          setStories(prev => prev.map(s => s.id === editingStory.id ? { ...s, date: data.time, title: data.title, description: data.description } : s));
          showToast('Entry updated');
      } else {
          const newStory: StoryItem = {
              id: Date.now().toString(),
              date: data.time,
              title: data.title,
              description: data.description
          };
          setStories(prev => [newStory, ...prev]);
          showToast('New entry added');
      }
      setIsStoryModalOpen(false);
  };

  const handleTogglePin = (id: string) => {
      setIdaArticles(prev => {
          const updated = prev.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item);
          return updated.sort((a, b) => (b.isPinned === a.isPinned) ? 0 : b.isPinned ? 1 : -1);
      });
      showToast('Article pin state updated');
  };

  const handleToggleHide = (id: string) => {
       setIdaArticles(prev => prev.map(item => item.id === id ? { ...item, isHidden: !item.isHidden } : item));
  };

  // -- Profile Edit Handlers --
  const handleOpenEditProfile = () => {
      setEditFormData(profileData);
      setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (data: typeof profileData) => {
      setProfileData(data);
      setIsEditProfileOpen(false);
      showToast('Profile updated successfully');
  };

  // -- Inline Tag Handlers --
  const handleAddResearchField = () => {
      if (researchInput.trim()) {
          setProfileData(prev => ({
              ...prev,
              researchFields: [...prev.researchFields, researchInput.trim()]
          }));
          setResearchInput('');
          setIsAddingResearch(false);
      }
  };

  const handleRemoveResearchField = (index: number) => {
      setProfileData(prev => ({
          ...prev,
          researchFields: prev.researchFields.filter((_, i) => i !== index)
      }));
  };

  const handleAddSubject = () => {
      if (subjectInput.trim()) {
          setProfileData(prev => ({
              ...prev,
              subjects: [...prev.subjects, subjectInput.trim()]
          }));
          setSubjectInput('');
          setIsAddingSubject(false);
      }
  };

  const handleRemoveSubject = (index: number) => {
      setProfileData(prev => ({
          ...prev,
          subjects: prev.subjects.filter((_, i) => i !== index)
      }));
  };

  const shimmerClass = "bg-gradient-to-r from-stone-200 via-stone-50 to-stone-200 bg-[length:400%_100%] animate-shimmer";

  if (isLoading) {
    return (
        <div className="min-h-screen bg-paper pb-24">
            {/* Header / Breadcrumb Skeleton */}
            <div className="pt-24 px-6 md:px-12 bg-surface">
                <div className="max-w-[1512px] mx-auto">
                    <div className={`h-4 w-32 rounded mb-6 ${shimmerClass}`}></div>
                </div>
            </div>

            <div className="max-w-[1512px] mx-auto px-6 md:px-12 pb-12 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        {/* Profile Header Card Skeleton */}
                        <div className="bg-surface border border-ink/5 rounded-sm mb-12 p-8 md:p-12 relative overflow-hidden h-[420px]">
                            <div className="absolute inset-0 bg-stone-100/50">
                                <div className={`absolute inset-0 opacity-50 ${shimmerClass}`}></div>
                            </div>
                            <div className="relative z-10 mt-32 flex flex-col md:flex-row items-start gap-6">
                                <div className={`w-28 h-28 rounded-full border-4 border-white shrink-0 ${shimmerClass}`}></div>
                                <div className="flex-1 pt-4 space-y-3">
                                    <div className={`h-8 w-48 rounded ${shimmerClass}`}></div>
                                    <div className={`h-4 w-32 rounded ${shimmerClass}`}></div>
                                    <div className={`h-4 w-40 rounded ${shimmerClass}`}></div>
                                </div>
                                <div className={`w-24 h-8 rounded-full mt-4 md:mt-0 ${shimmerClass}`}></div>
                            </div>
                            <div className="relative z-10 mt-8 space-y-2 max-w-2xl">
                                <div className={`h-4 w-full rounded ${shimmerClass}`}></div>
                                <div className={`h-4 w-5/6 rounded ${shimmerClass}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
       {/* Breadcrumbs */}
       <div className="pt-24 px-6 md:px-12 bg-surface">
            <div className="max-w-[1512px] mx-auto">
                <Link to="/" className="inline-flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors mb-6 uppercase tracking-widest group">
                    <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>
       </div>

       <div className="max-w-[1512px] mx-auto px-6 md:px-12 pb-12 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* FULL COLUMN: Main Content (12 cols) */}
                <div className="lg:col-span-12">
                    
                    {/* --- PROFILE HEADER BLOCK --- */}
                    <div className="bg-surface border border-ink/10 rounded-sm mb-12 p-8 md:p-12 relative overflow-hidden shadow-sm group">
                        {/* Banner Background */}
                        <div className="absolute inset-0 z-0">
                            {profileData.banner ? (
                                <img src={profileData.banner} alt="Banner" className="w-full h-full object-cover opacity-20" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-l from-stone-100 to-transparent opacity-80" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent"></div>
                        </div>

                        {/* Identity */}
                        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 mb-6">
                            <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden shrink-0 bg-stone-200">
                                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 pt-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-sans font-bold text-ink">{profileData.name}</h1>
                                    <BadgeCheck className="text-ink w-6 h-6 fill-transparent" strokeWidth={2.5} />
                                    <div className="flex items-center gap-2 ml-1">
                                        <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-700"><Award size={16} /></div>
                                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700"><Fingerprint size={16} /></div>
                                        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700"><Building2 size={16} /></div>
                                    </div>
                                </div>
                                <p className="text-lg text-ink/50 font-sans mb-1">{profileData.role}</p>
                                <p className="text-lg text-ink/50 font-sans">{profileData.institution}</p>
                            </div>
                            
                            <button 
                                onClick={handleOpenEditProfile}
                                className="flex items-center gap-2 bg-ink text-white px-5 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider hover:bg-ink/90 transition-colors shadow-lg hover:scale-[1.02]"
                            >
                                <Edit3 size={14} /> <span>Edit</span>
                            </button>
                        </div>

                        {/* NEW: Research Fields & Subjects (Interactive Rows) */}
                        <div className="relative z-10 mb-8 space-y-4">
                            
                            {/* Row 1: Research Fields (Outline Style) */}
                            <div className="flex flex-wrap items-center gap-2">
                                {profileData.researchFields.map((field, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-full border border-ink/20 bg-paper text-sm font-sans text-ink flex items-center gap-2 transition-all hover:border-ink/40 group/tag">
                                        {field}
                                        <X 
                                            size={14} 
                                            className="text-ink/30 hover:text-red-500 cursor-pointer opacity-0 group-hover/tag:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveResearchField(idx)}
                                        />
                                    </span>
                                ))}
                                
                                {isAddingResearch ? (
                                    <div className="flex items-center border border-ink/20 rounded-full px-3 py-1.5 bg-white">
                                        <input 
                                            type="text" 
                                            className="outline-none text-sm w-32 bg-transparent"
                                            autoFocus
                                            value={researchInput}
                                            onChange={(e) => setResearchInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddResearchField();
                                                if (e.key === 'Escape') setIsAddingResearch(false);
                                            }}
                                            onBlur={() => { if(!researchInput) setIsAddingResearch(false) }}
                                        />
                                        <button onClick={handleAddResearchField} className="ml-1 text-green-600 hover:text-green-700"><Check size={14}/></button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsAddingResearch(true)}
                                        className="w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:bg-stone/5 hover:text-ink transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Row 2: Subjects (Filled Style) */}
                            <div className="flex flex-wrap items-center gap-2">
                                {profileData.subjects.map((subject, idx) => (
                                    <span key={idx} className="px-4 py-2 rounded-full bg-stone-100 text-sm font-sans text-ink flex items-center gap-2 transition-all hover:bg-stone-200 group/tag">
                                        {subject}
                                        <X 
                                            size={14} 
                                            className="text-ink/30 hover:text-red-500 cursor-pointer opacity-0 group-hover/tag:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveSubject(idx)}
                                        />
                                    </span>
                                ))}

                                {isAddingSubject ? (
                                    <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5">
                                        <input 
                                            type="text" 
                                            className="outline-none text-sm w-32 bg-transparent"
                                            autoFocus
                                            value={subjectInput}
                                            onChange={(e) => setSubjectInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddSubject();
                                                if (e.key === 'Escape') setIsAddingSubject(false);
                                            }}
                                            onBlur={() => { if(!subjectInput) setIsAddingSubject(false) }}
                                        />
                                        <button onClick={handleAddSubject} className="ml-1 text-green-600 hover:text-green-700"><Check size={14}/></button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsAddingSubject(true)}
                                        className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-ink/60 hover:bg-stone-200 hover:text-ink transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Bio - Full Width */}
                        <div className="relative z-10 mb-6 w-full">
                            <p className="text-lg text-ink/80 leading-relaxed font-sans w-full">{profileData.bio}</p>
                        </div>

                        {/* Date Joined Section */}
                        <div className="relative z-10 flex items-center gap-3 mb-8">
                            <Calendar size={16} className="text-ink" />
                            <span className="text-sm font-mono font-bold text-ink uppercase tracking-widest">Date Joined</span>
                            <span className="text-sm font-mono font-bold text-ink">{profileData.joinDate}</span>
                        </div>

                        {/* Social Links */}
                        <div className="relative z-10 flex gap-6 items-center border-t border-ink/5 pt-6">
                            <a href="#" className="text-ink hover:text-black hover:scale-110 transition-transform"><Github size={22} strokeWidth={1.5} /></a>
                            <a href="#" className="text-ink hover:text-black hover:scale-110 transition-transform flex items-center justify-center w-6 h-6 border-2 border-ink rounded-full text-[10px] font-bold font-serif">ID</a>
                            <a href="#" className="text-ink hover:text-black hover:scale-110 transition-transform"><GraduationCap size={24} strokeWidth={1.5} /></a>
                            <a href="#" className="text-ink hover:text-blue-700 hover:scale-110 transition-transform"><Linkedin size={22} strokeWidth={1.5} /></a>
                            <a href="#" className="text-ink hover:text-black hover:scale-110 transition-transform"><Twitter size={22} strokeWidth={1.5} /></a>
                        </div>
                    </div>
                    
                    {/* --- TABS --- */}
                    <div className="flex items-center justify-between border-b border-ink/10 mb-10">
                        <div className="flex space-x-8 overflow-x-auto">
                            <button onClick={() => setActiveTab('MY_STORY')} className={`pb-4 flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'MY_STORY' ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}>
                                <BookOpen size={16} /> My Story
                                {activeTab === 'MY_STORY' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink"></div>}
                            </button>
                            <button onClick={() => setActiveTab('PROJECTS')} className={`pb-4 flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'PROJECTS' ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}>
                                <Building2 size={16} /> Projects
                                {activeTab === 'PROJECTS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink"></div>}
                            </button>
                            <button onClick={() => setActiveTab('IDA')} className={`pb-4 flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'IDA' ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}>
                                <Fingerprint size={16} /> IDA
                                {activeTab === 'IDA' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink"></div>}
                            </button>
                            <button onClick={() => setActiveTab('REVIEWS')} className={`pb-4 flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === 'REVIEWS' ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}>
                                <MessageSquare size={16} /> Reviews
                                {activeTab === 'REVIEWS' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-ink"></div>}
                            </button>
                        </div>
                    </div>

                    {/* --- TAB CONTENT --- */}
                    <div className="animate-in fade-in duration-500">
                        
                        {/* 1. MY STORY TAB */}
                        {activeTab === 'MY_STORY' && (
                            <div>
                                <h3 className="text-lg text-ink/50 font-sans mb-8">Academic journey</h3>
                                
                                <button 
                                    onClick={handleOpenAddStory}
                                    className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center hover:scale-110 transition-transform shadow-lg mb-8"
                                >
                                    <Plus size={20} />
                                </button>

                                <div className="relative border-l border-ink/10 ml-5 space-y-12 pb-12">
                                    {stories.map((story) => (
                                        <div key={story.id} className="relative pl-12 group">
                                            <div className="absolute -left-[5px] top-2 w-[11px] h-[11px] rounded-full bg-ink border-2 border-paper ring-4 ring-paper z-10"></div>
                                            <div className="bg-transparent group-hover:bg-stone/5 -m-6 p-6 rounded-sm transition-colors relative">
                                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-2">
                                                    <span className="font-mono text-sm font-bold text-ink shrink-0 min-w-[100px]">{story.date}</span>
                                                    <h4 className="font-sans text-xl font-bold text-ink leading-tight">{story.title}</h4>
                                                </div>
                                                <div className="md:pl-[132px]">
                                                    <p className="text-ink/60 font-sans leading-relaxed text-base mb-4">{story.description}</p>
                                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleDeleteStory(story.id)}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-mono font-bold uppercase tracking-wider"
                                                        >
                                                            <Trash2 size={12} /> Delete
                                                        </button>
                                                        <button 
                                                            onClick={() => handleOpenEditStory(story)}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-paper hover:bg-ink/80 text-xs font-mono font-bold uppercase tracking-wider"
                                                        >
                                                            <Edit3 size={12} /> Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. PROJECTS TAB */}
                        {activeTab === 'PROJECTS' && (
                            <div>
                                <h3 className="font-sans text-xl text-ink/60 mb-10">Research Projects ({myProjects.length})</h3>
                                <div className="space-y-16">
                                    {myProjects.map(project => {
                                        const percent = Math.min(100, Math.round((project.raised / project.goal) * 100));
                                        return (
                                            <div key={project.id} className="group">
                                                <div className="inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider mb-5">
                                                   <Hourglass size={14} />
                                                   <span>{project.status === 'RESEARCH' ? 'In progress' : project.status.replace('_', ' ')}</span>
                                                </div>
                                                <div className="mb-8">
                                                    <h4 className="font-sans text-3xl font-bold text-ink mb-3 group-hover:text-accent transition-colors leading-tight">
                                                        {project.title}
                                                    </h4>
                                                    <p className="font-sans text-lg text-ink/60 leading-relaxed max-w-3xl">
                                                        {project.shortDescription}
                                                    </p>
                                                </div>
                                                <div className="mb-6">
                                                    <div className="flex justify-between items-end mb-3 font-mono text-sm font-bold">
                                                        <span className="text-ink">Goals</span>
                                                        <span className="text-ink text-lg tracking-tight">
                                                            {project.raised.toLocaleString()}/{project.goal.toLocaleString()} <span className="text-xs uppercase ml-1">USD</span>
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-4 bg-ink/5">
                                                        <div className="h-full bg-ink" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                     <div className="flex -space-x-2">
                                                        {['Z', 'L', 'W'].map((initial, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-stone-200 border-2 border-paper flex items-center justify-center text-xs font-bold text-ink/50 font-mono">
                                                                {initial}
                                                            </div>
                                                        ))}
                                                     </div>
                                                     <span className="font-mono text-sm font-bold text-ink">{project.backers} Bidder count</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {myProjects.length === 0 && (
                                        <div className="py-20 text-center border border-dashed border-ink/10 bg-stone/5">
                                            <p className="text-ink/50 font-mono text-sm uppercase tracking-widest">No projects found</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 3. IDA TAB */}
                        {activeTab === 'IDA' && (
                            <div>
                                <h3 className="font-sans text-xl text-ink/60 mb-8">IDA ({idaArticles.length})</h3>
                                <div className="space-y-12">
                                    {idaArticles.map(article => {
                                        return (
                                            <div 
                                                key={article.id} 
                                                className={`group relative border-b border-ink/10 pb-12 transition-opacity duration-300 ${article.isHidden ? 'opacity-50' : 'opacity-100'}`}
                                            >
                                                <div className="absolute top-0 right-0 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleToggleHide(article.id)}
                                                        className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-ink/60 hover:text-ink transition-colors shadow-sm"
                                                        title={article.isHidden ? "Unhide" : "Hide"}
                                                    >
                                                        {article.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleTogglePin(article.id)}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                                                            article.isPinned 
                                                            ? 'bg-ink text-paper hover:bg-ink/80' 
                                                            : 'bg-stone-200 hover:bg-stone-300 text-ink/60 hover:text-ink'
                                                        }`}
                                                        title={article.isPinned ? "Unpin" : "Pin to Top"}
                                                    >
                                                        <ArrowUpToLine size={18} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="flex items-center gap-3">
                                                        {article.isFeatured && (
                                                            <span className="flex items-center gap-1 bg-ink text-paper text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-sm">
                                                                <Sparkles size={10} fill="currentColor" /> FEATURED
                                                            </span>
                                                        )}
                                                        {article.tags.map(tag => (
                                                            <span key={tag} className="border border-ink/10 bg-white text-ink text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-sm">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-4">
                                                        {article.isPinned && (
                                                            <ArrowUpToLine size={18} className="text-ink" />
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink uppercase tracking-wider">
                                                            <User size={14} /> OWNER
                                                        </div>
                                                    </div>
                                                </div>

                                                <h4 className="font-sans text-2xl md:text-3xl font-bold text-ink mb-4 leading-tight group-hover:text-accent transition-colors cursor-pointer">
                                                    {article.title}
                                                </h4>

                                                <p className="font-sans text-base text-ink/60 leading-relaxed mb-6 max-w-4xl">
                                                    {article.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-mono text-ink/40 uppercase tracking-widest mb-1">Publication time:</span>
                                                        <span className="font-sans font-bold text-ink text-lg">{article.publicationDate}</span>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2 text-ink/60 font-mono font-bold text-sm">
                                                            <ThumbsUp size={18} />
                                                            <span>{article.likes}</span>
                                                        </div>
                                                        <button className="flex items-center gap-2 bg-ink text-paper px-4 py-2 rounded-full font-mono text-xs font-bold hover:bg-accent transition-colors">
                                                            <MessageSquare size={14} fill="currentColor" />
                                                            <span>{article.comments}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 4. REVIEWS TAB */}
                        {activeTab === 'REVIEWS' && (
                            <div className="space-y-12">
                                <h3 className="font-sans text-xl text-ink/60 mb-8">Reviews ({reviews.length})</h3>
                                {reviews.map((review) => (
                                     <div key={review.id} className="border-b border-ink/10 pb-12 last:border-0">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="border border-ink px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink">
                                                {review.status}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="font-mono font-bold text-sm text-ink mr-1">{review.rating}</span>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                     <Star 
                                                        key={star} 
                                                        size={14} 
                                                        className={`${star <= Math.round(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-400'}`} 
                                                     />
                                                ))}
                                            </div>
                                        </div>

                                        <h4 className="font-sans text-2xl font-bold text-ink mb-3 leading-tight">
                                            {review.title}
                                        </h4>
                                        
                                        <p className="font-sans text-base text-ink/60 leading-relaxed mb-6 max-w-4xl">
                                            {review.description}
                                        </p>

                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-ink/60 uppercase tracking-widest mb-1">Publication date:</span>
                                            <span className="font-sans font-bold text-ink text-2xl">{review.publicationDate}</span>
                                        </div>
                                     </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>

            </div>
       </div>

       {/* Story Editor Modal */}
       <AddStoryModal 
            isOpen={isStoryModalOpen}
            onClose={() => setIsStoryModalOpen(false)}
            onSave={handleSaveStory}
       />

       {/* Edit Profile Modal */}
       <EditProfileModal 
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            initialData={editFormData}
            onSave={handleSaveProfile}
       />

    </div>
  );
};
