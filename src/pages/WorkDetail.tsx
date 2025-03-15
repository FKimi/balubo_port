import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Container } from '../components/Container';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

type Work = {
  id: string;
  title: string;
  description: string | null;
  source_url: string;
  thumbnail_url: string | null;
  created_at: string;
  user_id: string;
};

type AIAnalysis = {
  expertise: any;
  content_style: any;
  interests: any;
};

type Tag = {
  id: string;
  name: string;
};

export function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [work, setWork] = useState<Work | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTab, setActiveTab] = useState<'expertise' | 'style' | 'interests'>('expertise');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for AI analysis
  const expertiseData = [
    { subject: 'テクニカルライティング', value: 90 },
    { subject: 'SEO', value: 85 },
    { subject: 'コピーライティング', value: 75 },
    { subject: 'コンテンツ企画', value: 80 },
    { subject: 'マーケティング', value: 70 }
  ];

  const styleData = [
    { name: '論理的', value: 90 },
    { name: '説得力', value: 85 },
    { name: '読みやすさ', value: 95 },
    { name: 'オリジナリティ', value: 80 },
    { name: '専門性', value: 88 }
  ];

  const interestTags = [
    'テクノロジー',
    'プログラミング',
    'AI',
    'デザイン',
    'UX',
    '生産性',
    'マーケティング',
    'ビジネス'
  ];

  useEffect(() => {
    async function fetchWorkData() {
      try {
        if (!id) throw new Error('作品IDが指定されていません');

        const { data: user } = await supabase.auth.getUser();
        if (!user.user) {
          navigate('/login');
          return;
        }

        // Fetch work details
        const { data: work, error: workError } = await supabase
          .from('works')
          .select('*')
          .eq('id', id)
          .single();

        if (workError) throw workError;
        if (!work) throw new Error('作品が見つかりません');

        setWork(work);

        // Fetch AI analysis
        const { data: analysis, error: analysisError } = await supabase
          .from('ai_analyses')
          .select('*')
          .eq('work_id', id)
          .single();

        if (!analysisError) {
          setAnalysis(analysis);
        }

        // Fetch tags
        const { data: workTags, error: tagsError } = await supabase
          .from('work_tags')
          .select(`
            tag_id,
            tags (
              id,
              name
            )
          `)
          .eq('work_id', id);

        if (!tagsError && workTags) {
          setTags(workTags.map(wt => wt.tags));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '作品の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <Container size="md">
        <div className="bg-error-50 text-error-600 p-4 rounded-lg">
          {error || '作品が見つかりません'}
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-neutral-600 hover:text-neutral-900 flex items-center"
        >
          <ArrowLeft size={20} className="mr-2" />
          マイページに戻る
        </button>

        <Button
          variant="secondary"
          onClick={() => navigate(`/works/${id}/edit`)}
          className="flex items-center"
        >
          <Pencil size={16} className="mr-2" />
          編集
        </Button>
      </div>

      {/* Work Information */}
      <Card className="mb-8">
        <CardContent>
          {work.thumbnail_url && (
            <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            {work.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-sm text-neutral-500">
              {new Date(work.created_at).toLocaleDateString('ja-JP')}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag.id} variant="default">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {work.description && (
            <div className="prose max-w-none mb-6">
              <p className="text-neutral-600">{work.description}</p>
            </div>
          )}

          <a
            href={work.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            元記事を見る
            <ExternalLink size={16} className="ml-1" />
          </a>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            AI分析結果
          </h2>

          <div className="border-b border-neutral-200 mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('expertise')}
                className={`pb-4 relative ${
                  activeTab === 'expertise'
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                専門性（強み）
                {activeTab === 'expertise' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`pb-4 relative ${
                  activeTab === 'style'
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                作品の特徴・魅力
                {activeTab === 'style' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('interests')}
                className={`pb-4 relative ${
                  activeTab === 'interests'
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                興味・関心
                {activeTab === 'interests' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            </div>
          </div>

          <div className="h-80">
            {activeTab === 'expertise' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={expertiseData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar
                    name="専門性"
                    dataKey="value"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'style' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={styleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'interests' && (
              <div className="flex flex-wrap gap-2 p-4">
                {interestTags.map(tag => (
                  <Badge key={tag} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Works */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          関連作品
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder for related works */}
          <Card className="bg-neutral-50">
            <CardContent className="h-48 flex items-center justify-center text-neutral-400">
              関連作品は準備中です
            </CardContent>
          </Card>
        </div>
      </section>
    </Container>
  );
}