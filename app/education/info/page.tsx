"use client";

import { useState } from "react";
import { Search, PenTool, Calendar, User, Newspaper, ChevronRight } from "lucide-react";
import { useData } from "../../contexts/DataContext";

// Mock Data (Initial Posts are now in DataContext, but we can filter by category="info")

export default function EducationInfoPage() {
    const { posts } = useData();
    // Filter only Info posts
    const infoPosts = posts.filter(p => p.category === 'info');

    // Mock Session for Admin features
    const session = {
        user: {
            name: "Admin User",
            email: "admin@withalice.team" // Admin domain
        }
    };

    const isAdmin = session?.user?.email?.endsWith("@withalice.team");

    const [searchQuery, setSearchQuery] = useState("");

    // Filter Posts by Search
    const filteredPosts = infoPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                        아마존 관련정보
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        아마존 셀링에 필요한 최신 뉴스, 정책 업데이트, 그리고 꿀팁들을 확인하세요.
                    </p>
                </div>

                {/* Admin Write Button (Hidden, since creating is done in /admin page now) */}
                {/* 
                {isAdmin && (
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                        <PenTool size={18} /> 새 글 작성
                    </button>
                )} 
                */}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mb-12 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="정보 검색 (제목, 내용)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all text-lg"
                />
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                        >
                            {/* Card Header Color Stripe */}
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                            <div className="p-7 flex flex-col flex-grow">
                                {/* Category & Date */}
                                <div className="flex items-center justify-between mb-4 text-xs font-semibold tracking-wide uppercase">
                                    <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                        INFO
                                    </span>
                                    <span className="text-slate-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {post.date}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                {/* Excerpt (Using Content as excerpt for now) */}
                                <p className="text-slate-600 mb-6 flex-grow leading-relaxed line-clamp-3">
                                    {post.content}
                                </p>

                                {/* Footer (Author & Read More) */}
                                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <User size={14} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{post.author}</span>
                                    </div>
                                    <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        더 보기 <ChevronRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Newspaper size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">검색 결과가 없습니다</h3>
                        <p className="text-slate-500">다른 검색어로 찾아보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
