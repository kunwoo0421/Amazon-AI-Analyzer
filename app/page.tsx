"use client";

import { useEffect, useState } from "react";
import BannerSlider from "@/components/dashboard/BannerSlider";
import QuickAccessGrid from "@/components/dashboard/QuickAccessGrid";
import { ChevronRight } from "lucide-react";

export default function Home() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500 pb-20 space-y-4">
            {/* Banner Slider */}
            <BannerSlider />

            {/* Quick Access Menu Grid */}
            <QuickAccessGrid />

            {/* Bottom Content Area (Like the 'My Bill' section in the uploaded image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Section 1: Subscription / Cost Summary */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            이번 달 예상 마진
                        </h3>
                        <button className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-full transition-colors">
                            확인
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-3xl font-black text-slate-900 tracking-tight">
                            ₩ 4,540,000 <span className="text-lg font-medium text-slate-400">원</span>
                        </p>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            전월 대비 <span className="text-red-500 font-bold">+12%</span> 증가
                        </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">리포트 상세보기</p>
                                <p className="text-xs text-slate-500">카테고리별 수익 분석</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Section 2: Placeholder for 'My Info' or Ads */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                            내 교육 진척도
                        </h3>
                        <ChevronRight size={20} className="text-slate-400" />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* Circular Progress Placeholder */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                                <circle cx="48" cy="48" r="40" stroke="#4f46e5" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-xl font-bold text-indigo-600">75%</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 mb-1">Basic 1 코스 수강 중</p>
                            <p className="text-sm text-slate-500 mb-3">다음 강의: FBA 배송 설정하기</p>
                            <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                                이어듣기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
