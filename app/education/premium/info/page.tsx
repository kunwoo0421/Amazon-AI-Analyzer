"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

export default function InfoPage() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-pastel-beige pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight flex items-center gap-3">
                        <MapPin className="text-secondary" size={40} />
                        학습 정보 (Offline)
                    </h1>
                    <p className="text-pastel-taupe mt-3 text-lg font-medium">
                        오프라인 교육 일정 및 장소 안내
                    </p>
                </div>
            </div>

            <div className="min-h-[400px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-pastel-beige rounded-3xl bg-pastel-cream/30 text-center">
                <MapPin size={64} className="text-pastel-taupe mb-6 opacity-30" />
                <h3 className="text-2xl font-bold text-primary mb-2">오프라인 교육 준비 중입니다.</h3>
                <p className="text-pastel-taupe max-w-md mx-auto">
                    곧 현장에서 만나뵐 수 있도록 준비하겠습니다.
                </p>
            </div>
        </div>
    );
}
