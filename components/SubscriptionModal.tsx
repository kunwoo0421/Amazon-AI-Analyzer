"use client";

import { Check, X, CreditCard, ChevronLeft, Calendar, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PlanType = 'basic' | 'pro' | 'premium' | 'partner';
type ViewState = 'plans' | 'payment' | 'success';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan?: PlanType;
}

export function SubscriptionModal({ isOpen, onClose, currentPlan = 'basic' }: SubscriptionModalProps) {
    const [mounted, setMounted] = useState(false);
    const [view, setView] = useState<ViewState>('plans');
    const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setView('plans');
            setSelectedPlan(null);
            setIsProcessing(false);
        }
    }, [isOpen]);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.pointerEvents = 'auto';
        };
    }, [isOpen]);

    if (!mounted) return null;
    if (!isOpen) return null;

    const handleUpgradeClick = (plan: PlanType) => {
        setSelectedPlan(plan);
        setView('payment');
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setView('success');
    };

    const renderPlans = () => (
        <>
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-primary mb-3 tracking-tight">
                    Upgrade Your Plan
                </h2>
                <p className="text-xl text-pastel-taupe">
                    성공적인 아마존 셀링을 위한 최적의 플랜을 선택하세요.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {/* Basic Plan */}
                <div className="bg-white p-6 rounded-2xl border border-pastel-beige shadow-sm flex flex-col relative hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-primary mb-2">Basic Plan</h3>
                    <div className="text-3xl font-extrabold text-slate-900 mb-4">
                        Free
                    </div>
                    <p className="text-sm text-pastel-taupe mb-6 h-10">
                        아마존 입문을 위한 필수 도구
                    </p>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>아마존 학습 (체험판)</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>아마존 커뮤니티 전체 이용</span>
                        </li>
                        <div className="pl-6 space-y-2 text-xs text-slate-500">
                            <li className="flex items-center gap-1"><Check size={12} className="text-green-500" /> 뉴스 / 환율</li>
                            <li className="flex items-center gap-1"><Check size={12} className="text-green-500" /> FAQ / Q&A</li>
                        </div>
                    </ul>

                    <button
                        disabled={true}
                        className={`w-full py-3 rounded-xl font-bold border transition-all ${currentPlan === 'basic'
                            ? "bg-slate-100 text-slate-500 border-slate-200 cursor-default"
                            : "bg-white text-primary border-primary hover:bg-slate-50"
                            }`}
                    >
                        {currentPlan === 'basic' ? "현재 이용중" : "플랜 선택"}
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-white p-6 rounded-2xl border-2 border-secondary shadow-xl flex flex-col relative transform md:-translate-y-4 z-10">
                    <div className="absolute top-0 right-0 bg-secondary text-primary text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-sm">
                        인기 플랜
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">Pro Plan</h3>
                    <div className="text-3xl font-extrabold text-slate-900 mb-1">
                        ₩9,900
                    </div>
                    <div className="text-sm text-slate-400 mb-4 font-medium">/ 월</div>
                    <p className="text-sm text-pastel-taupe mb-6 h-10">
                        학습 전체 커리큘럼 및 분석 도구 제공
                    </p>

                    <ul className="space-y-4 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-slate-800 font-bold">
                            <Check className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>Basic 기능 전체 포함</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-800 font-bold">
                            <Check className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>아마존 학습 전체 커리큘럼</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-800 font-bold">
                            <Check className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>아마존 튜토리얼 이용</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-800 font-bold">
                            <Check className="text-green-500 mt-0.5 shrink-0" size={16} />
                            <span>내 제품 분석하기 (월 3회)</span>
                        </li>
                    </ul>

                    {currentPlan === 'pro' ? (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-100 border border-slate-200 cursor-default">
                            현재 이용중
                        </button>
                    ) : (
                        <button
                            onClick={() => handleUpgradeClick('pro')}
                            className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            업그레이드
                        </button>
                    )}
                </div>

                {/* Premium Plan */}
                <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-lg flex flex-col relative hover:border-purple-200 transition-all">
                    <h3 className="text-xl font-bold text-purple-900 mb-2">Premium Plan</h3>
                    <div className="text-3xl font-extrabold text-slate-900 mb-1">
                        ₩29,900
                    </div>
                    <div className="text-sm text-slate-400 mb-4 font-medium">/ 월</div>
                    <p className="text-sm text-pastel-taupe mb-6 h-10">
                        파워 셀러를 위한 고급 기능
                    </p>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="text-purple-500 mt-0.5 shrink-0" size={16} />
                            <span>고급 분석 도구</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="text-purple-500 mt-0.5 shrink-0" size={16} />
                            <span>제품 분석 무제한</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="text-purple-500 mt-0.5 shrink-0" size={16} />
                            <span>1:1 컨설팅</span>
                        </li>
                    </ul>

                    {currentPlan === 'premium' ? (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-100 border border-slate-200 cursor-default">
                            현재 이용중
                        </button>
                    ) : (
                        <button
                            onClick={() => handleUpgradeClick('premium')}
                            className="w-full py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                        >
                            업그레이드
                        </button>
                    )}
                </div>

                {/* Partner Plan */}
                <div className="bg-gradient-to-b from-indigo-50/50 to-white p-6 rounded-2xl border border-indigo-100 flex flex-col relative hover:border-indigo-200 transition-colors">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">Partner Plan</h3>
                    <div className="text-3xl font-extrabold text-indigo-600 mb-4 py-1">
                        Bonus
                    </div>
                    <p className="text-xs text-indigo-400 mb-6 h-10">
                        위드앨리스 대행 기업 전용 (구독료 무료)
                    </p>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-2 text-sm text-indigo-900 font-bold">
                            <Check className="text-indigo-600 mt-0.5 shrink-0" size={16} />
                            <span>Pro 기능 전체 포함</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-indigo-900 font-bold">
                            <Check className="text-indigo-600 mt-0.5 shrink-0" size={16} />
                            <span>셀러센트럴 연동 현황 보기</span>
                        </li>
                        <li className="flex items-center gap-1 pl-6 text-xs text-indigo-700 italic">
                            + 데이터 분석 리포트 제공
                        </li>
                    </ul>

                    {currentPlan === 'partner' ? (
                        <button disabled className="w-full py-3 rounded-xl font-bold text-indigo-400 bg-indigo-50 border border-indigo-100 cursor-default">
                            현재 이용중
                        </button>
                    ) : (
                        <button
                            onClick={() => handleUpgradeClick('partner')}
                            className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                        >
                            업그레이드
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    const getPlanDetails = (plan: PlanType | null) => {
        switch (plan) {
            case 'pro': return { name: 'Pro Plan', price: '₩9,900' };
            case 'premium': return { name: 'Premium Plan', price: '₩29,900' };
            case 'partner': return { name: 'Partner Plan', price: 'Bonus' };
            default: return { name: 'Basic Plan', price: 'Free' };
        }
    };

    const renderPayment = () => {
        const planDetails = getPlanDetails(selectedPlan);

        return (
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => setView('plans')}
                    className="flex items-center gap-2 text-pastel-taupe hover:text-primary transition-colors mb-6 font-medium"
                >
                    <ChevronLeft size={20} /> 멤버십 선택으로 돌아가기
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-primary mb-2">구독 결제</h2>
                    <p className="text-pastel-taupe">안전한 결제 정보를 입력해주세요.</p>
                </div>

                <div className="bg-white rounded-2xl border border-pastel-beige p-8 shadow-sm mb-8">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-100 mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-primary">{planDetails.name} 멤버십</h3>
                            <p className="text-sm text-pastel-taupe mt-1">월 정기 구독</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-extrabold text-primary">{planDetails.price}</div>
                            {planDetails.price !== 'Bonus' && (
                                <div className="text-xs text-pastel-taupe">/ 월 (VAT 포함)</div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary block">카드 번호</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    required
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary block">유효기간</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="MM / YY"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-primary block">CVC</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="123"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-primary block">카드 소유주 이름</label>
                            <input
                                required
                                type="text"
                                placeholder="HONG GIL DONG"
                                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full py-4 mt-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    결제 처리중...
                                </>
                            ) : (
                                `${planDetails.price} 결제하기`
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            * 결제 정보는 안전하게 암호화되어 처리됩니다.
                        </p>
                    </form>
                </div>
            </div>
        );
    };

    const renderSuccess = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <Check size={48} />
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-4">결제가 완료되었습니다!</h2>
            <p className="text-xl text-pastel-taupe mb-10">
                이제 {getPlanDetails(selectedPlan).name}의 모든 혜택을 이용하실 수 있습니다.
            </p>
            <button
                onClick={onClose}
                className="px-12 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg"
            >
                학습 시작하기
            </button>
        </div>
    );

    // Portal to prevent z-index issues
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl bg-slate-50 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 custom-scrollbar border border-white/20">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-pastel-taupe hover:text-primary transition-colors hover:bg-slate-100 z-10 shadow-sm"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    {view === 'plans' && renderPlans()}
                    {view === 'payment' && renderPayment()}
                    {view === 'success' && renderSuccess()}
                </div>
            </div>
        </div>,
        document.body
    );
}
