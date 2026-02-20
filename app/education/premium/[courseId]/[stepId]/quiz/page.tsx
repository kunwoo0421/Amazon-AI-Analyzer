"use client";

import { useState } from 'react';
import { premiumCurriculum, QuizQuestion } from '../../../../../../data/premium_education';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, RefreshCcw, AlertCircle, ArrowLeft, Check, Home } from 'lucide-react';
import { cn } from '../../../../../../lib/utils';
import Link from 'next/link';

interface PageProps {
    params: {
        courseId: string;
        stepId: string;
    }
}

export default function PremiumQuizPage({ params }: PageProps) {
    const { courseId, stepId } = params;
    const router = useRouter();

    // Data Loading
    const course = premiumCurriculum.find(c => c.id === courseId);
    const step = course?.steps.find(s => s.id === stepId);

    if (!course || !step) return notFound();

    const questions = step.quiz;
    const PASSING_SCORE = 80; // Percentage
    const PASSING_COUNT = Math.ceil(questions.length * (PASSING_SCORE / 100)); // e.g. 24 for 30

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> selectedOptionIndex
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Helpers
    const handleOptionSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questions[currentIndex].id]: optionIndex
        }));
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correct++;
        });
        return correct;
    };

    const handleSubmit = () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setIsSubmitted(true);
        // In a real app, save progress to DB/LocalStorage here
        if (finalScore >= PASSING_COUNT) {
            // Mock save unlock next step
            const existing = localStorage.getItem('completedSteps');
            const completed = existing ? JSON.parse(existing) : [];
            if (!completed.includes(stepId)) {
                completed.push(stepId);
                localStorage.setItem('completedSteps', JSON.stringify(completed));
            }
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setCurrentIndex(0);
        setIsSubmitted(false);
        setScore(0);
    };

    // Derived
    const currentQuestion = questions[currentIndex];
    const isAnswered = answers[currentQuestion.id] !== undefined;
    const allAnswered = questions.every(q => answers[q.id] !== undefined);
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const percentage = Math.round((score / questions.length) * 100);
    const passed = score >= PASSING_COUNT;

    // --- Render: Result View ---
    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500 min-h-screen flex flex-col items-center justify-center">
                <div className="bg-white rounded-3xl p-10 shadow-xl border border-pastel-beige max-w-2xl w-full text-center space-y-6">
                    <div className="flex justify-center mb-6">
                        {passed ? (
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                                <CheckCircle size={48} />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                <XCircle size={48} />
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-primary">
                        {passed ? "축하합니다! 합격입니다!" : "아쉽네요, 다시 도전해보세요!"}
                    </h1>

                    <div className="space-y-2">
                        <p className="text-6xl font-extrabold text-primary">{percentage}%</p>
                        <p className="text-pastel-taupe font-medium">
                            총 {questions.length}문제 중 {score}문제 정답
                        </p>
                    </div>

                    <p className="text-lg text-slate-600">
                        {passed
                            ? "이번 강의의 핵심 내용을 완벽하게 이해하셨군요. 다음 단계로 넘어갈 수 있습니다."
                            : "최소 80% 이상 맞춰야 통과할 수 있습니다. 오답 노트를 확인하고 재도전해보세요."}
                    </p>

                    <div className="flex flex-col gap-3 pt-6">
                        {passed ? (
                            <>
                                <Link href="/education/premium" className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-pastel-black/20">
                                    커리큘럼으로 돌아가기
                                </Link>
                                <Link href="/" className="w-full py-3 bg-white border border-primary text-primary rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                    <Home size={20} /> 메인으로 돌아가기
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleRetry}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-pastel-black/20 flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={20} /> 퀴즈 재시도
                            </button>
                        )}
                        <Link href={`/education/premium/${courseId}/${stepId}`} className="text-pastel-taupe hover:text-primary font-medium p-2">
                            강의 다시보기
                        </Link>
                    </div>
                </div>

                {/* Review Section */}
                <div className="mt-12 w-full max-w-3xl space-y-6">
                    <h2 className="text-2xl font-bold text-primary border-b border-pastel-beige pb-4">
                        오답 노트
                    </h2>
                    {questions.map((q, idx) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = userAnswer === q.correctAnswer;

                        if (isCorrect) return null; // Only show wrong answers

                        return (
                            <div key={q.id} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <span className="shrink-0 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-sm">
                                        Q{idx + 1}
                                    </span>
                                    <div className="space-y-3 w-full">
                                        <p className="font-bold text-lg text-primary">{q.question}</p>

                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-700 text-sm flex items-center gap-2">
                                            <XCircle size={16} />
                                            내가 고른 답: <span className="font-semibold">{q.options[userAnswer]}</span>
                                        </div>

                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-green-700 text-sm flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            정답: <span className="font-semibold">{q.options[q.correctAnswer]}</span>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                                            <span className="font-bold text-primary block mb-1">해설:</span>
                                            {q.explanation}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {passed && score === questions.length && (
                        <p className="text-center text-pastel-taupe">모든 문제를 맞추셨습니다!</p>
                    )}
                </div>
            </div>
        );
    }

    // --- Render: Quiz View ---
    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href={`/education/premium/${courseId}/${stepId}`}
                    className="p-2 hover:bg-white rounded-full transition-colors text-pastel-taupe hover:text-primary"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div className="text-center">
                    <h2 className="font-bold text-primary">{step.title}</h2>
                    <p className="text-xs text-pastel-taupe uppercase tracking-widest font-bold">퀴즈 모드</p>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-pastel-beige/30 rounded-full mb-8 relative overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="absolute top-0 left-0 h-full bg-secondary rounded-full"
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                />
            </div>

            {/* Question Card */}
            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-pastel-taupe font-bold text-sm mb-2 block">
                                문제 {currentIndex + 1} / {questions.length}
                            </span>
                            <h3 className="text-2xl font-bold text-primary leading-snug">
                                {currentQuestion.question}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = answers[currentQuestion.id] === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={cn(
                                            "p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group",
                                            isSelected
                                                ? "border-secondary bg-pastel-beige/40 shadow-md"
                                                : "border-pastel-beige bg-white hover:border-secondary/50 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                                isSelected
                                                    ? "bg-secondary border-secondary scale-110"
                                                    : "bg-white border-pastel-beige group-hover:border-secondary/50"
                                            )}>
                                                {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                                            </div>
                                            <span className={cn("font-medium text-lg", isSelected ? "text-primary" : "text-slate-600")}>
                                                {option}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-10 pt-6 border-t border-pastel-beige flex justify-between items-center bg-pastel-cream/50 -mx-6 px-6 py-4 rounded-b-3xl">
                <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-pastel-taupe hover:text-primary disabled:opacity-30 disabled:hover:text-pastel-taupe transition-colors"
                >
                    <ChevronLeft size={20} /> 이전
                </button>

                {currentIndex === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pastel-black/20"
                    >
                        퀴즈 제출하기 <CheckCircle size={20} />
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        disabled={!isAnswered}
                        className="flex items-center gap-2 px-8 py-3 bg-white border border-pastel-beige text-primary rounded-xl font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        다음 <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
