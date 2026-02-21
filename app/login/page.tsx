"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (!keepMeLoggedIn) {
                sessionStorage.setItem('sessionOnly', 'true');
            } else {
                sessionStorage.removeItem('sessionOnly');
            }

            window.location.href = "/";
        } catch (error: any) {
            console.error("Auth error:", error);
            setErrorMsg(error.message || "이메일이나 비밀번호가 일치하지 않습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
            {/* 1. 웹페이지형 영역 (데스크탑에서만 보이는 좌측 홍보영역) */}
            <div className="hidden md:flex flex-1 flex-col justify-between p-12 lg:p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
                        Amazon Seller Pilot
                    </h1>
                    <p className="text-xl text-slate-300 font-medium max-w-md">
                        데이터 기반의 아마존 입점 심사 및 마진 최적화, 모든 프로세스를 한 곳에서 관리하세요.
                    </p>
                </div>

                <div className="relative z-10 space-y-8 mt-12">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md">
                            <ShieldCheck className="text-indigo-300" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">AI 기반 자동 서류 검토</h3>
                            <p className="text-slate-400 mt-1">SIV 심사 및 브랜드 레지스트리 성공률을 극대화합니다.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-md">
                            <CheckCircle2 className="text-emerald-300" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">실시간 수익 및 재고 트래킹</h3>
                            <p className="text-slate-400 mt-1">글로벌 마켓플레이스의 인사이트를 한눈에 파악하세요.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-auto pt-16 font-medium text-slate-500 text-sm">
                    © {new Date().getFullYear()} Withalice Team.
                </div>
            </div>

            {/* 2. 어플형 영역 (모바일에선 전체화면, 데스크탑에선 우측 패널) */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative bg-white md:max-w-md lg:max-w-xl w-full">
                <div className="w-full max-w-sm space-y-8">
                    {/* 모바일 전용 로고 영역 */}
                    <div className="md:hidden text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Seller Pilot</h1>
                        <p className="text-slate-500 mt-2">환영합니다. 계정에 로그인해주세요.</p>
                    </div>

                    <div className="text-center md:text-left mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                            환영합니다 👋
                        </h2>
                        <p className="text-slate-500 mt-2">
                            계정 정보를 입력하고 대시보드에 접속하세요.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="이메일 주소"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-slate-900"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={20} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="비밀번호"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-slate-900"
                            />
                        </div>

                        {errorMsg && (
                            <div className="text-red-500 font-bold text-sm text-center bg-red-50 py-2 rounded-lg">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm font-bold pb-2">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={keepMeLoggedIn}
                                    onChange={(e) => setKeepMeLoggedIn(e.target.checked)}
                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                />
                                <span>자동 로그인 유지</span>
                            </label>
                            <button type="button" className="text-indigo-600 hover:text-indigo-800">
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-lg transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>
                                    로그인
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-slate-100">
                        <p className="text-slate-500 font-medium pb-2">
                            계정이 없으신가요?
                        </p>
                        <Link
                            href="/signup"
                            className="inline-block w-full py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-indigo-500 hover:text-indigo-600 transition-all"
                        >
                            회원가입하기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
