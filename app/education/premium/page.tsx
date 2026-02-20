"use client";

import { useState } from 'react';
import { premiumCurriculum } from '../../../data/premium_education';
import Link from 'next/link';
import { ChevronRight, Lock, CheckCircle2, PlayCircle, BookOpen, Crown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';
import { SubscriptionModal } from '../../../components/SubscriptionModal';

export default function PremiumEducationDashboard() {
    // In a real app, this comes from DB/API
    // Defaulting to "Basic Plan" (Not subscribed to Pro)
    const [isProMember, setIsProMember] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    const handleStepClick = (e: React.MouseEvent, stepId: string) => {
        // Allow basic-1 for everyone
        if (stepId === 'basic-1') return;

        // If not basic-1 and not pro member, show modal
        if (!isProMember) {
            e.preventDefault();
            setShowPlanModal(true);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    학습하기
                    {!isProMember && <span className="text-xs md:text-base font-bold text-white bg-secondary px-2 md:px-3 py-0.5 md:py-1 rounded-full align-middle">Trial</span>}
                </h1>
                <p className="text-sm md:text-lg text-pastel-taupe max-w-2xl mx-auto px-2">
                    {!isProMember
                        ? "현재 Basic Plan(Trial) 체험 중입니다. 전체 커리큘럼을 잠금 해제하려면 업그레이드하세요."
                        : "Master the art of Amazon selling with our structured, in-depth curriculum."
                    }
                </p>
            </div>

            <div className="space-y-4 md:space-y-8">
                {premiumCurriculum.map((level, levelIndex) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: levelIndex * 0.1 }}
                        key={level.id}
                        className="bg-white border border-pastel-beige rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="bg-pastel-cream/50 p-4 md:p-6 border-b border-pastel-beige flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                            <div>
                                <h2 className="text-lg md:text-2xl font-bold text-primary flex items-center gap-2 md:gap-3">
                                    <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary text-pastel-cream flex items-center justify-center text-xs md:text-sm font-bold shrink-0">
                                        {levelIndex + 1}
                                    </span>
                                    {level.title}
                                </h2>
                                <p className="text-xs md:text-base text-pastel-taupe mt-1 md:mt-1 ml-8 md:ml-11">{level.description}</p>
                            </div>
                            {level.steps.length === 0 && (
                                <span className="self-start md:self-auto px-2 md:px-3 py-0.5 md:py-1 bg-pastel-beige/30 text-pastel-taupe rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                    Coming Soon
                                </span>
                            )}
                        </div>

                        <div className="p-2">
                            {level.steps.length > 0 ? (
                                <div className="grid gap-2">
                                    {level.steps.map((step, stepIndex) => {
                                        // Logic: 
                                        // If Basic User: Only basic-1 is unlocked.
                                        // If Pro User: Follow normal progression logic (not fully implemented here for brevity, assuming unlocking)

                                        const isBasic1 = step.id === 'basic-1';
                                        const isLocked = !isProMember && !isBasic1;
                                        const completed = completedSteps.includes(step.id);

                                        return (
                                            <Link
                                                key={step.id}
                                                href={isLocked ? '#' : `/education/premium/${level.id}/${step.id}`}
                                                className={cn(
                                                    "group flex items-center justify-between p-3 md:p-4 rounded-xl transition-all gap-3",
                                                    isLocked
                                                        ? "cursor-pointer bg-slate-50 opacity-90" // Allow click to trigger modal
                                                        : "hover:bg-pastel-cream/30 cursor-pointer bg-white"
                                                )}
                                                onClick={(e) => handleStepClick(e, step.id)}
                                            >
                                                <div className="flex items-start md:items-center gap-3 md:gap-4">
                                                    <div className={cn(
                                                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5 md:mt-0",
                                                        completed ? "bg-pastel-olive/20 text-pastel-olive" :
                                                            isLocked ? "bg-slate-200 text-slate-400" :
                                                                "bg-secondary/20 text-secondary"
                                                    )}>
                                                        {completed ? <CheckCircle2 size={16} className="md:w-5 md:h-5" /> :
                                                            isLocked ? <Lock size={16} className="md:w-5 md:h-5" /> :
                                                                <PlayCircle size={16} className="md:w-5 md:h-5" />}
                                                    </div>
                                                    <div>
                                                        <h3 className={cn("font-bold text-sm md:text-lg leading-tight md:leading-normal", isLocked ? "text-slate-500" : "text-primary")}>
                                                            {step.title}
                                                        </h3>
                                                        <div className="text-xs md:text-sm text-pastel-taupe flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="flex items-center gap-1"><BookOpen size={12} className="md:w-[14px] md:h-[14px]" /> 10 min read + Quiz</span>
                                                            {isLocked && <span className="text-secondary text-[10px] md:text-xs font-bold px-1.5 py-0.5 bg-secondary/10 rounded-full whitespace-nowrap">Pro Only</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                                    {completed && (
                                                        <span className="text-[10px] md:text-xs font-bold text-pastel-olive bg-pastel-olive/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                                                            PASSED
                                                        </span>
                                                    )}
                                                    {isLocked ? (
                                                        <Crown size={16} className="md:w-5 md:h-5 text-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <ChevronRight size={16} className="md:w-5 md:h-5 text-pastel-taupe group-hover:text-primary transition-colors" />
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 md:p-8 text-center text-sm md:text-base text-pastel-taupe italic">
                                    Content for this level is being prepared.
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <SubscriptionModal
                isOpen={showPlanModal}
                onClose={() => setShowPlanModal(false)}
            />
        </div>
    );
}
