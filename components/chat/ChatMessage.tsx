import React from 'react';
import { User, Bot, BookOpen, Download } from 'lucide-react';
import { Message } from '../../types';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    return (
        <div className={`flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-ink/5 ${message.role === 'assistant' ? 'bg-ink text-paper' : 'bg-surface text-ink'}`}>
                {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`flex flex-col max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-6 rounded-sm text-base leading-loose font-sans ${message.role === 'user' ? 'bg-surface border border-ink/10 text-ink shadow-sm' : 'text-ink/80'
                    }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Files in message */}
                    {message.files && message.files.length > 0 && (
                        <div className="mt-6 space-y-2">
                            {message.files.map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-paper border border-ink/5 rounded-sm">
                                    <div className="flex items-center gap-3">
                                        <BookOpen size={16} className="text-ink/30" />
                                        <div>
                                            <span className="text-xs font-bold block">{f.name}</span>
                                            <span className="text-[9px] font-mono text-ink/40">{f.size}</span>
                                        </div>
                                    </div>
                                    <button className="text-ink/30 hover:text-accent p-1 transition-colors"><Download size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <span className="text-[9px] font-mono text-ink/20 uppercase mt-2">{message.timestamp}</span>
            </div>
        </div>
    );
};
