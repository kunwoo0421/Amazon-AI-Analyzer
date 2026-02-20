"use client";

import { useState } from "react";
import { Check, CreditCard, AlertTriangle, Calendar, Settings, ChevronRight } from "lucide-react";
import { useData } from "../contexts/DataContext";

export default function SubscriptionPage() {
    const { currentUser } = useData();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Mock Data
    const currentPlan = "pro" as "basic" | "pro" | "premium" | "partner"; // Default to pro for demo
    const nextBillingDate = "2026. 02. 21";
    const cardInfo = {
        brand: "MasterCard",
        last4: "8821",
        expiry: "12/28"
    };

    const handleUpdatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        alert("결제 정보가 업데이트되었습니다.");
        setIsPaymentModalOpen(false);
    };

    const handleDeleteAccount = () => {
        if (confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            alert("회원 탈퇴 처리가 완료되었습니다.");
        }
    };

    const PlanCard = ({ title, price, description, features, type, isCurrent }: any) => (
        <div className={`p-6 rounded-2xl border flex flex-col relative transition-all ${isCurrent
            ? "bg-slate-50 border-slate-200"
            : "bg-white border-pastel-beige hover:shadow-lg"
            } ${type === 'partner' ? 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-100' : ''} ${type === 'premium' ? 'border-purple-100' : ''}`}>

            {type === 'pro' && !isCurrent && (
                <div className="absolute top-0 right-0 bg-secondary text-primary text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-sm">
                    인기
                </div>
            )}

            <h3 className={`text-xl font-bold mb-2 ${type === 'partner' ? 'text-indigo-900' : type === 'premium' ? 'text-purple-900' : 'text-primary'}`}>{title}</h3>
            <div className={`text-3xl font-extrabold mb-4 ${type === 'partner' ? 'text-indigo-600' : 'text-slate-900'}`}>
                {price}
            </div>
            <p className={`text-sm mb-6 h-10 ${type === 'partner' ? 'text-indigo-400' : 'text-pastel-taupe'}`}>
                {description}
            </p>

            <ul className="space-y-3 mb-8 flex-grow">
                {features.map((feature: string, idx: number) => (
                    <li key={idx} className={`flex items-start gap-2 text-sm ${type === 'partner' ? 'text-indigo-900' : 'text-slate-700'}`}>
                        <Check className={`${type === 'partner' ? 'text-indigo-600' : type === 'premium' ? 'text-purple-500' : 'text-green-500'} mt-0.5 shrink-0`} size={16} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl font-bold border transition-all ${isCurrent
                    ? "bg-slate-200 text-slate-500 border-slate-200 cursor-default"
                    : type === 'partner'
                        ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                        : type === 'premium'
                            ? "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                    }`}
            >
                {isCurrent ? "현재 이용중" : "플랜 변경"}
            </button>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-primary mb-8">구독 관리</h1>

            {/* Top Section: Current Plan & Payment Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Current Plan Info */}
                <div className="bg-white p-8 rounded-3xl border border-pastel-beige shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-pastel-cream rounded-xl text-primary">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-primary">현재 구독 플랜</h2>
                            <p className="text-sm text-pastel-taupe">Pro Plan 멤버십 이용중</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end pb-4 border-b border-gray-100">
                            <span className="text-slate-500 font-medium">이용 금액</span>
                            <span className="text-2xl font-extrabold text-primary">₩9,900 <span className="text-sm font-normal text-slate-400">/ 월</span></span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">실제 결제 금액</span>
                            <span className="text-lg font-bold text-primary">₩9,900</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">다음 결제일</span>
                            <span className="text-primary font-bold">{nextBillingDate}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method Info */}
                <div className="bg-white p-8 rounded-3xl border border-pastel-beige shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-primary">결제 수단</h2>
                            <p className="text-sm text-pastel-taupe">등록된 카드로 자동 결제됩니다.</p>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-center mb-6">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">CARD</div>
                            <div>
                                <p className="font-bold text-primary">{cardInfo.brand} **** {cardInfo.last4}</p>
                                <p className="text-xs text-slate-400">만료일: {cardInfo.expiry}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="w-full py-3 border border-pastel-beige rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Settings size={18} /> 결제 수단 변경하기
                    </button>
                </div>
            </div>

            {/* Bottom Section: All Plans */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-primary mb-6">플랜 변경</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    <PlanCard
                        type="basic"
                        title="Basic Plan"
                        price="Free"
                        description="아마존 입문을 위한 필수 도구"
                        features={["아마존 학습 (체험판)", "아마존 커뮤니티 전체 이용", "뉴스 / 환율 정보"]}
                        isCurrent={currentPlan === 'basic'}
                    />
                    <PlanCard
                        type="pro"
                        title="Pro Plan"
                        price="₩9,900"
                        description="학습 전체 커리큘럼 및 분석 도구 제공"
                        features={["Basic 기능 전체 포함", "아마존 학습 전체 커리큘럼", "아마존 튜토리얼 이용", "내 제품 분석하기 (월 3회)"]}
                        isCurrent={currentPlan === 'pro'}
                    />
                    <PlanCard
                        type="premium"
                        title="Premium Plan"
                        price="₩29,900"
                        description="파워 셀러를 위한 고급 기능"
                        features={["고급 분석 도구", "제품 분석 무제한", "1:1 컨설팅"]}
                        isCurrent={currentPlan === 'premium'}
                    />
                    <PlanCard
                        type="partner"
                        title="Partner Plan"
                        price="Bonus"
                        description="위드앨리스 대행 기업 전용 (구독료 무료)"
                        features={["Pro 기능 전체 포함", "셀러센트럴 연동 현황", "데이터 분석 리포트 제공"]}
                        isCurrent={currentPlan === 'partner'}
                    />
                </div>
            </div>

            {/* Footer: Delete Account */}
            <div className="border-t border-pastel-beige pt-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-700">회원 탈퇴</h3>
                        <p className="text-sm text-slate-400">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-2.5 bg-white border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        <AlertTriangle size={18} /> 회원 탈퇴
                    </button>
                </div>
            </div>

            {/* Payment Update Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
                        <h2 className="text-xl font-bold text-primary mb-6">결제 수단 변경</h2>
                        <form onSubmit={handleUpdatePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-primary mb-2">카드 번호</label>
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 bg-slate-50 border rounded-xl" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-primary mb-2">유효기간</label>
                                    <input type="text" placeholder="MM/YY" className="w-full p-3 bg-slate-50 border rounded-xl" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-primary mb-2">CVC</label>
                                    <input type="text" placeholder="123" className="w-full p-3 bg-slate-50 border rounded-xl" required />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold">
                                변경사항 저장
                            </button>
                            <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="w-full py-3 text-slate-400 hover:text-primary">
                                취소
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
