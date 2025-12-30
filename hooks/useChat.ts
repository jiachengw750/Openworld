import { useState, useRef, useEffect } from 'react';
import { Message, AiTool } from '../types';

export const useChat = (tool?: AiTool) => {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Welcome Message
    useEffect(() => {
        if (tool) {
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: `Hello! I'm the **${tool.name}**. I've been fine-tuned on thousands of scientific papers to assist with your research. How can I help you today?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [tool]);

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = (text: string, filesToAttach: File[] = []) => {
        if (!text.trim() && filesToAttach.length === 0) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            files: filesToAttach.map(f => ({ name: f.name, type: f.type, size: (f.size / 1024).toFixed(1) + ' KB' }))
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setAttachedFiles([]);
        setIsTyping(true);

        // Simulation logic
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I've analyzed your request using ${tool?.modelPoweredBy || 'our base model'}. Based on the current literature and the data provided, here's a synthesis of my findings... [SIMULATED RESPONSE]`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 2000);
    };

    const handleSend = () => sendMessage(input, attachedFiles);

    const handleQuickPrompt = (content: string) => {
        sendMessage(content);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const removeAttachedFile = (idx: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const clearHistory = () => {
        setMessages(messages.slice(0, 1));
    };

    return {
        input,
        setInput,
        isTyping,
        messages,
        attachedFiles,
        messagesEndRef,
        fileInputRef,
        handleSend,
        handleQuickPrompt,
        handleFileSelect,
        removeAttachedFile,
        clearHistory
    };
};
