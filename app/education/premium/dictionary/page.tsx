"use client";

import React, { useState, useMemo } from 'react';
import { glossaryTerms } from '../../../../data/glossary';
import { Search, BookOpen, AlertCircle, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../../lib/utils';

type ViewMode = 'list' | 'tile';
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function DictionaryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>('tile');
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter terms based on search
    const filteredTerms = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        let result = glossaryTerms;

        if (query) {
            result = glossaryTerms.filter((item) =>
                item.term.toLowerCase().includes(query) ||
                item.definition.toLowerCase().includes(query)
            );
        }

        // Always sort alphabetically
        return result.sort((a, b) => a.term.localeCompare(b.term));
    }, [searchQuery]);

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
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-pastel-beige pb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary tracking-tight flex items-center gap-3">
                        <BookOpen className="text-secondary" size={40} />
                        아마존 용어사전
                    </h1>
                    <p className="text-pastel-taupe mt-3 text-lg font-medium">
                        아마존 셀러를 위한 필수 용어 대백과
                    </p>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-pastel-taupe/70" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="용어 검색 (예: FBA, ACoS...)"
                        className="w-full pl-12 pr-4 py-3 bg-white border border-pastel-beige rounded-xl focus:outline-none focus:ring-4 focus:ring-secondary/20 focus:border-secondary transition-all font-medium text-lg placeholder:text-pastel-taupe/50 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-pastel-beige">
                        <button
                            onClick={() => setViewMode('tile')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'tile' ? "bg-primary text-white shadow-sm" : "text-pastel-taupe hover:text-primary"
                            )}
                            title="크게 보기"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-md transition-all",
                                viewMode === 'list' ? "bg-primary text-white shadow-sm" : "text-pastel-taupe hover:text-primary"
                            )}
                            title="목록 보기"
                        >
                            <ListIcon size={20} />
                        </button>
                    </div>

                    {/* Items Per Page */}
                    <div className="flex items-center gap-2">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-white border border-pastel-beige rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary cursor-pointer font-bold"
                        >
                            {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                <option key={option} value={option}>{option}개씩 보기</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {currentItems.length > 0 ? (
                    <>
                        {viewMode === 'tile' ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {currentItems.map((item, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        key={`${item.term}-${index}`}
                                        className="bg-white p-6 rounded-2xl border border-pastel-beige shadow-sm hover:shadow-md hover:border-secondary/50 transition-all group h-full flex flex-col"
                                    >
                                        <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-3 break-words leading-tight">
                                            {item.term}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                                            {item.definition}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-pastel-beige overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-pastel-cream border-b border-pastel-beige">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-bold text-primary w-1/4">용어</th>
                                            <th className="px-6 py-4 text-sm font-bold text-primary">정의</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pastel-beige/50">
                                        {currentItems.map((item, index) => (
                                            <tr key={`${item.term}-${index}`} className="hover:bg-pastel-cream/30 transition-colors group">
                                                <td className="px-6 py-4 font-bold text-primary group-hover:text-secondary transition-colors align-top">
                                                    {item.term}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 align-top leading-relaxed">
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
                            <div className="flex justify-center items-center gap-2 mt-10 pb-10">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-pastel-beige text-pastel-taupe hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-1 overflow-x-auto max-w-[300px] md:max-w-none no-scrollbar">
                                    {/* Simple pagination logic for many pages to avoid overcrowding could involve ellipsis, 
                                        but for now rendering all or a subset is fine. Since term counts can be high, 
                                        let's render a window if too many. For simplicity here: standard list. */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                        // Show first, last, current, and neighbors
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 2 && page <= currentPage + 2)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-lg text-sm font-bold transition-all shrink-0",
                                                        currentPage === page
                                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                                            : "text-pastel-taupe hover:bg-white border border-transparent hover:border-pastel-beige"
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 3 ||
                                            page === currentPage + 3
                                        ) {
                                            return <span key={page} className="flex items-center justify-center w-10 text-pastel-taupe">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-pastel-beige text-pastel-taupe hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-pastel-cream/50 rounded-3xl border border-dashed border-pastel-beige text-center">
                        <AlertCircle size={48} className="text-pastel-taupe mb-4 opacity-50" />
                        <p className="text-xl text-primary font-bold">검색 결과가 없습니다.</p>
                        <p className="text-pastel-taupe mt-2">다른 검색어로 시도해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
