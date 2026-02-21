"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    MessageCircle,
    Search,
    Briefcase,
    Package,
    Settings,
    ChevronDown,
    ChevronRight,
    Users,
    Globe,
    HelpCircle,
    Video,
    Book,
    Menu,
    User,
    CreditCard,
    LogOut,
    FileText
} from "lucide-react";
import Image from "next/image";
import { useData, UserRole } from "../app/contexts/DataContext";
import { supabase } from "@/lib/supabase";

// Navigation Structure based on Excellence Table
const NAVIGATION_CONFIG = [
    {
        category: "기본 가입자용 (User 1+)",
        items: [
            {
                name: "아마존 학습센터",
                path: "/education/premium",
                icon: BookOpen,
                minRole: "USER_1" as UserRole,
                children: [
                    { name: "전체 커리큘럼", path: "/education/premium", minRole: "USER_1" as UserRole },
                    { name: "아마존 용어사전", path: "/education/premium/dictionary", minRole: "USER_1" as UserRole },
                    { name: "아마존 튜토리얼 (Trial)", path: "/education/premium", minRole: "USER_1" as UserRole, maxRole: "USER_1" as UserRole },
                    { name: "아마존 튜토리얼 (영상)", path: "/education/premium/tutorial", minRole: "USER_2" as UserRole },
                    { name: "학습 정보 (Offline)", path: "/education/premium/info", minRole: "USER_2" as UserRole }
                ]
            },
            {
                name: "아마존 커뮤니티",
                path: "/community",
                icon: MessageCircle,
                minRole: "USER_1" as UserRole,
                children: [
                    { name: "아마존 서비스업체 소개", path: "/community/services" },
                    { name: "환율 정보", path: "/community/exchange-rate" },
                    { name: "아마존 정보 (News)", path: "/community/news" },
                    { name: "ACS (Anyone Can Share)", path: "/community/acs" },
                    { name: "FAQ", path: "/community/faq" },
                    { name: "Q&A", path: "/community/qna" }
                ]
            }
        ]
    },
    {
        category: "AI 분석 도구 (Analyzer)",
        items: [
            {
                name: "AI 제품 분석기",
                path: "/analysis",
                icon: Search,
                minRole: "USER_1" as UserRole,
                children: [
                    { name: "통합 분석 (미국 시장)", path: "/analysis" },
                    { name: "일본 시장 분석 (예정)", path: "/analysis/jp" },
                    { name: "글로벌 분석 (예정)", path: "/analysis/global" }
                ]
            },
            {
                name: "입점 서류 검토",
                path: "/onboarding",
                icon: FileText,
                minRole: "USER_1" as UserRole
            }
        ]
    },
    {
        category: "서비스 대행 고객 (User 3 Only)",
        items: [
            {
                name: "내 브랜드 관리하기",
                path: "/brand",
                icon: Briefcase,
                minRole: "USER_3" as UserRole,
                children: [
                    { name: "위드앨리스 업무현황", path: "/brand/work-status" },
                    { name: "재고 현황", path: "/brand/inventory" }
                ]
            }
        ]
    },
    {
        category: "관리자 전용 (Admin)",
        items: [
            {
                name: "브랜드 관리 (Admin)",
                path: "/admin/brand",
                icon: Settings,
                minRole: "ADMIN_1" as UserRole,
                children: [
                    { name: "재고현황 업데이트", path: "/admin/brand/inventory-update" },
                    { name: "Daily 업무현황 업데이트", path: "/admin/brand/work-update" },
                    { name: "선적 관리", path: "/admin/brand/shipment" }
                ]
            },
            {
                name: "사이트 관리",
                path: "/admin",
                icon: Users,
                minRole: "ADMIN_1" as UserRole
            }
        ]
    }
];

import { GraduationCap } from "lucide-react"; // Additional Icon

interface SidebarProps {
    variant?: 'default' | 'mobile'; // mobile = dark transparent
}

export default function Sidebar({ variant = 'default' }: SidebarProps) {
    const pathname = usePathname();
    const { currentUser, switchUser, checkPermission } = useData();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isMobile = variant === 'mobile';

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsMenuOpen(false);
        localStorage.removeItem('mock_admin');
        await supabase.auth.signOut();
        sessionStorage.removeItem('sessionOnly');
        window.location.href = '/login';
    };

    // Theme Classes based on variant - Updated to Dark Theme (#27273f)
    const theme = {
        container: "bg-primary text-white border-r border-slate-800",
        border: "border-slate-700",
        textDefault: "text-slate-400",
        textActive: "text-white font-bold",
        textHover: "hover:text-white hover:bg-white/10",
        bgActive: "bg-white/10 text-white",
        bgHover: "hover:bg-slate-800/50",
        iconActive: "text-secondary",
        iconInactive: "text-slate-500 group-hover:text-white",
        logoBg: "bg-transparent",
        logoText: "text-white",
        categoryText: "text-slate-500",
        subItemBorder: "border-slate-700",
        footerBg: "bg-slate-900/50",
    };

    const toggleExpand = (name: string) => {
        setExpandedItems(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    return (
        <div className={`w-full h-full flex flex-col font-sans ${theme.container}`}>
            {/* Logo Section & User Menu */}
            <div className={`p-8 pb-4 relative flex justify-between items-center`}>
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative p-2">
                        <h1 className={`text-lg font-extrabold ${theme.logoText} tracking-tight group-hover:text-secondary transition-colors whitespace-nowrap`}>
                            Amazon Seller Pilot
                        </h1>
                    </div>
                </Link>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${theme.bgHover} ${theme.textDefault} hover:${theme.textActive}`}
                    >
                        <Menu size={20} />
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-pastel-beige overflow-hidden z-50 py-2"
                            >
                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                    <p className="text-xs font-bold text-pastel-taupe">Account</p>
                                    <p className="text-sm font-bold text-primary truncate">{currentUser?.email || 'user@example.com'}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={16} /> 프로필
                                </Link>
                                <Link
                                    href="/subscription"
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <CreditCard size={16} /> 구독 정보
                                </Link>
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                                >
                                    <LogOut size={16} /> 로그아웃
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 scrollbar-hide">
                {NAVIGATION_CONFIG.map((section, idx) => {
                    const visibleItems = section.items.filter(item => checkPermission(item.minRole));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={idx}>
                            <h3 className={`px-4 text-[11px] font-extrabold uppercase tracking-wider mb-3 ${theme.categoryText}`}>
                                {section.category}
                            </h3>
                            <ul className="space-y-1">
                                {visibleItems.map((item) => {
                                    const isActive = pathname.startsWith(item.path);
                                    const isExpanded = expandedItems.includes(item.name);
                                    const hasChildren = item.children && item.children.length > 0;

                                    return (
                                        <li key={item.name}>
                                            {hasChildren ? (
                                                <button
                                                    onClick={() => toggleExpand(item.name)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                        ? theme.bgActive
                                                        : `${theme.textDefault} ${theme.bgHover} ${theme.textHover}`
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={20} className={isActive ? theme.iconActive : theme.iconInactive} />
                                                        <span className={`font-bold text-sm tracking-tight ${isActive && !isMobile ? "text-white" : ""}`}>{item.name}</span>
                                                    </div>
                                                    <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ${isActive ? "text-white/70" : "opacity-50"}`} />
                                                </button>
                                            ) : (
                                                <Link
                                                    href={item.path}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                        ? theme.bgActive
                                                        : `${theme.textDefault} ${theme.bgHover} ${theme.textHover}`
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={20} className={isActive ? theme.iconActive : theme.iconInactive} />
                                                        <span className={`font-bold text-sm tracking-tight ${isActive && !isMobile ? "text-white" : ""}`}>{item.name}</span>
                                                    </div>
                                                </Link>
                                            )}

                                            {/* Submenu */}
                                            <AnimatePresence>
                                                {hasChildren && isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <ul className={`mt-1 ml-4 pl-4 border-l-2 space-y-1 py-1 ${theme.subItemBorder}`}>
                                                            {item.children
                                                                ?.filter((child: any) => (!child.minRole || checkPermission(child.minRole)) && (!child.maxRole || currentUser?.role === child.maxRole))
                                                                .map((child) => (
                                                                    <li key={child.name}>
                                                                        <Link
                                                                            href={child.path}
                                                                            className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pathname === child.path
                                                                                ? `${theme.textActive} ${isMobile ? 'bg-white/10' : 'bg-white/50'}`
                                                                                : `${theme.textDefault} ${theme.textHover} ${theme.bgHover}`
                                                                                }`}
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                        </ul>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </nav>
            {/* Role Switcher (Demo Only) */}
            <div className={`p-4 border-t ${theme.border} ${theme.footerBg}`}>
                <p className={`text-[10px] font-bold uppercase mb-2 tracking-wider ${theme.textDefault}`}>Debug: Switch Role</p>
                <div className="grid grid-cols-5 gap-1">
                    {['USER_1', 'USER_2', 'USER_3', 'ADMIN_1'].map((role) => (
                        <button
                            key={role}
                            onClick={() => switchUser(role as UserRole)}
                            className={`text-[9px] font-bold py-1.5 rounded border transition-all ${currentUser?.role === role
                                ? "bg-primary text-white border-primary"
                                : `bg-transparent ${theme.textDefault} ${theme.border} hover:border-slate-500`
                                }`}
                        >
                            {role.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div className="mt-3 mb-1">
                    <Link href="/test" className="block w-full text-center py-1.5 text-[10px] font-bold text-white bg-primary rounded hover:bg-primary/90 transition-colors">
                        Go to Test Center
                    </Link>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${isMobile ? "bg-slate-700 text-white border-slate-600" : "bg-pastel-yellow/30 text-primary border-pastel-yellow/50"}`}>
                        {currentUser?.nickname?.substring(0, 1) || 'U'}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xs font-bold ${theme.textActive}`}>{currentUser?.nickname}</span>
                        <span className={`text-[10px] ${theme.textDefault}`}>{currentUser?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
