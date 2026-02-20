"use client";

import { mockNews } from '../../../data/community_data';
import { ExternalLink, Calendar, Newspaper, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function AmazonNewsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-pastel-beige">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Amazon News & Updates</h1>
                    <p className="text-pastel-taupe">아마존 최신 뉴스, 구글 업데이트, 공식 발표 (자동 번역)</p>
                </div>
            </div>

            <div className="space-y-6">
                {mockNews.map((news) => (
                    <div
                        key={news.id}
                        className="group bg-white p-6 rounded-2xl shadow-sm border border-pastel-beige hover:border-primary/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="text-primary" />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className={cn(
                                "text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                                news.category === 'Official Announcement' ? "bg-pastel-olive/20 text-pastel-olive" :
                                    news.category === 'Google Update' ? "bg-blue-100 text-blue-600" :
                                        "bg-amber-100 text-amber-700"
                            )}>
                                {news.category}
                            </span>
                            <span className="text-xs text-pastel-taupe flex items-center gap-1">
                                <Calendar size={12} /> {news.date}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-primary mb-3 group-hover:text-blue-600 transition-colors">
                            {news.title}
                        </h2>

                        <p className="text-slate-600 leading-relaxed mb-4">
                            {news.summary}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-bold text-pastel-taupe">
                            <Newspaper size={14} />
                            Source: {news.source}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <button className="px-6 py-3 border border-pastel-beige rounded-xl text-primary font-bold hover:bg-white hover:shadow-sm transition-all">
                    Load More News
                </button>
            </div>
        </div>
    );
}
