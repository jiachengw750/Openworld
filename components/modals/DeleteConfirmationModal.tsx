import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, onClose, onConfirm, 
  title = "Delete Item", 
  message = "Are you sure you want to delete this item? This action cannot be undone." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-paper w-full max-w-md p-8 rounded-sm shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 p-3 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 border border-red-100">
            <Trash2 size={32} />
        </div>
        
        <h3 className="font-sans text-2xl font-bold text-ink mb-2">{title}</h3>
        <p className="font-sans text-ink/60 text-sm mb-8 leading-relaxed max-w-xs">
            {message}
        </p>

        <div className="flex gap-4 w-full">
            <button 
                onClick={onClose}
                className="flex-1 border border-ink/10 py-3 rounded-full font-mono text-xs font-bold uppercase text-ink/60 hover:text-ink hover:bg-stone/5 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm}
                className="flex-1 bg-red-600 text-white py-3 rounded-full font-mono text-xs font-bold uppercase hover:bg-red-700 transition-colors shadow-lg"
            >
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};