"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    authorEmail?: string;
    date: string;
    category: 'notice' | 'free' | 'info';
    isSecret?: boolean;
    password?: string;
    views: number;
}

export type UserRole = 'USER_1' | 'USER_2' | 'USER_3' | 'ADMIN_1' | 'ADMIN_2';

export interface User {
    email: string;
    nickname: string;
    role: UserRole;
    isAdmin: boolean;
    accessCodes?: string[];
}

export interface MenuItem {
    title: string;
    path: string;
    minRole: UserRole;
    children?: MenuItem[];
}

export const USER_ROLES: Record<UserRole, number> = {
    'USER_1': 1,
    'USER_2': 2,
    'USER_3': 3,
    'ADMIN_2': 8,
    'ADMIN_1': 9
};

interface DataContextType {
    posts: Post[];
    users: User[];
    currentUser: User | null;
    addPost: (post: Omit<Post, 'id' | 'date' | 'views'>) => void;
    updatePost: (id: number, updatedPost: Partial<Post>) => void;
    deletePost: (id: number) => void;
    registerUser: (email: string, nickname: string) => void;
    switchUser: (role: UserRole) => void;
    checkPermission: (requiredRole: UserRole) => boolean;
    grantAccess: (email: string, feature: string) => void;
    verifyAccess: (feature: string) => boolean;
    checkSecretPost: (id: number, password?: string) => boolean;
    showTopBanner: boolean;
    setTopBannerVisibility: (show: boolean) => void;
    isLoadingAuth: boolean;
}

// ----------------------------------------------------------------------
// Initial Mock Data
// ----------------------------------------------------------------------
const INITIAL_POSTS: Post[] = [
    {
        id: 1,
        title: "[필독] 커뮤니티 이용 수칙 안내",
        content: "욕설 및 비방 금지...",
        author: "Amazon Master",
        authorEmail: "admin@withalice.team",
        date: "2024-01-01",
        category: "notice",
        views: 1205
    },
    {
        id: 2,
        title: "2024년 FBA 수수료 변경 정리 (Info)",
        content: "수수료 변경 상세 내용...",
        author: "Amazon Master",
        authorEmail: "admin@withalice.team",
        date: "2024-01-15",
        category: "info",
        views: 540
    },
    {
        id: 3,
        title: "초보 셀러 질문 드립니다 ㅠㅠ",
        content: "가입 승인이 안 나는데...",
        author: "Seller123",
        date: "2024-01-20",
        category: "free",
        views: 12
    }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [showTopBanner, setTopBannerVisibility] = useState(true);

    // Mock Users for Demo
    const MOCK_USERS: Record<UserRole, User> = {
        'USER_1': { email: 'user1@test.com', nickname: 'Newbie', role: 'USER_1', isAdmin: false },
        'USER_2': { email: 'user2@test.com', nickname: 'ProSeller', role: 'USER_2', isAdmin: false },
        'USER_3': { email: 'client@test.com', nickname: 'BigBrand', role: 'USER_3', isAdmin: false },
        'ADMIN_2': { email: 'manager@withalice.team', nickname: 'Manager', role: 'ADMIN_2', isAdmin: true },
        'ADMIN_1': { email: 'admin@withalice.team', nickname: 'Master', role: 'ADMIN_1', isAdmin: true },
    };

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    // ✅ Supabase Auth Listener
    useEffect(() => {
        // 프리패스 모의 어드민 세션 확인 (DB 조회 없이 무조건 로그인)
        if (typeof window !== 'undefined' && window.localStorage.getItem("mock_admin") === "true") {
            setCurrentUser({
                email: 'admin@withalice.team',
                nickname: 'Admin (Mock)',
                role: 'ADMIN_1',
                isAdmin: true
            });
            setIsLoadingAuth(false);
            return;
        }

        // 현재 세션 확인
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                mapSupabaseUserToLocalUser(session.user);
            }
            setIsLoadingAuth(false);
        });

        // 인증 상태 변경 감지 (로그인, 로그아웃 등)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            if (session?.user) {
                mapSupabaseUserToLocalUser(session.user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapSupabaseUserToLocalUser = (sUser: any) => {
        // Supabase user_metadata 정보 활용, 없으면 기본값 설정
        const role = sUser.user_metadata?.role || 'USER_1';
        const nickname = sUser.user_metadata?.nickname || sUser.email?.split('@')[0] || 'User';

        setCurrentUser({
            email: sUser.email || '',
            nickname,
            role,
            isAdmin: role === 'ADMIN_1' || role === 'ADMIN_2'
        });
    };

    const addPost = (postData: Omit<Post, 'id' | 'date' | 'views'>) => {
        const newPost: Post = { ...postData, id: Date.now(), date: new Date().toISOString().split('T')[0], views: 0 };
        setPosts(prev => [newPost, ...prev]);
    };

    const updatePost = (id: number, updatedPost: Partial<Post>) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedPost } : p));
    };

    const deletePost = (id: number) => {
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    const registerUser = (email: string, nickname: string) => {
        // Mock registration
        console.log("Registering", email);
    };

    const switchUser = (role: UserRole) => {
        setCurrentUser(MOCK_USERS[role]);
    };

    const checkPermission = (requiredRole: UserRole) => {
        if (!currentUser) return false;
        return USER_ROLES[currentUser.role] >= USER_ROLES[requiredRole];
    };

    const [accessGrants, setAccessGrants] = useState<Record<string, string[]>>({});

    const grantAccess = (email: string, feature: string) => {
        setAccessGrants(prev => ({
            ...prev,
            [email]: [...(prev[email] || []), feature]
        }));
    };

    const verifyAccess = (feature: string) => {
        if (!currentUser) return false;
        // Check if user has explicit access
        const userGrants = accessGrants[currentUser.email] || [];
        if (userGrants.includes(feature)) return true;

        // Also allow if user has high enough role (optional, but good for admin)
        if (checkPermission('ADMIN_1')) return true;

        return false;
    };

    const checkSecretPost = (id: number, password?: string) => {
        const post = posts.find(p => p.id === id);
        if (!post || !post.isSecret) return true;

        // If author or admin, allow access? (Optional logic)
        if (currentUser && (post.authorEmail === currentUser.email || currentUser.isAdmin)) return true;

        return post.password === password;
    };

    return (
        <DataContext.Provider value={{
            posts,
            users: Object.values(MOCK_USERS).map(u => ({
                ...u,
                accessCodes: accessGrants[u.email] || []
            })),
            currentUser,
            addPost,
            updatePost,
            deletePost,
            registerUser,
            switchUser,
            checkPermission,
            grantAccess,
            verifyAccess,
            checkSecretPost,
            showTopBanner,
            setTopBannerVisibility,
            isLoadingAuth
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
