"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Pin, User, PenSquare, Calendar, Filter, Lock, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { useData, Post } from "../contexts/DataContext";

// Mock Session (Temporary)
const useSession = () => {
    return {
        data: {
            user: {
                name: "Test User",
                email: "test@withalice.team" // Change to test@gmail.com for non-admin
            }
        }
    }
};

export default function CommunityPage() {
    // 1. Get Data from Global Context
    const { posts, addPost, checkSecretPost } = useData();
    const { data: session } = useSession();

    const searchParams = useSearchParams();
    const router = useRouter();

    const isAdmin = session?.user?.email?.endsWith("@withalice.team") ?? false;

    // 2. Filter Tabs
    const tabParam = searchParams.get("tab") as "all" | "notice" | "free" | null;
    const [filter, setFilter] = useState<"all" | "notice" | "free">("all");

    useEffect(() => {
        if (tabParam) setFilter(tabParam);
        else setFilter("all");
    }, [tabParam]);

    // 3. Filter Logic
    const filteredPosts = posts
        .filter(p => p.category !== 'info') // Exclude Education Info posts
        .filter(p => filter === "all" ? true : p.category === filter);

    const handleTabChange = (newFilter: "all" | "notice" | "free") => {
        setFilter(newFilter);
        router.push(`/community?tab=${newFilter}`);
    };

    // 4. Writing State
    const [isWriting, setIsWriting] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newCategory, setNewCategory] = useState<"notice" | "free">("free");
    const [nickname, setNickname] = useState(""); // Custom Nickname

    // Secret Post State
    const [isSecret, setIsSecret] = useState(false);
    const [postPassword, setPostPassword] = useState("");

    // 5. Viewing Secret Post State
    const [selectedSecretPostId, setSelectedSecretPostId] = useState<number | null>(null);
    const [inputPassword, setInputPassword] = useState("");

    const handleWriteClick = () => {
        if (isAdmin && filter === 'notice') setNewCategory('notice');
        else setNewCategory('free');

        // Auto-fill nickname if desired, currently left empty for user input
        // if (session?.user?.name) setNickname(session.user.name);

        setIsWriting(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;
        if (!nickname.trim()) {
            alert("Please enter a nickname.");
            return;
        }
        if (isSecret && !postPassword) {
            alert("Please enter a password for the secret post.");
            return;
        }

        addPost({
            title: newTitle,
            content: newContent,
            author: nickname,
            authorEmail: session?.user?.email || undefined,
            category: newCategory,
            isSecret: newCategory === 'free' && isSecret,
            password: isSecret ? postPassword : undefined
        });

        setIsWriting(false);
        // Reset Form
        setNewTitle("");
        setNewContent("");
        setNewCategory("free");
        setNickname("");
        setIsSecret(false);
        setPostPassword("");

        if (newCategory === 'notice') handleTabChange('notice');
        else handleTabChange('free');
    };

    // Unlock Secret Post
    const handleUnlockPost = () => {
        if (selectedSecretPostId === null) return;
        const isValid = checkSecretPost(selectedSecretPostId, inputPassword);

        if (isValid) {
            alert("Password Correct! (In a real app, this would route to detail page)");
            // Here you would typically route to the detail page.
            // For now, let's just show an alert or expand the content.
            setInputPassword("");
            setSelectedSecretPostId(null);
        } else {
            alert("Incorrect Password.");
        }
    };

    // Helper: Mask Nickname (e.g. Alice -> Al***)
    const maskNickname = (name: string) => {
        if (name.length <= 2) return name + "*";
        const visibleLen = Math.ceil(name.length / 2);
        return name.substring(0, visibleLen) + "*".repeat(name.length - visibleLen);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6 mt-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">커뮤니티</h1>
                    <p className="text-slate-500">아마존 셀러들과 정보를 공유하고 소통하세요.</p>
                </div>
                <button
                    onClick={handleWriteClick}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                    <PenSquare size={18} />
                    글쓰기
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: "all", label: "전체글" },
                    { id: "notice", label: "공지사항" },
                    { id: "free", label: "자유게시판" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as any)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap",
                            filter === tab.id
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Post List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
                {filteredPosts.length === 0 ? (
                    <div className="p-16 text-center text-slate-400">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p>등록된 게시글이 없습니다.</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => post.isSecret ? setSelectedSecretPostId(post.id) : null}
                            className={cn(
                                "p-6 transition-all group",
                                post.category === 'free' ? "hover:bg-slate-50 cursor-pointer" : "bg-slate-50/50"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Badges */}
                                    {post.category === "notice" ? (
                                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 uppercase tracking-wider">
                                            <Pin size={10} fill="currentColor" /> 공지
                                        </span>
                                    ) : (
                                        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                            잡담
                                        </span>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 flex items-center gap-2">
                                        {post.title}
                                        {post.isSecret && <Lock size={14} className="text-amber-500" />}
                                    </h3>
                                </div>
                                <span className="text-xs text-slate-400 flex-shrink-0 flex items-center gap-1 font-medium">
                                    <Calendar size={12} /> {post.date}
                                </span>
                            </div>

                            {/* Content Preview */}
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                {post.isSecret ? (
                                    <span className="flex items-center gap-2 text-slate-400 italic">
                                        <Lock size={12} /> 비밀글입니다 - 내용을 보려면 비밀번호를 입력하세요.
                                    </span>
                                ) : (
                                    post.content
                                )}
                            </p>

                            {/* Footer Info */}
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                <span className={cn("flex items-center gap-1.5", post.category === 'notice' ? "text-indigo-600 font-bold" : "")}>
                                    <User size={12} />
                                    {post.isSecret ? maskNickname(post.author) : post.author}
                                    {post.category === 'notice' && " (Admin)"}
                                </span>
                                <div>Views {post.views}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Write Modal */}
            {isWriting && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <PenSquare className="text-indigo-600" size={20} /> Write New Post
                            </h2>
                            <button onClick={() => setIsWriting(false)} className="text-slate-400 hover:text-slate-600 font-bold p-2">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="flex gap-6">
                                {/* Category */}
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Category</label>
                                    <div className="flex gap-2">
                                        <label className={cn(
                                            "flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-bold",
                                            newCategory === 'free'
                                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                : "border-slate-100 text-slate-500 hover:bg-slate-50"
                                        )}>
                                            <input type="radio" name="cat" className="hidden"
                                                checked={newCategory === 'free'} onChange={() => setNewCategory('free')} />
                                            Free Board
                                        </label>
                                        <label className={cn(
                                            "flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold",
                                            isAdmin ? "cursor-pointer" : "opacity-50 cursor-not-allowed bg-slate-50",
                                            newCategory === 'notice'
                                                ? "border-red-500 bg-red-50 text-red-700"
                                                : "border-slate-100 text-slate-400"
                                        )}>
                                            <input type="radio" name="cat" className="hidden"
                                                checked={newCategory === 'notice'} onChange={() => isAdmin && setNewCategory('notice')} disabled={!isAdmin} />
                                            <div className="flex items-center gap-1.5">
                                                {isAdmin ? <Pin size={14} /> : <Lock size={14} />}
                                                Notice
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Nickname & Secret Option */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nickname</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                                            placeholder="Display Name"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {newCategory === 'free' && (
                                    <div className="flex-1">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                            <input
                                                type="checkbox"
                                                checked={isSecret}
                                                onChange={(e) => setIsSecret(e.target.checked)}
                                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Secret Post
                                        </label>
                                        <div className="relative">
                                            <Lock className={cn("absolute left-3 top-3", isSecret ? "text-indigo-500" : "text-slate-300")} size={18} />
                                            <input
                                                type="password"
                                                disabled={!isSecret}
                                                required={isSecret}
                                                className={cn(
                                                    "w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium transition-colors",
                                                    isSecret ? "bg-white" : "bg-slate-100 text-slate-400"
                                                )}
                                                placeholder={isSecret ? "Enter Password" : "Not Secret"}
                                                value={postPassword}
                                                onChange={(e) => setPostPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-lg"
                                    placeholder="Subject"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Content</label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
                                    placeholder="What's on your mind?"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsWriting(false)}
                                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Secret Post Password Modal */}
            {selectedSecretPostId !== null && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">비밀글입니다</h3>
                            <p className="text-sm text-slate-500">내용을 보려면 비밀번호를 입력하세요.</p>
                        </div>
                        <input
                            type="password"
                            autoFocus
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-bold tracking-widest text-lg mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="●●●●"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setSelectedSecretPostId(null); setInputPassword(""); }}
                                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUnlockPost}
                                className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-200"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
