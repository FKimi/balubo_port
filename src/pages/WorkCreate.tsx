import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Container } from '../components/Container';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { Alert } from '../components/Alert';
import { ArrowLeft, Link as LinkIcon, FileText, Image, X } from 'lucide-react';
import { fetchMetadata } from '../lib/edge-functions';
import { analyzeContent } from '../lib/gemini';

type WorkData = {
  title: string;
  description: string;
  source_url: string;
  work_type: 'writing' | 'design';
  image_url?: string;
  file?: File;
};

type Analysis = {
  expertise: {
    categories: Array<{ name: string; score: number }>;
    summary: string;
  };
  content_style: {
    features: Array<{ name: string; score: number }>;
    summary: string;
  };
  interests: {
    tags: string[];
    summary: string;
  };
} | null;

const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  'application/pdf',
  'application/x-photoshop',
  'application/illustrator'
];

export function WorkCreate() {
  const navigate = useNavigate();
  const [workData, setWorkData] = useState<WorkData>({
    title: '',
    description: '',
    source_url: '',
    work_type: 'writing'
  });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [articleMetadata, setArticleMetadata] = useState<{
    title: string;
    description: string | null;
    thumbnail_url: string | null;
  } | null>(null);

  // URLが変更されたときに自動的にメタデータを取得
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (workData.source_url && !extracting && workData.work_type === 'writing') {
        try {
          // URLの形式チェック
          try {
            new URL(workData.source_url);
          } catch {
            return; // 無効なURLの場合は何もしない
          }

          setExtracting(true);
          setError(null);

          // メタデータを取得
          const metadata = await fetchMetadata(workData.source_url);
          
          if (metadata.error) {
            throw new Error(metadata.error);
          }

          // 記事メタデータを設定
          setArticleMetadata({
            title: metadata.title,
            description: metadata.description,
            thumbnail_url: metadata.thumbnail_url || metadata.image
          });

          // サムネイル画像URLも設定
          setWorkData(prev => ({
            ...prev,
            title: metadata.title || prev.title,
            description: metadata.description || prev.description,
            image_url: metadata.thumbnail_url || metadata.image || prev.image_url
          }));

          // AI分析を実行
          const contentAnalysis = await analyzeContent({
            title: metadata.title,
            description: metadata.description,
            url: workData.source_url
          });

          setAnalysis(contentAnalysis);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'メタデータの取得に失敗しました');
        } finally {
          setExtracting(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [workData.source_url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError('サポートされていないファイル形式です');
      return;
    }

    // プレビュー用のURL生成
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    setWorkData(prev => ({
      ...prev,
      file,
      image_url: null // ファイルが選択されたらURLをクリア
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // 必須項目のチェック
      if (!workData.title) {
        throw new Error('タイトルは必須です');
      }

      let image_url = workData.image_url;

      // ファイルがある場合はアップロード
      if (workData.file) {
        const fileExt = workData.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/works/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('works')
          .upload(filePath, workData.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('works')
          .getPublicUrl(filePath);

        image_url = publicUrl;
      }

      // 作品を保存
      const { data: work, error: workError } = await supabase
        .from('works')
        .insert([
          {
            user_id: user.id,
            title: workData.title,
            description: workData.description,
            source_url: workData.source_url,
            work_type: workData.work_type,
            thumbnail_url: image_url
          },
        ])
        .select()
        .single();

      if (workError) throw workError;

      // AI分析結果を保存
      if (analysis && work) {
        const { error: analysisError } = await supabase
          .from('ai_analyses')
          .insert([
            {
              work_id: work.id,
              expertise: analysis.expertise,
              content_style: analysis.content_style,
              interests: analysis.interests,
            },
          ]);

        if (analysisError) throw analysisError;
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '作品の登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const isAnalyzing = extracting && !analysis;

  return (
    <Container size="md">
      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-neutral-600 hover:text-neutral-900 flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            マイページに戻る
          </button>

          <Button
            onClick={handleSubmit}
            isLoading={loading}
          >
            保存
          </Button>
        </div>

        {error && (
          <Alert type="error" className="mb-6" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent>
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              作品の種類
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setWorkData(prev => ({ ...prev, work_type: 'writing' }))}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  workData.work_type === 'writing'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-200'
                }`}
              >
                <FileText size={24} className={`mx-auto mb-4 ${
                  workData.work_type === 'writing' ? 'text-primary-500' : 'text-neutral-400'
                }`} />
                <p className={`text-center font-medium ${
                  workData.work_type === 'writing' ? 'text-primary-900' : 'text-neutral-600'
                }`}>
                  記事・文章
                </p>
              </button>

              <button
                onClick={() => setWorkData(prev => ({ ...prev, work_type: 'design' }))}
                className={`p-6 rounded-lg border-2 transition-colors ${
                  workData.work_type === 'design'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-primary-200'
                }`}
              >
                <Image size={24} className={`mx-auto mb-4 ${
                  workData.work_type === 'design' ? 'text-primary-500' : 'text-neutral-400'
                }`} />
                <p className={`text-center font-medium ${
                  workData.work_type === 'design' ? 'text-primary-900' : 'text-neutral-600'
                }`}>
                  デザイン
                </p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent>
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              作品情報
            </h2>

            <div className="space-y-6">
              {workData.work_type === 'writing' && (
                <>
                  <FormInput
                    id="source_url"
                    label="作品URL"
                    type="url"
                    value={workData.source_url}
                    onChange={(e) => setWorkData(prev => ({ ...prev, source_url: e.target.value }))}
                    placeholder="https://example.com/your-work"
                    icon={<LinkIcon size={20} className="text-neutral-400" />}
                    helpText="URLを入力すると、タイトルや説明文を自動で取得します"
                  />
                  
                  {/* 記事プレビューバナー */}
                  {articleMetadata && articleMetadata.thumbnail_url && (
                    <div className="mt-4">
                      <img 
                        src={articleMetadata.thumbnail_url} 
                        alt="記事サムネイル"
                        className="w-full h-auto object-contain rounded-lg border border-neutral-200 shadow-sm"
                        style={{ maxHeight: '300px' }}
                        onError={(e) => {
                          // 画像読み込みエラー時に非表示にする
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* AI分析バナー */}
                  <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-primary-900">AI分析</h3>
                        <p className="text-sm text-primary-700 mt-1">
                          URLを入力すると、AIがコンテンツを分析し、あなたの専門性や作品の特徴を可視化します
                        </p>
                      </div>
                      {extracting && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {workData.work_type === 'design' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    デザインファイル
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Image size={24} className="mx-auto text-neutral-400" />
                      <div className="flex text-sm text-neutral-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>ファイルを選択</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept={ACCEPTED_FILE_TYPES.join(',')}
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">またはドラッグ＆ドロップ</p>
                      </div>
                      <p className="text-xs text-neutral-500">
                        JPEG, PNG, GIF, PSD, AI, PDF, TIFF, WEBP (最大10MB)
                      </p>
                    </div>
                  </div>
                  {preview && (
                    <div className="mt-4 relative">
                      <img
                        src={preview}
                        alt="プレビュー"
                        className="max-w-full h-auto rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setPreview(null);
                          setWorkData(prev => ({ ...prev, file: undefined }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <FormInput
                id="title"
                label="タイトル"
                type="text"
                value={workData.title}
                onChange={(e) => setWorkData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="作品のタイトル"
                required
              />

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  説明文
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={workData.description}
                  onChange={(e) => setWorkData(prev => ({ ...prev, description: e.target.value }))}
                  className="block w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="作品の説明文"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI分析結果 */}
        {isAnalyzing ? (
          <Card className="mb-6">
            <CardContent>
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                <p className="text-neutral-600">AI分析中...</p>
              </div>
            </CardContent>
          </Card>
        ) : analysis ? (
          <Card>
            <CardContent>
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                AI分析結果
              </h2>

              <div className="space-y-8">
                {/* 専門性 */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    専門性（強み）
                  </h3>
                  <div className="space-y-4">
                    <p className="text-neutral-600">{analysis.expertise.summary}</p>
                  </div>
                </div>

                {/* 作品の特徴 */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    作品の特徴
                  </h3>
                  <div className="space-y-4">
                    <p className="text-neutral-600">{analysis.content_style.summary}</p>
                  </div>
                </div>

                {/* 興味・関心 */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    興味・関心
                  </h3>
                  <div className="space-y-4">
                    <p className="text-neutral-600">{analysis.interests.summary}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Container>
  );
}