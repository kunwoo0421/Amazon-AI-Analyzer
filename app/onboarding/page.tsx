"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils";

// 문서 항목 타입 정의
interface DocItem {
    id: string;
    title: string;
    description: string;
    isRequired: boolean;
    status: 'pending' | 'uploaded' | 'verified' | 'error';
    fileUrl?: string;
}

export default function DocumentReviewPage() {
    const [activeTab, setActiveTab] = useState<'seller' | 'brand'>('seller');

    // 셀러 신원 확인 서류 목록
    const [sellerDocs, setSellerDocs] = useState<DocItem[]>([
        {
            id: 'passport',
            title: '신분증 (여권 권장)',
            description: '유효기간이 남은 여권 전체 컬러 스캔본 (서명 필수).',
            isRequired: true,
            status: 'pending'
        },
        {
            id: 'bank_statement',
            title: '은행/신용카드 명세서 (Statement)',
            description: '최근 180일 이내 발급된 영문 내역서 (Payoneer 등 가상계좌 가능).',
            isRequired: true,
            status: 'pending'
        },
        {
            id: 'business_license',
            title: '사업자등록증명원 (영문)',
            description: '홈택스에서 발급받은 영문 사업자등록증명원.',
            isRequired: false,
            status: 'pending'
        },
        {
            id: 'utility_bill',
            title: '공과금 고지서 (추가 증빙용)',
            description: '가스, 수도, 전기, 인터넷 요금 고지서 (최근 90일).',
            isRequired: false,
            status: 'pending'
        }
    ]);

    // 브랜드 레지스트리 서류 목록
    const [brandDocs, setBrandDocs] = useState<DocItem[]>([
        {
            id: 'trademark',
            title: '상표 등록 번호 (Trademark #)',
            description: 'USPTO, KIPO 등에 등록 및 출원된 상표 번호 캡처본.',
            isRequired: true,
            status: 'pending'
        },
        {
            id: 'logo_image',
            title: '브랜드 로고 이미지',
            description: '상표 출원 시 제출한 이미지와 동일한 로고 파일.',
            isRequired: true,
            status: 'pending'
        },
        {
            id: 'product_image',
            title: '제품/패키지 실사 이미지',
            description: '브랜드 로고가 영구 부착/인쇄된 실제 제품 사진 (검토 핵심).',
            isRequired: true,
            status: 'pending'
        },
        {
            id: 'contract',
            title: '제조 계약서 / 거래 명세서',
            description: '제조업체와 맺은 계약서 또는 매입 증빙 서류.',
            isRequired: false,
            status: 'pending'
        }
    ]);

    const currentDocs = activeTab === 'seller' ? sellerDocs : brandDocs;
    const completedCount = currentDocs.filter(d => d.status === 'verified' || d.status === 'uploaded').length;

    const handleFileUpload = async (docId: string) => {
        // 임시 파일 업로드 시뮬레이션 (이후 R2 연동 로직 적용 예정)
        alert(`${docId} 업로드 창 오픈 예정`);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">입점 서류 및 브랜드 등록 가이드</h1>
                <p className="text-slate-500">
                    아마존 입점 심사를 통과하기 위한 단계별 서류 준비 및 검증 시스템입니다.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 p-1 rounded-xl inline-flex gap-1">
                    <button
                        onClick={() => setActiveTab('seller')}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            activeTab === 'seller'
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <FileText size={18} />
                        입점 서류 (Seller Reg)
                    </button>
                    <button
                        onClick={() => setActiveTab('brand')}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                            activeTab === 'brand'
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        <CheckCircle2 size={18} />
                        브랜드 레지스트리 (Brand)
                    </button>
                </div>
            </div>

            {/* Document List Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                        {activeTab === 'seller' ? '셀러 신원 확인 (SIV) 서류' : '브랜드 레지스트리 등록 서류'}
                    </h2>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                        {completedCount} / {currentDocs.length} 준비됨
                    </span>
                </div>

                <div className="space-y-4">
                    {currentDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all gap-4"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800">{doc.title}</h3>
                                    {doc.isRequired && (
                                        <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] px-2 py-0.5 rounded font-bold">
                                            필수 (REQUIRED)
                                        </span>
                                    )}
                                    <HelpCircle size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                                </div>
                                <p className="text-sm text-slate-500">{doc.description}</p>
                            </div>

                            <div className="shrink-0 flex items-center">
                                {doc.status === 'pending' && (
                                    <button
                                        onClick={() => handleFileUpload(doc.id)}
                                        className="w-full md:w-auto px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Upload size={16} />
                                        파일 업로드
                                    </button>
                                )}
                                {doc.status === 'uploaded' && (
                                    <span className="flex items-center gap-2 text-amber-500 font-bold text-sm bg-amber-50 px-4 py-2 rounded-xl">
                                        <AlertCircle size={16} /> 검토 대기중
                                    </span>
                                )}
                                {doc.status === 'verified' && (
                                    <span className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl">
                                        <CheckCircle2 size={16} /> 검증 완료
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="mt-10 flex justify-end pt-6 border-t border-slate-100">
                    <button className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:scale-[1.02] hover:bg-slate-800 transition-all">
                        AI 입점 서류 분석 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}
