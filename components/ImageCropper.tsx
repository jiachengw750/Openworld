
import React, { useState, useEffect, useRef } from 'react';
import { X, Move, Minus, Plus } from 'lucide-react';

interface ImageCropperProps {
    src: string;
    onCancel: () => void;
    onSave: (croppedUrl: string) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ src, onCancel, onSave }) => {
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize zoom to fit image in container
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            // Default logic: if image is huge, zoom out so at least 500px is visible
            const minDim = Math.min(img.width, img.height);
            if (minDim > 600) {
                setZoom(600 / minDim);
            }
        };
    }, [src]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSave = () => {
        const canvas = document.createElement('canvas');
        const size = 300; // Final avatar output size
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx || !imgRef.current) return;

        // Fill white background to handle transparency if needed
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        // Calculate transformations
        // We need to map the view's center to the canvas center
        // The view center corresponds to the mask center
        
        ctx.translate(size / 2, size / 2);
        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);
        
        // Draw image centered at the translated origin
        ctx.drawImage(
            imgRef.current, 
            -imgRef.current.naturalWidth / 2, 
            -imgRef.current.naturalHeight / 2
        );

        onSave(canvas.toDataURL('image/jpeg', 0.9));
    };

    return (
        <div className="flex flex-col h-full bg-paper animate-in fade-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-ink/10 bg-surface">
                <h3 className="font-sans text-lg font-bold text-ink">Choose Profile Image</h3>
                <button 
                    onClick={onCancel}
                    className="p-2 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex-1 bg-[#E5E5E5] relative overflow-hidden flex items-center justify-center cursor-move select-none"
                 onMouseDown={handleMouseDown}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}
                 onMouseLeave={handleMouseUp}
                 ref={containerRef}
            >
                {/* Image Layer */}
                <img 
                    ref={imgRef}
                    src={src} 
                    alt="Crop target"
                    style={{ 
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        maxWidth: 'none',
                        maxHeight: 'none',
                    }}
                    className="transition-transform duration-75 ease-linear pointer-events-none origin-center"
                    draggable={false}
                />
                
                {/* Overlay Mask - Using borders to create the circular cutout effect */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                     <div className="w-64 h-64 rounded-full border-[2000px] border-black/50 box-content relative shrink-0">
                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50">
                            <Move size={24} strokeWidth={1} />
                        </div>
                     </div>
                </div>
            </div>

            <div className="p-6 border-t border-ink/10 bg-surface space-y-6">
                {/* Zoom Controls */}
                <div className="flex items-center gap-4 px-4 max-w-md mx-auto w-full">
                    <button onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="hover:bg-stone/10 p-1 rounded">
                        <Minus size={20} className="text-ink" />
                    </button>
                    <input 
                        type="range" 
                        min="0.1" 
                        max="3" 
                        step="0.01" 
                        value={zoom} 
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-ink"
                    />
                    <button onClick={() => setZoom(Math.min(5, zoom + 0.1))} className="hover:bg-stone/10 p-1 rounded">
                        <Plus size={20} className="text-ink" />
                    </button>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onCancel} 
                        className="px-8 py-3 rounded-full border border-ink/20 font-mono text-xs font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors text-ink"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-10 py-3 rounded-full bg-ink text-paper font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent shadow-lg transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
