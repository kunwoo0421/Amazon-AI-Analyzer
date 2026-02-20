"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import Link from "next/link";
import Image from "next/image";
import TopBanner from "./TopBanner";
import { useData } from "../app/contexts/DataContext";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { showTopBanner } = useData();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Do not show navigation on auth pages
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) {
        return <div className="min-h-screen bg-slate-900">{children}</div>;
    }

    return (
        <div className={`flex min-h-screen relative overflow-x-hidden ${showTopBanner ? 'pt-10' : 'pt-0'}`}>
            <TopBanner />
            {/* Mobile Header */}
            <header className={`lg:hidden fixed ${showTopBanner ? 'top-10' : 'top-0'} left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center px-4 shadow-sm`}>
                <div className="flex items-center gap-3 z-50">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo_transparent.png"
                                alt="Amazon Seller Pilot Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors whitespace-nowrap">
                            Amazon Seller Pilot
                        </h1>
                    </Link>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    `fixed ${showTopBanner ? 'top-10' : 'top-0'} bottom-0 left-0 z-50 w-72 transform bg-primary border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-auto shadow-xl shadow-black/20`,
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 text-pastel-taupe hover:text-primary transition-colors z-50"
                    >
                        <X size={20} />
                    </button>
                    <Sidebar variant="mobile" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
