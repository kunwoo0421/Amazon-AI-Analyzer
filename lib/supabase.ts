import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 커스텀 스토리지 구현 (로그인 유지 체크 여부에 따라 분기)
const customStorage = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return null;
        // sessionStorage를 먼저 확인하고, 없으면 localStorage 확인
        return window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        // 로그인 시 저장해둔 플래그 확인
        if (window.sessionStorage.getItem('sessionOnly') === 'true') {
            window.sessionStorage.setItem(key, value);
        } else {
            window.localStorage.setItem(key, value);
        }
    },
    removeItem: (key: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
        window.sessionStorage.removeItem(key);
    }
};

// Supabase 클라이언트 내보내기 (DB, Auth 등 사용 목적)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage
    }
});
