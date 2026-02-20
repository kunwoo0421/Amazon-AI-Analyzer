"use client";

import { useState } from 'react';
import { mockFAQs, FAQItem } from '../../../data/community_data';
import { Plus, Minus, Heart, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [openItemId, setOpenItemId] = useState<string | null>(null);
    const [faqs, setFaqs] = useState<FAQItem[]>(mockFAQs);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', '아마존 셀러센트럴', '아마존 물류', '아마존 광고', 'AWA 어플 사용'];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleItem = (id: string) => {
        setOpenItemId(prev => prev === id ? null : id);
    };

    const handleLike = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFaqs(faqs.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
    };

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500 min-h-screen">
            <h1 className="text-3xl font-bold text-primary mb-2">FAQ</h1>
            <p className="text-pastel-taupe mb-8">자주 묻는 질문들을 확인해보세요.</p>

            {/* Search */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-taupe" size={20} />
                <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-pastel-beige bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                            selectedCategory === cat
                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                : "bg-white text-pastel-taupe border-pastel-beige hover:border-primary hover:text-primary"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                    <motion.div
                        key={faq.id}
                        initial={false}
                        className={cn(
                            "bg-white rounded-2xl border transition-all overflow-hidden",
                            openItemId === faq.id ? "border-primary shadow-md" : "border-pastel-beige hover:border-primary/50"
                        )}
                    >
                        <button
                            onClick={() => toggleItem(faq.id)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <div className="flex-1 pr-4">
                                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded mb-2 uppercase tracking-wide">
                                    {faq.category}
                                </span>
                                <h3 className={cn(
                                    "text-lg font-bold transition-colors",
                                    openItemId === faq.id ? "text-primary" : "text-slate-700"
                                )}>
                                    Q. {faq.question}
                                </h3>
                            </div>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                                openItemId === faq.id ? "bg-primary text-white" : "bg-pastel-cream text-pastel-taupe"
                            )}>
                                {openItemId === faq.id ? <Minus size={16} /> : <Plus size={16} />}
                            </div>
                        </button>

                        <AnimatePresence initial={false}>
                            {openItemId === faq.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="p-6 bg-pastel-cream/30 rounded-xl border border-pastel-beige/50 text-slate-600 leading-relaxed font-medium">
                                            A. {faq.answer}
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={(e) => handleLike(e, faq.id)}
                                                className="flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
                                            >
                                                <Heart size={16} fill="currentColor" /> Helpful ({faq.likes})
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {filteredFAQs.length === 0 && (
                    <div className="text-center py-20 text-pastel-taupe">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>

            {/* Admin Upload Button (Mock) */}
            <div className="mt-12 text-center">
                <button className="text-xs font-bold text-slate-300 hover:text-primary transition-colors uppercase tracking-widest">
                    Admin Login to Upload FAQ
                </button>
            </div>
        </div>
    );
}
