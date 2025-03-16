import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 環境変数をロード
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // ベースパスを設定（必要に応じて変更）
    base: '/',
    build: {
      // ソースマップを生成（デバッグ用）
      sourcemap: true,
      // 出力ディレクトリ
      outDir: 'dist',
      // ビルド時の警告を表示
      reportCompressedSize: true,
      // チャンクサイズの警告閾値
      chunkSizeWarningLimit: 1000,
    },
    // 環境変数を定義
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || 'https://msaikiiwdhgfyovjxuso.supabase.co'),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zYWlraWl3ZGhnZnlvdmp4dXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODIxODYsImV4cCI6MjA1NzQ1ODE4Nn0.-Tn2oT12v9JKt09OBQ3RJ0aEK4YMmtWlLOtIndn06Y0'),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || 'AIzaSyBiWIbXXRT0wDqHl8VdChfLmmBN_VKuseQ'),
      'process.env.VITE_LINKPREVIEW_API_KEY': JSON.stringify(env.VITE_LINKPREVIEW_API_KEY || '23c2c2d4e248bc250a0adf683ac26621'),
    },
    server: {
      proxy: {
        // LinkPreview APIへのリクエストをプロキシ
        '/api/linkpreview': {
          target: 'https://api.linkpreview.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/linkpreview/, ''),
        },
        // 外部URLへのリクエストをプロキシ（シンプルな実装に変更）
        '/api/proxy': {
          target: 'https://example.com', // デフォルトターゲット（実際のリクエストでは使用されない）
          changeOrigin: true,
          bypass: (req) => {
            // CORSバイパスのためのカスタムロジック
            // 実際のリクエストはedge-functions.tsで処理
            console.log('Proxying request:', req.url);
            return; // bypassしない
          }
        },
      },
    },
  };
});
