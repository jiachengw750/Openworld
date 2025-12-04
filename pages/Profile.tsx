
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Settings, Trophy, RefreshCw, 
  Building2, Edit3, Github, Linkedin, Twitter,
  BadgeCheck, Award, GraduationCap, Fingerprint, 
  Plus, Trash2, X, Save, BookOpen, MessageSquare,
  Hourglass, Sparkles, User, ThumbsUp, EyeOff, ArrowUpToLine,
  Star, Image as ImageIcon, Camera, Upload, Check
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { PROJECTS } from '../constants';

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
  
  // Story Form State
  const [formDate, setFormDate] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // -- Profile Data State --
  const [profileData, setProfileData] = useState({
      name: "Zhang Wei",
      role: "Associate Professor",
      institution: "School of Medicine, Tsinghua University",
      avatar: "https://i.pravatar.cc/300?u=zhangwei",
      banner: "https://picsum.photos/seed/science_banner/1200/400",
      bio: "Specializing in Medical Artificial Intelligence and the application of deep learning in medical imaging diagnostics. Dedicated to advancing the innovation and application of AI technologies in precision medicine, with over 50 SCI-indexed publications and leadership in three National Natural Science Foundation of China projects.",
      tags: [
          { label: "Innovation", count: 15 },
          { label: "Rigor", count: 12 },
          { label: "Collaboration", count: 10 },
          { label: "Cutting-Edge", count: 8 },
          { label: "Open-Minded", count: 7 },
          { label: "Professionalism", count: 6 },
      ],
      fieldsOfStudy: ['Medical AI', 'Deep Learning', 'Precision Medicine', 'Medical Imaging']
  });

  // -- Edit Profile Modal State --
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(profileData);
  const [isTagInputActive, setIsTagInputActive] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // -- Fields of Study Input State (Sidebar) --
  const [isFieldInputActive, setIsFieldInputActive] = useState(false);
  const [newFieldInput, setNewFieldInput] = useState('');

  // Effect to sync wallet if connected (optional, but good for demo)
  useEffect(() => {
      if (wallet?.connected) {
          setProfileData(prev => ({
              ...prev,
              name: wallet.name,
              avatar: wallet.avatar
          }));
      }
  }, [wallet]);

  // Simulate loading effect on mount
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
      setFormDate('');
      setFormTitle('');
      setFormDesc('');
      setIsStoryModalOpen(true);
  };

  const handleOpenEditStory = (item: StoryItem) => {
      setEditingStory(item);
      setFormDate(item.date);
      setFormTitle(item.title);
      setFormDesc(item.description);
      setIsStoryModalOpen(true);
  };

  const handleDeleteStory = (id: string) => {
      if (confirm('Are you sure you want to delete this entry?')) {
          setStories(prev => prev.filter(s => s.id !== id));
          showToast('Entry deleted');
      }
  };

  const handleSaveStory = () => {
      if (!formDate || !formTitle) {
          showToast('Please fill in Date and Title');
          return;
      }

      if (editingStory) {
          // Update
          setStories(prev => prev.map(s => s.id === editingStory.id ? { ...s, date: formDate, title: formTitle, description: formDesc } : s));
          showToast('Entry updated');
      } else {
          // Create
          const newStory: StoryItem = {
              id: Date.now().toString(),
              date: formDate,
              title: formTitle,
              description: formDesc
          };
          // Add to top
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
       showToast('Article visibility updated');
  };

  // -- Profile Edit Handlers --
  const handleOpenEditProfile = () => {
      setEditFormData(profileData);
      setIsEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
      setProfileData(editFormData);
      setIsEditProfileOpen(false);
      showToast('Profile updated successfully');
  };

  const handleAddTag = () => {
      if (newTagInput.trim()) {
          setEditFormData(prev => ({
              ...prev,
              tags: [...prev.tags, { label: newTagInput.trim(), count: 1 }]
          }));
          setNewTagInput('');
          setIsTagInputActive(false);
      }
  };

  const handleRemoveTag = (index: number) => {
      const newTags = [...editFormData.tags];
      newTags.splice(index, 1);
      setEditFormData(prev => ({ ...prev, tags: newTags }));
  };

  // -- Sidebar Field Handlers --
  const handleAddField = () => {
      if (newFieldInput.trim()) {
          setProfileData(prev => ({
              ...prev,
              fieldsOfStudy: [...prev.fieldsOfStudy, newFieldInput.trim()]
          }));
          setNewFieldInput('');
          setIsFieldInputActive(false);
      }
  };

  const handleRemoveField = (index: number) => {
      setProfileData(prev => ({
          ...prev,
          fieldsOfStudy: prev.fieldsOfStudy.filter((_, i) => i !== index)
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
                    
                    {/* LEFT COLUMN SKELETON */}
                    <div className="lg:col-span-8">
                        
                        {/* Profile Header Card Skeleton */}
                        <div className="bg-surface border border-ink/5 rounded-sm mb-12 p-8 md:p-12 relative overflow-hidden h-[420px]">
                            {/* Banner Shimmer */}
                            <div className="absolute inset-0 bg-stone-100/50">
                                <div className={`absolute inset-0 opacity-50 ${shimmerClass}`}></div>
                            </div>
                            
                            <div className="relative z-10 mt-32 flex flex-col md:flex-row items-start gap-6">
                                {/* Avatar */}
                                <div className={`w-28 h-28 rounded-full border-4 border-white shrink-0 ${shimmerClass}`}></div>
                                {/* Info */}
                                <div className="flex-1 pt-4 space-y-3">
                                    <div className={`h-8 w-48 rounded ${shimmerClass}`}></div>
                                    <div className={`h-4 w-32 rounded ${shimmerClass}`}></div>
                                    <div className={`h-4 w-40 rounded ${shimmerClass}`}></div>
                                </div>
                                {/* Edit Button Placeholder */}
                                <div className={`w-24 h-8 rounded-full mt-4 md:mt-0 ${shimmerClass}`}></div>
                            </div>

                            {/* Bio Lines */}
                            <div className="relative z-10 mt-8 space-y-2 max-w-2xl">
                                <div className={`h-4 w-full rounded ${shimmerClass}`}></div>
                                <div className={`h-4 w-5/6 rounded ${shimmerClass}`}></div>
                                <div className={`h-4 w-4/6 rounded ${shimmerClass}`}></div>
                            </div>
                        </div>

                        {/* Tabs Skeleton */}
                        <div className="flex gap-8 mb-10 border-b border-ink/5 pb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${shimmerClass}`}></div>
                                    <div className={`h-4 w-16 rounded ${shimmerClass}`}></div>
                                </div>
                            ))}
                        </div>

                        {/* List Content Skeleton */}
                        <div className="space-y-12">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-12">
                                    {/* Date Column */}
                                    <div className="w-24 shrink-0">
                                        <div className={`h-4 w-16 rounded ${shimmerClass}`}></div>
                                    </div>
                                    {/* Content Column */}
                                    <div className="flex-1 space-y-3">
                                        <div className={`h-6 w-3/4 rounded ${shimmerClass}`}></div>
                                        <div className="space-y-2">
                                            <div className={`h-4 w-full rounded ${shimmerClass}`}></div>
                                            <div className={`h-4 w-5/6 rounded ${shimmerClass}`}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN SKELETON */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* LEX Score Card */}
                        <div className="h-64 bg-stone-50 border border-ink/5 p-8 flex flex-col justify-between">
                            <div className={`h-4 w-24 rounded ${shimmerClass}`}></div>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full ${shimmerClass}`}></div>
                                <div className={`h-12 w-32 rounded ${shimmerClass}`}></div>
                            </div>
                            <div className={`h-10 w-full rounded ${shimmerClass}`}></div>
                        </div>

                        {/* Tags */}
                        <div>
                            <div className={`h-6 w-32 rounded mb-4 ${shimmerClass}`}></div>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className={`h-8 w-24 rounded-full ${shimmerClass}`}></div>
                                ))}
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
                
                {/* LEFT COLUMN: Main Content (8 cols) */}
                <div className="lg:col-span-8">
                    
                    {/* --- PROFILE HEADER BLOCK --- */}
                    <div className="bg-surface border border-ink/10 rounded-sm mb-12 p-8 md:p-12 relative overflow-hidden shadow-sm group">
                        {/* Banner Background (Dynamic) */}
                        <div className="absolute inset-0 z-0">
                            {profileData.banner ? (
                                <img src={profileData.banner} alt="Banner" className="w-full h-full object-cover opacity-20" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-l from-stone-100 to-transparent opacity-80" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-transparent"></div>
                        </div>

                        {/* Identity */}
                        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 mb-10">
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

                        {/* Tags & Bio */}
                        <div className="relative z-10 mb-10">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {profileData.tags.map((tag) => (
                                    <div key={tag.label} className="flex items-center bg-stone-100 hover:bg-stone-200 text-ink/70 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-default">
                                        <span className="mr-1">{tag.label}</span>
                                        <span className="opacity-60">({tag.count})</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-lg text-ink/80 leading-relaxed font-sans max-w-3xl">{profileData.bio}</p>
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
                                            {/* Dot */}
                                            <div className="absolute -left-[5px] top-2 w-[11px] h-[11px] rounded-full bg-ink border-2 border-paper ring-4 ring-paper z-10"></div>
                                            
                                            {/* Content Container */}
                                            <div className="bg-transparent group-hover:bg-stone/5 -m-6 p-6 rounded-sm transition-colors relative">
                                                
                                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-2">
                                                    <span className="font-mono text-sm font-bold text-ink shrink-0 min-w-[100px]">{story.date}</span>
                                                    <h4 className="font-sans text-xl font-bold text-ink leading-tight">{story.title}</h4>
                                                </div>
                                                
                                                <div className="md:pl-[132px]">
                                                    <p className="text-ink/60 font-sans leading-relaxed text-base mb-4">{story.description}</p>
                                                    
                                                    {/* Hover Actions */}
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
                                                {/* Status Badge */}
                                                <div className="inline-flex items-center gap-2 border border-ink/20 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider mb-5">
                                                   <Hourglass size={14} />
                                                   <span>{project.status === 'RESEARCH' ? 'In progress' : project.status.replace('_', ' ')}</span>
                                                </div>

                                                {/* Title & Description */}
                                                <div className="mb-8">
                                                    <h4 className="font-sans text-3xl font-bold text-ink mb-3 group-hover:text-accent transition-colors leading-tight">
                                                        {project.title}
                                                    </h4>
                                                    <p className="font-sans text-lg text-ink/60 leading-relaxed max-w-3xl">
                                                        {project.shortDescription}
                                                    </p>
                                                </div>

                                                {/* Progress Section */}
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

                                                {/* Footer: Bidders */}
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

                        {/* 3. IDA TAB (Article List) */}
                        {activeTab === 'IDA' && (
                            <div>
                                <h3 className="font-sans text-xl text-ink/60 mb-8">IDA ({idaArticles.filter(a => !a.isHidden).length})</h3>
                                <div className="space-y-12">
                                    {idaArticles.map(article => {
                                        if (article.isHidden) return null;
                                        return (
                                            <div key={article.id} className="group relative border-b border-ink/10 pb-12">
                                                
                                                {/* Hover Actions (Absolute Top Right) */}
                                                <div className="absolute top-0 right-0 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleToggleHide(article.id)}
                                                        className="w-10 h-10 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-ink/60 hover:text-ink transition-colors shadow-sm"
                                                        title="Hide"
                                                    >
                                                        <EyeOff size={18} />
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

                                                {/* Row 1: Tags & Owner/Pin Indicator */}
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

                                                {/* Row 2: Title */}
                                                <h4 className="font-sans text-2xl md:text-3xl font-bold text-ink mb-4 leading-tight group-hover:text-accent transition-colors cursor-pointer">
                                                    {article.title}
                                                </h4>

                                                {/* Row 3: Description */}
                                                <p className="font-sans text-base text-ink/60 leading-relaxed mb-6 max-w-4xl">
                                                    {article.description}
                                                </p>

                                                {/* Row 4: Footer Info */}
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
                                    {idaArticles.every(a => a.isHidden) && (
                                        <div className="py-20 text-center border border-dashed border-ink/10 bg-stone/5">
                                            <p className="text-ink/50 font-mono text-sm uppercase tracking-widest">No articles visible</p>
                                        </div>
                                    )}
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
                                                        className={`${star <= Math.round(review.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'}`} 
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

                {/* RIGHT COLUMN: Sidebar Widgets (4 cols) */}
                <div className="lg:col-span-4 space-y-10">
                    
                    {/* 2. LEX Score Card */}
                    <div className="bg-stone/5 p-8 border border-ink/5 relative overflow-hidden">
                        <div className="flex items-center space-x-2 text-ink mb-6">
                            <Trophy size={20} className="text-ink" strokeWidth={1.5} />
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/70">LEX (Lifetime Expertise Score)</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-4 relative z-10">
                             <div className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
                                <Building2 size={18} />
                             </div>
                             <span className="font-sans text-6xl font-bold text-ink tracking-tighter leading-none">8567</span>
                        </div>

                        <p className="text-sm text-ink/60 leading-relaxed mb-8 font-sans border-l-2 border-ink/10 pl-4">
                            This synthesis incorporates OpenSci contributions and associated external scholarly achievements.
                        </p>

                        <button className="w-full py-4 border border-ink/10 bg-paper hover:bg-white transition-colors flex items-center justify-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-ink/50 hover:text-ink">
                            <RefreshCw size={14} />
                            <span>Next Refresh: 180 Days</span>
                        </button>
                    </div>

                    {/* 3. Fields of Study (Interactive) */}
                    <div>
                        <h3 className="font-sans text-xl font-bold text-ink mb-5">Fields of Study</h3>
                        <div className="flex flex-wrap gap-2">
                            {profileData.fieldsOfStudy.map((tag, idx) => (
                                <div key={idx} className="group relative">
                                    <span className="px-4 py-2 bg-stone/10 hover:bg-stone/20 transition-colors border border-transparent hover:border-ink/10 rounded-full text-xs font-mono font-bold text-ink/70 cursor-default flex items-center">
                                        {tag}
                                        <button 
                                            onClick={() => handleRemoveField(idx)}
                                            className="ml-2 text-ink/40 hover:text-red-500 hidden group-hover:block transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                </div>
                            ))}
                            
                            {/* Add Button / Input */}
                            {isFieldInputActive ? (
                                <div className="flex items-center gap-1 bg-white border-2 border-ink/20 rounded-full px-3 py-1.5 h-[34px] shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                    <input 
                                        type="text" 
                                        value={newFieldInput}
                                        onChange={(e) => setNewFieldInput(e.target.value)}
                                        className="w-24 text-xs font-mono font-bold outline-none bg-transparent text-ink placeholder-ink/30"
                                        placeholder="New..."
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddField();
                                            if (e.key === 'Escape') setIsFieldInputActive(false);
                                        }}
                                    />
                                    <div className="w-px h-3 bg-ink/10 mx-1"></div>
                                    <button onClick={handleAddField} className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-0.5"><Check size={12} /></button>
                                    <button onClick={() => setIsFieldInputActive(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => {
                                        setIsFieldInputActive(true);
                                        setNewFieldInput('');
                                    }}
                                    className="px-3 py-2 bg-stone/5 border border-dashed border-ink/20 hover:border-ink/40 rounded-full text-xs font-mono font-bold text-ink/40 hover:text-ink transition-all flex items-center gap-1 h-[34px]"
                                >
                                    <Plus size={12} /> Add
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 4. Status */}
                    <div className="pt-8 border-t border-ink/10">
                        <h3 className="font-sans text-xl font-bold text-ink mb-5">Status</h3>
                        <div className="flex justify-between items-center group">
                            <span className="text-sm text-ink/60 font-sans group-hover:text-ink transition-colors">Date Joined</span>
                            <span className="font-mono text-sm font-bold text-ink">Jul, 2020</span>
                        </div>
                    </div>
                </div>

            </div>
       </div>

       {/* Story Editor Modal */}
       {isStoryModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
               <div className="bg-paper w-full max-w-lg p-8 rounded-sm shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                   <div className="flex justify-between items-start mb-6">
                       <h3 className="font-sans text-2xl font-bold text-ink">
                           {editingStory ? 'Edit Story' : 'Add to Story'}
                       </h3>
                       <button onClick={() => setIsStoryModalOpen(false)} className="p-2 hover:bg-ink/5 rounded-full text-ink/60 hover:text-red-500 transition-colors">
                           <X size={24} />
                       </button>
                   </div>
                   
                   <div className="space-y-6">
                       <div>
                           <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Date</label>
                           <input 
                               type="text" 
                               value={formDate}
                               onChange={(e) => setFormDate(e.target.value)}
                               placeholder="e.g. Nov, 2023" 
                               className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Title</label>
                           <input 
                               type="text" 
                               value={formTitle}
                               onChange={(e) => setFormTitle(e.target.value)}
                               placeholder="Milestone title..." 
                               className="w-full bg-surface border border-ink/20 p-3 font-sans font-bold text-lg text-ink focus:outline-none focus:border-accent rounded-sm"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-mono font-bold uppercase tracking-widest text-ink/60 mb-2">Description</label>
                           <textarea 
                               value={formDesc}
                               onChange={(e) => setFormDesc(e.target.value)}
                               placeholder="Brief description of the event..." 
                               className="w-full bg-surface border border-ink/20 p-3 font-sans text-base text-ink focus:outline-none focus:border-accent rounded-sm h-32 resize-none leading-relaxed"
                           />
                       </div>
                       
                       <div className="flex gap-4 pt-2">
                            <button 
                                onClick={() => setIsStoryModalOpen(false)}
                                className="flex-1 py-3 border border-ink/20 text-ink font-mono text-xs font-bold uppercase tracking-widest hover:bg-ink/5 transition-colors rounded-full"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveStory}
                                className="flex-1 py-3 bg-ink text-paper hover:bg-accent transition-colors font-mono text-xs font-bold uppercase tracking-widest rounded-full flex justify-center items-center shadow-lg hover:scale-[1.02]"
                            >
                                <Save size={14} className="mr-2" />
                                Save
                            </button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Edit Profile Modal */}
       {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-ink/10 sticky top-0 bg-paper z-20">
                    <h3 className="font-sans text-2xl font-bold text-ink">Edit Profile</h3>
                    <button onClick={() => setIsEditProfileOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-colors">
                        <X size={24} className="text-ink/60" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Banner & Avatar Area */}
                    <div className="relative">
                        {/* Banner */}
                        <div className="h-48 w-full bg-stone-100 rounded-lg overflow-hidden relative group">
                            <img src={editFormData.banner} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                            <button className="absolute bottom-4 right-4 bg-ink text-paper px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-ink/90 transition-colors shadow-lg">
                                <ImageIcon size={14} />
                                Background Image
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 rounded-full border-[4px] border-paper bg-stone-200 overflow-hidden relative group/avatar">
                                <img src={editFormData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                   <Camera size={24} className="text-white"/>
                                </div>
                            </div>
                            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-ink text-paper px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-ink/90 transition-colors shadow-md whitespace-nowrap z-10 border-2 border-paper">
                                <Upload size={10} />
                                Upload
                            </button>
                        </div>
                    </div>

                    {/* Spacer for avatar overflow */}
                    <div className="h-6"></div>

                    {/* Form Fields */}
                    <div className="space-y-8 pt-4">
                        {/* Full Name */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <label className="text-base font-sans text-ink">Full Name</label>
                            <div className="md:col-span-3">
                                <input 
                                    type="text" 
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                    className="w-full border border-ink/20 rounded-sm p-3 focus:outline-none focus:border-accent transition-colors bg-white font-sans"
                                />
                            </div>
                        </div>

                        {/* Position */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <label className="text-base font-sans text-ink">Position</label>
                            <div className="md:col-span-3">
                                <input 
                                    type="text" 
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                                    className="w-full border border-ink/20 rounded-sm p-3 focus:outline-none focus:border-accent transition-colors bg-white font-sans"
                                />
                            </div>
                        </div>

                        {/* Institution */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <label className="text-base font-sans text-ink">Affiliated Institution</label>
                            <div className="md:col-span-3">
                                <input 
                                    type="text" 
                                    value={editFormData.institution}
                                    onChange={(e) => setEditFormData({...editFormData, institution: e.target.value})}
                                    className="w-full border border-ink/20 rounded-sm p-3 focus:outline-none focus:border-accent transition-colors bg-white font-sans"
                                />
                            </div>
                        </div>

                        {/* Perception Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <label className="text-base font-sans text-ink pt-3">Perception Tags</label>
                            <div className="md:col-span-3">
                                <div className="border border-ink/20 rounded-sm p-3 bg-white min-h-[60px] flex flex-wrap gap-2">
                                    {editFormData.tags.map((tag, idx) => (
                                        <div key={idx} className="bg-stone-100 text-ink px-3 py-1.5 rounded-full text-sm flex items-center gap-2 group border border-ink/5">
                                            <span>{tag.label} ({tag.count})</span>
                                            <button 
                                                onClick={() => handleRemoveTag(idx)}
                                                className="text-ink/40 group-hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {/* Add Tag Input */}
                                    {isTagInputActive ? (
                                        <div className="flex items-center gap-1 bg-white border-2 border-ink/20 rounded-full px-3 py-1.5 h-[34px] shadow-sm">
                                            <input 
                                                type="text" 
                                                value={newTagInput}
                                                onChange={(e) => setNewTagInput(e.target.value)}
                                                className="w-32 text-sm outline-none bg-transparent"
                                                placeholder="New tag..."
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleAddTag();
                                                    if (e.key === 'Escape') setIsTagInputActive(false);
                                                }}
                                            />
                                            <div className="w-px h-4 bg-ink/10 mx-1"></div>
                                            <button onClick={handleAddTag} className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-0.5"><Check size={14} /></button>
                                            <button onClick={() => setIsTagInputActive(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full p-0.5"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => {
                                                setIsTagInputActive(true);
                                                setNewTagInput('');
                                            }}
                                            className="border border-dashed border-ink/30 text-ink/50 px-3 py-1.5 rounded-full text-sm hover:border-ink/50 hover:text-ink transition-colors flex items-center gap-1 h-[34px]"
                                        >
                                            <Plus size={14} /> Add Tag
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Self Introduction */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <label className="text-base font-sans text-ink pt-3">Self-Introduction</label>
                            <div className="md:col-span-3">
                                <textarea 
                                    value={editFormData.bio}
                                    onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                                    className="w-full border border-ink/20 rounded-sm p-3 focus:outline-none focus:border-accent transition-colors bg-white h-32 resize-none leading-relaxed text-sm"
                                    maxLength={300}
                                />
                                <div className="text-right text-xs text-ink/40 mt-1 font-mono">
                                    {editFormData.bio.length}/300
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-ink/10 flex justify-end gap-4 sticky bottom-0 bg-paper z-20">
                    <button 
                        onClick={() => setIsEditProfileOpen(false)}
                        className="px-8 py-3 rounded-full border border-ink/20 text-ink font-bold hover:bg-stone-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveProfile}
                        className="px-8 py-3 rounded-full bg-ink text-paper font-bold hover:bg-ink/90 transition-colors shadow-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
        )}

    </div>
  );
};
