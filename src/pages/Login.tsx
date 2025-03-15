import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { signInWithGoogle } from '../lib/auth';
import { Container } from '../components/Container';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { Alert } from '../components/Alert';
import { Mail, Lock, Chrome } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('メールアドレスまたはパスワードが正しくありません');
          return;
        }
        throw error;
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      // Googleの認証画面にリダイレクトされるため、ここには到達しない
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Googleログインに失敗しました');
      setLoading(false);
    }
  };

  return (
    <Container size="sm">
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900">
                おかえりなさい
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                アカウントにログインして、ポートフォリオ作成を始めましょう
              </p>
            </div>

            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            <div className="space-y-6">
              <Button
                variant="secondary"
                onClick={handleGoogleLogin}
                isLoading={loading}
                className="w-full"
              >
                <Chrome size={20} className="mr-2" />
                Googleでログイン
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">または</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-6">
                <FormInput
                  id="email"
                  label="メールアドレス"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  icon={<Mail size={20} className="text-neutral-400" />}
                  required
                />

                <FormInput
                  id="password"
                  label="パスワード"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  icon={<Lock size={20} className="text-neutral-400" />}
                  required
                />

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full"
                >
                  ログイン
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  アカウントをお持ちでない方は{' '}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    新規登録
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}