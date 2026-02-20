"use client";

import { useState } from 'react';
import { mockQnAs, QnAItem } from '../../../data/community_data';
import { Lock, Plus, Search, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function QnAPage() {
    const [qnas, setQnas] = useState<QnAItem[]>(mockQnAs);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

    // Write Form State
    const [category, setCategory] = useState('아마존 셀러센트럴');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');

    // Unlock State
    const [unlockingId, setUnlockingId] = useState<string | null>(null);
    const [unlockPassword, setUnlockPassword] = useState('');

    const categories = ['아마존 셀러센트럴', '아마존 물류', '아마존 광고', 'AWA 어플 사용'];

    const handleSubmit = () => {
        if (!title || !content) return alert('제목과 내용을 입력해주세요.');
        if (password.length !== 4) return alert('비밀번호는 4자리 숫자여야 합니다.');

        const newQnA: QnAItem = {
            id: Date.now().toString(),
            category: category as any,
            title,
            author: 'CurrentUser', // Mock
            content,
            date: new Date().toISOString().split('T')[0],
            status: 'Waiting',
            password
        };

        setQnas([newQnA, ...qnas]);
        setIsWriteModalOpen(false);
        // Reset
        setTitle('');
        setContent('');
        setPassword('');
    };

    const handleUnlock = (id: string, correctPassword?: string) => {
        if (unlockPassword === correctPassword) {
            alert('비밀번호 일치! (실제 앱에서는 상세 페이지로 이동)');
            setUnlockingId(null);
            setUnlockPassword('');
        } else {
            alert('비밀번호가 일치하지 않습니다.');
        }
    };

    const handleForgotPassword = () => {
        alert('비밀번호가 회원님의 앱 비밀번호로 초기화되었습니다. (0000)');
        // In real app, reset password logic here
    };

    return (
        <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">1:1 Q&A (Secret)</h1>
                    <p className="text-pastel-taupe">관리자와의 1:1 비밀 상담 게시판입니다.</p>
                </div>
                <button
                    onClick={() => setIsWriteModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Ask Question
                </button>
            </div>

            {/* Q&A List */}
            <div className="bg-white rounded-3xl shadow-sm border border-pastel-beige overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-pastel-cream/50 border-b border-pastel-beige text-xs font-bold text-pastel-taupe uppercase tracking-wider">
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2 text-center">Category</div>
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2 text-center">Author</div>
                    <div className="col-span-1 text-center">Date</div>
                </div>

                <div className="divide-y divide-pastel-beige">
                    {qnas.map((item) => (
                        <div key={item.id}>
                            <div
                                onClick={() => setUnlockingId(unlockingId === item.id ? null : item.id)}
                                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 cursor-pointer transition-colors group"
                            >
                                <div className="col-span-1 text-center">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                        item.status === 'Answered' ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="col-span-2 text-center">
                                    <span className="text-xs font-bold text-slate-500">{item.category}</span>
                                </div>
                                <div className="col-span-6 font-medium text-slate-700 group-hover:text-primary flex items-center gap-2">
                                    <Lock size={14} className="text-pastel-taupe" />
                                    Secret Question
                                </div>
                                <div className="col-span-2 text-center text-sm text-slate-500">
                                    {item.author.substring(0, 3)}***
                                </div>
                                <div className="col-span-1 text-center text-xs text-slate-400">
                                    {item.date}
                                </div>
                            </div>

                            {/* Password Prompt */}
                            <AnimatePresence>
                                {unlockingId === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-50 overflow-hidden"
                                    >
                                        <div className="p-6 flex flex-col items-center justify-center gap-4">
                                            <p className="text-sm font-bold text-primary">Enter 4-digit password to view</p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="password"
                                                    maxLength={4}
                                                    value={unlockPassword}
                                                    onChange={(e) => setUnlockPassword(e.target.value)}
                                                    className="w-24 px-3 py-2 text-center font-bold tracking-widest border border-pastel-beige rounded-lg focus:outline-none focus:border-secondary"
                                                    placeholder="****"
                                                />
                                                <button
                                                    onClick={() => handleUnlock(item.id, item.password)}
                                                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90"
                                                >
                                                    View
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleForgotPassword}
                                                className="text-xs text-slate-400 hover:text-primary underline"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Modal */}
            <AnimatePresence>
                {isWriteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsWriteModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 p-8"
                        >
                            <h2 className="text-2xl font-bold text-primary mb-6">Ask Secret Question</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-pastel-taupe uppercase mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary font-medium"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-pastel-taupe uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Summarize your issue"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-pastel-taupe uppercase mb-1">Content</label>
                                    <textarea
                                        placeholder="Describe your question in detail..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full h-32 px-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-pastel-taupe uppercase mb-1">Secret Password (4 Digits)</label>
                                    <input
                                        type="password"
                                        maxLength={4}
                                        placeholder="****"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary font-bold tracking-widest text-lg"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">* Remember this password to check the answer later.</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setIsWriteModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Submit Question
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
