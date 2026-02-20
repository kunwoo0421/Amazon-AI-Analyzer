"use client";

import { mockExchangeRates } from '../../../data/community_data';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export default function ExchangeRatePage() {
    // In real app, allow refresh every X minutes or fetch live
    const currentDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Real-time Exchange Rates</h1>
                    <p className="text-pastel-taupe">주요 국가 실시간 환율 정보 (Google Finance 기준)</p>
                </div>
                <div className="text-right">
                    <span className="text-sm text-pastel-taupe block mb-1">기준: {currentDate}</span>
                    <button className="flex items-center gap-2 text-primary font-bold hover:bg-white/50 px-3 py-1 rounded-lg transition-colors">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockExchangeRates.map((rate) => (
                    <div key={rate.currency} className="bg-white p-6 rounded-2xl shadow-sm border border-pastel-beige hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{rate.flag}</span>
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{rate.country}</h3>
                                    <span className="text-sm text-pastel-taupe">{rate.currency}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-extrabold text-primary">
                                    {rate.rate.toLocaleString('ko-KR')} <span className="text-sm font-normal text-pastel-taupe">KRW</span>
                                </p>
                                <p className={`flex items-center justify-end text-sm font-bold ${rate.change > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                    {rate.change > 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                                    {Math.abs(rate.change)}%
                                </p>
                            </div>
                        </div>
                        {/* Simple Chart Visualization Mock */}
                        <div className="h-16 bg-slate-50 rounded-lg flex items-end justify-between px-2 pb-2 gap-1 overflow-hidden opacity-50">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-full rounded-t-sm ${rate.change > 0 ? 'bg-red-200' : 'bg-blue-200'}`}
                                    style={{ height: `${Math.random() * 80 + 20}%` }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-8 text-center text-xs text-pastel-taupe">
                * 위 환율 정보는 모의 데이터이며, 실제 거래 시 은행 고시 환율과 다를 수 있습니다.
            </p>
        </div>
    );
}
