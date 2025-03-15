/*
  # ストレージバケットとポリシーの作成

  1. 新規バケット
    - `avatars` - プロフィール画像用のストレージバケット
    - バケットが存在しない場合のみ作成

  2. セキュリティ
    - 認証済みユーザーのみが自分のプロフィール画像を操作可能
    - 全ユーザーが画像を閲覧可能
*/

-- avatarsバケットの作成（存在しない場合のみ）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  END IF;
END $$;

-- avatarsバケットのRLSポリシー
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'プロフィール画像は誰でも閲覧可能'
  ) THEN
    CREATE POLICY "プロフィール画像は誰でも閲覧可能" ON storage.objects
      FOR SELECT
      USING (bucket_id = 'avatars');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '認証済みユーザーは自分のプロフィール画像をアップロード可能'
  ) THEN
    CREATE POLICY "認証済みユーザーは自分のプロフィール画像をアップロード可能" ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '認証済みユーザーは自分のプロフィール画像を更新可能'
  ) THEN
    CREATE POLICY "認証済みユーザーは自分のプロフィール画像を更新可能" ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '認証済みユーザーは自分のプロフィール画像を削除可能'
  ) THEN
    CREATE POLICY "認証済みユーザーは自分のプロフィール画像を削除可能" ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;