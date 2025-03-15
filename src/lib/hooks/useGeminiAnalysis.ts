import { useState, useCallback } from 'react';
import { analyzeContent, ContentAnalysis } from '../gemini';

interface UseGeminiAnalysisResult {
  analysis: ContentAnalysis | null;
  loading: boolean;
  error: string | null;
  analyze: (content: { title: string; description?: string | null; url?: string }) => Promise<void>;
  reset: () => void;
}

export function useGeminiAnalysis(): UseGeminiAnalysisResult {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (content: { title: string; description?: string | null; url?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeContent(content);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    analysis,
    loading,
    error,
    analyze,
    reset
  };
}