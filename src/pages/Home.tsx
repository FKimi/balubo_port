import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  FolderKanban,
  Check,
  Pen,
  Camera,
  Palette,
  Star,
  TrendingUp,
  Heart,
  ExternalLink,
  LineChart,
  Brain,
  Users,
  Zap
} from 'lucide-react';
import { Container } from '../components/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

export function Home() {
  const [activeTab, setActiveTab] = useState<'writer' | 'designer' | 'photographer'>('writer');

  // AI分析サンプルデータ
  const analysisData = {
    writer: {
      expertise: [
        { category: 'テクノロジー', score: 85 },
        { category: 'ライフスタイル', score: 65 },
        { category: 'ビジネス', score: 78 },
        { category: '教育', score: 60 },
        { category: '健康', score: 45 },
      ],
      style: [
        { feature: '簡潔な説明', score: 90 },
        { feature: '論理的構成', score: 85 },
        { feature: '読みやすさ', score: 80 },
        { feature: '感情表現', score: 60 },
        { feature: '説得力', score: 75 },
      ],
      interests: ['AI技術', 'プログラミング', 'UXデザイン', '教育改革', 'リモートワーク']
    },
    designer: {
      expertise: [
        { category: 'UIデザイン', score: 90 },
        { category: 'イラスト', score: 75 },
        { category: 'タイポグラフィ', score: 80 },
        { category: 'ブランディング', score: 85 },
        { category: '印刷デザイン', score: 60 },
      ],
      style: [
        { feature: 'ミニマリズム', score: 85 },
        { feature: 'カラーバランス', score: 90 },
        { feature: '空間活用', score: 80 },
        { feature: '創造性', score: 85 },
        { feature: '一貫性', score: 75 },
      ],
      interests: ['UI/UX', 'モーショングラフィックス', '3Dモデリング', 'NFTアート', '持続可能デザイン']
    },
    photographer: {
      expertise: [
        { category: 'ポートレート', score: 85 },
        { category: '風景', score: 90 },
        { category: '料理', score: 70 },
        { category: 'ストリート', score: 75 },
        { category: '建築', score: 65 },
      ],
      style: [
        { feature: '構図', score: 90 },
        { feature: '色彩表現', score: 85 },
        { feature: '光の活用', score: 95 },
        { feature: 'ストーリー性', score: 80 },
        { feature: '独自性', score: 75 },
      ],
      interests: ['ドローン撮影', 'フィルム写真', 'モノクローム', '夜景撮影', 'ミニマル写真']
    }
  };

  return (
    <div>
      {/* ヘッダー - 未ログインユーザー向け */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <Container>
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="text-primary-600" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">
                Balubo
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-neutral-700 hover:text-neutral-900"
              >
                ログイン
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 mb-6">
                <Zap size={16} />
                <span className="text-sm font-medium">AIがあなたの才能を可視化</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                クリエイター向け
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">
                  AI分析型ポートフォリオ
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 mb-8">
                作品URLを入力するだけで、あなたの強みと魅力をAIが分析・可視化。
                魅力的なポートフォリオを簡単に作成できます。
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  無料で始める
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                
                <Button
                  variant="secondary"
                  onClick={() => {
                    const demoSection = document.getElementById('demo-section');
                    demoSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  デモを見る
                </Button>
              </div>

              <div className="mt-8 flex items-center space-x-8 text-sm text-neutral-600">
                <div className="flex items-center">
                  <Check size={16} className="text-success-500 mr-2" />
                  無料プラン有り
                </div>
                <div className="flex items-center">
                  <Check size={16} className="text-success-500 mr-2" />
                  登録1分
                </div>
                <div className="flex items-center">
                  <Users size={16} className="text-success-500 mr-2" />
                  1,000+ ユーザー
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-white shadow-xl overflow-hidden border border-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80"
                  alt="Portfolio Dashboard"
                  className="w-full h-full object-cover"
                />
                
                {/* ぼかしと半透明のオーバーレイを追加 */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent"></div>
                
                {/* 短いコピーテキスト */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="success" size="sm">AIが分析</Badge>
                    <Badge variant="accent" size="sm">専門性を可視化</Badge>
                  </div>
                  <p className="text-sm md:text-base">あなたの才能を客観的に分析し、魅力的な形で伝えます</p>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -right-4 -bottom-4 bg-white rounded-lg shadow-lg p-4 max-w-xs transform rotate-2">
                <div className="flex items-center space-x-2 text-sm">
                  <LineChart size={16} className="text-primary-600" />
                  <span className="font-medium">専門性スコア: 92%</span>
                </div>
              </div>
              <div className="absolute -left-4 top-1/2 bg-white rounded-lg shadow-lg p-4 max-w-xs transform -rotate-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Brain size={16} className="text-accent-600" />
                  <span className="font-medium">AI分析完了</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Baluboが解決すること
            </h2>
            
            <p className="text-neutral-600">
              クリエイターの作品を分析して、あなたの魅力を客観的に伝える
              新しいポートフォリオの形を提供します。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="text-primary-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  ポートフォリオ作成の手間を削減
                </h3>
                <p className="text-neutral-600">
                  URLを入力するだけで作品情報を自動取得。
                  面倒な手作業から解放されます。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="text-accent-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  客観的な自己PR
                </h3>
                <p className="text-neutral-600">
                  AIが作品を分析し、あなたの強みを
                  客観的に可視化します。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <FolderKanban className="text-success-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  散在した作品の一元管理
                </h3>
                <p className="text-neutral-600">
                  複数のメディアやサイトの作品を
                  一箇所にまとめて管理できます。
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* デモセクション */}
      <section id="demo-section" className="py-20 bg-neutral-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              あなたの才能を可視化
            </h2>
            
            <p className="text-neutral-600">
              AI技術であなたの作品を分析し、専門性や作風の特徴、関心領域を客観的に可視化します。
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-neutral-200 p-1 bg-white shadow-md">
              <button
                onClick={() => setActiveTab('writer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'writer'
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center">
                  <Pen size={16} className="mr-2" />
                  ライター向け
                </span>
              </button>
              <button
                onClick={() => setActiveTab('designer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'designer'
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center">
                  <Palette size={16} className="mr-2" />
                  デザイナー向け
                </span>
              </button>
              <button
                onClick={() => setActiveTab('photographer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'photographer'
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center">
                  <Camera size={16} className="mr-2" />
                  カメラマン向け
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 左側: サンプル作品イメージ */}
            <Card>
              <CardContent className="p-0 overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img
                    src={
                      activeTab === 'writer'
                        ? "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80"
                        : activeTab === 'designer'
                        ? "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80"
                        : "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80"
                    }
                    alt="Portfolio Demo"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {activeTab === 'writer' 
                          ? 'テクノロジーの未来と私たち' 
                          : activeTab === 'designer' 
                          ? 'ミニマルUIデザイン集' 
                          : '都市の光と影'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisData[activeTab].interests.slice(0, 3).map((interest, index) => (
                          <Badge key={index} variant="outline" size="sm" className="text-white border-white">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 右側: AI分析結果の可視化 */}
            <div className="space-y-6">
              {/* 専門性分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="text-primary-600 mr-2" size={18} />
                    専門性（強み）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisData[activeTab].expertise.slice(0, 3).map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.category}</span>
                          <span className="font-medium">{item.score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 作品の特徴 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="text-accent-600 mr-2" size={18} />
                    作品の特徴・魅力
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisData[activeTab].style.slice(0, 3).map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.feature}</span>
                          <span className="font-medium">{item.score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-success-500" 
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 興味・関心 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="text-success-600 mr-2" size={18} />
                    興味・関心
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisData[activeTab].interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" size="lg">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all shadow-lg"
            >
              自分のポートフォリオを作成する
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </Container>
      </section>

      {/* 料金プラン */}
      <section className="py-20 bg-white">
        <Container size="md">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              シンプルな料金プラン
            </h2>
            
            <p className="text-neutral-600">
              無料で始めて、必要に応じてアップグレード。
              追加料金や隠れた費用はありません。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="text-center p-8">
                <Badge variant="default" size="md" className="mb-4">
                  無料プラン
                </Badge>
                <div className="mb-6">
                  <span className="text-4xl font-bold">¥0</span>
                  <span className="text-neutral-600">/月</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    基本的なポートフォリオ機能
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    最大10作品までAI分析
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    標準サポート
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-primary-600 font-medium rounded-xl hover:bg-primary-50 border border-primary-200"
                >
                  無料で始める
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary-200 shadow-lg shadow-primary-100">
              <CardContent className="text-center p-8">
                <Badge variant="primary" size="md" className="mb-4">
                  プロプラン
                </Badge>
                <div className="mb-6">
                  <span className="text-4xl font-bold">¥500</span>
                  <span className="text-neutral-600">/月</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    無制限のAI分析
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    詳細なアナリティクス
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    優先サポート
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <Check size={20} className="text-success-500 mr-2 flex-shrink-0" />
                    カスタマイズ可能なデザイン
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700"
                >
                  アップグレード
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA セクション */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              あなたの才能を世界に伝える時間です
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Baluboを使えば、あなたの実力を客観的に示し、
              理想のクライアントや案件に出会えるチャンスが広がります。
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-800 font-medium rounded-xl hover:bg-neutral-100 transform hover:scale-105 transition-all shadow-lg"
            >
              今すぐ無料で始める
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </Container>
      </section>

      {/* フッター */}
      <footer className="bg-neutral-900 text-white py-12">
        <Container>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Sparkles size={24} />
                <span className="text-xl font-bold">Balubo</span>
              </Link>
              <p className="text-neutral-400">
                クリエイターのための
                <br />
                AI分析型ポートフォリオサービス
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">サービス</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-neutral-400 hover:text-white">
                    機能紹介
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-neutral-400 hover:text-white">
                    料金プラン
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">サポート</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-neutral-400 hover:text-white">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-neutral-400 hover:text-white">
                    よくある質問
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">法的情報</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-neutral-400 hover:text-white">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-neutral-400 hover:text-white">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400">
            <p>© 2025 Balubo. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}