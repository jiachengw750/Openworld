import React from 'react';
import { BookOpen, FileText, PenTool, Database, Palette, Sparkles, Heart } from 'lucide-react';
import { AiToolCategory } from '../types';

export type MarketCategory = AiToolCategory | 'ALL' | 'FAVORITES';

export const CATEGORY_ICON_MAP: Record<AiToolCategory, React.ComponentType<any>> = {
    'Literature': BookOpen,
    'Reading': FileText,
    'Writing': PenTool,
    'Data': Database,
    'Design': Palette,
};

export const getCategoryIcon = (category: AiToolCategory) => {
    return CATEGORY_ICON_MAP[category] || Sparkles;
};

export const getResearchDirectionIcon = (category: MarketCategory) => {
    if (category === 'FAVORITES') return Heart;
    if (category === 'ALL') return Sparkles;
    return getCategoryIcon(category as AiToolCategory);
};

export const RESEARCH_DIRECTIONS: { id: MarketCategory, label: string, icon: any }[] = [
    { id: 'ALL', label: 'ALL TOOLS', icon: Sparkles },
    { id: 'FAVORITES', label: 'FAVORITES', icon: Heart },
    { id: 'Literature', label: 'LITERATURE SEARCH', icon: BookOpen },
    { id: 'Reading', label: 'READING & SYNTHESIS', icon: FileText },
    { id: 'Writing', label: 'WRITING & POLISHING', icon: PenTool },
    { id: 'Data', label: 'DATA ANALYSIS', icon: Database },
    { id: 'Design', label: 'VISUALS & DESIGN', icon: Palette },
];

export const SOURCE_FILTERS = ['ALL', 'OFFICIAL', 'LINK'] as const;
export const SORT_OPTIONS = ['HOT', 'RATING'] as const;

export const STAGE_MAP: Record<string, string> = {
    'Literature': '01. LITERATURE',
    'Reading': '02. READING',
    'Writing': '03. WRITING',
    'Data': '04. ANALYSIS',
    'Design': '05. DESIGN'
};

