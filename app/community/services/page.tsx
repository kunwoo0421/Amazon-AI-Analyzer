"use client";

import { useState } from 'react';
import { serviceCategories, mockServiceProviders, ServiceProvider } from '../../../data/community_data';
import { Search, MapPin, Phone, Mail, Globe, ArrowRight, X, LayoutGrid, List as ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'list' | 'tile';
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function ServiceProvidersPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('tile');
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProviders = mockServiceProviders.filter(provider => {
        const matchesCategory = selectedCategory ? provider.category === selectedCategory : true;
        const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination Logic
    const totalItems = filteredProviders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredProviders.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-6xl mx-auto p-8 animate-in fade-in duration-500 relative min-h-screen">
            <h1 className="text-3xl font-bold text-primary mb-2">Amazon Service Providers</h1>
            <p className="text-pastel-taupe mb-8">검증된 아마존 전문 서비스 업체를 만나보세요.</p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                    }}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                        !selectedCategory
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-pastel-taupe border-pastel-beige hover:border-primary hover:text-primary"
                    )}
                >
                    전체
                </button>
                {serviceCategories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                        }}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                            selectedCategory === cat
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-pastel-taupe border-pastel-beige hover:border-primary hover:text-primary"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search Bar & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pastel-taupe" size={20} />
                    <input
                        type="text"
                        placeholder="업체명 또는 서비스 내용 검색..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-300"
                    />
                </div>

                <div className="flex items-center gap-4">
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

            {/* Provider List */}
            {currentItems.length > 0 ? (
                <>
                    {viewMode === 'tile' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentItems.map((provider) => (
                                <motion.div
                                    key={provider.id}
                                    layoutId={`card-${provider.id}`}
                                    onClick={() => setSelectedProvider(provider)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-pastel-beige hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                                >
                                    <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded mb-3">
                                        {provider.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-amber-500 transition-colors">
                                        {provider.name}
                                    </h3>
                                    <p className="text-pastel-taupe text-sm line-clamp-2 mb-4">
                                        {provider.description}
                                    </p>
                                    <div className="flex items-center text-primary text-sm font-bold">
                                        자세히 보기 <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-pastel-beige overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-pastel-cream border-b border-pastel-beige">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-primary w-32">분류</th>
                                        <th className="px-6 py-4 text-sm font-bold text-primary w-1/4">업체명</th>
                                        <th className="px-6 py-4 text-sm font-bold text-primary">소개</th>
                                        <th className="px-6 py-4 text-sm font-bold text-primary w-24">상세</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pastel-beige/50">
                                    {currentItems.map((provider) => (
                                        <tr
                                            key={provider.id}
                                            onClick={() => setSelectedProvider(provider)}
                                            className="hover:bg-pastel-cream/30 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded">
                                                    {provider.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary group-hover:text-secondary transition-colors">
                                                {provider.name}
                                            </td>
                                            <td className="px-6 py-4 text-pastel-taupe text-sm line-clamp-1">
                                                {provider.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <ArrowRight size={18} className="text-pastel-taupe group-hover:text-primary transition-colors" />
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
                                className="p-2 rounded-lg border border-pastel-beige text-pastel-taupe hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "text-pastel-taupe hover:bg-white border border-transparent hover:border-pastel-beige"
                                        )}
                                    >
                                        {page}
                                    </button>
                                ))}
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
                <div className="col-span-full text-center py-20 text-pastel-taupe bg-white/50 rounded-2xl border border-dashed border-pastel-beige">
                    검색 결과가 없습니다.
                </div>
            )}

            {/* Detail Modal - Unchanged but included for context */}
            <AnimatePresence>
                {selectedProvider && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProvider(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`card-${selectedProvider.id}`}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
                        >
                            <button
                                onClick={() => setSelectedProvider(null)}
                                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <X size={20} className="text-slate-600" />
                            </button>

                            <div className="p-8">
                                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-bold rounded-lg mb-4">
                                    {selectedProvider.category}
                                </span>
                                <h2 className="text-3xl font-bold text-primary mb-6">{selectedProvider.name}</h2>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-pastel-cream rounded-full flex items-center justify-center text-primary shrink-0">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-pastel-taupe font-bold uppercase">Address</p>
                                                <p className="text-primary font-medium">{selectedProvider.address}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-pastel-cream rounded-full flex items-center justify-center text-primary shrink-0">
                                                <Phone size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-pastel-taupe font-bold uppercase">Phone</p>
                                                <p className="text-primary font-medium">{selectedProvider.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-pastel-cream rounded-full flex items-center justify-center text-primary shrink-0">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-pastel-taupe font-bold uppercase">Email</p>
                                                <p className="text-primary font-medium">{selectedProvider.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-pastel-cream/50 p-6 rounded-2xl border border-pastel-beige">
                                        <p className="text-xs text-pastel-taupe font-bold uppercase mb-2">Service Description</p>
                                        <p className="text-slate-700 leading-relaxed">
                                            {selectedProvider.description}
                                        </p>
                                    </div>

                                    <button className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-pastel-black/20">
                                        문의하기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
