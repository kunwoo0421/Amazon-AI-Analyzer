"use client";

import { educationLevels } from "../../../data/education_data";
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle2, AlertCircle, Lightbulb, Info, FileText, Download } from "lucide-react";
import Link from "next/link";

export default function LevelPage({ params }: { params: { levelId: string } }) {
    const levelId = parseInt(params.levelId);
    const levelData = educationLevels.find((l) => l.id === levelId);

    if (!levelData) {
        return <div className="p-10 text-center">Level not found</div>;
    }

    const getHighlightStyle = (type?: string) => {
        switch (type) {
            case 'info':
                return 'bg-blue-50 border-l-4 border-blue-500';
            case 'warning':
                return 'bg-amber-50 border-l-4 border-amber-500';
            case 'success':
                return 'bg-green-50 border-l-4 border-green-500';
            case 'tip':
                return 'bg-purple-50 border-l-4 border-purple-500';
            default:
                return '';
        }
    };

    const getHighlightIcon = (type?: string) => {
        switch (type) {
            case 'info':
                return <Info className="text-blue-600" size={24} />;
            case 'warning':
                return <AlertCircle className="text-amber-600" size={24} />;
            case 'success':
                return <CheckCircle2 className="text-green-600" size={24} />;
            case 'tip':
                return <Lightbulb className="text-purple-600" size={24} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/education" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <div className="text-sm font-medium text-blue-600 mb-1">Level {levelData.id}</div>
                    <h1 className="text-4xl font-bold text-slate-900">{levelData.title}</h1>
                    <p className="text-slate-500 mt-2 text-lg">{levelData.description}</p>
                </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
                {levelData.sections.map((section, idx) => (
                    <div key={idx} className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow ${section.highlight ? getHighlightStyle(section.highlight) : ''}`}>
                        {/* Section Title */}
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                            {section.highlight && getHighlightIcon(section.highlight)}
                            <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                        </div>

                        {/* Section Image */}
                        {section.image && (
                            <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={section.image}
                                    alt={section.title}
                                    className="w-full h-auto"
                                />
                            </div>
                        )}

                        {/* Section Content */}
                        <div className="space-y-4 prose prose-slate max-w-none">
                            {section.content.split('\n').map((paragraph, i) => {
                                // Handle Bullet points
                                if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
                                    return (
                                        <div key={i} className="flex items-start gap-2 mb-2 pl-2">
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                            <span className="text-slate-700 leading-relaxed">
                                                {paragraph.replace(/^[-•]\s*/, '')}
                                            </span>
                                        </div>
                                    );
                                }
                                // Handle Headings (Bold lines)
                                if (paragraph.trim().startsWith('**')) {
                                    return (
                                        <h4 key={i} className="mt-5 mb-2 text-lg font-bold text-slate-900">
                                            {paragraph.replace(/\*\*/g, '')}
                                        </h4>
                                    );
                                }
                                // Normal paragraph
                                if (paragraph.trim() === '') return <br key={i} />;

                                return (
                                    <p key={i} className="mb-2 text-slate-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </div>

                        {/* PDF Download Button */}
                        {section.pdf && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <a
                                    href={section.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group w-full sm:w-auto"
                                >
                                    <div className="bg-red-100 p-2.5 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="font-bold text-slate-900">Download Training Material</span>
                                        <span className="text-xs text-slate-500">PDF Document • Click to view</span>
                                    </div>
                                    <Download size={18} className="ml-auto text-slate-400 group-hover:text-slate-600" />
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Key Takeaways Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="text-amber-600" size={32} />
                    <h3 className="text-2xl font-bold text-amber-900">핵심 요약</h3>
                </div>
                <p className="text-amber-800 leading-relaxed text-lg">
                    위 내용을 충분히 학습하셨다면, 이제 퀴즈를 통해 실력을 점검해보세요.
                    <span className="font-bold"> 80% 이상</span> 정답을 맞춰야 다음 레벨로 진행할 수 있습니다.
                </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4">
                <Link
                    href={`/education/${levelId}/quiz`}
                    className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
                >
                    <BookOpen size={28} />
                    <span>퀴즈 풀고 레벨 통과하기</span>
                    <ChevronRight size={28} />
                </Link>
            </div>
        </div>
    );
}
