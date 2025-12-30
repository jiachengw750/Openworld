
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
            // Default logic: fit image nicely within the view
            const minDim = Math.min(img.width, img.height);
            // If image is large, scale it down initially so user sees most of it
            // 300 is the crop diameter approx
            if (minDim > 400) {
                setZoom(400 / minDim);
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
        const size = 400; // High res output for avatar
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx || !imgRef.current) return;

        // Fill white background to handle transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        // Calculate transformations to map the visible area to the canvas
        // The center of the view (mask) corresponds to the center of the canvas
        
        ctx.translate(size / 2, size / 2);
        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);
        
        // Draw image centered at the translated origin
        ctx.drawImage(
            imgRef.current, 
            -imgRef.current.naturalWidth / 2, 
            -imgRef.current.naturalHeight / 2
        );

        onSave(canvas.toDataURL('image/jpeg', 0.95));
    };

    return (
        <div className="flex flex-col h-full bg-paper animate-in fade-in duration-300">
            {/* Header - Centered Title */}
            <div className="relative flex justify-center items-center p-6 border-b border-ink/10 bg-surface">
                <h3 className="font-sans text-lg font-bold text-ink">Choose Profile Image</h3>
                <button 
                    onClick={onCancel}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
            
            {/* Main Crop Area */}
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
                        pointerEvents: 'none'
                    }}
                    className="origin-center transition-transform duration-75 ease-linear"
                    draggable={false}
                />
                
                {/* Overlay Mask - Using huge borders to create the circular cutout effect */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                     {/* The 'hole' is 280px (w-70) to match visual, border is semi-transparent black */}
                     <div className="w-[280px] h-[280px] rounded-full border-[2000px] border-black/50 box-content relative shrink-0">
                        {/* Center Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80">
                            <Move size={24} strokeWidth={1.5} />
                        </div>
                     </div>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="p-8 border-t border-ink/10 bg-surface space-y-8">
                {/* Zoom Controls */}
                <div className="flex items-center gap-6 px-4 max-w-md mx-auto w-full">
                    <button 
                        onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} 
                        className="hover:bg-stone/10 p-1 rounded transition-colors text-ink font-bold"
                    >
                        <Minus size={24} strokeWidth={1.5} />
                    </button>
                    
                    <div className="flex-1 relative h-8 flex items-center">
                        <input 
                            type="range" 
                            min="0.2" 
                            max="3" 
                            step="0.05" 
                            value={zoom} 
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full h-1 bg-ink rounded-lg appearance-none cursor-pointer accent-ink"
                        />
                    </div>

                    <button 
                        onClick={() => setZoom(Math.min(5, zoom + 0.1))} 
                        className="hover:bg-stone/10 p-1 rounded transition-colors text-ink font-bold"
                    >
                        <Plus size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-2">
                    <button 
                        onClick={onCancel} 
                        className="px-10 py-3 rounded-full border border-ink/20 font-mono text-sm font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors text-ink bg-white"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-12 py-3 rounded-full bg-ink text-paper font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent shadow-lg transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
