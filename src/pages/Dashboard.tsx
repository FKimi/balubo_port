import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Container } from '../components/Container';
import { Card, CardContent } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import {
  LayoutGrid,
  List,
  Plus,
  Pencil,
  Target,
  Sparkles,
  Brain,
  Star,
  TrendingUp,
  BarChart4,
  FileText,
  Clock,
  Users,
  Type,
  AlignLeft,
  Twitter,
  Instagram,
  Facebook,
  Filter,
  Search,
  Calendar,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

type User = {
  id: string;
  name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  twitter_username: string | null;
  instagram_username: string | null;
  facebook_username: string | null;
};

type Work = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  work_type: 'writing' | 'design';
  design_type?: string;
  tools_used?: string[];
};

type UserAnalysis = {
  expertise_summary: {
    text: string;
    highlights: string[];
  };
  style_summary: {
    text: string;
    highlights: string[];
  };
  interests_summary: {
    text: string;
    tags: string[];
  };
  talent_score: {
    score: number;
    evaluation: string;
  };
} | null;

type ActivityStats = {
  totalWorks: number;
  monthlyWorks: number[];
  totalViews: number;
  averageEngagement: number;
  totalCharacters: number;
  averageCharacters: number;
};

const DESIGN_TYPES = [
  'ウェブデザイン',
  'ロゴ',
  'バナー',
  'イラスト',
  'UI/UX',
  'その他'
];

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [analysis, setAnalysis] = useState<UserAnalysis>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    totalWorks: 0,
    monthlyWorks: [4, 6, 8, 5, 7, 10, 12, 9, 11, 8, 13, 15],
    totalViews: 2450,
    averageEngagement: 28.5,
    totalCharacters: 0,
    averageCharacters: 0
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkType, setSelectedWorkType] = useState<'all' | 'writing' | 'design'>('all');
  const [selectedDesignType, setSelectedDesignType] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter works
  const filteredWorks = works.filter(work => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = work.title.toLowerCase().includes(query);
      const matchesDescription = work.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Work type filter
    if (selectedWorkType !== 'all' && work.work_type !== selectedWorkType) {
      return false;
    }

    // Design type filter
    if (selectedDesignType && work.design_type !== selectedDesignType) {
      return false;
    }

    // Tools filter
    if (selectedTools.length > 0 && (!work.tools_used || !selectedTools.every(tool => work.tools_used?.includes(tool)))) {
      return false;
    }

    // Date range filter
    if (dateRange !== 'all') {
      const workDate = new Date(work.created_at);
      const now = new Date();
      switch (dateRange) {
        case 'week':
          if (now.getTime() - workDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'month':
          if (now.getTime() - workDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
          break;
        case 'year':
          if (now.getTime() - workDate.getTime() > 365 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }

    return true;
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUser(profile);

        // Fetch works
        const { data: works, error: worksError } = await supabase
          .from('works')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (worksError) throw worksError;
        setWorks(works || []);

        // Calculate character counts
        if (works) {
          const totalChars = works.reduce((sum, work) => {
            return sum + (work.description?.length || 0);
          }, 0);
          
          setActivityStats(prev => ({
            ...prev,
            totalWorks: works.length,
            totalCharacters: totalChars,
            averageCharacters: works.length > 0 ? Math.round(totalChars / works.length) : 0
          }));
        }

        // Fetch user analysis
        const { data: analyses, error: analysisError } = await supabase
          .from('user_analyses')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        if (!analysisError && analyses && analyses.length > 0) {
          setAnalysis(analyses[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [navigate]);

  const handleTwitterConnect = async () => {
    try {
      setLoading(true);
      await connectTwitter();
      // OAuthのリダイレクト後に自動的にダッシュボードに戻ります
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Twitter連携に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // OAuthコールバックの処理
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.provider_token) {
        try {
          const twitterData = session.user.user_metadata;
          await updateUserWithTwitterData(twitterData);
          // プロフィール情報を再取得
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) setUser(profile);
        } catch (err) {
          console.error('OAuth callback error:', err);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 pb-8">
        <Container>
          <div className="flex items-center justify-between pt-8">
            <div className="flex items-center space-x-4">
              <Avatar
                src={user?.profile_image_url}
                alt={user?.name || ''}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {user?.name || 'ゲスト'}
                </h1>
                <p className="text-neutral-600 mt-1">
                  {user?.bio || 'プロフィールを編集して自己紹介を追加しましょう'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/profile')}
                className="flex items-center"
              >
                <Pencil size={16} className="mr-2" />
                プロフィール編集
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleTwitterConnect}
                  isLoading={loading}
                  className={user?.twitter_username ? 'bg-blue-50 text-blue-600' : ''}
                >
                  <Twitter size={16} className="mr-2" />
                  {user?.twitter_username ? 'Twitter連携済み' : 'Twitterと連携'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSocialConnect('instagram')}
                  disabled
                >
                  <Instagram size={16} className="mr-2" />
                  Instagram
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSocialConnect('facebook')}
                  disabled
                >
                  <Facebook size={16} className="mr-2" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <section className="mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
            <BarChart4 className="mr-2 text-primary-600" />
            実績・活動量
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
            <Card>
              <CardContent className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="text-primary-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">総作品数</p>
                  <p className="text-2xl font-bold text-neutral-900">{activityStats.totalWorks}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="text-accent-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">総閲覧数</p>
                  <p className="text-2xl font-bold text-neutral-900">{activityStats.totalViews}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="text-success-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">月間投稿数</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {activityStats.monthlyWorks[activityStats.monthlyWorks.length - 1]}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="text-warning-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">エンゲージメント</p>
                  <p className="text-2xl font-bold text-neutral-900">{activityStats.averageEngagement}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <Type className="text-primary-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">総文字数</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {activityStats.totalCharacters.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
                  <AlignLeft className="text-accent-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">平均文字数</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {activityStats.averageCharacters.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">月間投稿推移</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityStats.monthlyWorks.map((value, index) => ({
                      month: `${index + 1}月`,
                      works: value
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="works"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
            <Sparkles className="mr-2 text-primary-600" />
            あなたの才能分析
          </h2>

          <div className="grid gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Target className="text-primary-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    専門性（強み）
                  </h3>
                </div>
                
                {analysis?.expertise_summary ? (
                  <div className="space-y-4">
                    <p className="text-neutral-600">
                      {analysis.expertise_summary.text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.expertise_summary.highlights.map((highlight, index) => (
                        <Badge key={index} variant="primary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">
                    作品を追加すると、AIがあなたの専門性を分析します
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Star className="text-accent-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    作品の特徴・魅力
                  </h3>
                </div>

                {analysis?.style_summary ? (
                  <div className="space-y-4">
                    <p className="text-neutral-600">
                      {analysis.style_summary.text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.style_summary.highlights.map((highlight, index) => (
                        <Badge key={index} variant="primary">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">
                    作品を追加すると、AIがあなたの文章の特徴を分析します
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Brain className="text-success-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    興味・関心
                  </h3>
                </div>

                {analysis?.interests_summary ? (
                  <div className="space-y-4">
                    <p className="text-neutral-600">
                      {analysis.interests_summary.text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.interests_summary.tags.map((tag, index) => (
                        <Badge key={index} variant="success">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-500 italic">
                    作品を追加すると、AIがあなたの興味・関心を分析します
                  </p>
                )}
              </CardContent>
            </Card>

            {analysis?.talent_score && (
              <Card>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <TrendingUp className="text-primary-600 mr-2" size={20} />
                    <h3 className="text-lg font-semibold text-neutral-900">
                      才能スコア
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-neutral-600">
                        {analysis.talent_score.evaluation}
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-primary-600">
                      {analysis.talent_score.score}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">作品一覧</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-neutral-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter size={20} className="mr-2" />
                フィルター
              </Button>
              <Button
                onClick={() => navigate('/works/new')}
                className="flex items-center"
              >
                <Plus size={20} className="mr-2" />
                新規作品
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-6">
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    キーワード検索
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="タイトルや説明文で検索..."
                      className="pl-10 pr-4 py-2 w-full rounded-lg border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  </div>
                </div>

                {/* Work Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    作品の種類
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={selectedWorkType === 'all' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setSelectedWorkType('all')}
                    >
                      すべて
                    </Badge>
                    <Badge
                      variant={selectedWorkType === 'writing' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setSelectedWorkType('writing')}
                    >
                      記事・文章
                    </Badge>
                    <Badge
                      variant={selectedWorkType === 'design' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setSelectedWorkType('design')}
                    >
                      デザイン
                    </Badge>
                  </div>
                </div>

                {/* Design Type (only show when design is selected) */}
                {selectedWorkType === 'design' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      デザインの種類
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DESIGN_TYPES.map(type => (
                        <Badge
                          key={type}
                          variant={selectedDesignType === type ? 'primary' : 'default'}
                          className="cursor-pointer"
                          onClick={() => setSelectedDesignType(selectedDesignType === type ? null : type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    期間
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={dateRange === 'all' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setDateRange('all')}
                    >
                      すべて
                    </Badge>
                    <Badge
                      variant={dateRange === 'week' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setDateRange('week')}
                    >
                      1週間以内
                    </Badge>
                    <Badge
                      variant={dateRange === 'month' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setDateRange('month')}
                    >
                      1ヶ月以内
                    </Badge>
                    <Badge
                      variant={dateRange === 'year' ? 'primary' : 'default'}
                      className="cursor-pointer"
                      onClick={() => setDateRange('year')}
                    >
                      1年以内
                    </Badge>
                  </div>
                </div>

                {/* Active Filters */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="primary" className="flex items-center">
                        検索: {searchQuery}
                        <X
                          size={14}
                          className="ml-2 cursor-pointer"
                          onClick={() => setSearchQuery('')}
                        />
                      </Badge>
                    )}
                    {selectedWorkType !== 'all' && (
                      <Badge variant="primary" className="flex items-center">
                        種類: {selectedWorkType === 'writing' ? '記事・文章' : 'デザイン'}
                        <X
                          size={14}
                          className="ml-2 cursor-pointer"
                          onClick={() => setSelectedWorkType('all')}
                        />
                      </Badge>
                    )}
                    {selectedDesignType && (
                      <Badge variant="primary" className="flex items-center">
                        デザイン: {selectedDesignType}
                        <X
                          size={14}
                          className="ml-2 cursor-pointer"
                          onClick={() => setSelectedDesignType(null)}
                        />
                      </Badge>
                    )}
                    {dateRange !== 'all' && (
                      <Badge variant="primary" className="flex items-center">
                        期間: {
                          dateRange === 'week' ? '1週間以内' :
                          dateRange === 'month' ? '1ヶ月以内' :
                          '1年以内'
                        }
                        <X
                          size={14}
                          className="ml-2 cursor-pointer"
                          onClick={() => setDateRange('all')}
                        />
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="text"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedWorkType('all');
                      setSelectedDesignType(null);
                      setSelectedTools([]);
                      setDateRange('all');
                    }}
                  >
                    フィルターをクリア
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="bg-error-50 text-error-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {works.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  まだ作品が登録されていません
                </h3>
                <p className="text-neutral-600 mb-6">
                  「新規作品」ボタンから、最初の作品を登録してみましょう。
                </p>
                <Button
                  onClick={() => navigate('/works/new')}
                  className="flex items-center mx-auto"
                >
                  <Plus size={20} className="mr-2" />
                  作品を追加
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4 text-sm text-neutral-600">
                {filteredWorks.length}件の作品が見つかりました
              </div>
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredWorks.map((work) => (
                  <Card
                    key={work.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/works/${work.id}`)}
                  >
                    <CardContent className={viewMode === 'list' ? 'flex items-center space-x-4' : ''}>
                      <div className={`${
                        viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48 mb-4'
                      }`}>
                        {work.thumbnail_url ? (
                          <img
                            src={work.thumbnail_url}
                            alt={work.title}
                            className="w-full h-full object-contain bg-white rounded-lg border border-neutral-200"
                            onError={(e) => {
                              // 画像読み込みエラー時はデフォルト表示に切り替え
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement!.innerHTML = `
                                <div class="w-full h-full bg-neutral-100 rounded-lg flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-neutral-400">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <line x1="10" y1="9" x2="8" y2="9"></line>
                                  </svg>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-neutral-400" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-900 mb-2">
                          {work.title}
                        </h3>
                        {work.description && (
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {work.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="default" size="sm">
                            {work.work_type === 'writing' ? '記事・文章' : 'デザイン'}
                          </Badge>
                          {work.design_type && (
                            <Badge variant="default" size="sm">
                              {work.design_type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>
      </Container>
    </div>
  );
}