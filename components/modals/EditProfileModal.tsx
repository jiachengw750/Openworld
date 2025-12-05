
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, X as XIcon, Save, Loader2 } from 'lucide-react';

interface ProfileData {
  name: string;
  role?: string; // Updated to match Profile.tsx
  title?: string; // Kept for backward compatibility
  institution: string;
  avatar: string;
  bio: string;
  fieldsOfStudy: string[];
  joinDate?: string;
  // Optional new fields to prevent type errors when saving
  researchFields?: string[];
  subjects?: string[];
  banner?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any; // Relaxed type for now to handle slight schema diffs or map it
  onSave: (data: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      fieldsOfStudy: prev.fieldsOfStudy.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.fieldsOfStudy.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        fieldsOfStudy: [...prev.fieldsOfStudy, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create a fake local URL for preview
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, avatar: url }));
    }
  };

  const handleSubmit = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-paper w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative border border-ink/10 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-ink/10 bg-surface">
          <h3 className="font-sans text-2xl font-bold text-ink">Edit Profile</h3>
          <button 
            onClick={onClose}
            className="p-2 text-ink/60 hover:text-red-600 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-ink/10 group-hover:border-accent transition-colors">
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-ink">Profile Photo</span>
              <span className="text-xs text-ink/50 mt-1">Recommended 400x400px. JPG or PNG.</span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs font-mono font-bold uppercase tracking-widest text-accent hover:underline w-fit"
              >
                Upload New
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Display Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-surface border border-ink/20 p-3 font-sans text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Title / Role</label>
              <input 
                type="text"
                name="role" // Changed from title to role to match main state
                value={formData.role || formData.title}
                onChange={handleInputChange}
                className="w-full bg-surface border border-ink/20 p-3 font-sans text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Institution</label>
              <input 
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="w-full bg-surface border border-ink/20 p-3 font-sans text-sm text-ink focus:outline-none focus:border-accent rounded-sm"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">Biography</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-surface border border-ink/20 p-3 font-sans text-sm text-ink focus:outline-none focus:border-accent rounded-sm h-32 leading-relaxed resize-none"
              placeholder="Tell us about your research interests..."
            />
          </div>

          {/* Fields of Study (Legacy / General Tags) */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-ink/60 mb-2 font-bold">General Interests</label>
            <div className="bg-surface border border-ink/20 p-3 rounded-sm min-h-[50px] flex flex-wrap gap-2 items-center">
              {formData.fieldsOfStudy.map(tag => (
                <span key={tag} className="bg-stone/10 border border-ink/10 px-2 py-1 rounded-sm text-xs font-mono font-bold text-ink flex items-center gap-1 group">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-ink/40 group-hover:text-red-500 transition-colors">
                    <XIcon size={12} />
                  </button>
                </span>
              ))}
              <input 
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddTag}
                placeholder={formData.fieldsOfStudy.length === 0 ? "Add tags..." : ""}
                className="bg-transparent text-sm font-sans focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
            <p className="text-[10px] text-ink/40 mt-2">Press Enter to add a tag. Specific research fields and subjects can be managed directly on your profile page.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-ink/10 bg-paper flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-ink/10 text-ink font-mono text-xs font-bold uppercase tracking-widest hover:bg-stone/5 transition-colors rounded-full"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-3 bg-ink text-paper hover:bg-accent transition-colors font-mono text-xs font-bold uppercase tracking-widest rounded-full flex items-center shadow-lg hover:scale-[1.02]"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};
