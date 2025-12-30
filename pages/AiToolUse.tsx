import React from 'react';
import { useParams } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { AI_TOOLS } from '../constants';
import { useToast } from '../context/ToastContext';
import { useChat } from '../hooks/useChat';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedPrompts } from '../components/chat/SuggestedPrompts';

export const AiToolUse: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { showToast } = useToast();
    const tool = AI_TOOLS.find(t => t.id === id);

    // Custom Hook for Logic
    const {
        input, setInput, isTyping, messages, attachedFiles,
        messagesEndRef, fileInputRef,
        handleSend, handleQuickPrompt, handleFileSelect, removeAttachedFile, clearHistory
    } = useChat(tool);

    if (!tool) return <div className="p-12 text-center">Tool not found</div>;

    const handleClearHistory = () => {
        clearHistory();
        showToast("History cleared");
    };

    return (
        <div className="h-screen bg-paper flex flex-col pt-24 overflow-hidden">

            <ChatHeader tool={tool} onClearHistory={handleClearHistory} />

            {/* Chat History Flow */}
            <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10">
                <div className="max-w-[800px] mx-auto space-y-12">
                    {messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}

                    {isTyping && (
                        <div className="flex gap-6 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center shrink-0 border border-ink/5">
                                <Bot size={20} />
                            </div>
                            <div className="flex items-center gap-1.5 py-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-ink/20 animate-bounce"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-ink/20 animate-bounce delay-150"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-ink/20 animate-bounce delay-300"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input & Suggestions */}
            <div className="bg-surface border-t border-ink/10">
                <div className="max-w-[800px] mx-auto px-6 md:px-10 pt-6">
                    {/* Suggested Prompts shown only when chat is empty (just welcome message) */}
                    {messages.length <= 1 && tool.prompts.length > 0 && !isTyping && (
                        <SuggestedPrompts prompts={tool.prompts} onPromptSelect={handleQuickPrompt} />
                    )}
                </div>

                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSend={handleSend}
                    onFileSelect={handleFileSelect}
                    attachedFiles={attachedFiles}
                    onRemoveFile={removeAttachedFile}
                    fileInputRef={fileInputRef}
                    toolName={tool.name}
                />
            </div>
        </div>
    );
};
