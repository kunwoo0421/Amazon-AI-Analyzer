"use client";

import Link from "next/link";
import {
    Book,
    FileText,
    PlayCircle,
    MessageCircle,
    Calculator,
    Globe,
    Settings,
    HelpCircle,
    TrendingUp,
    Store
} from "lucide-react";

export default function QuickAccessGrid() {
    const menus = [
        {
            name: "아마존/용어사전",
            icon: <Book size={24} className="text-white" />,
            color: "bg-blue-500", // blue
            href: "/education/premium/dictionary"
        },
        {
            name: "제품분석/리포트",
            icon: <FileText size={24} className="text-white" />,
            color: "bg-indigo-500", // indigo
            href: "/analysis"
        },
        {
            name: "튜토리얼/강의",
            icon: <PlayCircle size={24} className="text-white" />,
            color: "bg-rose-500", // pink/red
            href: "/education/premium",
            badge: "NEW"
        },
        {
            name: "아마존/뉴스",
            icon: <Globe size={24} className="text-white" />,
            color: "bg-teal-500", // teal
            href: "/community/news"
        },
        {
            name: "셀러/커뮤니티",
            icon: <MessageCircle size={24} className="text-white" />,
            color: "bg-amber-400", // yellow
            href: "/community/qna"
        },
        {
            name: "환율/계산기",
            icon: <Calculator size={24} className="text-white" />,
            color: "bg-emerald-500", // green
            href: "/community/exchange-rate"
        },
        {
            name: "마켓/플레이스",
            icon: <Store size={24} className="text-white" />,
            color: "bg-violet-500", // violet
            href: "#"
        },
        {
            name: "고객센터/FAQ",
            icon: <HelpCircle size={24} className="text-white" />,
            color: "bg-slate-400", // gray
            href: "/community/faq"
        },

    ];

    return (
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4 py-8">
            {menus.map((menu, index) => (
                <Link
                    href={menu.href}
                    key={index}
                    className="flex flex-col items-center gap-3 group"
                >
                    <div className="relative">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[22px] ${menu.color} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300 ease-spring`}>
                            {menu.icon}
                        </div>
                        {menu.badge && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                {menu.badge}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        {menu.name.split("/").map((line, i) => (
                            <span key={i} className="text-sm font-medium text-slate-600 group-hover:text-slate-900 text-center leading-tight">
                                {line}
                            </span>
                        ))}
                    </div>
                </Link>
            ))}
        </div>
    );
}
