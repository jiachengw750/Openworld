

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