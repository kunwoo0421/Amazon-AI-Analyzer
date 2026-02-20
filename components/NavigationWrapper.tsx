"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../lib/utils";
import Link from "next/link";
import Image from "next/image";
import TopBanner from "./TopBanner";
import { useData } from "../app/contexts/DataContext";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { showTopBanner, currentUser, isLoadingAuth } = useData();
    const router = useRouter();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Do not show navigation on auth pages
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    // Route Protection
    useEffect(() => {
        if (!isLoadingAuth) {
            if (!currentUser && !isAuthPage) {
                // If not logged in and not on auth page -> redirect to login
                router.push("/login");
            } else if (currentUser && isAuthPage) {
                // If logged in and on auth page -> redirect to home
                router.push("/");
            }
        }
    }, [isLoadingAuth, currentUser, isAuthPage, router]);

    // Show loading spinner while determining auth state
    if (isLoadingAuth) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="animate-spin w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full" />
                    <p className="text-slate-400 font-medium text-sm">인증 정보를 확인 중입니다...</p>
                </div>
            </div>
        );
    }

    // Auth pages shouldn't show the layout
    if (isAuthPage && !currentUser) {
        return <div className="min-h-screen bg-slate-900">{children}</div>;
    }

    // Don't render layout if we are redirecting away from protected route
    if (!currentUser) {
        return null;
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
