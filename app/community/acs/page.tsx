"use client";

import { useState } from 'react';
import { mockACSPosts, ACSPost } from '../../../data/community_data';
import { Heart, MessageSquare, Lock, Unlock, Paperclip, Plus, Send, X, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ACSPage() {
    // State
    const [posts, setPosts] = useState<ACSPost[]>(mockACSPosts);
    const [selectedPost, setSelectedPost] = useState<ACSPost | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Auth / Secret Logic
    const [passwordInput, setPasswordInput] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);

    // New Post Form
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostIsSecret, setNewPostIsSecret] = useState(false);
    const [newPostPassword, setNewPostPassword] = useState('');

    // Comment Form
    const [commentContent, setCommentContent] = useState('');

    const handlePostClick = (post: ACSPost) => {
        setSelectedPost(post);
        setIsUnlocked(!post.isSecret); // Auto unlock public posts
        setPasswordInput('');
    };

    const handleUnlock = () => {
        if (selectedPost && selectedPost.password === passwordInput) {
            setIsUnlocked(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleCreatePost = () => {
        if (!newPostTitle || !newPostContent) return alert('제목과 내용을 입력해주세요.');
        if (newPostIsSecret && newPostPassword.length !== 4) return alert('비밀번호는 4자리 숫자여야 합니다.');

        const newPost: ACSPost = {
            id: Date.now().toString(),
            title: newPostTitle,
            content: newPostContent,
            author: 'CurrentUser', // Mock
            date: new Date().toISOString().split('T')[0],
            category: 'Free',
            isSecret: newPostIsSecret,
            password: newPostIsSecret ? newPostPassword : undefined,
            views: 0,
            likes: 0,
            comments: []
        };

        setPosts([newPost, ...posts]);
        setIsCreateModalOpen(false);
        // Reset Form
        setNewPostTitle('');
        setNewPostContent('');
        setNewPostIsSecret(false);
        setNewPostPassword('');
    };

    const handleAddComment = () => {
        if (!selectedPost || !commentContent) return;

        const newComment = {
            id: Date.now().toString(),
            author: 'CurrentUser',
            content: commentContent,
            date: new Date().toISOString().split('T')[0],
        };

        const updatedPost = {
            ...selectedPost,
            comments: [...selectedPost.comments, newComment]
        };

        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        setSelectedPost(updatedPost);
        setCommentContent('');
    };

    const handleLike = (e: React.MouseEvent, postId: string) => {
        e.stopPropagation();
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
        if (selectedPost?.id === postId) {
            setSelectedPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500 min-h-screen relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Anyone Can Share (ACS)</h1>
                    <p className="text-pastel-taupe">자유롭게 정보를 공유하고 소통하는 공간입니다.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Write Post
                </button>
            </div>

            {/* Post List */}
            <div className="bg-white rounded-3xl shadow-sm border border-pastel-beige overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-pastel-cream/50 border-b border-pastel-beige text-xs font-bold text-pastel-taupe uppercase tracking-wider">
                    <div className="col-span-1 text-center">No.</div>
                    <div className="col-span-1 text-center">Cat.</div>
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2 text-center">Author</div>
                    <div className="col-span-1 text-center">Views</div>
                    <div className="col-span-1 text-center">Likes</div>
                </div>
                <div>
                    {posts.map((post, idx) => (
                        <div
                            key={post.id}
                            onClick={() => handlePostClick(post)}
                            className="grid grid-cols-12 gap-4 p-4 border-b border-pastel-beige items-center hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                            <div className="col-span-1 text-center text-slate-400 font-medium">{posts.length - idx}</div>
                            <div className="col-span-1 text-center">
                                <span className="px-2 py-1 bg-pastel-cream rounded text-xs font-bold text-primary">{post.category}</span>
                            </div>
                            <div className="col-span-6 font-medium text-slate-700 group-hover:text-primary flex items-center gap-2">
                                {post.title}
                                {post.isSecret && <Lock size={14} className="text-pastel-taupe" />}
                                {post.files && <Paperclip size={14} className="text-pastel-taupe" />}
                            </div>
                            <div className="col-span-2 text-center text-sm text-slate-500">{post.author}</div>
                            <div className="col-span-1 text-center text-sm text-slate-400">{post.views}</div>
                            <div className="col-span-1 flex items-center justify-center gap-1 text-sm text-rose-400 font-bold">
                                <Heart size={14} fill={post.likes > 0 ? "currentColor" : "none"} /> {post.likes}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Post Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsCreateModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 p-8"
                        >
                            <h2 className="text-2xl font-bold text-primary mb-6">Write New Post</h2>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary font-bold text-lg"
                                />

                                <textarea
                                    placeholder="Share your thoughts..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="w-full h-40 px-4 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary resize-none"
                                />

                                <div className="flex items-center gap-4 py-2">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={newPostIsSecret}
                                            onChange={(e) => setNewPostIsSecret(e.target.checked)}
                                            className="w-5 h-5 rounded border-pastel-beige text-primary focus:ring-primary"
                                        />
                                        <span className="font-bold text-slate-600">Secret Post</span>
                                    </label>

                                    {newPostIsSecret && (
                                        <input
                                            type="password"
                                            maxLength={4}
                                            placeholder="4-digit PW"
                                            value={newPostPassword}
                                            onChange={(e) => setNewPostPassword(e.target.value)}
                                            className="w-32 px-3 py-2 rounded-lg border border-pastel-beige focus:outline-none focus:border-primary text-center tracking-widest font-bold"
                                        />
                                    )}
                                </div>

                                <div className="p-4 border border-dashed border-pastel-beige rounded-xl bg-slate-50 flex flex-col items-center justify-center text-pastel-taupe gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex gap-4">
                                        <ImageIcon size={24} />
                                        <Video size={24} />
                                        <FileText size={24} />
                                    </div>
                                    <span className="text-sm font-bold">Click to upload files (Mock)</span>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreatePost}
                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* View Post Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setSelectedPost(null)}
                        />
                        <motion.div
                            layoutId={selectedPost.id}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative z-10 max-h-[90vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-pastel-beige flex items-start justify-between bg-white sticky top-0 z-20">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-bold rounded uppercase">
                                            {selectedPost.category}
                                        </span>
                                        <span className="text-xs text-pastel-taupe">{selectedPost.date}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-primary leading-tight">
                                        {selectedPost.title}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 font-medium">
                                        By {selectedPost.author}
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                        Views {selectedPost.views}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="overflow-y-auto p-0 flex-1 bg-slate-50">
                                {!isUnlocked ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-primary mb-2">Secret Post</h3>
                                        <p className="text-slate-500 mb-6">Enter the 4-digit password to view this content.</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="password"
                                                maxLength={4}
                                                className="w-32 px-4 py-2 rounded-xl border border-pastel-beige text-center font-bold tracking-[0.5em] text-lg focus:border-secondary focus:outline-none"
                                                value={passwordInput}
                                                onChange={(e) => setPasswordInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                                            />
                                            <button
                                                onClick={handleUnlock}
                                                className="px-6 py-2 bg-secondary text-primary font-bold rounded-xl hover:bg-secondary/90 transition-colors"
                                            >
                                                Unlock
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 space-y-8 bg-white min-h-[400px]">
                                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                                            {selectedPost.content}
                                        </p>

                                        {/* Likes */}
                                        <div className="flex justify-center pt-8 pb-4">
                                            <button
                                                onClick={(e) => handleLike(e, selectedPost.id)}
                                                className="flex flex-col items-center gap-2 group"
                                            >
                                                <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-100 group-hover:border-rose-200 transition-all shadow-sm">
                                                    <Heart size={28} fill={selectedPost.likes > 0 ? "currentColor" : "none"} />
                                                </div>
                                                <span className="text-sm font-bold text-rose-400">{selectedPost.likes} Likes</span>
                                            </button>
                                        </div>

                                        {/* Comments Section */}
                                        <div className="border-t border-pastel-beige pt-8">
                                            <h3 className="font-bold text-primary flex items-center gap-2 mb-6">
                                                <MessageSquare size={20} /> Comments ({selectedPost.comments.length})
                                            </h3>

                                            <div className="space-y-6 mb-8">
                                                {selectedPost.comments.map((comment) => (
                                                    <div key={comment.id} className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-pastel-cream flex items-center justify-center font-bold text-primary text-sm shrink-0">
                                                            {comment.author[0]}
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-sm text-primary">{comment.author}</span>
                                                                <span className="text-xs text-pastel-taupe">{comment.date}</span>
                                                            </div>
                                                            <p className="text-slate-600 text-sm">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Write Comment */}
                                            <div className="flex gap-3 items-start">
                                                <div className="flex-1 relative">
                                                    <textarea
                                                        placeholder="Write a comment..."
                                                        maxLength={500}
                                                        rows={2}
                                                        value={commentContent}
                                                        onChange={(e) => setCommentContent(e.target.value)}
                                                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-pastel-beige focus:outline-none focus:border-primary resize-none text-sm bg-slate-50 focus:bg-white transition-colors"
                                                    />
                                                    <button className="absolute right-3 top-3 p-1.5 text-pastel-taupe hover:text-primary rounded hover:bg-slate-200 transition-colors">
                                                        <ImageIcon size={18} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={handleAddComment}
                                                    disabled={!commentContent.trim()}
                                                    className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Send size={20} />
                                                </button>
                                            </div>
                                            <p className="text-right text-xs text-pastel-taupe mt-2">
                                                {commentContent.length}/500
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
