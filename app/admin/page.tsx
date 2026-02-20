"use client";

import { useState } from "react";
import { Users, FileText, Bell, BarChart3, Settings, LogOut, Search, Plus, Trash2, Edit2, CheckCircle, GraduationCap } from "lucide-react";
import { useData, Post, User } from "../contexts/DataContext";

export default function AdminDashboard() {
    const isAdmin = true;
    const { posts, users, addPost, deletePost, updatePost, grantAccess } = useData();

    const [activeTab, setActiveTab] = useState("dashboard");

    // Stats Calculation
    const totalUsers = users.length;
    const activePosts = posts.length;
    const totalViews = posts.reduce((acc, curr) => acc + curr.views, 0);

    // Notice & Info Management State
    const [manageType, setManageType] = useState<'notice' | 'info'>('notice');
    const [isWriting, setIsWriting] = useState(false);
    const [writeTitle, setWriteTitle] = useState("");
    const [writeContent, setWriteContent] = useState("");

    const handleAdminPostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addPost({
            title: writeTitle,
            content: writeContent,
            author: "Amazon Master",
            authorEmail: "admin@withalice.team",
            category: manageType // 'notice' or 'info'
        });
        setIsWriting(false);
        setWriteTitle("");
        setWriteContent("");
        alert("Post registered successfully!");
    };

    const handleDeletePost = (id: number) => {
        if (confirm("Are you sure you want to delete this post?")) {
            deletePost(id);
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-100">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-slate-600">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 shadow-2xl">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        <span className="text-indigo-500">Admin</span> Panel
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <MenuItem
                        icon={BarChart3}
                        label="Dashboard"
                        isActive={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                    />
                    <MenuItem
                        icon={Bell}
                        label="Notices & Info"
                        isActive={activeTab === "content"}
                        onClick={() => setActiveTab("content")}
                    />
                    <MenuItem
                        icon={Users}
                        label="User Management"
                        isActive={activeTab === "users"}
                        onClick={() => setActiveTab("users")}
                    />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-slate-800">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                        <p className="text-slate-500">Welcome back, Administrator.</p>
                    </div>
                </header>

                {/* 1. Dashboard Tab */}
                {activeTab === "dashboard" && (
                    <div className="space-y-8 animate-in fade-in">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-6">
                            <StatCard label="Total Users" value={totalUsers} icon={Users} color="bg-blue-500" />
                            <StatCard label="Total Posts" value={activePosts} icon={FileText} color="bg-green-500" />
                            <StatCard label="Total Views" value={totalViews} icon={BarChart3} color="bg-purple-500" />
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800">Recent Posts</h3>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 pl-6">Title</th>
                                        <th className="p-4">Author</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Category</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {posts.slice(0, 5).map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50">
                                            <td className="p-4 pl-6 font-semibold text-slate-900 truncate max-w-xs">{post.title}</td>
                                            <td className="p-4 text-slate-600">{post.author}</td>
                                            <td className="p-4 text-slate-400 text-sm">{post.date}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${post.category === 'notice' ? 'bg-red-100 text-red-600' :
                                                    post.category === 'info' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {post.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 2. Content Management Tab (Notices & Info) */}
                {activeTab === "content" && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center">
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                                <button
                                    onClick={() => setManageType('notice')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${manageType === 'notice' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Community Notices
                                </button>
                                <button
                                    onClick={() => setManageType('info')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${manageType === 'info' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Education Info
                                </button>
                            </div>
                            <button
                                onClick={() => setIsWriting(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                            >
                                <Plus size={18} /> Add New {manageType === 'notice' ? 'Notice' : 'Info'}
                            </button>
                        </div>

                        {/* Post List for Management */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                                    <tr>
                                        <th className="p-4 pl-6">ID</th>
                                        <th className="p-4">Title</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {posts.filter(p => p.category === manageType).map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50">
                                            <td className="p-4 pl-6 text-slate-400">#{post.id}</td>
                                            <td className="p-4 font-semibold text-slate-900">{post.title}</td>
                                            <td className="p-4 text-slate-500">{post.date}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {posts.filter(p => p.category === manageType).length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-slate-400">
                                                No posts found. Create one!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Write Modal */}
                        {isWriting && (
                            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                                <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Edit2 size={20} className="text-indigo-600" />
                                        Write New {manageType === 'notice' ? 'Notice' : 'Education Info'}
                                    </h3>
                                    <form onSubmit={handleAdminPostSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                            <input
                                                type="text" required
                                                value={writeTitle} onChange={e => setWriteTitle(e.target.value)}
                                                className="w-full p-3 border rounded-xl" placeholder="Important Announcement..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Content</label>
                                            <textarea
                                                required rows={6}
                                                value={writeContent} onChange={e => setWriteContent(e.target.value)}
                                                className="w-full p-3 border rounded-xl" placeholder="Enter details..."
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4">
                                            <button type="button" onClick={() => setIsWriting(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                                            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. User Management Tab */}
                {activeTab === "users" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Registered Users</h3>
                            <button className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg">Export CSV</button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                                <tr>
                                    <th className="p-4 pl-6">Nickname</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Access Codes</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((user, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-4 pl-6 font-semibold text-slate-900 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                                                {user.nickname.substring(0, 2).toUpperCase()}
                                            </div>
                                            {user.nickname}
                                        </td>
                                        <td className="p-4 text-slate-600">{user.email}</td>
                                        <td className="p-4">
                                            {user.isAdmin ? (
                                                <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-xs flex w-fit items-center gap-1">
                                                    <CheckCircle size={10} /> Admin
                                                </span>
                                            ) : (
                                                <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-xs w-fit">User</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(user as any).accessCodes?.length > 0 ? (
                                                    ((user as any).accessCodes as string[]).map((code, idx) => (
                                                        <span key={idx} className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-200">
                                                            {code}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-xs">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const code = prompt("Enter Access Code to Grant (e.g., PREMIUM_REPORT):");
                                                    if (code) grantAccess(user.email, code);
                                                }}
                                                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors"
                                            >
                                                + Grant
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

// Helpers
function MenuItem({ icon: Icon, label, isActive, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
            <Icon size={20} /> {label}
        </button>
    );
}
function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} text-white`}><Icon size={24} /></div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
        </div>
    );
}
