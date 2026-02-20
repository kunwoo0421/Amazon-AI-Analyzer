"use client";

import { useState, useRef } from "react";
import { Search, ArrowRight, FileText, Download, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useData } from "../../contexts/DataContext";

export default function AnalysisPage() {
    const { currentUser, checkPermission } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // Access Control
    const hasAccess = checkPermission('USER_2');
    const isUnlimited = checkPermission('USER_3');
    const remainingCount = 3; // Mock value for USER_2


    // Form State
    const [formData, setFormData] = useState({
        productName: "",
        category: "Kitchen", // Default category
        price: "",
        width: "",
        length: "",
        height: "",
        weight: "",
        hsCode: "",
        keywords: ""
    });

    const categories = [
        "Kitchen", "Home", "Beauty", "Grocery", "Health & Personal Care", "Toy", "Automotive", "Electronics", "Computers", "Video Games", "Tools & Home Improvement"
    ];

    const reportRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateFBAFees = (price: number, weightAndDim: { weight: number, width: number, length: number, height: number }) => {
        // Mock FBA Calculation Logic (Simplified 2024 Rates)
        // 1. Referral Fee (15% standard)
        const referralFee = price * 0.15;

        // 2. FBA Fulfillment Fee (Based on mock size/weight)
        // Assume Large Standard for simplicity if not tiny
        let fbaFee = 5.40; // Base rate
        if (weightAndDim.weight > 2) fbaFee += (weightAndDim.weight - 2) * 0.5; // add per pound

        // 3. Storage Fee (Mock)
        const volume = (weightAndDim.width * weightAndDim.length * weightAndDim.height) / 28317; // cu ft
        const storageFee = volume * 0.87; // Jan-Sep rate

        return {
            referralFee: referralFee.toFixed(2),
            fbaFee: fbaFee.toFixed(2),
            storageFee: storageFee.toFixed(2),
            totalFee: (referralFee + fbaFee + storageFee).toFixed(2),
            netMargin: (price - (referralFee + fbaFee + storageFee)).toFixed(2)
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasAccess) {
            alert("This feature requires a subscription (User 2+).");
            return;
        }

        setIsLoading(true);

        // Local Fee Calculation
        const priceNum = parseFloat(formData.price) || 0;
        const fees = calculateFBAFees(priceNum, {
            weight: parseFloat(formData.weight) || 1,
            width: parseFloat(formData.width) || 10,
            length: parseFloat(formData.length) || 10,
            height: parseFloat(formData.height) || 5
        });

        // Simulate API delay
        setTimeout(() => {
            const mockData = {
                productOverview: {
                    summary: `"${formData.productName}" 제품은 입력하신 키워드 "${formData.keywords}"를 분석했을 때 미국 시장에서 높은 잠재력을 보여줍니다. 현재 트렌드는 친환경 및 유기농 패키징을 선호하며, 이는 귀하의 제품 키워드와 일치합니다.`,
                    validated: ["수요 트렌드: 상승세 (전년 대비 15% 증가)", "경쟁 강도: 보통", "예상 가격대: $25 - $40"]
                },
                financials: fees,
                swot: {
                    strengths: ["K-Category 프리미엄 이미지 활용 가능", "선물하기 좋은 패키징 구성", "독창적인 허브 블렌딩 경쟁력"],
                    weaknesses: ["벌크형 경쟁사 대비 높은 단가", "초기 브랜드 인지도 부족"],
                    opportunities: ["미국 내 웰니스 및 이너뷰티 시장 성장", "요가 스튜디오 및 인플루언서 제휴 마케팅 기회"],
                    threats: ["기존 대형 로컬 경쟁사들의 시장 지배력", "변동성 높은 국제 배송비"]
                },
                marketing4P: {
                    product: "'Organic' 및 'Gift' 키워드를 강조하세요. 메인 이미지에 USDA 유기농 인증 마크(있는 경우)를 부각시키는 것이 좋습니다.",
                    price: "초기 판매 속도 확보를 위해 $29.99 런칭 후 10% 쿠폰 전략을 추천합니다. (정상가 $34.99 목표)",
                    place: "Prime 뱃지 획득을 위해 FBA 입고가 필수적입니다. 부피가 작다면 'Small and Light' 프로그램 적용을 고려하세요.",
                    promotion: "'Organic Tea Gift' 키워드를 타겟으로 한 PPC 캠페인을 집행하세요. 브루잉 경험을 보여주는 비디오 광고가 효과적입니다."
                },
                conclusion: "이 제품의 잠재력 점수는 7.8/10 입니다. 실제 전환율 검증을 위해 소량(200~500개)의 테스트 배치(Test Batch)로 FBA 판매를 시작하시길 강력히 권장합니다."
            };
            setAnalysisResult(mockData);
            setIsGenerated(true);
            setIsLoading(false);
        }, 2000);
    };

    const handleDownload = async (type: 'pdf' | 'docx') => {
        if (!analysisResult) return;
        alert(`${type.toUpperCase()} 다운로드가 시작됩니다. (시뮬레이션)`);
    };

    if (isGenerated && analysisResult) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">분석이 완료되었습니다!</h1>
                    <p className="text-slate-600 max-w-lg mx-auto">
                        <strong>{formData.productName}</strong> 제품에 대한 심층 시장 분석 보고서가 생성되었습니다.<br />
                        미국 시장 트렌드와 경쟁 현황을 반영한 결과를 확인하세요.
                    </p>
                    {/* Usage Limit Badge */}
                    <div className="inline-block bg-slate-100 rounded-full px-4 py-1 text-sm font-medium text-slate-600 border border-slate-200">
                        {isUnlimited ? "플랜: 무제한 액세스" : `월간 이용량: ${remainingCount} / 5 회 남음`}
                    </div>
                </div>

                {/* Report Preview Section */}
                <div ref={reportRef} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-12 max-w-3xl mx-auto space-y-8 print:shadow-none print:border-none">
                    {/* ... Content of Report ... */}
                    <div className="border-b border-slate-100 pb-6 mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">[Amazon US] 제품 분석 보고서</h2>
                            <p className="text-slate-500 text-sm">Target Product: {formData.productName}</p>
                        </div>
                        <p className="text-slate-400 text-xs">Generated on: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-8 text-slate-700">
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-slate-900 rounded-sm"></span>
                                1. 분석 요약 (Executive Summary)
                            </h3>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed border border-slate-100">
                                <p className="mb-2">{analysisResult.productOverview.summary}</p>
                                <ul className="list-disc list-inside mt-2 text-slate-600">
                                    {analysisResult.productOverview.validated.map((v: string, i: number) => (
                                        <li key={i}>{v}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* FBA/Fees Section */}
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-green-600 rounded-sm"></span>
                                2. 예상 수익성 분석 (Estimated Profitability)
                            </h3>
                            <p className="text-xs text-slate-500 mb-4">* Based on standard FBA rates. Shipping charge to Amazon set to $0 as requested.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                    <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">Revenue & Fees</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span>Selling Price</span>
                                            <span className="font-bold">${formData.price}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Referral Fee (15%)</span>
                                            <span>- ${analysisResult.financials.referralFee}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>FBA Fulfillment Fee</span>
                                            <span>- ${analysisResult.financials.fbaFee}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Storage Fee (Est.)</span>
                                            <span>- ${analysisResult.financials.storageFee}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between items-center">
                                        <span className="font-bold">Total Amazon Fees</span>
                                        <span className="font-bold text-red-600">- ${analysisResult.financials.totalFee}</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-5 rounded-xl border border-green-200 flex flex-col justify-center items-center text-center">
                                    <h4 className="font-bold text-green-800 mb-2">Estimated Net Profit</h4>
                                    <span className="text-4xl font-extrabold text-green-600 mb-2">
                                        ${analysisResult.financials.netMargin}
                                    </span>
                                    <p className="text-sm text-green-700">Per Unit</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-600 rounded-sm"></span>
                                3. SWOT 분석 (미국 시장 관점)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-bold text-blue-700 mb-2 border-b border-blue-100 pb-2">Strengths (강점)</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                                        {analysisResult.swot.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-bold text-red-600 mb-2 border-b border-red-100 pb-2">Weaknesses (약점)</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                                        {analysisResult.swot.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-bold text-green-600 mb-2 border-b border-green-100 pb-2">Opportunities (기회)</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                                        {analysisResult.swot.opportunities.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                                    <h4 className="font-bold text-amber-600 mb-2 border-b border-amber-100 pb-2">Threats (위협)</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                                        {analysisResult.swot.threats.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-slate-900 rounded-sm"></span>
                                4. 마케팅 4P 전략 제언
                            </h3>
                            <div className="space-y-4 text-sm border-t border-slate-200 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                                    <span className="font-bold text-slate-900 bg-slate-100 rounded px-2 py-1 text-center h-fit">Product</span>
                                    <div>
                                        <p className="text-slate-600">{analysisResult.marketing4P.product}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                                    <span className="font-bold text-slate-900 bg-slate-100 rounded px-2 py-1 text-center h-fit">Price</span>
                                    <div>
                                        <p className="text-slate-600">{analysisResult.marketing4P.price}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                                    <span className="font-bold text-slate-900 bg-slate-100 rounded px-2 py-1 text-center h-fit">Place</span>
                                    <div>
                                        <p className="text-slate-600">{analysisResult.marketing4P.place}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                                    <span className="font-bold text-slate-900 bg-slate-100 rounded px-2 py-1 text-center h-fit">Promotion</span>
                                    <div>
                                        <p className="text-slate-600">{analysisResult.marketing4P.promotion}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-slate-900 rounded-sm"></span>
                                5. 종합 결론
                            </h3>
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 text-sm text-blue-900">
                                <p className="font-bold mb-2">🚀 진출 추천: 소규모 테스트 판매 (Test Bed)</p>
                                <p>{analysisResult.conclusion}</p>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handleDownload('pdf')}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-md"
                    >
                        <FileText size={20} /> PDF 다운로드
                    </button>
                    <button
                        onClick={() => handleDownload('docx')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                    >
                        <FileText size={20} /> Word 다운로드
                    </button>
                </div>

                <div className="text-center pt-4 border-t border-slate-100">
                    <button
                        onClick={() => { setIsGenerated(false); setIsLoading(false); }}
                        className="text-slate-500 hover:text-slate-900 text-sm font-medium underline underline-offset-4 flex items-center gap-1 mx-auto"
                    >
                        <ArrowRight className="rotate-180" size={14} />
                        뒤로 가기 (새로운 제품 분석)
                    </button>
                </div>
            </div>
        );
    }

    // Access Denied State (If visited via URL directly without permission, though Sidebar hides it)
    if (!hasAccess) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Lock size={40} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
                <p className="text-slate-600">
                    This feature requires <strong>User 2</strong> (Subscriber) level access or higher.
                </p>
                <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-lg inline-block text-left">
                    <p className="font-bold mb-1">Upgrade Benefits:</p>
                    <ul className="list-disc list-inside">
                        <li>AI Product Analysis (5/month)</li>
                        <li>Advanced Learning Content</li>
                        <li>Dictionary Access</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">내 제품 분석하기 (미국)</h1>
                <p className="text-slate-600 text-lg">
                    제품의 기본 정보를 입력하시면 AI가 아마존 미국 시장 진출 가능성을 분석해드립니다.
                </p>
                <div className="mt-4 flex gap-2">
                    <div className="inline-block bg-indigo-50 rounded-full px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">
                        {isUnlimited ? "Unlimited Plan" : "Subscriber Plan"}
                    </div>
                    {!isUnlimited && (
                        <div className="inline-block bg-slate-50 rounded-full px-3 py-1 text-xs font-medium text-slate-500 border border-slate-200">
                            {remainingCount} / 5 analysis remaining
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">

                {/* 1. 기본 정보 */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
                        제품 기본 정보
                    </h2>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                제품명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="productName"
                                type="text"
                                required
                                value={formData.productName}
                                onChange={handleInputChange}
                                placeholder="예: Premium Organic Green Tea Set"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">판매 카테고리 (Category) <span className="text-red-500">*</span></label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 bg-white"
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">예상 판매가 ($) <span className="text-red-500">*</span></label>
                                <input
                                    name="price"
                                    type="number"
                                    required
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="29.99"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">가로 (cm)</label>
                                <input name="width" type="number" value={formData.width} onChange={handleInputChange} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">세로 (cm)</label>
                                <input name="length" type="number" value={formData.length} onChange={handleInputChange} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">높이 (cm)</label>
                                <input name="height" type="number" value={formData.height} onChange={handleInputChange} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">중량 (kg)</label>
                                <input name="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 수출입 정보 */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">2</span>
                        수출입 및 키워드 정보
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-700">HS 코드</label>
                                <a
                                    href="https://unipass.customs.go.kr/clip/index.do"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                                >
                                    <Search size={12} />
                                    HS 코드 검색하기
                                </a>
                            </div>
                            <input
                                name="hsCode"
                                type="text"
                                value={formData.hsCode}
                                onChange={handleInputChange}
                                placeholder="HS 코드를 입력해주세요 (선택사항)"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                추천 검색 키워드 (영문) <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="keywords"
                                type="text"
                                required
                                value={formData.keywords}
                                onChange={handleInputChange}
                                placeholder="예: organic tea, gift set, herbal tea (쉼표로 구분)"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-300"
                            />
                            <p className="text-xs text-slate-500">
                                아마존 내에서 검색될 것으로 예상되는 주요 키워드를 입력해주세요.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                            "w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2",
                            isLoading
                                ? "bg-slate-700 cursor-not-allowed opacity-80"
                                : "bg-slate-900 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                분석 보고서 생성 중...
                            </>
                        ) : (
                            <>
                                다음 단계로
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    {isLoading && (
                        <p className="text-center text-sm text-slate-500 mt-4 animate-pulse">
                            Amazon US 시장 데이터와 Google 트렌드를 분석하고 있습니다.<br />
                            잠시만 기다려주세요. (약 1분 소요)
                        </p>
                    )}
                </div>

            </form>
        </div>
    );
}
