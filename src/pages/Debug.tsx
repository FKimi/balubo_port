import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/Container';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Alert } from '../components/Alert';
import { Badge } from '../components/Badge';
import { Bug, Database, Settings, User } from 'lucide-react';
import { collectDebugData, DebugData } from '../lib/debug';
import { isDevelopment } from '../lib/development';

export function Debug() {
  const navigate = useNavigate();
  const [data, setData] = useState<DebugData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isDevelopment) {
      navigate('/');
      return;
    }

    async function fetchDebugData() {
      try {
        const debugData = await collectDebugData();
        setData(debugData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'デバッグ情報の取得に失敗しました');
      }
    }

    fetchDebugData();
  }, [navigate]);

  if (!isDevelopment) return null;

  return (
    <Container size="lg" className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center">
          <Bug className="mr-2" />
          デバッグページ
        </h1>
        <Badge variant="warning">開発環境のみ</Badge>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" />
              認証状態
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-neutral-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(data?.auth, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2" />
              データベース
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-neutral-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(data?.database, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Environment */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2" />
              環境情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-neutral-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(data?.environment, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}