import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { uploadProfileImage } from '../lib/storage';
import { ImageUpload } from '../components/ImageUpload';
import { Button } from '../components/Button';

type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  website_url: string | null;
  profile_image_url: string | null;
  subscription_tier: number;
};

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website_url: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUser(user);

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) throw fetchError;

        setProfile(data);
        setFormData({
          name: data?.name || '',
          bio: data?.bio || '',
          website_url: data?.website_url || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'プロフィールの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleImageUpload = async (file: File) => {
    try {
      if (!user) throw new Error('ユーザーが見つかりません');

      const publicUrl = await uploadProfileImage(file);

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, profile_image_url: publicUrl } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像のアップロードに失敗しました');
    }
  };

  const handleImageRemove = async () => {
    try {
      if (!user) throw new Error('ユーザーが見つかりません');

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, profile_image_url: null } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の削除に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) throw new Error('ユーザーが見つかりません');

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          bio: formData.bio,
          website_url: formData.website_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // プロフィール更新後、マイページに遷移
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログアウトに失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プロフィール設定</h1>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-800"
        >
          <LogOut size={20} className="mr-2" />
          ログアウト
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <ImageUpload
          currentImageUrl={profile?.profile_image_url}
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="block w-full rounded-lg border-gray-300 bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              表示名
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              自己紹介
            </label>
            <textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              ウェブサイト
            </label>
            <input
              type="url"
              id="website"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              placeholder="https://example.com"
              className="block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              保存する
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">利用プラン</h2>
        <p className="text-gray-600">
          現在の利用プラン: {profile?.subscription_tier === 1 ? '有料プラン' : '無料プラン'}
        </p>
        {profile?.subscription_tier === 0 && (
          <Button
            variant="secondary"
            onClick={() => alert('準備中です')}
            className="mt-4"
          >
            有料プランへアップグレード
          </Button>
        )}
      </div>
    </div>
  );
}