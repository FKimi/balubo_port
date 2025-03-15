import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
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
});
