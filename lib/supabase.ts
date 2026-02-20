import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 내보내기 (DB, Auth 등 사용 목적)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
