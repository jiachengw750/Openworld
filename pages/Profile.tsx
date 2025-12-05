import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Edit3, Github, Linkedin, Twitter,
  GraduationCap, Fingerprint, Plus, Trash2, X, 
  MessageSquare, ArrowUpToLine, ThumbsUp, 
  Eye, EyeOff, Verified, Camera, Building2, Star
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';
import { PROJECTS } from '../constants';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { AddStoryModal } from '../components/modals/AddStoryModal';
import { PlatformVerificationModal } from '../components/modals/PlatformVerificationModal';
import { ProjectCard } from '../components/ProjectCard';

// --- Types ---
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
  
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<TabType>('MY_STORY');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isScholarModalOpen, setIsScholarModalOpen] = useState(false);
  
  // --- Data State (Mock Data) ---
  const [profileData, setProfileData] = useState({
      name: "Zhang Wei",
      role: "Associate Professor",
      institution: "School of Medicine, Tsinghua University",
      avatar: "https://i.pravatar.cc/300?u=zhangwei",
      banner: "https://picsum.photos/seed/science_banner/1200/400",
      bio: "Specializing in Medical Artificial Intelligence and the application of deep learning in medical imaging diagnostics. Dedicated to advancing the innovation and application of AI technologies in precision medicine, with over 50 SCI-indexed publications and leadership in three National Natural Science Foundation of China projects.",
      joinDate: "Jul, 2020",
      researchFields: ['Medical AI', 'Deep Learning', 'Precision Medicine', 'Medical Imaging'],
      subjects: ['Quantum mechanic', 'Introduction to Mathematics'],
      fieldsOfStudy: ['Medical AI', 'Deep Learning', 'Precision Medicine', 'Medical Imaging']
  });

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

  const [idaArticles, setIdaArticles] = useState<IdaArticle[]>([
      {
        id: '1',
        title: 'The Application and Challenges of Deep Learning in Medical Image Diagnosis',
        description: 'This article systematically reviews the latest advancements of deep learning technology in the field of medical image diagnosis, analyzes the main challenges currently faced, and proposes future research directions.',
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

  const [reviews, setReviews] = useState<ReviewItem[]>([
      {
          id: '1',
          status: 'PUBLISHED',
          rating: 4.2,
          title: 'A new method for protein structure prediction based on Transformer...',
          description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction. The experimental design is reasonable and the results are convincing.',
          publicationDate: 'OCT, 2023'
      },
      {
          id: '2',
          status: 'PUBLISHED',
          rating: 4.2,
          title: 'A new method for protein structure prediction based on Transformer',
          description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction.',
          publicationDate: 'OCT, 2023'
      }
  ]);

  // --- Operational State ---
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  const [isAddingResearch, setIsAddingResearch] = useState(false);
  const [researchInput, setResearchInput] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  const [scholarLink, setScholarLink] = useState('');

  // --- Effects ---
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
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const myProjects = PROJECTS.filter(p => p.author === profileData.name || p.author === "Dr. Aris Kothari" || p.author === "Dr. Wei Zhang");

  // --- Handlers ---

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
          setStories(prev => [{ id: Date.now().toString(), date: data.time, title: data.title, description: data.description }, ...prev]);
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

  const handleSaveProfile = (data: typeof profileData) => {
      setProfileData(data);
      setIsEditProfileOpen(false);
      showToast('Profile updated successfully');
  };

  const handleVerifyScholar = (link: string) => {
    setScholarLink(link);
    showToast('Academic profile verified successfully');
  };

  // --- Render Helpers ---

  if (isLoading) {
    return (
        <div className="min-h-screen bg-paper pb-24">
            <div className="pt-24 px-6 md:px-12 bg-surface"><div className="h-4 w-32 rounded bg-stone/10 animate-pulse mb-6"></div></div>
            <div className="max-w-[1512px] mx-auto px-6 md:px-12 mt-8">
                <div className="bg-surface h-[400px] border border-ink/5 rounded-sm animate-pulse"></div>
            </div>
        </div>
    );
  }

  const renderStoryTab = () => (
    <div className="relative border-l-2 border-ink/10 ml-4 md:ml-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="absolute -left-[21px] top-0 z-10">
            <button onClick={handleOpenAddStory} className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-accent transition-colors shadow-lg">
                <Plus size={20} />
            </button>
        </div>
        {stories.map((story) => (
            <div key={story.id} className="pl-12 relative group">
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-paper border-4 border-ink group-hover:border-accent transition-colors z-10"></div>
                <div className="bg-surface border border-ink/10 p-8 rounded-sm hover:shadow-md transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 bg-stone/5 text-ink/60 font-mono text-xs font-bold rounded-sm uppercase tracking-wide">{story.date}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEditStory(story)} className="p-2 hover:bg-stone/10 rounded-full text-ink/60 hover:text-ink"><Edit3 size={14}/></button>
                            <button onClick={() => handleDeleteStory(story.id)} className="p-2 hover:bg-stone/10 rounded-full text-ink/60 hover:text-red-600"><Trash2 size={14}/></button>
                        </div>
                    </div>
                    <h3 className="font-sans text-xl font-bold text-ink mb-3 leading-tight">{story.title}</h3>
                    <p className="font-sans text-ink/70 leading-relaxed">{story.description}</p>
                </div>
            </div>
        ))}
    </div>
  );

  const renderProjectsTab = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-ink/60 text-sm font-sans">Research Projects ({myProjects.length})</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
            {myProjects.length > 0 ? (
                myProjects.map(project => (
                    <ProjectCard key={project.id} project={project} variant="card" />
                ))
            ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-ink/10 bg-stone/5 rounded-sm">
                    <Building2 size={40} className="mx-auto text-ink/20 mb-4" />
                    <h3 className="font-bold text-ink/40 uppercase tracking-widest">No Projects Yet</h3>
                </div>
            )}
        </div>
    </div>
  );

  const renderIdaTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {idaArticles.map(article => (
            <div key={article.id} className={`bg-surface border border-ink/10 p-8 rounded-sm hover:border-ink/30 transition-all group ${article.isHidden ? 'opacity-50 grayscale' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {article.isPinned && <ArrowUpToLine size={16} className="text-accent" />}
                        <div className="flex gap-2">
                            {article.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-mono font-bold bg-stone/5 px-2 py-1 rounded-sm text-ink/60 uppercase tracking-wide">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleTogglePin(article.id)} className={`p-2 rounded-full hover:bg-stone/10 ${article.isPinned ? 'text-accent' : 'text-ink/40'}`} title="Pin"><ArrowUpToLine size={16} /></button>
                        <button onClick={() => handleToggleHide(article.id)} className="p-2 rounded-full hover:bg-stone/10 text-ink/40 hover:text-ink" title={article.isHidden ? "Show" : "Hide"}>{article.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                    </div>
                </div>
                <h3 className="font-sans text-2xl font-bold text-ink mb-3 group-hover:text-accent transition-colors cursor-pointer">{article.title}</h3>
                <p className="font-sans text-ink/70 leading-relaxed mb-6 line-clamp-2">{article.description}</p>
                <div className="flex items-center justify-between text-sm text-ink/40 font-mono font-bold">
                    <span>{article.publicationDate}</span>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5"><ThumbsUp size={14} /> {article.likes}</span>
                        <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {article.comments}</span>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );

  const renderReviewsTab = () => (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {reviews.map(review => (
            <div key={review.id} className="bg-surface border border-ink/10 p-8 rounded-sm hover:border-ink/30 transition-all group flex flex-col gap-6 relative">
                 {/* Header: Tag and Meta */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="inline-block px-4 py-1.5 border-2 border-ink rounded-sm text-xs font-mono font-bold uppercase tracking-widest text-ink bg-white w-fit">
                            {review.status}
                        </span>
                         <div className="flex items-center gap-1.5 text-ink">
                             <Star size={16} className="fill-current text-yellow-500" />
                             <span className="font-mono text-sm font-bold pt-0.5">{review.rating}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm font-mono font-bold text-ink/40">
                         <span>{review.publicationDate}</span>
                    </div>
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                    <h3 className="font-sans text-2xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">
                        {review.title}
                    </h3>
                    <p className="font-sans text-ink/70 text-base leading-relaxed">
                        {review.description}
                    </p>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-paper pb-24">
      {/* Header */}
      <div className="bg-surface border-b border-ink/10 pt-24 pb-8 px-6 md:px-12 sticky top-0 z-20">
         <div className="max-w-[1512px] mx-auto">
             <Link to="/" className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest w-fit mb-4">
                <ArrowLeft size={14} className="mr-2" /> Back to Home
            </Link>
         </div>
      </div>

      <div className="max-w-[1512px] mx-auto px-6 md:px-12 pb-12 mt-8">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-12">
                
                {/* Main Profile Info Card */}
                <div className="bg-surface border border-ink/5 rounded-sm mb-24 p-8 md:p-10 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="w-32 h-32 rounded-full overflow-hidden border border-ink/10 shadow-sm">
                                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 bg-ink text-paper p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-75" onClick={() => setIsEditProfileOpen(true)}>
                                <Camera size={16} />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full pt-2">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="font-sans text-3xl md:text-4xl font-bold text-ink">{profileData.name}</h1>
                                    <Verified size={20} className="text-blue-500 fill-current" strokeWidth={0} />
                                    {/* Certifications Mock */}
                                    <div className="flex items-center gap-2 ml-1">
                                         <div className="w-6 h-6 rounded-full bg-red-800 text-paper flex items-center justify-center text-[10px] font-bold border border-red-900 shadow-sm">A</div>
                                         <div className="w-6 h-6 rounded-full bg-blue-800 text-paper flex items-center justify-center text-[10px] font-bold border border-blue-900 shadow-sm">S</div>
                                         <div className="w-6 h-6 rounded-full bg-amber-600 text-paper flex items-center justify-center text-[10px] font-bold border border-amber-700 shadow-sm">M</div>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditProfileOpen(true)} className="hidden md:flex items-center gap-2 px-5 py-2 bg-ink text-paper rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-sm">
                                    <Edit3 size={14} /> Edit
                                </button>
                            </div>

                            <div className="flex flex-col gap-1 text-ink/60 mb-6">
                                <span className="font-sans text-lg">{profileData.role}</span>
                                <span className="font-sans text-base text-ink/50">{profileData.institution}</span>
                            </div>

                            <p className="font-sans text-ink/80 text-base leading-relaxed max-w-4xl mb-8">{profileData.bio}</p>

                            <div className="flex flex-col md:flex-row md:items-center justify-start gap-8 border-t border-ink/5 pt-6 mb-[26px]">
                                <div className="flex space-x-4">
                                    <a href="#" className="p-3 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Github size={20} /></a>
                                    <a href="#" className="p-3 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Fingerprint size={20} /></a>
                                    <button
                                        onClick={() => !scholarLink && setIsScholarModalOpen(true)}
                                        className={`p-3 border rounded-full transition-colors ${scholarLink ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' : 'bg-stone/5 border-ink/5 text-ink hover:bg-ink hover:text-paper'}`}
                                        title={scholarLink ? "Verified Scholar" : "Verify Scholar Profile"}
                                    >
                                        <GraduationCap size={20} />
                                    </button>
                                     <a href="#" className="p-3 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Linkedin size={20} /></a>
                                     <a href="#" className="p-3 bg-stone/5 border border-ink/5 rounded-full hover:bg-ink hover:text-paper transition-colors"><Twitter size={20} /></a>
                                </div>
                                <button onClick={() => setIsEditProfileOpen(true)} className="md:hidden flex items-center justify-center gap-2 px-6 py-3 bg-stone/5 border border-ink/10 rounded-full font-mono text-xs font-bold uppercase tracking-widest">
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tags Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-stone/5 p-8 rounded-sm border border-ink/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-ink/60">Research Fields</h3>
                                {!isAddingResearch ? (
                                    <button onClick={() => setIsAddingResearch(true)} className="text-ink/40 hover:text-ink"><Plus size={16}/></button>
                                ) : (
                                    <div className="flex items-center bg-white border border-ink/10 rounded-sm px-2">
                                        <input autoFocus className="bg-transparent text-xs font-mono p-1 outline-none w-32" value={researchInput} onChange={(e) => setResearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setProfileData(prev => ({...prev, researchFields: [...prev.researchFields, researchInput.trim()]})), setResearchInput(''), setIsAddingResearch(false))} onBlur={() => setIsAddingResearch(false)} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileData.researchFields.map((field, idx) => (
                                    <div key={idx} className="group relative">
                                        <span className="px-4 py-2 bg-white border border-ink/10 rounded-full text-xs font-mono font-bold text-ink hover:border-ink/30 cursor-default block">{field}</span>
                                        <button onClick={() => setProfileData(prev => ({...prev, researchFields: prev.researchFields.filter((_, i) => i !== idx)}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-stone/5 p-8 rounded-sm border border-ink/5">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-ink/60">Subjects</h3>
                                {!isAddingSubject ? (
                                    <button onClick={() => setIsAddingSubject(true)} className="text-ink/40 hover:text-ink"><Plus size={16}/></button>
                                ) : (
                                    <div className="flex items-center bg-white border border-ink/10 rounded-sm px-2">
                                        <input autoFocus className="bg-transparent text-xs font-mono p-1 outline-none w-32" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setProfileData(prev => ({...prev, subjects: [...prev.subjects, subjectInput.trim()]})), setSubjectInput(''), setIsAddingSubject(false))} onBlur={() => setIsAddingSubject(false)} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileData.subjects.map((subj, idx) => (
                                    <div key={idx} className="group relative">
                                        <span className="px-4 py-2 bg-ink text-paper border border-ink rounded-full text-xs font-mono font-bold cursor-default block">{subj}</span>
                                         <button onClick={() => setProfileData(prev => ({...prev, subjects: prev.subjects.filter((_, i) => i !== idx)}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="border-b border-ink/10 mb-12 flex space-x-10">
                    {(['MY_STORY', 'PROJECTS', 'IDA', 'REVIEWS'] as TabType[]).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-mono font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-ink' : 'text-ink/40 hover:text-ink'}`}>
                            {tab.replace('_', ' ')}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-accent"></div>}
                        </button>
                    ))}
                </div>

                {activeTab === 'MY_STORY' && renderStoryTab()}
                {activeTab === 'PROJECTS' && renderProjectsTab()}
                {activeTab === 'IDA' && renderIdaTab()}
                {activeTab === 'REVIEWS' && renderReviewsTab()}

            </div>
         </div>
      </div>

      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} initialData={profileData} onSave={handleSaveProfile} />
      <AddStoryModal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} onSave={handleSaveStory} />
      <PlatformVerificationModal isOpen={isScholarModalOpen} onClose={() => setIsScholarModalOpen(false)} platformName="Google Scholar" onVerify={handleVerifyScholar} />
    </div>
  );
};