
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface TagSectionProps {
    title: string;
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (index: number) => void;
    bgClass?: string;
}

export const TagSection: React.FC<TagSectionProps> = ({ title, tags, onAdd, onRemove, bgClass = 'bg-stone/5' }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [val, setVal] = useState('');
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setIsAdding(false);
            }
        };
        if (isAdding) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isAdding]);

    const submit = () => {
        if (val.trim()) onAdd(val.trim());
        setVal('');
        setIsAdding(false);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ink/50">{title}</h3>
                <button onClick={() => setIsAdding(true)} className="text-ink/40 hover:text-ink transition-colors"><Plus size={14}/></button>
                {isAdding && (
                    <div ref={inputRef} className="flex items-center bg-white border border-ink/10 rounded-sm px-2 py-0.5 animate-in fade-in slide-in-from-left-2 duration-200">
                        <input autoFocus className="bg-transparent text-xs font-mono p-1 outline-none w-32 text-ink" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') submit(); if(e.key === 'Escape') setIsAdding(false); }} placeholder="Add..." />
                        <button onClick={submit} className="text-green-600 hover:text-green-700 ml-1"><Check size={14}/></button>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                    <div key={i} className="group relative">
                        <span className={`px-3 py-1.5 border border-ink/10 text-ink/70 rounded-sm text-xs font-mono font-bold cursor-default block ${bgClass}`}>{t}</span>
                        <button onClick={() => onRemove(i)} className={`absolute -top-1 -right-1 bg-ink text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}><X size={10}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};
