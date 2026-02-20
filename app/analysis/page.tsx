"use client";

import { useState, useRef } from "react";
import { Search, ArrowRight, FileText, Download, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { cn } from "../../lib/utils";
import { useData } from "../contexts/DataContext";

export default function AnalysisPage() {
    const { verifyAccess, grantAccess } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [accessCodeInput, setAccessCodeInput] = useState("");

    // Check Permission
    // For demo: assume current user is 'user@test.com' (from DataContext)
    const hasAccess = verifyAccess('PREMIUM_REPORT');

    // Form State
    const [formData, setFormData] = useState({
        productName: "",
        width: "",
        length: "",
        height: "",
        weight: "",
        hsCode: "",
        keywords: ""
    });

    const reportRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setAnalysisResult(data);
            setIsGenerated(true);
        } catch (error) {
            console.error("Error:", error);
            alert("분석 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (type: 'pdf' | 'docx') => {
        if (!analysisResult) return;

        if (type === 'pdf') {
            if (reportRef.current) {
                try {
                    const html2canvas = (await import('html2canvas')).default;
                    const { jsPDF } = await import('jspdf');

                    const canvas = await html2canvas(reportRef.current, {
                        scale: 2, // Higher resolution
                        logging: false,
                        useCORS: true
                    });

                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const imgWidth = pdfWidth;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pdfHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pdfHeight;
                    }

                    pdf.save(`${formData.productName}_Analysis_Report.pdf`);
                } catch (error) {
                    console.error("PDF generation failed:", error);
                    alert("PDF 생성 중 오류가 발생했습니다.");
                }
            }
        } else {
            // DOCX Generation using dynamic data
            const content = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>Analysis Report</title></head>
                <body>
                    <h1>[Amazon US] 제품 분석 보고서: ${formData.productName}</h1>
                    <p>생성일: ${new Date().toLocaleDateString()}</p>
                    <hr/>
                    <h2>1. 분석 요약 (Executive Summary)</h2>
                    <p>${analysisResult.productOverview.summary}</p>
                    
                    <h2>2. SWOT 분석 (미국 시장 관점)</h2>
                    <h3>Strengths (강점)</h3>
                    <ul>${analysisResult.swot.strengths.map((s: string) => `<li>${s}</li>`).join('')}</ul>
                    <h3>Weaknesses (약점)</h3>
                    <ul>${analysisResult.swot.weaknesses.map((s: string) => `<li>${s}</li>`).join('')}</ul>
                    <h3>Opportunities (기회)</h3>
                    <ul>${analysisResult.swot.opportunities.map((s: string) => `<li>${s}</li>`).join('')}</ul>
                    <h3>Threats (위협)</h3>
                    <ul>${analysisResult.swot.threats.map((s: string) => `<li>${s}</li>`).join('')}</ul>
                    
                    <h2>3. 마케팅 4P 전략 (Marketing Strategy)</h2>
                    <ul>
                        <li><strong>Product:</strong> ${analysisResult.marketing4P.product}</li>
                        <li><strong>Price:</strong> ${analysisResult.marketing4P.price}</li>
                        <li><strong>Place:</strong> ${analysisResult.marketing4P.place}</li>
                        <li><strong>Promotion:</strong> ${analysisResult.marketing4P.promotion}</li>
                    </ul>

                    <h2>4. 종합 결론</h2>
                    <p>${analysisResult.conclusion}</p>
                </body>
                </html>
            `;

            const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formData.productName}_Analysis_Report.doc`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    const handleUnlock = () => {
        if (accessCodeInput === 'PREMIUM_REPORT') {
            // In a real app, this would be a server call.
            // Here we simulate granting access to the current session user.
            // We need to know WHO the current user is. In DataContext we hardcoded 'user@test.com'.
            // So we assume the user enters the code to 'claim' it.
            grantAccess('user@test.com', 'PREMIUM_REPORT');
            alert("인증되었습니다! 프리미엄 리포트를 확인하실 수 있습니다.");
        } else {
            alert("유효하지 않은 코드입니다.");
        }
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
                </div>

                {/* Locked State vs Unlocked State */}
                {!hasAccess ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-12 text-center space-y-6 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} className="text-slate-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">프리미엄 리포트 열람 권한이 필요합니다</h2>
                            <p className="text-slate-600">
                                상세 분석(SWOT, 4P 전략, 시장성 검증)을 확인하시려면<br />
                                <span className="font-bold text-indigo-600">액세스 코드</span>가 필요합니다.
                            </p>
                        </div>

                        <div className="flex gap-2 max-w-xs mx-auto">
                            <input
                                type="text"
                                value={accessCodeInput}
                                onChange={(e) => setAccessCodeInput(e.target.value)}
                                placeholder="Enter Access Code"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button
                                onClick={handleUnlock}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700"
                            >
                                Unlock
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">
                            * 코드 예시: <strong>PREMIUM_REPORT</strong> (대소문자 구분)
                        </p>
                    </div>
                ) : (
                    <>
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

                                {/* [NEW] Quantitative Market Analysis Section */}
                                {analysisResult.quantitativeAnalysis && (
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-indigo-600 rounded-sm"></span>
                                            2. 시장 데이터 분석 (Market Metrics)
                                        </h3>

                                        {/* Key Metrics Cards */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Avg Price</p>
                                                <p className="text-xl font-extrabold text-slate-900">${analysisResult.quantitativeAnalysis.avgPrice.toFixed(2)}</p>
                                            </div>
                                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Est. Revenue</p>
                                                <p className="text-xl font-extrabold text-slate-900">${(analysisResult.quantitativeAnalysis.estMarketRevenue / 1000).toFixed(1)}K</p>
                                            </div>
                                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Total Sales</p>
                                                <p className="text-xl font-extrabold text-slate-900">{analysisResult.quantitativeAnalysis.totalEstMonthlySales.toLocaleString()}</p>
                                            </div>
                                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Competitors</p>
                                                <p className="text-xl font-extrabold text-slate-900">{analysisResult.quantitativeAnalysis.competitors.length}</p>
                                            </div>
                                        </div>

                                        {/* Top Competitors Table */}
                                        <div className="overflow-hidden border border-slate-200 rounded-xl">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-3">Product</th>
                                                        <th className="px-4 py-3">Price</th>
                                                        <th className="px-4 py-3">Est. Sales</th>
                                                        <th className="px-4 py-3">Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {analysisResult.quantitativeAnalysis.competitors.map((comp: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-4 py-3 max-w-[200px] truncate" title={comp.title}>{comp.title}</td>
                                                            <td className="px-4 py-3 font-medium">${comp.price}</td>
                                                            <td className="px-4 py-3 text-slate-600">{comp.est_sales.toLocaleString()}</td>
                                                            <td className="px-4 py-3 font-bold text-indigo-600">${comp.revenue.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                )}

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
                                        3. 마케팅 4P 전략 제언
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
                                        4. 종합 결론
                                    </h3>
                                    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 text-sm text-blue-900">
                                        <p className="font-bold mb-2">🚀 진출 추천: 소규모 테스트 판매 (Test Bed)</p>
                                        <p>{analysisResult.conclusion}</p>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Download Buttons (Only visible if access granted) */}
                        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {/* PDF Download Card */}
                            <div
                                onClick={() => handleDownload('pdf')}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                        <FileText className="w-8 h-8 text-red-500" />
                                    </div>
                                    <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-500">PDF</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">분석 보고서 (PDF)</h3>
                                <p className="text-sm text-slate-500 mb-4">인쇄 및 공유에 최적화된 PDF 형식의 보고서입니다.</p>
                                <button className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium">
                                    <Download size={18} />
                                    다운로드
                                </button>
                            </div>

                            {/* DOCX Download Card */}
                            <div
                                onClick={() => handleDownload('docx')}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <FileText className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-500">DOCX</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">분석 보고서 (Word)</h3>
                                <p className="text-sm text-slate-500 mb-4">편집이 가능한 MS Word 형식의 보고서입니다.</p>
                                <button className="w-full py-2.5 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium">
                                    <Download size={18} />
                                    다운로드
                                </button>
                            </div>
                        </div>

                    </>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 max-w-3xl mx-auto">
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-1">참고사항</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                본 보고서는 Amazon US API 데이터와 Google 검색 트렌드를 기반으로 AI가 분석한 예측 자료입니다.
                                실제 시장 상황과는 차이가 있을 수 있으며, 비즈니스 결정의 참고 자료로만 활용하시기 바랍니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => { setIsGenerated(false); setIsLoading(false); }}
                        className="text-slate-500 hover:text-slate-900 text-sm font-medium underline underline-offset-4"
                    >
                        새로운 제품 분석하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">내 제품 분석하기</h1>
                <p className="text-slate-600 text-lg">
                    제품의 기본 정보를 입력하시면 AI가 아마존 미국 시장 진출 가능성을 분석해드립니다.
                </p>
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
                                    href="https://www.google.com/search?q=hs+code+search"
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
