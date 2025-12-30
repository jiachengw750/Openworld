import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useCreateQuest } from '../hooks/useCreateQuest';
import { PasswordVerificationModal } from '../components/modals/PasswordVerificationModal';
import { PublishProtocolModal } from '../components/modals/PublishProtocolModal';
import { EscrowProtocolModal } from '../components/modals/EscrowProtocolModal';
import { GuideStep } from '../components/create-quest/steps/GuideStep';
import { BasicsStep } from '../components/create-quest/steps/BasicsStep';
import { StandardsStep } from '../components/create-quest/steps/StandardsStep';
import { TermsStep } from '../components/create-quest/steps/TermsStep';
import { PreviewStep } from '../components/create-quest/steps/PreviewStep';
import { PaymentStep } from '../components/create-quest/steps/PaymentStep';

export const CreateQuest: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const {
        currentStep, setCurrentStep, formData, updateField,
        handleSaveDraft, nextStep, prevStep, clearDraft
    } = useCreateQuest();

    const [isPublishProtocolOpen, setIsPublishProtocolOpen] = useState(false);
    const [isEscrowProtocolOpen, setIsEscrowProtocolOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const onPasswordVerified = () => {
        setIsPasswordOpen(false);
        clearDraft();
        setTimeout(() => {
            showToast("Quest published successfully!");
            navigate('/workspace');
        }, 2500);
    };

    const Stepper = () => {
        const steps = ['Basics', 'Standards', 'Terms', 'Preview', 'Payment'];
        const currentIdx = ['BASICS', 'STANDARDS', 'TERMS', 'PREVIEW', 'PAYMENT'].indexOf(currentStep);

        if (currentStep === 'GUIDE') return null;

        return (
            <div className="flex items-center justify-center space-x-4 mb-12">
                {steps.map((label, idx) => (
                    <div key={idx} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-mono text-xs font-bold transition-colors ${idx <= currentIdx ? 'bg-ink border-ink text-paper' : 'border-ink/20 text-ink/30'
                            }`}>
                            {idx < currentIdx ? <CheckCircle size={14} /> : idx + 1}
                        </div>
                        <span className={`ml-2 text-xs font-mono font-bold uppercase tracking-wider hidden md:block ${idx <= currentIdx ? 'text-ink' : 'text-ink/30'
                            }`}>
                            {label}
                        </span>
                        {idx < steps.length - 1 && (
                            <div className={`w-8 h-[2px] mx-4 ${idx < currentIdx ? 'bg-ink' : 'bg-ink/10'}`}></div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-paper pb-24">
            <div className="bg-surface border-b border-ink/10 pt-24 pb-6 px-6 md:px-12 sticky top-0 z-20">
                <div className="max-w-[1000px] mx-auto flex justify-between items-center">
                    <button onClick={() => currentStep === 'GUIDE' ? navigate('/') : prevStep()} className="flex items-center text-xs font-mono font-bold text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} className="mr-2" /> {currentStep === 'GUIDE' ? 'Exit' : 'Back'}
                    </button>
                    <span className="font-sans font-bold text-ink text-lg">Create New Task</span>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 md:px-12 mt-12">
                <Stepper />

                {currentStep === 'GUIDE' && <GuideStep onStart={() => setCurrentStep('BASICS')} />}

                {currentStep === 'BASICS' && (
                    <BasicsStep
                        formData={formData}
                        updateField={updateField}
                        onNext={nextStep}
                        onSaveDraft={handleSaveDraft}
                    />
                )}

                {currentStep === 'STANDARDS' && (
                    <StandardsStep
                        formData={formData}
                        updateField={updateField}
                        onNext={nextStep}
                        onSaveDraft={handleSaveDraft}
                    />
                )}

                {currentStep === 'TERMS' && (
                    <TermsStep
                        formData={formData}
                        updateField={updateField}
                        onNext={nextStep}
                        onSaveDraft={handleSaveDraft}
                    />
                )}

                {currentStep === 'PREVIEW' && (
                    <PreviewStep
                        formData={formData}
                        onSubmit={() => setIsPublishProtocolOpen(true)}
                        onSaveDraft={handleSaveDraft}
                    />
                )}

                {currentStep === 'PAYMENT' && (
                    <PaymentStep
                        budget={formData.budget}
                        onInitiatePayment={() => setIsEscrowProtocolOpen(true)}
                    />
                )}
            </div>

            <PublishProtocolModal
                isOpen={isPublishProtocolOpen}
                onClose={() => setIsPublishProtocolOpen(false)}
                onConfirm={() => {
                    setIsPublishProtocolOpen(false);
                    setCurrentStep('PAYMENT');
                }}
            />

            <EscrowProtocolModal
                isOpen={isEscrowProtocolOpen}
                onClose={() => setIsEscrowProtocolOpen(false)}
                onConfirm={() => {
                    setIsEscrowProtocolOpen(false);
                    setIsPasswordOpen(true);
                }}
                budget={formData.budget}
            />

            <PasswordVerificationModal
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
                onVerified={onPasswordVerified}
            />
        </div>
    );
};
