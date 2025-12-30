
import { Project, DonationVoucher, Quest, UserProfile, StoryItem, IdaArticle, ReviewItem, AiTool } from './types';

export const USER_DONATIONS: DonationVoucher[] = [
    {
        id: 'v1',
        projectId: '1',
        projectTitle: 'Mycoremediation: Plastic Eating Fungi',
        amount: 500,
        date: '2023-12-15',
        tokenId: '#8821',
        contractAddress: '0x71C95911E9a5D330f4D621842EC243EE13439A23',
        image: 'https://picsum.photos/400/400?random=10',
        transactionHash: '0xabc123...'
    },
    {
        id: 'v2',
        projectId: '3',
        projectTitle: 'Quantum Entanglement in Neural Networks',
        amount: 1200,
        date: '2024-01-20',
        tokenId: '#4092',
        contractAddress: '0x11B233C1E9a5D330f4D621842EC243EE13439A23',
        image: 'https://picsum.photos/400/400?random=11',
        transactionHash: '0xdef456...'
    },
    {
        id: 'v3',
        projectId: '2',
        projectTitle: 'Atmospheric Aerosol Injection Arrays',
        amount: 150,
        date: '2024-02-10',
        tokenId: '#1209',
        contractAddress: '0x88A11B2E9a5D330f4D621842EC243EE13439A23',
        image: 'https://picsum.photos/400/400?random=12',
        transactionHash: '0xghi789...'
    }
];

export const MOCK_BIDDERS = [
    {
        id: 'b1',
        name: 'Dr. Sarah Lin',
        institution: 'MIT Media Lab',
        email: 'sarah.lin@media.mit.edu',
        avatar: 'https://i.pravatar.cc/150?u=30',
        lex: 890,
        amount: 4800,
        days: 7,
        proposal: "I have extensive experience with molecular rendering using Blender and PyMOL. I can deliver 4K renders and a 60fps animation.",
        fullProposal: `## Technical Approach
I propose a hybrid workflow utilizing PyMOL for initial structure cleanup and surface generation, followed by Blender (Cycles engine) for high-fidelity ray tracing.

### Methodology
1. **Data Preparation**: Import GROMACS trajectories, correct bond orders, and generate solvent-accessible surface area (SASA) meshes.
2. **Texturing**: Apply subsurface scattering (SSS) shaders to mimic the organic feel of protein structures, crucial for Nature-tier illustrations.
3. **Animation**: Keyframe the ligand binding path based on the energy minimization steps from your simulation data.

### Deliverables
- 10x 4K Still Images (TIFF, 300 DPI)
- 1x 60s Animation (H.264 & ProRes)
- Blender Project Files (.blend)

I have attached my portfolio demonstrating similar work for *Cell* and *Nature Chemistry*.`,
        attachments: [
            { name: "Portfolio_Molecular_2024.pdf", size: "12.4 MB", type: "PDF" },
            { name: "Render_Sample_Protein.png", size: "4.2 MB", type: "IMAGE" },
            { name: "Animation_Reel.mp4", size: "45.1 MB", type: "VIDEO" }
        ],
        tags: ['Expert', 'Top Rated'],
        stats: {
            successRate: '99%',
            completed: 42,
            rank: 'Top 1%'
        }
    },
    {
        id: 'b2',
        name: 'James Chen',
        institution: 'Stanford Biodesign',
        email: 'j.chen@stanford.edu',
        avatar: 'https://i.pravatar.cc/150?u=12',
        lex: 720,
        amount: 4500,
        days: 10,
        proposal: "I propose using a custom Python script to automate the frame generation from GROMACS trajectories.",
        fullProposal: "My approach focuses on data accuracy. By scripting the import process, we ensure that every atom's position is exactly as simulated, without the interpolation errors common in manual animation.",
        attachments: [
            { name: "Script_Demo.py", size: "12 KB", type: "CODE" },
            { name: "Previous_Work.pdf", size: "2.1 MB", type: "PDF" }
        ],
        tags: ['Fast Response'],
        stats: {
            successRate: '95%',
            completed: 18,
            rank: 'Top 10%'
        }
    },
    {
        id: 'b3',
        name: 'BioVis Studio',
        institution: 'Independent Agency',
        email: 'contact@biovis.studio',
        avatar: 'https://i.pravatar.cc/150?u=50',
        lex: 650,
        amount: 5000,
        days: 5,
        proposal: "We are a team of scientific illustrators. We can prioritize this task and deliver within 5 days.",
        fullProposal: "As an agency, we have a dedicated render farm. This allows us to produce 4K animations in a fraction of the time. We also include a dedicated art director to ensure the visual style matches your publication requirements.",
        attachments: [
            { name: "Agency_Showreel.mp4", size: "120 MB", type: "VIDEO" },
            { name: "Rate_Card.pdf", size: "1.5 MB", type: "PDF" }
        ],
        tags: ['Team', 'Agency'],
        stats: {
            successRate: '100%',
            completed: 8,
            rank: 'Rising Star'
        }
    },
    {
        id: 'b4',
        name: 'Alex Rivera',
        institution: 'Tsinghua University',
        email: 'arivera@tsinghua.edu.cn',
        avatar: 'https://i.pravatar.cc/150?u=60',
        lex: 450,
        amount: 3200,
        days: 12,
        proposal: "Recent grad with strong skills in Maya. Offering a lower rate to build my reputation on OpenSci.",
        fullProposal: "I am looking to build my portfolio. I will dedicate all my time to this single project, ensuring you get unlimited revisions until you are satisfied. I specialize in Maya's molecular plugins.",
        attachments: [
            { name: "Student_Portfolio.pdf", size: "5.5 MB", type: "PDF" }
        ],
        tags: ['New', 'Budget'],
        stats: {
            successRate: 'N/A',
            completed: 2,
            rank: 'Newcomer'
        }
    },
    {
        id: 'b5',
        name: 'Dr. Emily Zhao',
        institution: 'Oxford University',
        email: 'emily.zhao@bio.ox.ac.uk',
        avatar: 'https://i.pravatar.cc/150?u=15',
        lex: 880,
        amount: 4900,
        days: 8,
        proposal: "My research focuses on protein folding. I understand the scientific nuance required for Nature publications.",
        fullProposal: "Visual accuracy is paramount. I will verify the Van der Waals radii and hydrogen bond distances before rendering to ensure scientific validity.",
        attachments: [],
        tags: ['Academic', 'Expert'],
        stats: {
            successRate: '98%',
            completed: 35,
            rank: 'Top 5%'
        }
    },
    {
        id: 'b6',
        name: 'Quantum Graphics',
        institution: 'Design Firm',
        email: 'hello@quantumgraphics.io',
        avatar: 'https://i.pravatar.cc/150?u=70',
        lex: 750,
        amount: 5000,
        days: 4,
        proposal: "Rush delivery available. We have a render farm ready to process the 4K animation sequences overnight.",
        fullProposal: "We are a boutique design firm specializing in scientific visualization. Our team consists of 3D artists with backgrounds in biology.",
        attachments: [],
        tags: ['Fastest', 'Agency'],
        stats: {
            successRate: '100%',
            completed: 12,
            rank: 'Pro'
        }
    },
    {
        id: 'b7',
        name: 'Prof. David Miller',
        institution: 'ETH Zurich',
        email: 'dmiller@ethz.ch',
        avatar: 'https://i.pravatar.cc/150?u=22',
        lex: 920,
        amount: 4600,
        days: 9,
        proposal: "I have developed a proprietary plugin for visualizing hydrogen bonding networks.",
        fullProposal: "My plugin allows for dynamic visualization of H-bonds as they form and break during the docking simulation.",
        attachments: [],
        tags: ['Expert', 'Developer'],
        stats: {
            successRate: '100%',
            completed: 50,
            rank: 'Elite'
        }
    },
    {
        id: 'b8',
        name: 'Yuki Tanaka',
        institution: 'Freelance Artist',
        email: 'yuki.art@gmail.com',
        avatar: 'https://i.pravatar.cc/150?u=33',
        lex: 500,
        amount: 3000,
        days: 14,
        proposal: "Experienced in medical animation. My rate is lower as I am building my profile here, but quality is guaranteed.",
        fullProposal: "I have 5 years of experience in medical animation for pharmaceutical companies. I am new to OpenSci but not to the industry.",
        attachments: [],
        tags: ['Value', 'Visuals'],
        stats: {
            successRate: '100%',
            completed: 5,
            rank: 'Contributor'
        }
    },
    {
        id: 'b9',
        name: 'Neuron Collective',
        institution: 'Research Group',
        email: 'collab@neuron.org',
        avatar: 'https://i.pravatar.cc/150?u=88',
        lex: 810,
        amount: 4800,
        days: 6,
        proposal: "Our lab specializes in docking simulations. We can verify the PDB data integrity before rendering.",
        fullProposal: "We offer a scientific peer-review of the data as part of the visualization package.",
        attachments: [],
        tags: ['Team', 'Scientific'],
        stats: {
            successRate: '96%',
            completed: 22,
            rank: 'Verified Lab'
        }
    },
    {
        id: 'b10',
        name: 'Dr. Aarya Singh',
        institution: 'IIT Bombay',
        email: 'a.singh@iitb.ac.in',
        avatar: 'https://i.pravatar.cc/150?u=44',
        lex: 670,
        amount: 4000,
        days: 10,
        proposal: "Will use ChimeraX for initial setup and export to Blender for ray-tracing.",
        fullProposal: "I find ChimeraX handles surface generation better than PyMOL for large complexes. I will use this workflow.",
        attachments: [],
        tags: ['Reliable'],
        stats: {
            successRate: '92%',
            completed: 15,
            rank: 'Veteran'
        }
    },
    {
        id: 'b11',
        name: 'Mark O\'Connor',
        institution: 'Cambridge PhD',
        email: 'm.oconnor@cam.ac.uk',
        avatar: 'https://i.pravatar.cc/150?u=55',
        lex: 420,
        amount: 3500,
        days: 12,
        proposal: "I'm writing my thesis on similar topics. Familiar with the specific inhibitor structures mentioned.",
        fullProposal: "I have just finished a chapter on this exact inhibitor class. I can highlight the active site residues with high accuracy.",
        attachments: [],
        tags: ['Student', 'Domain Knowledge'],
        stats: {
            successRate: '100%',
            completed: 3,
            rank: 'Rising Star'
        }
    },
    {
        id: 'b12',
        name: 'Helix Designs',
        institution: 'SciComm Studio',
        email: 'projects@helixdesigns.com',
        avatar: 'https://i.pravatar.cc/150?u=99',
        lex: 890,
        amount: 5000,
        days: 5,
        proposal: "Standard commercial license included. We ensure colorblind-safe palettes for all publication figures.",
        fullProposal: "Accessibility is key for high-impact publications. We check all renders against CVD simulators.",
        attachments: [],
        tags: ['Agency', 'Accessibility'],
        stats: {
            successRate: '99%',
            completed: 60,
            rank: 'Top Rated'
        }
    }
];

export const INITIAL_PROFILE: UserProfile = {
    name: 'Dr. Aris Kothari',
    role: 'Principal Investigator',
    institution: 'Perimeter Institute',
    avatar: 'https://i.pravatar.cc/150?u=3',
    banner: 'https://picsum.photos/1200/400?random=1',
    bio: 'Leading researcher in quantum biology and neural coherence. Exploring the intersection of quantum mechanics and consciousness through the Orch OR theory. My lab focuses on microtubule resonance.',
    joinDate: 'Nov, 2023',
    researchFields: ['Quantum Physics', 'Neuroscience', 'Consciousness'],
    subjects: ['Physics', 'Biology'],
    fieldsOfStudy: ['Quantum Biology', 'Neurology'],
    title: 'Dr.'
};

export const INITIAL_STORIES: StoryItem[] = [
    { id: '1', date: 'Dec, 2023', title: 'Published in Nature', description: 'Our paper on "Quantum Coherence in Microtubules" was accepted for publication.' },
    { id: '2', date: 'Nov, 2023', title: 'Joined OpenSci', description: 'Started the journey to decentralized science funding.' },
    { id: '3', date: 'Oct, 2023', title: 'Research Grant Awarded', description: 'Received a $50k grant from the Future Science Foundation.' }
];

export const INITIAL_IDA: IdaArticle[] = [
    { id: '1', title: 'The Future of Quantum Biology', description: 'Exploring the implications of quantum effects in biological systems.', tags: ['Physics', 'Biology'], isFeatured: true, publicationDate: '2024-01-15', likes: 120, comments: 45, isPinned: true, isHidden: false },
    { id: '2', title: 'Decentralized Science: A New Era', description: 'How blockchain can revolutionize research funding and publishing.', tags: ['DeSci', 'Web3'], isFeatured: false, publicationDate: '2023-12-10', likes: 85, comments: 20, isPinned: false, isHidden: false }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
    { id: '1', status: 'Verified', rating: 5, title: 'Excellent Collaborator', description: 'Dr. Kothari provided clear guidance and was very responsive.', publicationDate: '2024-02-01' },
    { id: '2', status: 'Verified', rating: 4, title: 'Great Insight', description: 'Very knowledgeable in his field.', publicationDate: '2024-01-20' }
];

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Mycoremediation: Plastic Eating Fungi',
        shortDescription: 'Developing a new strain of fungi capable of digesting PET plastics in marine environments.',
        fullDescription: 'Plastic pollution is one of the most pressing environmental issues of our time. This project aims to genetically modify Aspergillus tubingensis to enhance its ability to degrade polyethylene terephthalate (PET). We will conduct controlled experiments to measure degradation rates and identify the enzymes responsible.',
        category: 'GRANTS',
        tags: ['Biology', 'Environment', 'Genetics'],
        status: 'FUNDING',
        image: 'https://picsum.photos/800/400?random=1',
        raised: 15000,
        goal: 50000,
        backers: 120,
        daysLeft: 15,
        author: 'Dr. Aris Kothari',
        authorAvatar: 'https://i.pravatar.cc/150?u=3',
        authorBio: 'Expert in mycology and genetic engineering.',
        institution: 'Perimeter Institute',
        team: [
            { name: 'Dr. Aris Kothari', role: 'Lead', institution: 'Perimeter Institute', avatar: 'https://i.pravatar.cc/150?u=3', bio: 'Expert in mycology.', awards: ['Nobel Prize'] },
            { name: 'Dr. Sarah Lee', role: 'Geneticist', institution: 'MIT', avatar: 'https://i.pravatar.cc/150?u=30', bio: 'Specialist in CRISPR.', awards: [] }
        ],
        impactStats: [{ label: 'Plastic Degraded', value: '500kg' }],
        milestones: [
            { id: 'm1', title: 'Strain Isolation', description: 'Isolate high-efficiency strains.', date: '2024-01-01', status: 'COMPLETED' },
            { id: 'm2', title: 'Enzyme Analysis', description: 'Identify key enzymes.', date: '2024-03-01', status: 'IN_PROGRESS' },
            { id: 'm3', title: 'Field Test', description: 'Test in controlled marine environment.', date: '2024-06-01', status: 'UPCOMING' }
        ],
        allocation: [
            { category: 'Equipment', description: 'Lab bioreactors', amount: 20000, percentage: 40 },
            { category: 'Personnel', description: 'Research assistants', amount: 20000, percentage: 40 },
            { category: 'Materials', description: 'Consumables', amount: 10000, percentage: 20 }
        ],
        ida: { name: 'MycoDAO', contractAddress: '0x123...abc', ownerAddress: '0x456...def' },
        donations: [
            { id: 'd1', donor: 'Alice', amount: 100, date: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=1' },
            { id: 'd2', donor: 'Bob', amount: 500, date: '5 days ago', avatar: 'https://i.pravatar.cc/150?u=2' }
        ]
    },
    {
        id: '2',
        title: 'Atmospheric Aerosol Injection Arrays',
        shortDescription: 'Testing scalable deployment methods for stratospheric aerosol injection to combat global warming.',
        fullDescription: 'Solar geoengineering offers a potential stopgap for climate change. This project investigates the feasibility of using high-altitude balloons for the controlled release of sulfate aerosols. We will model dispersion patterns and assess potential side effects on ozone depletion.',
        category: 'GRANTS',
        tags: ['Physics', 'Climate', 'Engineering'],
        status: 'RESEARCH',
        image: 'https://picsum.photos/800/400?random=2',
        raised: 75000,
        goal: 100000,
        backers: 340,
        daysLeft: 0,
        author: 'Dr. Wei Zhang',
        authorAvatar: 'https://i.pravatar.cc/150?u=4',
        authorBio: 'Atmospheric physicist specializing in climate engineering.',
        institution: 'Tsinghua University',
        team: [],
        impactStats: [],
        milestones: [
            { id: 'm1', title: 'Simulation', description: 'Computer modeling.', date: '2023-12-01', status: 'COMPLETED' },
            { id: 'm2', title: 'Prototype', description: 'Build balloon payload.', date: '2024-02-01', status: 'IN_PROGRESS' }
        ],
        allocation: [],
        ida: { name: 'GeoEngFund', contractAddress: '0x789...ghi', ownerAddress: '0xabc...jkl' },
        donations: []
    },
    {
        id: '3',
        title: 'Quantum Entanglement in Neural Networks',
        shortDescription: 'Investigating if quantum effects play a non-trivial role in biological neural processing.',
        fullDescription: 'The Orch OR theory posits that consciousness arises from quantum computations in microtubules. We aim to test this by measuring coherence times in isolated microtubule bundles under physiological conditions. This could revolutionize our understanding of the brain and AI.',
        category: 'GRANTS',
        tags: ['Quantum', 'Neuroscience', 'AI'],
        status: 'PRE_LAUNCH',
        image: 'https://picsum.photos/800/400?random=3',
        raised: 0,
        goal: 250000,
        backers: 0,
        daysLeft: 45,
        startTime: '2024-05-01',
        author: 'Dr. Aris Kothari',
        authorAvatar: 'https://i.pravatar.cc/150?u=3',
        authorBio: 'Leading researcher in quantum biology.',
        institution: 'Perimeter Institute',
        team: [],
        impactStats: [],
        milestones: [],
        allocation: [],
        ida: { name: 'QuantumMind', contractAddress: '0xdef...mno', ownerAddress: '0xghi...pqr' },
        donations: []
    }
];

export const QUESTS: Quest[] = [
    {
        id: 'q1',
        title: 'Heuristic Solution and Experimental Comparison of Convex Optimization Problems',
        shortDescription: 'Need a solver to implement and benchmark a new heuristic for large-scale convex problems.',
        fullDescription: 'We are looking for a researcher with strong optimization background to implement a novel heuristic algorithm for solving large-scale convex optimization problems. The task involves coding the algorithm in Python/C++, comparing it with standard solvers (CVXPY, Gurobi) on a provided dataset, and writing a technical report on the convergence properties.',
        status: 'RECRUITING',
        tags: ['Math', 'Optimization', 'Python'],
        subjects: ['Math', 'Computer Science'],
        reward: { amount: 2000, currency: 'USDC', usdValue: 2000 },
        endTime: '2024-04-15',
        deliveryTime: '2024-05-01',
        bidderCount: 5,
        bidders: ['https://i.pravatar.cc/150?u=5', 'https://i.pravatar.cc/150?u=6'],
        author: { name: 'Dr. Aris Kothari', avatar: 'https://i.pravatar.cc/150?u=3', verified: true },
        commentsCount: 3
    },
    {
        id: 'q2',
        title: 'High-Fidelity 3D Rendering of Molecular Docking Interactions',
        shortDescription: 'Create publication-ready 3D visualizations of protein-ligand binding from PDB files.',
        fullDescription: 'We need a 3D artist or structural biologist to create high-resolution renders of a new drug candidate binding to its target protein. We will provide PDB files. Deliverables include 5 still images (4K) and a 30-second animation showing the conformational change upon binding. Must use PyMOL, ChimeraX, or Blender.',
        status: 'IN_PROGRESS',
        tags: ['Biology', 'Visualization', '3D'],
        subjects: ['Biology', 'Art'],
        reward: { amount: 1500, currency: 'USDC', usdValue: 1500 },
        endTime: '2024-03-30',
        deliveryTime: '2024-04-10',
        bidderCount: 12,
        bidders: ['https://i.pravatar.cc/150?u=7', 'https://i.pravatar.cc/150?u=8', 'https://i.pravatar.cc/150?u=9'],
        author: { name: 'Dr. Sarah Lin', avatar: 'https://i.pravatar.cc/150?u=30', verified: true },
        commentsCount: 8
    },
    {
        id: 'q3',
        title: 'Systematic Literature Review on Algae-Based Biofuels',
        shortDescription: 'Conduct a comprehensive review of peer-reviewed papers from 2020-2024.',
        fullDescription: 'Looking for a researcher to perform a systematic literature review on the efficiency of genetically modified algae for biofuel production. The review should cover extraction methods, lipid yields, and scalability. The output should be a structured report summarizing key findings and identifying research gaps.',
        status: 'COMPLETED',
        tags: ['Energy', 'Biology', 'Research'],
        subjects: ['Biology', 'Environmental Science'],
        reward: { amount: 800, currency: 'USDC', usdValue: 800 },
        endTime: '2024-02-28',
        deliveryTime: '2024-03-15',
        bidderCount: 8,
        bidders: ['https://i.pravatar.cc/150?u=10'],
        author: { name: 'GreenEnergy Lab', avatar: 'https://i.pravatar.cc/150?u=40', verified: false },
        commentsCount: 2
    },
    // Missing Quests from Workspace
    {
        id: 'q4',
        title: 'Parallelization of Monte Carlo Simulations for Particle Physics',
        shortDescription: 'Optimize and parallelize an existing Monte Carlo simulation code for high-energy physics collisions.',
        fullDescription: 'We require a computational physicist or HPC expert to optimize our legacy Fortran/C++ codebase. The goal is to implement MPI/OpenMP parallelization to scale the simulation up to 1000 cores on our cluster. Deliverables include the optimized source code and a performance benchmark report.',
        status: 'RECRUITING', // Actually Rejected in workspace but Quest itself is open/closed
        tags: ['Physics', 'HPC', 'C++'],
        subjects: ['Physics', 'Computer Science'],
        reward: { amount: 500000, currency: 'SCI', usdValue: 50000 },
        endTime: '2024-05-20',
        deliveryTime: '2024-06-30',
        bidderCount: 2,
        bidders: ['https://i.pravatar.cc/150?u=15', 'https://i.pravatar.cc/150?u=16'],
        author: { name: 'CERN Atlas Group', avatar: 'https://i.pravatar.cc/150?u=55', verified: true },
        commentsCount: 5
    },
    {
        id: '105',
        title: 'Visualizing Protein Folding with AI',
        shortDescription: 'Create an explainer video and 3D visualization of AlphaFold predictions for a general audience.',
        fullDescription: 'We are looking for a scientific communicator and 3D artist to create a visual package explaining how AI predicts protein folding. The output will be used in an educational documentary. You will work with our raw AlphaFold data output.',
        status: 'RECRUITING',
        tags: ['AI', 'Biology', 'Education'],
        subjects: ['Biology', 'Computer Science', 'Art'],
        reward: { amount: 1500, currency: 'USDC', usdValue: 1500 },
        endTime: '2024-04-25',
        deliveryTime: '2024-05-10',
        bidderCount: 15,
        bidders: ['https://i.pravatar.cc/150?u=20', 'https://i.pravatar.cc/150?u=21'],
        author: { name: 'DeepMind Edu', avatar: 'https://i.pravatar.cc/150?u=60', verified: true },
        commentsCount: 12
    },
    {
        id: '104',
        title: 'Translation of Biophysics Paper',
        shortDescription: 'Translate a technical biophysics paper from Mandarin to English for publication.',
        fullDescription: 'Looking for a bilingual researcher with a background in biophysics to translate a 15-page manuscript. Accuracy of technical terminology is paramount.',
        status: 'COMPLETED',
        tags: ['Translation', 'Biophysics'],
        subjects: ['Physics', 'Biology'],
        reward: { amount: 200, currency: 'USDC', usdValue: 200 },
        endTime: '2024-01-10',
        deliveryTime: '2024-01-20',
        bidderCount: 3,
        bidders: [],
        author: { name: 'Prof. Li', avatar: 'https://i.pravatar.cc/150?u=61', verified: false },
        commentsCount: 0
    },
    {
        id: '202',
        title: 'Data Analysis for Ocean Acidification Study',
        shortDescription: 'Analyze large dataset of ocean pH levels and correlate with marine biodiversity metrics.',
        fullDescription: 'We have 5 years of sensor data from the Pacific Ocean. We need a data scientist to clean the data, perform time-series analysis, and visualize correlations with local biodiversity counts.',
        status: 'RECRUITING',
        tags: ['Data Science', 'Environment', 'Statistics'],
        subjects: ['Environmental Science', 'Statistics'],
        reward: { amount: 800, currency: 'USDC', usdValue: 800 },
        endTime: '2024-04-05',
        deliveryTime: '2024-04-20',
        bidderCount: 6,
        bidders: ['https://i.pravatar.cc/150?u=70'],
        author: { name: 'Ocean Cleanup', avatar: 'https://i.pravatar.cc/150?u=71', verified: true },
        commentsCount: 4
    },
    {
        id: '203',
        title: 'Smart Contract Audit for Research DAO',
        shortDescription: 'Security audit for a new governance contract for a DeSci DAO.',
        fullDescription: 'We need a certified smart contract auditor to review our GovernorBravo fork. Focus on reentrancy vulnerabilities and governance attack vectors.',
        status: 'IN_PROGRESS',
        tags: ['Blockchain', 'Security', 'Solidity'],
        subjects: ['Computer Science'],
        reward: { amount: 4500, currency: 'USDC', usdValue: 4500 },
        endTime: '2024-03-25',
        deliveryTime: '2024-04-05',
        bidderCount: 4,
        bidders: ['https://i.pravatar.cc/150?u=80'],
        author: { name: 'ResearchDAO', avatar: 'https://i.pravatar.cc/150?u=81', verified: true },
        commentsCount: 2
    },
    {
        id: 'm4',
        title: 'Autonomous Drone Swarm Navigation',
        shortDescription: 'Develop pathfinding algorithms for a swarm of drones in a cluttered environment.',
        fullDescription: 'Seeking robotics engineers to develop decentralized path planning for drone swarms. Must simulate in Gazebo/ROS.',
        status: 'IN_PROGRESS',
        tags: ['Robotics', 'AI', 'Control Systems'],
        subjects: ['Engineering', 'Computer Science'],
        reward: { amount: 65000, currency: 'SCI', usdValue: 6500 },
        endTime: '2024-06-01',
        deliveryTime: '2024-08-01',
        bidderCount: 9,
        bidders: ['https://i.pravatar.cc/150?u=90'],
        author: { name: 'SkyNet Labs', avatar: 'https://i.pravatar.cc/150?u=91', verified: true },
        commentsCount: 10
    }
];

export const AI_TOOLS: AiTool[] = [
    {
        id: 'ai-1',
        name: 'Semantic Scholar Agent',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=Scholar',
        isAiTool: true,
        image: 'https://picsum.photos/1200/600?random=30',
        description: 'Advanced AI agent for real-time literature tracking and citation analysis.',
        fullDescription: 'The Semantic Scholar Agent is a specialized tool designed for researchers who need to stay updated with the latest publications in their field. It leverages official Semantic Scholar APIs to provide deep citation analysis, citation graphs, and personalized paper recommendations based on your research interests.',
        category: 'Literature',
        researchField: 'ALL_FIELDS',
        sourceType: 'OFFICIAL',
        rating: 4.8,
        reviewCount: 1240,
        useCount: 45000,
        tags: ['Search', 'Academic', 'Citation'],
        modelPoweredBy: 'GPT-4o',
        prompts: [
            { id: 'p1', title: 'Find Review Papers', content: 'Find me the top 5 most cited review papers on "Quantum Computing" published after 2022.', isOfficial: true },
            { id: 'p2', title: 'Trace Citation Graph', content: 'Explain the citation network for the paper titled "Attention is All You Need".', isOfficial: true }
        ],
        faqs: [
            { question: 'Is the data up to date?', answer: 'Yes, we sync with the Semantic Scholar database daily.' },
            { question: 'Can I export the results?', answer: 'Yes, results can be exported as BibTeX or CSV.' }
        ]
    },
    {
        id: 'ai-2',
        name: 'Elicit Navigator',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elicit',
        isAiTool: true,
        image: 'https://picsum.photos/1200/600?random=31',
        description: 'AI research assistant that automates time-consuming research tasks.',
        fullDescription: 'Elicit Navigator provides a seamless interface to the Elicit platform. It is widely recognized for its ability to automate systematic reviews and data extraction from thousands of papers simultaneously.',
        category: 'Literature',
        researchField: 'ALL_FIELDS',
        sourceType: 'LINK',
        rating: 4.6,
        reviewCount: 890,
        useCount: 12000,
        tags: ['Extraction', 'Synthesis'],
        externalUrl: 'https://elicit.org',
        prompts: [
            { id: 'ep1', title: 'Summarize Literature', content: 'Summarize the top 10 papers discussing the impact of microplastics on soil health, focus on experimental methods.', isOfficial: true },
            { id: 'ep2', title: 'Extract Parameters', content: 'Extract the drug dosage and efficacy results from the following three clinical trial PDFs.', isOfficial: true }
        ],
        faqs: [
            { question: 'Does Catalyst share my data with Elicit?', answer: 'No. As an external service, you interact with Elicit directly on their platform according to their privacy policy.' },
            { question: 'Is there a free tier for Elicit?', answer: 'Elicit offers a limited free trial, but heavy research use may require their Plus subscription.' }
        ]
    },
    {
        id: 'ai-3',
        name: 'Paper Reading Bot',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=Reading',
        isAiTool: true,
        image: 'https://picsum.photos/1200/600?random=32',
        description: 'Deep reading assistant that helps you digest complex PDFs in minutes.',
        fullDescription: 'Our Paper Reading Bot specializes in technical analysis. Upload any academic PDF and it will help you extract the methodology, key findings, and potential weaknesses without missing any nuance.',
        category: 'Reading',
        researchField: 'ALL_FIELDS',
        sourceType: 'OFFICIAL',
        rating: 4.9,
        reviewCount: 2300,
        useCount: 88000,
        tags: ['PDF', 'Analysis', 'Polishing'],
        modelPoweredBy: 'Claude 3.5 Sonnet',
        prompts: [
            { id: 'p3', title: 'Explain Methodology', content: 'Analyze the methodology section of this paper and identify any potential biases.', isOfficial: true }
        ],
        faqs: [
            { question: 'Does it support multi-column PDFs?', answer: 'Yes, our OCR and parsing engine handles most academic layouts perfectly.' }
        ]
    },
    {
        id: 'ai-4',
        name: 'Claude Academic Polisher',
        icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=Claude',
        isAiTool: true,
        image: 'https://picsum.photos/1200/600?random=33',
        description: 'Expert-level writing assistant for academic papers and grant proposals.',
        fullDescription: 'Improve your manuscript with our Academic Polisher. It doesn\'t just correct grammar; it optimizes the logical flow, technical vocabulary, and adheres to specific journal style guides.',
        category: 'Writing',
        researchField: 'ALL_FIELDS',
        sourceType: 'OFFICIAL',
        rating: 4.7,
        reviewCount: 1500,
        useCount: 32000,
        tags: ['Writing', 'Polishing', 'English'],
        modelPoweredBy: 'Claude 3.5 Sonnet',
        prompts: [
            { id: 'p4', title: 'Improve Abstract', content: 'Rewrite my abstract to be more compelling and suitable for submission to Nature.', isOfficial: true }
        ],
        faqs: []
    },
    {
        id: 'ut-1',
        name: 'NCBI PubMed Search',
        icon: 'https://api.dicebear.com/7.x/initials/svg?seed=PM',
        isAiTool: false,
        image: 'https://picsum.photos/1200/600?random=35',
        description: 'The world\'s premier database for biomedical literature and clinical research.',
        fullDescription: 'PubMed is a free resource supporting the search and retrieval of biomedical and life sciences literature with the aim of improving health–both globally and personally. It provides access to millions of citations from MEDLINE, life science journals, and online books.',
        category: 'Literature',
        researchField: 'Medicine',
        sourceType: 'LINK',
        rating: 4.9,
        reviewCount: 5400,
        useCount: 1200000,
        tags: ['Database', 'Biomedical', 'Clinical'],
        externalUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
        prompts: [
            { id: 'up1', title: 'Clinical Trial Filter', content: '(clinical trial[Filter]) AND (cardiology[Title]) AND 2023[PDAT]', isOfficial: true },
            { id: 'up2', title: 'Meta-Analysis Template', content: 'meta-analysis[Publication Type] AND genome-wide association study[Text Word]', isOfficial: true }
        ],
        faqs: [
            { question: 'Is full-text available?', answer: 'Citations often include links to full-text content from PubMed Central and publisher web sites.' }
        ]
    }
];

export const MOCK_AI_REVIEWS: Record<string, any[]> = {
    'ai-1': [
        { id: 'r1', user: 'Dr. John Doe', avatar: 'https://i.pravatar.cc/150?u=1', rating: 5, content: 'Outstanding tool for literature mapping. Saved me hours of manual searching. The citation graph feature is particularly impressive for understanding research lineages.', date: '2024-03-15', likes: 42, isFeatured: true },
        { id: 'r2', user: 'Prof. Alice Chen', avatar: 'https://i.pravatar.cc/150?u=2', rating: 4, content: 'Very good, but sometimes citation counts have a small lag compared to Google Scholar.', date: '2024-03-10', likes: 18 },
        { id: 'r3', user: 'Dr. Marcus Wei', avatar: 'https://i.pravatar.cc/150?u=25', rating: 5, content: 'Essential for my systematic review workflow. The API integration is seamless.', date: '2024-03-08', likes: 31, isFeatured: true },
        { id: 'r4', user: 'Sarah Kim, PhD', avatar: 'https://i.pravatar.cc/150?u=26', rating: 5, content: 'Best literature tool I have used. Beats manual searching by a mile.', date: '2024-03-05', likes: 15 },
        { id: 'r5', user: 'Prof. David Miller', avatar: 'https://i.pravatar.cc/150?u=27', rating: 4, content: 'Great for finding seminal papers. Would love to see better filtering options.', date: '2024-02-28', likes: 8 }
    ],
    'ai-2': [
        { id: 'r1', user: 'Dr. Emily Zhang', avatar: 'https://i.pravatar.cc/150?u=28', rating: 5, content: 'Elicit transformed how I do literature reviews. The extraction feature is a game-changer.', date: '2024-03-12', likes: 28, isFeatured: true },
        { id: 'r2', user: 'James Liu, PhD', avatar: 'https://i.pravatar.cc/150?u=29', rating: 4, content: 'Very useful but requires a paid plan for heavy use.', date: '2024-03-01', likes: 12 }
    ],
    'ai-3': [
        { id: 'r1', user: 'Dr. Anna Roberts', avatar: 'https://i.pravatar.cc/150?u=30', rating: 5, content: 'Incredible for digesting dense technical papers. Saves hours of reading time while maintaining accuracy.', date: '2024-03-14', likes: 56, isFeatured: true },
        { id: 'r2', user: 'Prof. Michael Chang', avatar: 'https://i.pravatar.cc/150?u=31', rating: 5, content: 'My go-to tool for paper reviews. The methodology analysis is spot-on.', date: '2024-03-11', likes: 34 },
        { id: 'r3', user: 'Dr. Lisa Park', avatar: 'https://i.pravatar.cc/150?u=32', rating: 4, content: 'Excellent for most papers, occasionally struggles with heavy math notation.', date: '2024-03-06', likes: 19 },
        { id: 'r4', user: 'James Wilson', avatar: 'https://i.pravatar.cc/150?u=52', rating: 5, content: 'The best tool I have found for quick literature screening. The summaries are consistently accurate.', date: '2024-03-01', likes: 12 },
        { id: 'r5', user: 'Prof. Emma Thompson', avatar: 'https://i.pravatar.cc/150?u=53', rating: 4, content: 'Great time saver. Would love to see integration with Zotero in the future.', date: '2024-02-28', likes: 25 },
        { id: 'r6', user: 'Dr. Ryan Garcia', avatar: 'https://i.pravatar.cc/150?u=54', rating: 5, content: 'Indispensable for my PhD research. Helps me keep up with the overwhelming volume of new papers.', date: '2024-02-25', likes: 41 },
        { id: 'r7', user: 'Sarah Jenkings', avatar: 'https://i.pravatar.cc/150?u=55', rating: 5, content: 'Very intuitive interface and powerful analysis capabilities.', date: '2024-02-20', likes: 8 }
    ],
    'ai-4': [
        { id: 'r1', user: 'Dr. Robert Taylor', avatar: 'https://i.pravatar.cc/150?u=33', rating: 5, content: 'Polished my Nature submission perfectly. The journal-specific style adaptation is impressive.', date: '2024-03-13', likes: 45, isFeatured: true },
        { id: 'r2', user: 'Prof. Jennifer Wu', avatar: 'https://i.pravatar.cc/150?u=34', rating: 4, content: 'Great for non-native speakers. Really improves academic writing quality.', date: '2024-03-09', likes: 22 }
    ],
    'ut-1': [
        { id: 'r1', user: 'Dr. William Harris', avatar: 'https://i.pravatar.cc/150?u=35', rating: 5, content: 'The gold standard for biomedical literature. Nothing else comes close for clinical research.', date: '2024-03-15', likes: 89, isFeatured: true },
        { id: 'r2', user: 'Prof. Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=36', rating: 5, content: 'Indispensable for any medical researcher. The MeSH filtering is powerful.', date: '2024-03-10', likes: 67 },
        { id: 'r3', user: 'Dr. Kevin Brown', avatar: 'https://i.pravatar.cc/150?u=37', rating: 4, content: 'Essential tool, though the interface could be more modern.', date: '2024-03-05', likes: 23 }
    ]
};

// Community-contributed prompts
export const MOCK_COMMUNITY_PROMPTS: Record<string, any[]> = {
    'ai-1': [
        { id: 'cp1', title: 'Find Contradicting Papers', content: 'Find papers that contradict or challenge the findings of [PAPER TITLE]. Focus on methodology critiques.', isOfficial: false, author: 'Dr. Sarah Lin', authorAvatar: 'https://i.pravatar.cc/150?u=40', likes: 89, usageCount: 1240, date: '2024-03-12' },
        { id: 'cp2', title: 'Research Gap Analysis', content: 'Analyze the citation network around [TOPIC] and identify potential research gaps that haven\'t been addressed.', isOfficial: false, author: 'Prof. James Chen', authorAvatar: 'https://i.pravatar.cc/150?u=41', likes: 67, usageCount: 890, date: '2024-03-08' },
        { id: 'cp3', title: 'Author Collaboration Map', content: 'Show me the collaboration network of [AUTHOR NAME] and identify their most frequent co-authors.', isOfficial: false, author: 'Dr. Emily Wang', authorAvatar: 'https://i.pravatar.cc/150?u=42', likes: 45, usageCount: 560, date: '2024-03-01' }
    ],
    'ai-2': [
        { id: 'cp1', title: 'Systematic Review Helper', content: 'Help me screen these 50 papers for inclusion in my systematic review on [TOPIC]. Criteria: [LIST CRITERIA]', isOfficial: false, author: 'Dr. Michael Park', authorAvatar: 'https://i.pravatar.cc/150?u=43', likes: 112, usageCount: 2100, date: '2024-03-10' },
        { id: 'cp2', title: 'Data Extraction Template', content: 'Extract sample size, intervention type, and primary outcomes from each of these RCT papers.', isOfficial: false, author: 'Prof. Lisa Zhang', authorAvatar: 'https://i.pravatar.cc/150?u=44', likes: 78, usageCount: 1560, date: '2024-03-05' }
    ],
    'ai-3': [
        { id: 'cp1', title: 'Critical Analysis Template', content: 'Provide a critical analysis of this paper including: 1) Key contributions 2) Methodological limitations 3) Reproducibility concerns 4) Suggested improvements', isOfficial: false, author: 'Dr. David Kim', authorAvatar: 'https://i.pravatar.cc/150?u=45', likes: 156, usageCount: 3200, date: '2024-03-14' },
        { id: 'cp2', title: 'Compare Two Papers', content: 'Compare and contrast the methodologies of [PAPER A] and [PAPER B]. Which approach is more rigorous?', isOfficial: false, author: 'Prof. Anna Lee', authorAvatar: 'https://i.pravatar.cc/150?u=46', likes: 98, usageCount: 1890, date: '2024-03-09' }
    ],
    'ai-4': [
        { id: 'cp1', title: 'Abstract Rewriter for High-Impact', content: 'Rewrite this abstract to be suitable for [JOURNAL NAME]. Maintain scientific accuracy while improving impact and readability.', isOfficial: false, author: 'Dr. Robert Chen', authorAvatar: 'https://i.pravatar.cc/150?u=47', likes: 134, usageCount: 2800, date: '2024-03-11' },
        { id: 'cp2', title: 'Response to Reviewers', content: 'Help me draft a professional response to these reviewer comments. Be diplomatic but defend our methodology where appropriate.', isOfficial: false, author: 'Prof. Maria Santos', authorAvatar: 'https://i.pravatar.cc/150?u=48', likes: 189, usageCount: 4200, date: '2024-03-06' }
    ],
    'ut-1': [
        { id: 'cp1', title: 'Clinical Trial Advanced Search', content: '(randomized controlled trial[pt] OR controlled clinical trial[pt]) AND [DISEASE] AND [INTERVENTION] AND ("2020"[PDAT] : "2024"[PDAT])', isOfficial: false, author: 'Dr. Kevin Wilson', authorAvatar: 'https://i.pravatar.cc/150?u=49', likes: 234, usageCount: 5600, date: '2024-03-13' },
        { id: 'cp2', title: 'Systematic Review Search', content: '(systematic review[ti] OR meta-analysis[pt]) AND [TOPIC] AND free full text[sb]', isOfficial: false, author: 'Prof. Jennifer Liu', authorAvatar: 'https://i.pravatar.cc/150?u=50', likes: 178, usageCount: 4100, date: '2024-03-07' }
    ]
};
