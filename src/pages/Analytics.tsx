import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import {
  ChevronDown,
  Eye,
  Clock,
  MousePointer,
  MessageSquare,
  TrendingUp,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Brain,
  Target,
  Star,
  Users,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar
} from 'recharts';

// デモデータ
const viewsData = [
  { date: '3/1', views: 120 },
  { date: '3/2', views: 150 },
  { date: '3/3', views: 180 },
  { date: '3/4', views: 220 },
  { date: '3/5', views: 190 },
  { date: '3/6', views: 250 },
  { date: '3/7', views: 300 }
];

const deviceData = [
  { name: 'デスクトップ', value: 45 },
  { name: 'モバイル', value: 35 },
  { name: 'タブレット', value: 20 }
];

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

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981'];

const worksData = [
  {
    id: 1,
    title: 'AIと機械学習の未来',
    views: 1250,
    clicks: 350,
    engagement: 28,
    thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'プログラミング入門ガイド',
    views: 980,
    clicks: 280,
    engagement: 29,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'デザインシステムの構築',
    views: 850,
    clicks: 220,
    engagement: 26,
    thumbnail: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80'
  }
];

export function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <Container size="lg" className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          詳細分析
        </h1>

        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as '7d' | '30d' | '90d')}
            className="rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="7d">過去7日</option>
            <option value="30d">過去30日</option>
            <option value="90d">過去90日</option>
          </select>
          <Calendar className="text-neutral-500" size={20} />
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <Eye className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">総閲覧数</p>
              <p className="text-2xl font-bold text-neutral-900">2,450</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mr-4">
              <Clock className="text-accent-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">平均閲覧時間</p>
              <p className="text-2xl font-bold text-neutral-900">2:30</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
              <MousePointer className="text-success-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">クリック率</p>
              <p className="text-2xl font-bold text-neutral-900">24.8%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
              <MessageSquare className="text-warning-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">問い合わせ数</p>
              <p className="text-2xl font-bold text-neutral-900">18</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="text-primary-600 mr-2" size={20} />
              専門性分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="text-accent-600 mr-2" size={20} />
              文章スタイル分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={styleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="text-primary-600 mr-2" size={20} />
            閲覧数の推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Works Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>作品別パフォーマンス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4">作品</th>
                  <th className="text-right py-3 px-4">閲覧数</th>
                  <th className="text-right py-3 px-4">クリック数</th>
                  <th className="text-right py-3 px-4">エンゲージメント率</th>
                </tr>
              </thead>
              <tbody>
                {worksData.map((work) => (
                  <tr
                    key={work.id}
                    className="border-b border-neutral-200 hover:bg-neutral-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={work.thumbnail}
                          alt={work.title}
                          className="w-12 h-8 object-cover rounded mr-3"
                        />
                        <span className="font-medium text-neutral-900">
                          {work.title}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">{work.views}</td>
                    <td className="text-right py-3 px-4">{work.clicks}</td>
                    <td className="text-right py-3 px-4">{work.engagement}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visitor Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="text-primary-600 mr-2" size={20} />
              訪問元
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Google</span>
                <span className="text-neutral-900 font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">直接訪問</span>
                <span className="text-neutral-900 font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">SNS</span>
                <span className="text-neutral-900 font-medium">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>デバイス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <Monitor className="text-primary-600 mr-2" size={20} />
                <span className="text-sm text-neutral-600">45%</span>
              </div>
              <div className="flex items-center">
                <Smartphone className="text-accent-600 mr-2" size={20} />
                <span className="text-sm text-neutral-600">35%</span>
              </div>
              <div className="flex items-center">
                <Tablet className="text-success-600 mr-2" size={20} />
                <span className="text-sm text-neutral-600">20%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}