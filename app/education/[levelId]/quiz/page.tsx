"use client";

import { educationLevels } from "../../../../data/education_data";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy, HelpCircle, ChevronRight, AlertCircle, Home } from "lucide-react";
import Link from "next/link";
import confetti from 'canvas-confetti';

export default function QuizPage({ params }: { params: { levelId: string } }) {
    const router = useRouter();
    const levelId = parseInt(params.levelId);
    const levelData = educationLevels.find((l) => l.id === levelId);

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isPassed, setIsPassed] = useState(false);

    // Initial check
    if (!levelData) return <div className="p-8 text-center text-red-500 font-bold">Level {levelId} not found</div>;

    const questions = levelData.quiz;
    const currentQuestion = questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

    const handleSelectAnswer = (optionIdx: number) => {
        if (showAnswerFeedback) return; // Already checked answer
        setSelectedAnswer(optionIdx);
    };

    const handleCheckAnswer = () => {
        if (selectedAnswer === null) return;
        setShowAnswerFeedback(true);

        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setSelectedAnswer(null);
            setShowAnswerFeedback(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const finalScore = selectedAnswer === currentQuestion.correctAnswer ? score + 1 : score;
        const percentage = (finalScore / questions.length) * 100;
        const passed = percentage >= 80;

        setShowResult(true);
        setIsPassed(passed);

        if (passed) {
            const currentLevel = parseInt(localStorage.getItem("educationLevel") || "1");
            if (currentLevel === levelId) {
                localStorage.setItem("educationLevel", (currentLevel + 1).toString());
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#4F46E5', '#10B981', '#F59E0B']
                });
            }
        }
    };

    if (showResult) {
        return (
            <div className="max-w-md mx-auto p-8 mt-16 text-center animate-in zoom-in-95 duration-500 bg-white rounded-3xl shadow-2xl border border-slate-100">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${isPassed ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-500'}`}>
                    {isPassed ? <Trophy size={56} className="drop-shadow-md" /> : <AlertCircle size={56} className="drop-shadow-md" />}
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                    {isPassed ? "테스트 통과!" : "아쉽네요!"}
                </h1>
                <p className="text-slate-500 mb-8 font-medium">
                    {isPassed ? "축하합니다, 다음 레벨이 잠금 해제되었습니다." : "조금 더 공부하고 다시 도전해보세요."}
                </p>

                <div className="flex justify-center gap-8 mb-10 text-center">
                    <div>
                        <p className="text-sm text-slate-400 font-bold uppercase mb-1">내 점수</p>
                        <p className={`text-3xl font-black ${isPassed ? 'text-indigo-600' : 'text-red-500'}`}>
                            {Math.round((score / questions.length) * 100)}%
                        </p>
                    </div>
                    <div className="w-[1px] bg-slate-200 h-12 self-center" />
                    <div>
                        <p className="text-sm text-slate-400 font-bold uppercase mb-1">합격 기준</p>
                        <p className="text-3xl font-black text-slate-700">80%</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {isPassed ? (
                        <Link
                            href="/education"
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            다음 레벨로 이동 <ArrowRight size={20} />
                        </Link>
                    ) : (
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} />
                            다시 도전하기
                        </button>
                    )}
                    <Link href="/" className="text-slate-400 font-bold text-sm hover:text-slate-600 mt-4 flex items-center justify-center gap-1">
                        <Home size={14} /> 홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header / Progress */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-4 px-1">
                    <div>
                        <span className="block text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Level {levelId} Test</span>
                        <h2 className="text-2xl font-bold text-slate-900">지식 체크</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-slate-200">{currentQuestionIdx + 1}</span>
                        <span className="text-lg font-bold text-slate-300">/{questions.length}</span>
                    </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none" />

                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10 leading-snug relative z-10">
                    Q. {currentQuestion.question}
                </h3>

                <div className="space-y-4 relative z-10">
                    {currentQuestion.options.map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect = idx === currentQuestion.correctAnswer;
                        const showCorrect = showAnswerFeedback && isCorrect;
                        const showWrong = showAnswerFeedback && isSelected && !isCorrect;

                        let style = "border-slate-100 bg-white hover:border-indigo-300 hover:bg-slate-50"; // Default

                        if (isSelected && !showAnswerFeedback) {
                            style = "border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600"; // Selected
                        }

                        if (showAnswerFeedback) {
                            if (showCorrect) style = "border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500";
                            else if (showWrong) style = "border-red-500 bg-red-50 text-red-800 ring-1 ring-red-500 opacity-80";
                            else style = "border-slate-100 text-slate-400 opacity-50"; // Default unused
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelectAnswer(idx)}
                                disabled={showAnswerFeedback}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between font-bold text-lg group ${style}`}
                            >
                                <span className="flex-1">{option}</span>
                                {showCorrect && <CheckCircle className="text-green-600 animate-in zoom-in spin-in-90" size={24} />}
                                {showWrong && <XCircle className="text-red-500 animate-in zoom-in" size={24} />}
                                {!showAnswerFeedback && isSelected && <div className="w-6 h-6 rounded-full border-4 border-indigo-600" />}
                                {!showAnswerFeedback && !isSelected && <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-300" />}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-10 flex justify-end animate-in fade-in slide-in-from-left-2 items-center h-14">
                    {!showAnswerFeedback ? (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={selectedAnswer === null}
                            className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedAnswer !== null
                                    ? "bg-slate-900 text-white hover:bg-black hover:scale-105 shadow-xl"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            정답 확인 <HelpCircle size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-200 flex items-center gap-2"
                        >
                            {currentQuestionIdx < questions.length - 1 ? "다음 문제" : "결과 보기"}
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
