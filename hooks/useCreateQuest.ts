import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { QuestFormData, WizardStep } from '../types';

const INITIAL_DATA: QuestFormData = {
    title: '',
    subject: '',
    tags: [],
    description: '',
    attachments: [],
    deliverables: '',
    acceptanceCriteria: '',
    budget: '',
    deadline: '',
    ipRights: null
};

export const useCreateQuest = () => {
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState<WizardStep>('GUIDE');
    const [formData, setFormData] = useState<QuestFormData>(INITIAL_DATA);

    // Load Draft
    useEffect(() => {
        const savedDraft = localStorage.getItem('opensci_quest_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setFormData(prev => ({ ...prev, ...parsed, attachments: [] }));
                if (parsed.title) showToast("Draft restored");
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, [showToast]);

    const handleSaveDraft = () => {
        // Exclude attachments
        const { attachments, ...draftData } = formData;
        localStorage.setItem('opensci_quest_draft', JSON.stringify(draftData));
        showToast("Draft saved successfully");
    };

    const updateField = (field: keyof QuestFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: WizardStep): boolean => {
        switch (step) {
            case 'BASICS':
                if (!formData.title || !formData.subject || !formData.description) {
                    showToast("Please fill in all required basic info.");
                    return false;
                }
                return true;
            case 'STANDARDS':
                if (!formData.deliverables || !formData.acceptanceCriteria) {
                    showToast("Please define deliverables and acceptance criteria.");
                    return false;
                }
                return true;
            case 'TERMS':
                if (!formData.budget || !formData.deadline || !formData.ipRights) {
                    showToast("Please complete budget, deadline and IP rights.");
                    return false;
                }
                if (parseFloat(formData.budget) <= 0) {
                    showToast("Budget must be greater than 0.");
                    return false;
                }
                return true;
            default: return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            const steps: WizardStep[] = ['GUIDE', 'BASICS', 'STANDARDS', 'TERMS', 'PREVIEW', 'PAYMENT'];
            const idx = steps.indexOf(currentStep);
            if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
        }
    };

    const prevStep = () => {
        const steps: WizardStep[] = ['GUIDE', 'BASICS', 'STANDARDS', 'TERMS', 'PREVIEW', 'PAYMENT'];
        const idx = steps.indexOf(currentStep);
        if (idx > 0) setCurrentStep(steps[idx - 1]);
    };

    const clearDraft = () => {
        localStorage.removeItem('opensci_quest_draft');
        setFormData(INITIAL_DATA);
    };

    return {
        currentStep,
        setCurrentStep,
        formData,
        updateField,
        handleSaveDraft,
        nextStep,
        prevStep,
        clearDraft
    };
};
