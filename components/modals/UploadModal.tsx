import React, { useState, useRef } from 'react';
import { X, Paperclip, FileText, Trash2 } from 'lucide-react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [progressText, setProgressText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        setIsSubmittingUpload(true);
        // Simulate network request handled by parent
        setTimeout(() => {
            setIsSubmittingUpload(false);
            onSubmit();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-paper w-full max-w-lg p-8 rounded-none shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="font-sans text-2xl font-bold mb-6">Update Milestone Progress</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2">Progress Description</label>
                        <textarea 
                            value={progressText}
                            onChange={(e) => setProgressText(e.target.value)}
                            placeholder="Describe the progress achieved..."
                            className="w-full bg-surface border border-ink/20 p-3 font-mono text-sm text-ink focus:outline-none focus:border-accent rounded-sm h-32 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2">Attachments</label>
                        <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-ink/20 rounded-sm p-6 text-center cursor-pointer hover:border-accent hover:bg-ink/5 transition-colors group"
                        >
                            <Paperclip size={24} className="mx-auto text-ink/40 group-hover:text-accent mb-2" />
                            <span className="text-xs font-mono text-ink/60 group-hover:text-ink">Click to upload files</span>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-stone/10 p-2 rounded-sm text-xs font-mono">
                                        <div className="flex items-center space-x-2 truncate">
                                            <FileText size={12} className="text-ink/60" />
                                            <span className="truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                        <button onClick={() => handleRemoveFile(index)} className="text-ink/40 hover:text-red-500">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 border border-ink/20 text-ink font-mono text-xs font-bold uppercase tracking-widest hover:bg-ink/5 transition-colors rounded-full"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmittingUpload}
                            className="flex-1 py-3 bg-ink text-paper hover:bg-accent transition-colors font-mono text-xs font-bold uppercase tracking-widest rounded-full flex justify-center items-center"
                        >
                            {isSubmittingUpload ? (
                                <div className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin"></div>
                            ) : (
                                "Submit Update"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};