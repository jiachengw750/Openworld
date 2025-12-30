import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, List as ListIcon, ListOrdered, Video, Image, Maximize2, Minimize2 } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    height?: string;
    isFullscreen?: boolean;
    onUploadVideo?: (file: File) => void;
    onUploadImage?: (file: File) => void;
    onToggleFullscreen?: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value, 
    onChange, 
    placeholder, 
    height = "h-64",
    isFullscreen = false,
    onUploadVideo,
    onUploadImage,
    onToggleFullscreen
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
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

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUploadVideo) {
            onUploadVideo(file);
        }
        // Reset input
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUploadImage) {
            onUploadImage(file);
            // Insert image into editor
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
        // Reset input
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    return (
        <div className={`flex flex-col border rounded-sm bg-surface transition-colors overflow-hidden ${isFocused ? 'border-accent' : 'border-ink/20'}`}>
            {/* Top Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-ink/10 bg-stone/5">
                <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bold"><Bold size={14} /></button>
                <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Italic"><Italic size={14} /></button>
                <div className="w-px h-4 bg-ink/10 mx-1"></div>
                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Bullet List"><ListIcon size={14} /></button>
                <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-ink/10 rounded-sm text-ink/70 transition-colors" title="Numbered List"><ListOrdered size={14} /></button>
            </div>
            
            {/* Editor Content */}
            <div
                ref={editorRef}
                className={`w-full p-4 overflow-auto outline-none ${height} font-sans text-base text-ink empty:before:content-[attr(data-placeholder)] empty:before:text-ink/30`}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
            />

            {/* Bottom Toolbar - File Upload and Fullscreen */}
            <div className="flex items-center justify-between gap-4 p-3 border-t border-ink/10 bg-stone/5">
                <div className="flex items-center gap-4">
                    {onUploadVideo && (
                        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-ink/10 rounded-sm cursor-pointer hover:bg-stone/5 transition-colors">
                            <Video size={16} className="text-ink/60" />
                            <span className="text-xs font-mono font-bold uppercase text-ink/60">Upload Video</span>
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleVideoUpload}
                            />
                        </label>
                    )}
                    {onUploadImage && (
                        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-ink/10 rounded-sm cursor-pointer hover:bg-stone/5 transition-colors">
                            <Image size={16} className="text-ink/60" />
                            <span className="text-xs font-mono font-bold uppercase text-ink/60">Upload Image</span>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    )}
                </div>
                {onToggleFullscreen && (
                    <button
                        type="button"
                        onClick={onToggleFullscreen}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-ink/10 rounded-sm hover:bg-stone/5 transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={16} className="text-ink/60" /> : <Maximize2 size={16} className="text-ink/60" />}
                        <span className="text-xs font-mono font-bold uppercase text-ink/60">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                    </button>
                )}
            </div>
        </div>
    );
};
