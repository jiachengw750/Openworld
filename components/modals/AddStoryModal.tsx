
import React, { useState, useEffect } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';

interface AddStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { time: string; title: string; description: string }) => void;
}

export const AddStoryModal: React.FC<AddStoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset fields when opening
  useEffect(() => {
    if (isOpen) {
        setTime('');
        setTitle('');
        setDescription('');
        setIsSaving(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    
    // Simulate network request delay for better UX
    setTimeout(() => {
        onSave({ time, title, description });
        setIsSaving(false);
        onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-paper w-full max-w-[800px] shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 flex flex-col rounded-sm">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-ink/10">
          <h3 className="font-sans text-2xl font-bold text-ink">Edit Milestone</h3>
          <button 
            onClick={onClose}
            className="p-2 text-ink/40 hover:text-ink transition-colors rounded-full hover:bg-stone/10"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 md:p-10 space-y-8 bg-paper">
            
            {/* Time Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <label className="md:col-span-2 font-sans text-base font-medium text-ink">Time</label>
                <div className="md:col-span-4 relative group">
                    <input
                        type="text"
                        placeholder="yyyy/mm"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full border border-ink/10 bg-surface p-3 pr-10 font-mono text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-blue-500 rounded-sm transition-all"
                    />
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                </div>
            </div>

            {/* Milestone Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <label className="md:col-span-2 font-sans text-base font-medium text-ink pt-3">Milestone</label>
                <div className="md:col-span-10 relative">
                    <input
                        type="text"
                        placeholder="Enter milestone title here, such as achievement, prize, scholarship..."
                        value={title}
                        maxLength={40}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-ink/10 bg-surface p-3 pr-16 font-sans text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-blue-500 rounded-sm transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink/40 pointer-events-none">
                        {title.length}/40
                    </span>
                </div>
            </div>

            {/* Description Field */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <label className="md:col-span-2 font-sans text-base font-medium text-ink pt-3">Description</label>
                <div className="md:col-span-10 relative">
                    <textarea
                        placeholder="Enter details..."
                        value={description}
                        maxLength={200}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-ink/10 bg-surface p-3 pb-8 font-sans text-sm text-ink placeholder-ink/30 focus:outline-none focus:border-blue-500 rounded-sm transition-all h-32 resize-none leading-relaxed"
                    />
                    <span className="absolute right-3 bottom-3 text-[10px] font-mono text-ink/40 pointer-events-none">
                        {description.length}/200
                    </span>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-ink/10 flex justify-end gap-4 bg-surface">
            <button
                onClick={onClose}
                className="px-8 py-2.5 rounded-full border border-ink/20 text-ink font-mono text-sm font-bold bg-white hover:bg-stone/5 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                disabled={!title.trim() || isSaving}
                className={`px-8 py-2.5 rounded-full font-mono text-sm font-bold border border-transparent transition-colors flex items-center gap-2 ${
                    title.trim() 
                        ? 'bg-ink text-paper hover:bg-accent shadow-lg' 
                        : 'bg-stone/20 text-ink/40 cursor-not-allowed'
                }`}
            >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save'}
            </button>
        </div>
      </div>
    </div>
  );
};
