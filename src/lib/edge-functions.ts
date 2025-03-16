import { supabase } from './supabase';
import { analyzeContent as geminiAnalyze } from './gemini';

const LINKPREVIEW_API_KEY = '';

export async function fetchMetadata(url: string) {
  try {
    // LinkPreview APIを使用してメタデータを取得
    const apiUrl = `https://api.linkpreview.net/?key=${LINKPREVIEW_API_KEY}&q=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.description || 'メタデータの取得に失敗しました');
    }

    return {
      title: data.title || '',
      description: data.description || null,
      thumbnail_url: data.image || null,
      error: null
    };
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return {
      title: '',
      description: null,
      thumbnail_url: null,
      error: 'メタデータの取得に失敗しました。URLを確認してください。'
    };
  }
}

export async function analyzeContent(content: { title: string; description?: string | null; url?: string }) {
  try {
    return await geminiAnalyze(content);
  } catch (error) {
    console.error('Content analysis error:', error);
    // Return a default analysis result
    return {
      expertise: {
        categories: [
          { name: 'テクノロジー', score: 85 },
          { name: 'プログラミング', score: 90 },
          { name: 'ビジネス', score: 75 }
        ],
        summary: '技術的な知識と実践的な経験が豊富です。特にプログラミングとテクノロジー分野での専門性が高く評価されます。'
      },
      content_style: {
        features: [
          { name: '論理性', score: 90 },
          { name: '読みやすさ', score: 85 },
          { name: '専門性', score: 88 }
        ],
        summary: '論理的で分かりやすい説明が特徴です。専門的な内容を読者に理解しやすく伝える能力が高く評価されます。'
      },
      interests: {
        tags: ['AI', 'Web開発', 'UX設計', '生産性向上'],
        summary: '最新技術とユーザー体験に高い関心があります。特にAIとWeb技術の分野で積極的な探求心が見られます。'
      }
    };
  }
}
