import React from 'react';
import { Paperclip, Send, X } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    attachedFiles: File[];
    onRemoveFile: (idx: number) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    toolName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    input, setInput, onSend, onFileSelect,
    attachedFiles, onRemoveFile, fileInputRef, toolName
}) => {
    return (
        <div className="bg-surface border-t border-ink/10 p-6 md:p-10 shrink-0">
            <div className="max-w-[800px] mx-auto">

                {/* Attached Files Preview */}
                {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6 animate-in slide-in-from-bottom-4 duration-300">
                        {attachedFiles.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-stone/5 border border-ink/10 px-4 py-2 rounded-full group">
                                <span className="text-[10px] font-mono font-bold text-ink/60 truncate max-w-[120px]">{file.name}</span>
                                <button onClick={() => onRemoveFile(i)} className="text-ink/30 hover:text-red-500 transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative group bg-paper border border-ink/20 rounded-sm focus-within:border-accent transition-all shadow-sm">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
                        placeholder={`Ask ${toolName} anything...`}
                        className="w-full bg-transparent p-6 pr-32 font-sans text-base text-ink outline-none resize-none h-24 placeholder:text-ink/20"
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            onChange={onFileSelect}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-ink/30 hover:text-ink hover:bg-stone/5 transition-colors rounded-full"
                            title="Attach files"
                        >
                            <Paperclip size={20} />
                        </button>
                        <button
                            onClick={onSend}
                            disabled={!input.trim() && attachedFiles.length === 0}
                            className="p-4 bg-ink text-paper rounded-full hover:bg-accent hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-lg"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
                <p className="text-[9px] font-mono text-ink/30 text-center mt-4 uppercase tracking-[0.2em]">
                    AI may generate inaccurate information. Use with discretion.
                </p>
            </div>
        </div>
    );
};
