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

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First check if user exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (existingUser.user) {
        setError('このメールアドレスは既に登録されています。ログインページからログインしてください。');
        setLoading(false);
        return;
      }

      // If user doesn't exist, proceed with signup
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('ユーザー登録に失敗しました');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
            subscription_tier: 0,
          },
        ]);

      if (profileError) {
        // If profile creation fails, clean up by signing out
        await supabase.auth.signOut();
        throw profileError;
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
                Baluboへようこそ
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                アカウントを作成して、ポートフォリオ作成を始めましょう
              </p>
            </div>

            {error && (
              <Alert type="error" className="mb-6">
                <p>{error}</p>
                {error.includes('既に登録されています') && (
                  <div className="mt-2">
                    <Link
                      to="/login"
                      className="text-error-600 hover:text-error-800 font-medium"
                    >
                      ログインページへ
                    </Link>
                  </div>
                )}
              </Alert>
            )}

            <div className="space-y-6">
              <Button
                variant="secondary"
                onClick={handleGoogleSignup}
                isLoading={loading}
                className="w-full"
              >
                <Chrome size={20} className="mr-2" />
                Googleで登録
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">または</span>
                </div>
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-6">
                <FormInput
                  id="name"
                  label="ユーザー名"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  icon={<Mail size={20} className="text-neutral-400" />}
                  required
                />

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
                  autoComplete="new-password"
                  icon={<Lock size={20} className="text-neutral-400" />}
                  required
                  helpText="6文字以上で入力してください"
                />

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full"
                >
                  アカウント作成
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  すでにアカウントをお持ちの方は{' '}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    ログイン
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