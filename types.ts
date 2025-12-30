

export type Category = 'ALL' | 'GRANTS' | 'QUEST' | 'AI TOOLS' | 'WLS(LIVE)' | 'PRIZE';
export type ProjectStatus = 'PRE_LAUNCH' | 'FUNDING' | 'RESEARCH' | 'COMPLETED';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
}

export interface Allocation {
  category: string;
  description: string;
  amount: number;
  percentage: number;
}

export interface TeamMember {
  name: string;
  role: string;
  institution: string;
  avatar: string;
  bio: string;
  awards: string[];
}

export interface Donation {
  id: string;
  donor: string;
  amount: number;
  date: string;
  avatar: string;
}

export interface DonationVoucher {
  id: string;
  projectId: string;
  projectTitle: string;
  amount: number;
  date: string;
  tokenId: string;
  contractAddress: string;
  image: string;
  transactionHash: string;
}

export interface IDA {
  name: string;
  contractAddress: string;
  ownerAddress: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  tags: string[];
  status: ProjectStatus;
  image: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  startTime?: string;
  author: string;
  authorAvatar: string;
  authorBio: string;
  institution: string;
  team: TeamMember[];
  impactStats: { label: string; value: string }[];
  milestones: Milestone[];
  allocation: Allocation[];
  ida: IDA;
  donations: Donation[];
}

// Quest Types
export type QuestStatus = 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Quest {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  status: QuestStatus;
  tags: string[];
  subjects: string[]; // Added subjects field
  image?: string;
  reward: {
    amount: number;
    currency: string;
    usdValue: number;
  };
  endTime: string;
  deliveryTime: string;
  bidderCount: number;
  bidders: string[]; // avatar urls
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  commentsCount: number;
}

// Profile Types
export interface StoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface IdaArticle {
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

export interface ReviewItem {
  id: string;
  status: string;
  rating: number;
  title: string;
  description: string;
  publicationDate: string;
}

export interface UserProfile {
  name: string;
  role: string;
  institution: string;
  avatar: string;
  banner: string;
  bio: string;
  joinDate: string;
  researchFields: string[];
  subjects: string[];
  fieldsOfStudy: string[];
  title?: string;
}

// AI Tool Market Types
export type AiToolCategory = 'Literature' | 'Reading' | 'Writing' | 'Data' | 'Design';
export type AiSourceType = 'OFFICIAL' | 'LINK';
export type ResearchField = 'ALL_FIELDS' | 'Biology' | 'Chemistry' | 'Physics' | 'Computer Science' | 'Mathematics' | 'Medicine' | 'Environmental Science' | 'Engineering' | 'Neuroscience' | 'Materials Science';

export interface AiPrompt {
  id: string;
  title: string;
  content: string;
  isOfficial: boolean;
  author?: string;
  authorAvatar?: string;
  likes?: number;
  usageCount?: number;
  date?: string;
}

export interface AiToolReview {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  isFeatured?: boolean;
}

export interface AiFAQ {
  question: string;
  answer: string;
}

export interface AiTool {
  id: string;
  name: string;
  icon: string;
  isAiTool: boolean; // Property to distinguish AI Agents from pure utilities
  image?: string; // New field for Hero Media
  description: string;
  fullDescription: string;
  category: AiToolCategory;
  researchField?: ResearchField; // Research field classification
  sourceType: AiSourceType;
  rating: number;
  reviewCount: number;
  tags: string[];
  externalUrl?: string;
  prompts: AiPrompt[];
  faqs: AiFAQ[];
  modelPoweredBy?: string;
  useCount: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  files?: { name: string; type: string; size: string }[];
}

export type WizardStep = 'GUIDE' | 'BASICS' | 'STANDARDS' | 'TERMS' | 'PREVIEW' | 'PAYMENT';

export interface QuestFormData {
  title: string;
  subject: string;
  tags: string[];
  description: string;
  attachments: File[];
  deliverables: string;
  acceptanceCriteria: string;
  budget: string;
  deadline: string;
  ipRights: 'WORK_FOR_HIRE' | 'OPEN_SOURCE' | 'ATTRIBUTION' | null;
}
