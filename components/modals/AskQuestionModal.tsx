
import React, { useState, useRef, useEffect } from 'react';
import { X, Bold, Italic, List as ListIcon, ListOrdered, Image, Video, Loader2, CheckCircle, HelpCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AskQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolName: string;
    onSubmit: (question: { content: string; attachments: File[] }) => void;
}

// Rich Text Editor with Image/Video support
const QuestionEditor = ({ 
    value, 
    onChange, 
    placeholder,
    onImageUpload,
    onVideoUpload 
}: { 
    value: string; 
    onChange: (val: string) => void; 
    placeholder?: string;
    onImageUpload: (file: File) => void;
    onVideoUpload: (file: File) => void;
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (editorRef.current && !editorRef.current.innerHTML && value) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                if (editorRef.current && event.target?.result) {
                    const img = `<img src="${event.target.result}" alt="uploaded" class="max-w-full h-auto rounded-sm my-2" />`;
                    document.execCommand('insertHTML', false, img);
                    handleInput();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onVideoUpload(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                if (editorRef.current && event.target?.result) {
                    const video = `<video src="${event.target.result}" controls class="max-w-full h-auto rounded-sm my-2"></video>`;
                    document.execCommand('insertHTML', false, video);
                    handleInput();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`flex flex-col border rounded-sm bg-surface transition-colors overflow-hidden ${isFocused ? 'border-accent' : 'border-ink/20'}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-ink/10 bg-stone/5 flex-wrap">
                <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bold">
                    <Bold size={14}/>
                </button>
                <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Italic">
                    <Italic size={14}/>
                </button>
                <div className="w-px h-4 bg-ink/10 mx-1"></div>
                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bullet List">
                    <ListIcon size={14}/>
                </button>
                <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Numbered List">
                    <ListOrdered size={14}/>
                </button>
                <div className="w-px h-4 bg-ink/10 mx-1"></div>
                <button type="button" onClick={() => imageInputRef.current?.click()} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Insert Image">
                    <Image size={14}/>
                </button>
                <button type="button" onClick={() => videoInputRef.current?.click()} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Insert Video">
                    <Video size={14}/>
                </button>
                
                {/* Hidden file inputs */}
                <input 
                    type="file" 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageSelect}
                />
                <input 
                    type="file" 
                    ref={videoInputRef} 
                    className="hidden" 
                    accept="video/*" 
                    onChange={handleVideoSelect}
                />
            </div>
            
            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="p-4 h-48 overflow-y-auto text-sm text-ink outline-none prose prose-sm max-w-none"
                style={{ minHeight: '12rem' }}
                data-placeholder={placeholder}
            />
            
            {/* Placeholder styling */}
            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: rgba(0,0,0,0.3);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({ 
    isOpen, 
    onClose, 
    toolName,
    onSubmit 
}) => {
    const { showToast } = useToast();
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleImageUpload = (file: File) => {
        setAttachments(prev => [...prev, file]);
    };

    const handleVideoUpload = (file: File) => {
        setAttachments(prev => [...prev, file]);
    };

    const handleSubmit = async () => {
        if (!content.trim() || content === '<br>') {
            showToast('Please write your question');
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsSuccess(true);
        
        onSubmit({ content, attachments });
        
        // Auto close after success
        setTimeout(() => {
            setIsSuccess(false);
            setContent('');
            setAttachments([]);
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-2xl rounded-sm shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b border-ink/10 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="font-sans text-xl font-bold text-ink flex items-center gap-2">
                            <HelpCircle size={20} className="text-ink/40" />
                            Ask a Question
                        </h3>
                        <p className="text-sm text-ink/40 mt-1">Get help from the community about {toolName}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-ink/40 hover:text-ink bg-ink/5 hover:bg-ink/10 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {isSuccess ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                            <CheckCircle size={40} />
                        </div>
                        <h4 className="font-sans text-2xl font-bold text-ink mb-2">Question Posted!</h4>
                        <p className="text-ink/60">Your question has been submitted successfully.</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                        
                        {/* Question Content */}
                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-3 font-bold">
                                Your Question
                            </label>
                            <QuestionEditor 
                                value={content}
                                onChange={setContent}
                                placeholder="What would you like to know about this tool? Be specific to get better answers..."
                                onImageUpload={handleImageUpload}
                                onVideoUpload={handleVideoUpload}
                            />
                            <p className="text-[10px] text-ink/30 mt-2">
                                You can add images and videos to illustrate your question.
                            </p>
                        </div>

                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">
                                    Attachments ({attachments.length})
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-stone/5 px-3 py-1.5 rounded-full text-xs font-mono text-ink/60">
                                            {file.type.startsWith('image/') ? <Image size={12} /> : <Video size={12} />}
                                            <span className="truncate max-w-[100px]">{file.name}</span>
                                            <button 
                                                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                                                className="text-ink/30 hover:text-red-500"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-ink/10 flex items-center justify-between shrink-0 bg-stone/5">
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 text-ink/60 hover:text-ink font-mono text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-ink text-paper rounded-full font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Question'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

