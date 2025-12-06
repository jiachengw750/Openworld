

import { Project, DonationVoucher, Quest, UserProfile, StoryItem, IdaArticle, ReviewItem } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Mycoremediation: Plastic Eating Fungi',
    shortDescription: 'Engineering Pestalotiopsis microspora to break down polyurethane plastics in marine environments at 3x speed.',
    fullDescription: `Plastic pollution is one of the most pressing environmental challenges of our time. Our team at the Institute of Biotechnology has isolated a strain of Pestalotiopsis microspora, a fungus capable of surviving solely on polyurethane. 

    This project aims to genetically enhance the enzymatic pathways of this fungus to accelerate the degradation process. Our preliminary lab results show a 15% reduction in mass over 2 weeks. With your funding, we can scale this to a pilot bioreactor study simulating ocean conditions.
    
    The implications for waste management are revolutionary. Unlike incineration, this is a biological cold-process that yields non-toxic biomass as a byproduct. We are focusing specifically on microplastics filtration systems where traditional mechanical removal fails.`,
    category: 'GRANTS',
    tags: ['Biotech', 'Ocean Clean-up', 'Genetics'],
    status: 'RESEARCH',
    image: 'https://picsum.photos/800/600?random=1',
    raised: 120000,
    goal: 120000,
    backers: 342,
    daysLeft: 14,
    author: 'Dr. Elena Vossen',
    authorAvatar: 'https://i.pravatar.cc/150?u=1',
    authorBio: 'Marine biologist with 15 years experience in enzymatic plastic degradation.',
    institution: 'Delft University of Technology',
    team: [
        { 
            name: "Dr. Elena Vossen", 
            role: "Principal Investigator", 
            institution: "TU Delft",
            avatar: "https://i.pravatar.cc/150?u=1",
            bio: "Specializes in fungal enzymes and marine ecosystems.",
            awards: ["Nobel Spirit 2022", "Green Tech Lead"]
        },
        { 
            name: "James Chen", 
            role: "Lead Mycologist", 
            institution: "TU Delft",
            avatar: "https://i.pravatar.cc/150?u=12",
            bio: "Expert in genetic modification of fungal strains.",
            awards: ["BioFuture Prize"]
        },
        { 
            name: "Sarah Miller", 
            role: "Process Engineer", 
            institution: "MIT",
            avatar: "https://i.pravatar.cc/150?u=13",
            bio: "Focuses on bioreactor scaling and filtration systems.",
            awards: []
        }
    ],
    impactStats: [
        { label: "Degradation Rate", value: "0.5g/hr" },
        { label: "Target Plastic", value: "Polyurethane" },
        { label: "Biosafety Level", value: "BSL-1" }
    ],
    milestones: [
        { id: 'm0', title: 'Project Funding', description: 'Initial capital raised for equipment and personnel.', date: '2023-12-01', status: 'COMPLETED' },
        { id: 'm1', title: 'Lab Verification', description: 'In vitro testing of enzyme interactions under varied thermal conditions.', date: '2024-02-15', status: 'COMPLETED' },
        { id: 'm2', title: 'Pilot Bioreactor', description: 'Small-scale bioreactor deployment utilizing 500L containment vessels.', date: '2024-06-01', status: 'IN_PROGRESS' },
        { id: 'm3', title: 'Ocean Simulation', description: 'Testing degradation in high-salinity, low-temp environments.', date: '2024-11-01', status: 'UPCOMING' }
    ],
    allocation: [
        { category: 'Lab Equipment', description: 'High-precision incubators and spectrometry units.', amount: 48000, percentage: 40 },
        { category: 'Personnel', description: 'Salaries for 2 post-doc researchers for 12 months.', amount: 36000, percentage: 30 },
        { category: 'Sequencing Costs', description: 'Next-gen genomic sequencing services.', amount: 24000, percentage: 20 },
        { category: 'Admin & Overhead', description: 'University overheads and administrative fees.', amount: 12000, percentage: 10 }
    ],
    ida: {
        name: "MycoClean DAO",
        contractAddress: "0x71C...9A23",
        ownerAddress: "0xB21...889K"
    },
    donations: [
        { id: 'd1', donor: 'Alice Foundation', amount: 5000, date: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=60' },
        { id: 'd2', donor: 'Green Earth VC', amount: 2500, date: '5 days ago', avatar: 'https://i.pravatar.cc/150?u=61' },
        { id: 'd3', donor: 'Anonymous', amount: 1000, date: '1 week ago', avatar: 'https://i.pravatar.cc/150?u=62' },
        { id: 'd4', donor: 'Dr. House', amount: 500, date: '1 week ago', avatar: 'https://i.pravatar.cc/150?u=63' },
        { id: 'd5', donor: 'Jane Doe', amount: 250, date: '2 weeks ago', avatar: 'https://i.pravatar.cc/150?u=64' }
    ]
  },
  {
    id: '2',
    title: 'Atmospheric Aerosol Injection Arrays',
    shortDescription: 'Developing localized, reversible solar radiation management tools using biodegradable calcium carbonate particles.',
    fullDescription: `Solar geoengineering proposals often involve massive, irreversible global interventions. We propose a localized, controlled approach. By utilizing high-altitude drone arrays to disperse calcium carbonate (chalk) particles, we can temporarily reflect sunlight to cool specific heat islands or protect bleaching coral reefs.
    
    Unlike sulfur dioxide, calcium carbonate is not ozone-depleting. Our "Cloud-Whitening" project focuses on the hardware deployment mechanism: autonomous drone swarms that coordinate dispersal patterns based on real-time satellite weather data.`,
    category: 'WLS(LIVE)',
    tags: ['Geoengineering', 'Climate Hardware', 'Drones'],
    status: 'FUNDING',
    image: 'https://picsum.photos/800/600?random=2',
    raised: 12500,
    goal: 50000,
    backers: 89,
    daysLeft: 30,
    author: 'Prof. Marcus Thorne',
    authorAvatar: 'https://i.pravatar.cc/150?u=2',
    authorBio: 'Atmospheric physicist specializing in solar radiation management.',
    institution: 'Cambridge Climate Repair Centre',
    team: [
        { 
            name: "Prof. Marcus Thorne", 
            role: "Project Lead", 
            institution: "Cambridge",
            avatar: "https://i.pravatar.cc/150?u=2",
            bio: "20 years research in atmospheric dynamics.",
            awards: ["Climate Hero 2023", "Physics Nobel"]
        },
        { 
            name: "Dr. Aarya Singh", 
            role: "Atmospheric Physicist", 
            institution: "Oxford",
            avatar: "https://i.pravatar.cc/150?u=22",
            bio: "Simulating particle dispersion models.",
            awards: ["Royal Society Fellow"]
        }
    ],
    impactStats: [
        { label: "Reflectivity", value: "+12% Albedo" },
        { label: "Particle Size", value: "0.5 microns" },
        { label: "Deployment", value: "Drone Swarm" }
    ],
    milestones: [
        { id: 'm0', title: 'Crowdfunding', description: 'Raising initial capital from the public.', date: '2024-03-01', status: 'IN_PROGRESS' },
        { id: 'm1', title: 'Seed Funding', description: 'Securing funds for drone prototypes and materials.', date: '2024-04-15', status: 'UPCOMING' },
        { id: 'm2', title: 'Drone Prototyping', description: 'Building custom high-altitude dispersal drones.', date: '2024-06-01', status: 'UPCOMING' },
        { id: 'm3', title: 'Controlled Field Test', description: 'Testing dispersal over non-sensitive desert regions.', date: '2024-09-01', status: 'UPCOMING' }
    ],
    allocation: [
        { category: 'Hardware (Drones)', description: 'Components for 5 custom high-altitude drones.', amount: 25000, percentage: 50 },
        { category: 'Software Dev', description: 'Swarm coordination algorithm development.', amount: 10000, percentage: 20 },
        { category: 'Field Logistics', description: 'Travel and permits for desert testing site.', amount: 10000, percentage: 20 },
        { category: 'Safety Analysis', description: 'Environmental impact assessment studies.', amount: 5000, percentage: 10 }
    ],
    ida: {
        name: "AtmosphereDAO",
        contractAddress: "0x88A...11B2",
        ownerAddress: "0xCC2...990L"
    },
    donations: [
        { id: 'd1', donor: 'Future Ventures', amount: 5000, date: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=70' },
        { id: 'd2', donor: 'Climate Collective', amount: 2000, date: '3 days ago', avatar: 'https://i.pravatar.cc/150?u=71' },
        { id: 'd3', donor: 'Bob Smith', amount: 100, date: '1 week ago', avatar: 'https://i.pravatar.cc/150?u=72' },
        { id: 'd4', donor: 'Alice Cooper', amount: 50, date: '1 week ago', avatar: 'https://i.pravatar.cc/150?u=73' },
        { id: 'd5', donor: 'Anonymous', amount: 25, date: '2 weeks ago', avatar: 'https://i.pravatar.cc/150?u=74' }
    ]
  },
  {
    id: '3',
    title: 'Quantum Entanglement in Neural Networks',
    shortDescription: 'Investigating potential quantum effects in biological microtubules to understand consciousness.',
    fullDescription: `The "Orch OR" theory proposes that consciousness originates from quantum computations in neuronal microtubules. For decades, this was dismissed due to the "warm, wet, and noisy" environment of the brain. 
    
    Recent discoveries in quantum biology suggest that coherence can be maintained in biological systems. We are building a high-sensitivity femtosecond laser array to detect quantum beats in isolated tubulin proteins. If successful, this rewrites the textbook on neuroscience and artificial intelligence.`,
    category: 'QUEST',
    tags: ['Neuroscience', 'Quantum Physics', 'Consciousness'],
    status: 'FUNDING',
    image: 'https://picsum.photos/800/600?random=3',
    raised: 89000,
    goal: 200000,
    backers: 1205,
    daysLeft: 45,
    author: 'Dr. Aris Kothari',
    authorAvatar: 'https://i.pravatar.cc/150?u=3',
    authorBio: 'Leading researcher in quantum biology and neural coherence.',
    institution: 'Perimeter Institute',
    team: [
        { 
            name: "Dr. Aris Kothari", 
            role: "Quantum Physicist", 
            institution: "Perimeter",
            avatar: "https://i.pravatar.cc/150?u=3",
            bio: "Pioneer in biological quantum effects.",
            awards: ["Physics Horizon"]
        },
        { 
            name: "Lia Vance", 
            role: "Neurobiologist", 
            institution: "Stanford",
            avatar: "https://i.pravatar.cc/150?u=32",
            bio: "Expert in microtubule isolation.",
            awards: []
        }
    ],
    impactStats: [
        { label: "Laser Precision", value: "10fs" },
        { label: "Temperature", value: "310K (Body Temp)" },
        { label: "Scale", value: "Nanoscopic" }
    ],
    milestones: [
        { id: 'm0', title: 'Donation Phase', description: 'Gathering required funds for laser apparatus.', date: '2023-11-01', status: 'IN_PROGRESS' },
        { id: 'm1', title: 'Tubulin Isolation', description: 'Extracting pure microtubules for testing.', date: '2024-03-01', status: 'UPCOMING' },
        { id: 'm2', title: 'Quantum Beat Detection', description: 'Running the primary laser experiments.', date: '2024-08-01', status: 'UPCOMING' }
    ],
    allocation: [
        { category: 'Laser Equipment', description: 'Femtosecond laser array and optical tables.', amount: 120000, percentage: 60 },
        { category: 'Research Staff', description: 'Post-doctoral fellows and lab assistants.', amount: 50000, percentage: 25 },
        { category: 'Lab Space', description: 'Rental and maintenance of cleanroom facilities.', amount: 20000, percentage: 10 },
        { category: 'Publications', description: 'Open access fees and conference travel.', amount: 10000, percentage: 5 }
    ],
    ida: {
        name: "QuantumMind Org",
        contractAddress: "0x11B...33C1",
        ownerAddress: "0xD44...555M"
    },
    donations: [
        { id: 'd1', donor: 'NeuroTech Fund', amount: 10000, date: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=80' },
        { id: 'd2', donor: 'Physics Lovers', amount: 500, date: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=81' },
        { id: 'd3', donor: 'Anonymous', amount: 250, date: '3 days ago', avatar: 'https://i.pravatar.cc/150?u=82' },
        { id: 'd4', donor: 'Sarah J.', amount: 100, date: '3 days ago', avatar: 'https://i.pravatar.cc/150?u=83' }
    ]
  },
  {
    id: '4',
    title: 'Autonomous Reforestation Swarm',
    shortDescription: 'Deploying AI-driven drone swarms to plant 1 million trees in deforested regions of the Amazon.',
    fullDescription: 'Deforestation is accelerating at an alarming rate. Manual replanting is too slow and expensive. We are developing a swarm of autonomous drones capable of analyzing soil data and planting seed pods in optimal locations. This project aims to restore biodiversity and combat climate change on a massive scale.',
    category: 'AI TOOLS',
    tags: ['Reforestation', 'AI', 'Drones'],
    status: 'PRE_LAUNCH',
    image: 'https://picsum.photos/800/600?random=4',
    raised: 0,
    goal: 150000,
    backers: 0,
    daysLeft: 0,
    startTime: '2024-06-01',
    author: 'Dr. Maria Gonzalez',
    authorAvatar: 'https://i.pravatar.cc/150?u=4',
    authorBio: 'Ecologist and robotics engineer.',
    institution: 'Amazon Conservation Team',
    team: [],
    impactStats: [],
    milestones: [],
    allocation: [],
    ida: { name: 'ForestDAO', contractAddress: '0x...', ownerAddress: '0x...' },
    donations: []
  },
  {
    id: '5',
    title: 'CRISPR Cure for Sickle Cell',
    shortDescription: 'Clinical trials for a low-cost CRISPR-based gene therapy for Sickle Cell Disease.',
    fullDescription: 'Sickle Cell Disease affects millions worldwide. Current treatments are expensive and often inaccessible. We are developing a novel CRISPR-Cas9 delivery system that can be administered via a simple injection, potentially curing the disease at a fraction of the cost.',
    category: 'GRANTS',
    tags: ['Biotech', 'Gene Therapy', 'Healthcare'],
    status: 'RESEARCH',
    image: 'https://picsum.photos/800/600?random=5',
    raised: 250000,
    goal: 250000,
    backers: 512,
    daysLeft: 60,
    author: 'Dr. Samuel Okafor',
    authorAvatar: 'https://i.pravatar.cc/150?u=5',
    authorBio: 'Hematologist and geneticist.',
    institution: 'Lagos University Teaching Hospital',
    team: [],
    impactStats: [],
    milestones: [
         { id: 'm0', title: 'Phase 1 Trials', description: 'Safety testing in small group.', date: '2024-01-15', status: 'COMPLETED' },
         { id: 'm1', title: 'Phase 2 Trials', description: 'Efficacy testing in larger group.', date: '2024-06-01', status: 'IN_PROGRESS' }
    ],
    allocation: [],
    ida: { name: 'HealthDAO', contractAddress: '0x...', ownerAddress: '0x...' },
    donations: []
  },
  {
    id: '6',
    title: 'Fusion Energy Prototype',
    shortDescription: 'Building a compact magnetic confinement fusion reactor to demonstrate net energy gain.',
    fullDescription: 'Fusion energy is the holy grail of clean power. We are constructing a compact, high-field tokamak reactor using high-temperature superconducting magnets. Our goal is to achieve a Q-factor greater than 1, demonstrating net energy gain.',
    category: 'PRIZE',
    tags: ['Energy', 'Fusion', 'Physics'],
    status: 'COMPLETED',
    image: 'https://picsum.photos/800/600?random=6',
    raised: 500000,
    goal: 500000,
    backers: 2500,
    daysLeft: 0,
    author: 'Dr. Hiroshi Tanaka',
    authorAvatar: 'https://i.pravatar.cc/150?u=6',
    authorBio: 'Plasma physicist.',
    institution: 'ITER Organization',
    team: [],
    impactStats: [],
    milestones: [
        { id: 'm0', title: 'Construction', description: 'Building the reactor.', date: '2023-01-01', status: 'COMPLETED' },
        { id: 'm1', title: 'First Plasma', description: 'Generating plasma.', date: '2023-06-01', status: 'COMPLETED' },
        { id: 'm2', title: 'Net Gain', description: 'Achieving Q > 1.', date: '2024-01-01', status: 'COMPLETED' }
    ],
    allocation: [],
    ida: { name: 'FusionDAO', contractAddress: '0x...', ownerAddress: '0x...' },
    donations: []
  },
  {
    id: '7',
    title: 'Ocean Acidification Monitors',
    shortDescription: 'A network of low-cost, open-source buoys to monitor ocean acidity in real-time.',
    fullDescription: 'Ocean acidification threatens marine life. We are deploying a network of open-source sensor buoys to provide real-time data to researchers worldwide. This data is crucial for understanding the scope of the problem and developing mitigation strategies.',
    category: 'AI TOOLS',
    tags: ['Ocean', 'Climate Change', 'Open Source'],
    status: 'FUNDING',
    image: 'https://picsum.photos/800/600?random=7',
    raised: 15000,
    goal: 30000,
    backers: 120,
    daysLeft: 20,
    author: 'Sarah Jenkins',
    authorAvatar: 'https://i.pravatar.cc/150?u=7',
    authorBio: 'Oceanographer and data scientist.',
    institution: 'Scripps Institution of Oceanography',
    team: [],
    impactStats: [],
    milestones: [],
    allocation: [],
    ida: { name: 'OceanDAO', contractAddress: '0x...', ownerAddress: '0x...' },
    donations: []
  },
  {
    id: '8',
    title: 'Biodegradable Electronics',
    shortDescription: 'Developing transient electronic components that dissolve completely in water.',
    fullDescription: 'E-waste is a growing global crisis. We are creating fully biodegradable electronic components using silk protein and magnesium. These devices can be used for temporary environmental sensors or medical implants that do not require surgical removal.',
    category: 'GRANTS',
    tags: ['Materials Science', 'Sustainability', 'Electronics'],
    status: 'RESEARCH',
    image: 'https://picsum.photos/800/600?random=8',
    raised: 60000,
    goal: 60000,
    backers: 210,
    daysLeft: 40,
    author: 'Dr. Wei Zhang',
    authorAvatar: 'https://i.pravatar.cc/150?u=8',
    authorBio: 'Materials scientist.',
    institution: 'Tsinghua University',
    team: [],
    impactStats: [],
    milestones: [
        { id: 'm0', title: 'Material Synthesis', description: 'Developing silk-magnesium composite.', date: '2023-09-01', status: 'COMPLETED' },
        { id: 'm1', title: 'Prototype', description: 'Creating the first working circuit.', date: '2024-02-01', status: 'IN_PROGRESS' }
    ],
    allocation: [],
    ida: { name: 'GreenTechDAO', contractAddress: '0x...', ownerAddress: '0x...' },
    donations: []
  },
  {
    id: '9',
    title: 'AI for Early Cancer Detection',
    shortDescription: 'Training deep learning models on MRI scans to detect tumors at stage 0.',
    fullDescription: 'Early detection saves lives. We are training state-of-the-art deep learning models on a massive dataset of MRI scans to identify micro-tumors that are invisible to the human eye. Our goal is to provide a low-cost diagnostic tool for clinics worldwide.',
    category: 'AI TOOLS',
    tags: ['Healthcare', 'AI', 'Deep Learning'],
    status: 'PRE_LAUNCH',
    image: 'https://picsum.photos/800/600?random=9',
    raised: 0,
    goal: 100000,
    backers: 0,
    daysLeft: 0,
    startTime: '2024-07-15',
    author: 'Dr. Emily Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=9',
    authorBio: 'Computer scientist and radiologist.',
    institution: 'Johns Hopkins University',
    team: [],
    impactStats: [],
    milestones: [],
    allocation: [],
    ida: { name: 'MedAI DAO', contractAddress: '0x...', ownerAddress: '0x...' },
    donations: []
  },
  {
    id: '10',
    title: 'Cognitive Resilience in Spaceflight',
    shortDescription: 'Monitoring and mitigating neurocognitive decline in long-duration microgravity environments.',
    fullDescription: 'Long-duration space missions pose significant risks to the human brain. We are developing a suite of AI-driven cognitive assessment tools and neurofeedback protocols to maintain astronaut mental health during missions to Mars and beyond.',
    category: 'WLS(LIVE)',
    tags: ['Neuroscience', 'Space', 'AI'],
    status: 'RESEARCH',
    image: 'https://picsum.photos/800/600?random=15',
    raised: 180000,
    goal: 180000,
    backers: 420,
    daysLeft: 0,
    author: 'Dr. Aris Kothari',
    authorAvatar: 'https://i.pravatar.cc/150?u=3',
    authorBio: 'Leading researcher in quantum biology and neural coherence.',
    institution: 'Perimeter Institute',
    team: [],
    impactStats: [],
    milestones: [
        { id: 'm0', title: 'Baseline Study', description: 'Collecting baseline data.', date: '2023-11-01', status: 'COMPLETED' },
        { id: 'm1', title: 'Simulation Testing', description: 'Testing in isolation chambers.', date: '2024-03-01', status: 'IN_PROGRESS' }
    ],
    allocation: [],
    ida: { name: 'AstroNeuro DAO', contractAddress: '0xAB...9988', ownerAddress: '0x...' },
    donations: [
        { id: 'd10', donor: 'SpaceX Fund', amount: 50000, date: '2 months ago', avatar: 'https://i.pravatar.cc/150?u=90' }
    ]
  }
];

export const QUESTS: Quest[] = [
    {
        id: 'q1',
        title: 'Heuristic Solution and Experimental Comparison of Convex Optimization Problems',
        shortDescription: 'Implement several heuristic algorithms and compare them with the classical baseline, producing a technical report that includes convergence curves and complexity analysis.',
        fullDescription: 'We are seeking a researcher or data scientist to implement a set of heuristic algorithms (Genetic Algorithm, Simulated Annealing, and Particle Swarm Optimization) to solve a specific class of convex optimization problems defined in our provided whitepaper.\n\nThe goal is to benchmark these heuristics against standard gradient descent methods. Deliverables include well-documented Python code, a set of comparative plots (convergence time vs. accuracy), and a brief technical report summarizing the findings.',
        status: 'RECRUITING',
        tags: ['Python', 'NumPy', 'SciPy', 'Matplotlib', 'C++(Optional)'],
        subjects: ['Math', 'Computer', 'Statistics'],
        image: 'https://picsum.photos/800/600?random=100',
        reward: {
            amount: 200000,
            currency: 'SCI',
            usdValue: 2500
        },
        endTime: '2025-11-30 18:00 (GMT+8)',
        deliveryTime: '2025-12-30 18:00 (GMT+8)',
        bidderCount: 7,
        bidders: [
            'https://i.pravatar.cc/150?u=20',
            'https://i.pravatar.cc/150?u=21',
            'https://i.pravatar.cc/150?u=22',
            'https://i.pravatar.cc/150?u=23',
            'https://i.pravatar.cc/150?u=24',
            'https://i.pravatar.cc/150?u=25',
            'https://i.pravatar.cc/150?u=26'
        ],
        author: {
            name: 'Madison Kemper',
            avatar: 'https://i.pravatar.cc/150?u=25',
            verified: true
        },
        commentsCount: 1020
    },
    {
        id: 'q2',
        title: 'High-Fidelity 3D Rendering of Molecular Docking Interactions',
        shortDescription: 'Create a series of 4K render images and a 30-second animation demonstrating the binding mechanism of inhibitor X to Protein Y.',
        fullDescription: 'We need a visualization expert to take PDB data files and simulation trajectories (GROMACS format) and produce high-quality visual assets for a Nature publication submission.\n\nRequirements:\n- Accurate representation of Van der Waals surfaces.\n- Highlight specific residues involved in hydrogen bonding.\n- Delivery in Blender or Maya formats.',
        status: 'IN_PROGRESS',
        tags: ['Blender', 'PyMOL', 'Visualization', '3D Design'],
        subjects: ['Computer', 'Biology', 'Chemistry'],
        image: 'https://picsum.photos/800/600?random=101',
        reward: {
            amount: 50000,
            currency: 'SCI',
            usdValue: 600
        },
        endTime: 'Oct 10, 2025',
        deliveryTime: 'Oct 20, 2025',
        bidderCount: 12,
        bidders: [
            'https://i.pravatar.cc/150?u=30',
            'https://i.pravatar.cc/150?u=31',
            'https://i.pravatar.cc/150?u=32'
        ],
        author: {
            name: 'Dr. Sarah Lin',
            avatar: 'https://i.pravatar.cc/150?u=33',
            verified: true
        },
        commentsCount: 45
    },
    {
        id: 'q3',
        title: 'Systematic Literature Review on Algae-Based Biofuels (2020-2024)',
        shortDescription: 'Compile and summarize recent advancements in genetic modification of microalgae for enhanced lipid production.',
        fullDescription: 'We require a comprehensive literature review covering the last 4 years of research in algae biofuels. The review should focus specifically on CRISPR-Cas9 applications in lipid enhancement.\n\nDeliverable: A structured LaTeX document with at least 50 citations, summarized tables of strain yields, and a synthesis of current bottlenecks.',
        status: 'RECRUITING',
        tags: ['Biology', 'Research Writing', 'LaTeX', 'Review'],
        subjects: ['Biology'],
        image: 'https://picsum.photos/800/600?random=102',
        reward: {
            amount: 15000,
            currency: 'SCI',
            usdValue: 180
        },
        endTime: 'Nov 01, 2025',
        deliveryTime: 'Nov 15, 2025',
        bidderCount: 2,
        bidders: [
            'https://i.pravatar.cc/150?u=40',
            'https://i.pravatar.cc/150?u=41'
        ],
        author: {
            name: 'GreenEnergy Lab',
            avatar: 'https://i.pravatar.cc/150?u=42',
            verified: true
        },
        commentsCount: 8
    },
    {
        id: 'q4',
        title: 'Parallelization of Monte Carlo Simulations for Particle Physics',
        shortDescription: 'Optimize existing Python code using CUDA/OpenCL to achieve at least 10x speedup on GPU clusters.',
        fullDescription: 'Our current Monte Carlo simulation for particle decay events is bottlenecked by CPU performance. We need a developer proficient in CUDA or OpenCL to port the core calculation loop to run on NVIDIA A100 GPUs.\n\nThe existing code is written in Python (NumPy). The deliverable must verify numerical consistency within 1e-6 tolerance.',
        status: 'COMPLETED',
        tags: ['CUDA', 'Python', 'HPC', 'Physics'],
        subjects: ['Physics', 'Computer'],
        image: 'https://picsum.photos/800/600?random=103',
        reward: {
            amount: 500000,
            currency: 'SCI',
            usdValue: 6000
        },
        endTime: 'Sep 01, 2025',
        deliveryTime: 'Sep 15, 2025',
        bidderCount: 8,
        bidders: [
            'https://i.pravatar.cc/150?u=50',
            'https://i.pravatar.cc/150?u=51',
            'https://i.pravatar.cc/150?u=52'
        ],
        author: {
            name: 'CERN Atlas Team',
            avatar: 'https://i.pravatar.cc/150?u=53',
            verified: true
        },
        commentsCount: 156
    }
];

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

// --- Profile Mock Data ---

export const INITIAL_PROFILE: UserProfile = {
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
};

export const INITIAL_STORIES: StoryItem[] = [
    { id: '1', date: 'Nov, 2023', title: 'Published the first selected paper titled "Application of Deep Learning in Medical Image Diagnosis"', description: 'This study proposed a new neural network architecture, which significantly improved the diagnostic accuracy for lung diseases.' },
    { id: '2', date: 'Jun, 2022', title: 'Obtained the National Natural Science Foundation of China\'s Outstanding Young Investigator Project', description: 'Project Name: Precision Medicine Research Based on Machine Learning' },
    { id: '3', date: 'Jul, 2020', title: 'Received a Ph.D. in Computer Science from Tsinghua University', description: 'Doctoral Dissertation: "Research on Medical Image Analysis Methods Based on Deep Learning", Supervisor: Professor Zhang San' }
];

export const INITIAL_IDA: IdaArticle[] = [
    { id: '1', title: 'The Application and Challenges of Deep Learning in Medical Image Diagnosis', description: 'This article systematically reviews the latest advancements of deep learning technology in the field of medical image diagnosis, analyzes the main challenges currently faced, and proposes future research directions.', tags: ['MEDICINE AI'], isFeatured: true, publicationDate: 'Nov, 2023', likes: 234, comments: 45, isPinned: false, isHidden: false },
    { id: '2', title: 'The Application of Federated Learning in Protecting Privacy of Medical Data', description: 'Introduce how the federated learning technology enables AI model collaboration training among multiple medical institutions while protecting patient privacy.', tags: ['EXPLAINABLE AI'], isFeatured: false, publicationDate: 'Nov, 2023', likes: 234, comments: 45, isPinned: false, isHidden: false },
    { id: '3', title: 'Deep Learning in Precision Medicine: A Comprehensive Survey', description: 'A deep dive into how AI is revolutionizing personalized treatment plans by analyzing genomic data and medical history with unprecedented accuracy.', tags: ['PRECISION MEDICINE'], isFeatured: false, publicationDate: 'Oct, 2023', likes: 189, comments: 32, isPinned: false, isHidden: false }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
    { id: '1', status: 'PUBLISHED', rating: 4.2, title: 'A new method for protein structure prediction based on Transformer...', description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction. The experimental design is reasonable and the results are convincing.', publicationDate: 'OCT, 2023' },
    { id: '2', status: 'PUBLISHED', rating: 4.2, title: 'A new method for protein structure prediction based on Transformer', description: 'The method proposed in this paper has achieved significant improvements in protein structure prediction.', publicationDate: 'OCT, 2023' }
];
