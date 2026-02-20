"use client";

import React from 'react';
import { PlayCircle } from 'lucide-react';

export default function TutorialPage() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-pastel-beige pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight flex items-center gap-3">
                        <PlayCircle className="text-secondary" size={40} />
                        아마존 튜토리얼 (영상)
                    </h1>
                    <p className="text-pastel-taupe mt-3 text-lg font-medium">
                        영상으로 배우는 실전 아마존 셀링 가이드
                    </p>
                </div>
            </div>

            {/* Video Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Video Player */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-pastel-beige">
                        <iframe
                            src="https://www.youtube.com/embed/Dwlm51gxEQo"
                            title="YouTube video player"
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="p-2">
                        <h2 className="text-2xl font-bold text-primary">아마존 셀리 가이드 - 기초편</h2>
                        <p className="text-pastel-taupe mt-2">
                            아마존 셀링을 처음 시작하시는 분들을 위한 필수 시청 영상입니다. 재고 관리부터 판매 전략까지 핵심 내용을 다루고 있습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
