import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Video, Image as ImageIcon } from 'lucide-react';
import { AI_TOOLS } from '../constants';

// Mock experience data - in real app, this would come from API
const MOCK_EXPERIENCES: Record<string, any> = {
    'exp-1': {
        id: 'exp-1',
        toolId: 'ai-1',
        user: 'Dr. Sarah Lin',
        avatar: 'https://i.pravatar.cc/150?u=1',
        date: '2 days ago',
        title: 'How I Use This Tool for My Research',
        content: `
            <p>This tool has been incredibly helpful for my research. The semantic search capabilities are outstanding and saved me hours of manual work.</p>
            <p>When I first discovered this tool, I was struggling with a literature review that required me to go through hundreds of papers. The traditional keyword search wasn't giving me the results I needed, and I was spending too much time on manual screening.</p>
            <p>With this tool's semantic search feature, I can now find relevant papers based on meaning rather than just keywords. The AI understands the context of my research questions and suggests papers that I might have missed otherwise.</p>
            <p>The citation graph feature is particularly impressive. It helps me understand research lineages and identify key papers in my field. I can see how ideas have evolved over time and which papers have been most influential.</p>
            <p>Overall, this tool has transformed my research workflow. I highly recommend it to anyone doing literature reviews or systematic research.</p>
        `,
        media: {
            type: 'video',
            url: 'https://example.com/video.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'
        }
    },
    'exp-2': {
        id: 'exp-2',
        toolId: 'ai-1',
        user: 'Prof. Michael Chen',
        avatar: 'https://i.pravatar.cc/150?u=2',
        date: '5 days ago',
        title: 'Citation Analysis: A Game-Changer',
        content: `
            <p>The citation analysis feature is a game-changer. I can now track research lineages and identify key papers in my field much more efficiently.</p>
            <p>As someone who works with citation networks, I've always struggled with visualizing how research connects. This tool makes it easy to see the relationships between papers and understand the flow of ideas.</p>
            <p>The visualizations are clear and intuitive, making it simple to identify influential papers and emerging trends in my research area.</p>
        `,
        media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
        }
    },
    'exp-3': {
        id: 'exp-3',
        toolId: 'ai-1',
        user: 'Dr. Emily Zhang',
        avatar: 'https://i.pravatar.cc/150?u=3',
        date: '1 week ago',
        title: 'Systematic Review Made Easy',
        content: `
            <p>Used this for my systematic review and it cut down my literature screening time by 70%. The filtering options are comprehensive and intuitive.</p>
            <p>The ability to filter by multiple criteria simultaneously is a huge time-saver. I can narrow down results by date, study type, methodology, and more.</p>
        `,
        media: {
            type: 'video',
            url: 'https://example.com/video2.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=450&fit=crop'
        }
    },
    'exp-4': {
        id: 'exp-4',
        toolId: 'ai-1',
        user: 'Dr. James Wilson',
        avatar: 'https://i.pravatar.cc/150?u=4',
        date: '1 week ago',
        title: 'Seamless Integration with My Workflow',
        content: `
            <p>The export functionality is excellent. I can seamlessly integrate findings into my research workflow and citation managers.</p>
            <p>Exporting to BibTeX, RIS, and other formats makes it easy to import into Zotero, Mendeley, and other reference managers.</p>
        `,
        media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
        }
    },
    'exp-5': {
        id: 'exp-5',
        toolId: 'ai-1',
        user: 'Prof. Lisa Park',
        avatar: 'https://i.pravatar.cc/150?u=5',
        date: '2 weeks ago',
        title: 'AI-Powered Summaries for Literature Reviews',
        content: `
            <p>As a graduate student, this tool has been invaluable for literature reviews. The AI-powered summaries help me quickly identify relevant papers.</p>
            <p>The summaries are concise yet comprehensive, giving me a good overview of each paper before I decide whether to read it in full.</p>
        `,
        media: {
            type: 'video',
            url: 'https://example.com/video3.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop'
        }
    },
    'exp-6': {
        id: 'exp-6',
        toolId: 'ai-1',
        user: 'Dr. Robert Taylor',
        avatar: 'https://i.pravatar.cc/150?u=6',
        date: '2 weeks ago',
        title: 'Collaborative Research Made Easy',
        content: `
            <p>The collaborative features allow my research team to share findings and annotations seamlessly. Highly recommended for group projects.</p>
            <p>We can all work on the same literature review simultaneously, adding notes and highlights that everyone can see.</p>
        `,
        media: {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop'
        }
    }
};

export const AiToolExperienceDetail: React.FC = () => {
    const { id, reviewId } = useParams<{ id: string; reviewId: string }>();
    const navigate = useNavigate();
    const tool = AI_TOOLS.find(t => t.id === id);
    const experience = reviewId ? MOCK_EXPERIENCES[reviewId] : null;

    if (!tool || !experience) {
        return (
            <div className="min-h-screen bg-paper pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center py-12">
                        <p className="text-ink/60">Experience not found</p>
                        <button
                            onClick={() => navigate(`/ai-market/${id}`)}
                            className="mt-4 text-ink/60 hover:text-ink transition-colors"
                        >
                            Back to tool details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/ai-market/${id}`)}
                    className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-mono font-bold uppercase">Back to Tool Details</span>
                </button>

                {/* Article Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-ink mb-6 leading-tight">
                        {experience.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-ink/60">
                        <div className="flex items-center gap-2">
                            <img src={experience.avatar} alt={experience.user} className="w-10 h-10 rounded-full" />
                            <span className="font-medium text-ink">{experience.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{experience.date}</span>
                        </div>
                    </div>
                </div>

                {/* Featured Media */}
                {experience.media && (
                    <div className="mb-8 rounded-sm overflow-hidden border border-ink/10">
                        {experience.media.type === 'video' ? (
                            <div className="relative w-full aspect-video bg-stone/10">
                                <img
                                    src={experience.media.thumbnail}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                                        <Video size={24} className="text-ink ml-1" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={experience.media.url}
                                alt="Article image"
                                className="w-full h-auto object-cover"
                            />
                        )}
                    </div>
                )}

                {/* Article Content */}
                <article
                    className="mb-12 text-ink"
                    dangerouslySetInnerHTML={{ __html: experience.content }}
                    style={{
                        lineHeight: '1.8',
                        fontSize: '1.125rem',
                    }}
                />
                <style>{`
                    article p {
                        margin-bottom: 1.5rem;
                        color: rgb(var(--color-ink));
                    }
                    article img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 0.125rem;
                        margin: 1.5rem 0;
                    }
                `}</style>

                {/* Footer Actions */}
                <div className="border-t border-ink/10 pt-8">
                    <button
                        onClick={() => navigate(`/ai-market/${id}`)}
                        className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span className="text-sm font-mono font-bold uppercase">Back to Tool Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

