"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const banners = [
    {
        id: 1,
        title: "아마존 어플 구독하기",
        description: "복잡한 아마존 비즈니스, 위드앨리스 앱으로 시작하세요.\n언제 어디서나 스마트하게 관리할 수 있습니다.",
        bgImage: "from-blue-600 to-indigo-900",
        buttons: [
            { text: "구독 시작하기", href: "/subscription", primary: true }
        ]
    },
    {
        id: 2,
        title: "신규 기능 업데이트\nAI 상품 분석 리포트",
        description: "빅데이터 기반의 정밀 분석으로\n매출 상승의 기회를 잡으세요.",
        bgImage: "from-teal-500 to-emerald-600",
        buttons: [
            { text: "자세히보기", href: "/analysis", primary: true }
        ]
    },
    {
        id: 3,
        title: "2026 아마존\n셀러 전략 세미나",
        description: "성공적인 아마존 진출을 위한 필수코스",
        bgImage: "from-orange-500 to-red-500",
        tag: "HOT",
        buttons: [
            { text: "신청하러 가기", href: "/seminar", primary: true }
        ]
    }
];

export default function BannerSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentSlide((prevIndex) =>
                    prevIndex === banners.length - 1 ? 0 : prevIndex + 1
                ),
            3000 // Changed to 3 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentSlide]);

    return (
        <div className="relative w-full overflow-hidden rounded-3xl h-72 md:h-80 shadow-xl shadow-slate-200/50 group">
            <div
                className="whitespace-nowrap transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(${-currentSlide * 100}%)` }}
            >
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`inline-block w-full h-full relative bg-gradient-to-br ${banner.bgImage} p-8 md:p-12 whitespace-normal align-top`}
                    >
                        <div className="relative z-10 flex flex-col h-full justify-center max-w-2xl">
                            <div>
                                {banner.tag && (
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-4 border border-white/20">
                                        {banner.tag}
                                    </span>
                                )}
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 drop-shadow-sm">
                                    {banner.title.split('\n').map((line, i) => (
                                        <span key={i} className="block">{line}</span>
                                    ))}
                                </h2>
                                <p className="text-white/90 font-medium text-base md:text-lg leading-relaxed mb-8">
                                    {banner.description.split('\n').map((line, i) => (
                                        <span key={i} className="block">{line}</span>
                                    ))}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {banner.buttons.map((btn, idx) => (
                                    <Link
                                        key={idx}
                                        href={btn.href}
                                        className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-black/10 ${btn.primary
                                            ? "bg-white text-slate-900 hover:bg-slate-50"
                                            : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border border-white/20"
                                            }`}
                                    >
                                        {btn.text}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="absolute bottom-0 right-32 w-40 h-40 bg-black/10 rounded-full blur-xl pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-white w-8" : "bg-white/40 hover:bg-white/60 w-2"
                            }`}
                        onClick={() => setCurrentSlide(idx)}
                    ></button>
                ))}
            </div>
        </div>
    );
}
