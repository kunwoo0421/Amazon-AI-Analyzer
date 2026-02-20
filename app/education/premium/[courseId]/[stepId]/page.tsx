"use client";

import { premiumCurriculum, EducationStep } from '../../../../../data/premium_education';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft, Clock, MonitorPlay } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        courseId: string;
        stepId: string;
    }
}

export default function PremiumStepPage({ params }: PageProps) {
    const { courseId, stepId } = params;

    // Find the course and step data
    const course = premiumCurriculum.find(c => c.id === courseId);
    if (!course) return notFound();

    const step = course.steps.find(s => s.id === stepId);
    if (!step) return notFound();

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Breadcrumb / Back Navigation */}
            <div className="mb-8">
                <Link
                    href="/education/premium"
                    className="inline-flex items-center gap-2 text-pastel-taupe hover:text-primary transition-colors font-medium text-sm"
                >
                    <ArrowLeft size={16} /> 커리큘럼으로 돌아가기
                </Link>
            </div>

            {/* Header Section */}
            <div className="border-b border-pastel-beige pb-8 mb-8 relative">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-xs font-bold uppercase tracking-wider border border-secondary/20">
                        {course.title}
                    </span>
                    <span className="flex items-center gap-1.5 text-pastel-taupe text-sm font-medium">
                        <Clock size={14} /> 10분 소요
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold text-primary mb-4 leading-tight">
                    {step.title}
                </h1>
                <p className="text-xl text-pastel-taupe font-medium mb-6">
                    {step.description}
                </p>

                {/* Visible Start Button in Header */}
                <div className="md:absolute md:right-0 md:bottom-8">
                    <Link
                        href={`/education/premium/${courseId}/${stepId}/quiz`}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-md shadow-primary/20"
                    >
                        <MonitorPlay size={20} />
                        퀴즈 시작하기
                    </Link>
                </div>
            </div>

            {/* Main Content (Markdown) */}
            <div className="bg-white p-10 rounded-3xl border border-pastel-beige shadow-sm">
                <ReactMarkdown
                    components={{
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-primary mb-6 mt-8 pb-2 border-b border-pastel-beige" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-primary mb-4 mt-8" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-primary mb-3 mt-6" {...props} />,
                        p: ({ node, ...props }) => <p className="text-lg text-slate-700 leading-relaxed mb-4" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                    }}
                >
                    {step.content}
                </ReactMarkdown>
            </div>

            {/* Action Bar */}
            <div className="mt-12 flex justify-end">
                <Link
                    href={`/education/premium/${courseId}/${stepId}/quiz`}
                    className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-pastel-black/20"
                >
                    <MonitorPlay size={24} />
                    퀴즈 시작하기
                </Link>
            </div>
        </div>
    );
}
