import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// 環境変数の取得方法を変更
// Netlifyデプロイ時にはprocess.envから取得するように変更
// ハードコードされた値をフォールバックとして使用
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://msaikiiwdhgfyovjxuso.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zYWlraWl3ZGhnZnlvdmp4dXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODIxODYsImV4cCI6MjA1NzQ1ODE4Nn0.-Tn2oT12v9JKt09OBQ3RJ0aEK4YMmtWlLOtIndn06Y0';

// 環境変数チェックを無効化（フォールバック値があるため）
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'balubo@0.1.0'
    }
  }
});

export type Tables = Database['public']['Tables'];
export type Users = Tables['users']['Row'];
export type Works = Tables['works']['Row'];