"use client";

import { useState } from "react";
import { Search, Book, ArrowRight, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { glossaryTerms as glossaryData } from "../../data/glossary";
import { cn } from "../../lib/utils";

// Fallback data if glossary file import fails or is empty for dev
const MOCK_GLOSSARY = [
    { term: "FBA", definition: "Fulfillment by Amazon. 아마존이 판매자의 재고 보관, 배송, CS를 대행해주는 서비스." },
    { term: "FBM", definition: "Fulfillment by Merchant. 판매자가 직접 상품을 배송하고 고객 응대를 하는 방식." },
    { term: "PPC", definition: "Pay-Per-Click. 클릭당 과금되는 광고 방식." },
    { term: "ASIN", definition: "Amazon Standard Identification Number. 아마존 표준 식별 번호 (10자리)." },
    { term: "BSR", definition: "Best Sellers Rank. 아마존 베스트셀러 순위." },
    { term: "Buy Box", definition: "바이박스. 상품 페이지 우측의 '구매하기(Add to Cart)' 박스. 판매량에 결정적 영향." },
];

type ViewMode = 'list' | 'tile';
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function LibraryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>('tile');
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    // Use imported data or mock data
    const data = (typeof glossaryData !== 'undefined' && glossaryData.length > 0) ? glossaryData : MOCK_GLOSSARY;

    const filteredTerms = data.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalItems = filteredTerms.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredTerms.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen">
            <div className="flex flex-col items-center text-center mb-12 mt-8">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Book size={32} />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    아마존 용어사전
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                    어려운 아마존 셀링 용어, 여기서 쉽게 찾아보세요.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-14 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xl shadow-indigo-100/50 transition-all text-lg"
                    placeholder="용어 검색 (예: FBA, PPC, 바이박스)..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                    }}
                />
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('tile')}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            viewMode === 'tile' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-indigo-600"
                        )}
                        title="크게 보기"
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            viewMode === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-indigo-600"
                        )}
                        title="목록 보기"
                    >
                        <ListIcon size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">페이지당 개수:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}개</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results */}
            {currentItems.length > 0 ? (
                <>
                    {viewMode === 'tile' ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {currentItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all cursor-default group h-full"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {item.term.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                {item.term}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {item.definition}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500 w-1/4">용어</th>
                                        <th className="px-6 py-4 text-sm font-bold text-slate-500">정의</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentItems.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {item.term}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.definition}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={cn(
                                            "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                                            currentPage === page
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                                : "text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                    <Book size={40} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">검색 결과가 없습니다</h3>
                    <p className="text-slate-500">다른 키워드로 검색해 보세요.</p>
                </div>
            )}
        </div>
    );
}
