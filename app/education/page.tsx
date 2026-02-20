"use client";

import { educationLevels } from "../../data/education_data";
import { BookOpen, CheckCircle, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Education() {
    // In a real app, this would be fetched from a database or local storage
    const [userProgress, setUserProgress] = useState<number>(1);

    useEffect(() => {
        const savedProgress = localStorage.getItem("educationLevel");
        if (savedProgress) {
            setUserProgress(parseInt(savedProgress));
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 p-6">
            <div>
                <h1 className="text-3xl font-bold text-primary">Education Center</h1>
                <p className="text-pastel-taupe mt-2">아마존 셀링 마스터를 위한 5단계 커리큘럼</p>
            </div>

            <div className="space-y-4">
                {educationLevels.map((level) => {
                    const isLocked = level.id > userProgress;
                    const isCompleted = level.id < userProgress;
                    const isCurrent = level.id === userProgress;

                    return (
                        <div
                            key={level.id}
                            className={`relative group rounded-xl p-6 border transition-all duration-300 ${isLocked
                                ? 'bg-pastel-cream border-pastel-beige opacity-75'
                                : 'bg-white border-pastel-beige shadow-sm hover:shadow-md hover:border-accent'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isCompleted ? 'bg-pastel-olive/20 text-pastel-olive' :
                                        isCurrent ? 'bg-secondary/20 text-secondary' :
                                            'bg-pastel-cream text-pastel-taupe'
                                        }`}>
                                        {isCompleted ? <CheckCircle size={24} /> : level.id}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{level.title}</h3>
                                        <p className="text-pastel-taupe mt-1">{level.description}</p>

                                        <div className="flex items-center gap-4 mt-3">
                                            {!isLocked ? (
                                                <Link
                                                    href={`/education/${level.id}`}
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-accent px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                                                >
                                                    학습 시작하기 <ArrowRight size={16} />
                                                </Link>
                                            ) : (
                                                <span className="flex items-center gap-2 text-sm text-pastel-taupe bg-pastel-cream px-4 py-2 rounded-lg border border-pastel-beige">
                                                    <Lock size={16} /> 이전 단계 완료 필요
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
