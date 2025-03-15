/*
  # 初期データベーススキーマの作成

  1. 新規テーブル
    - `users`
      - `id` (uuid, primary key) - ユーザーID（auth.usersと紐付け）
      - `name` (text) - 表示名
      - `bio` (text) - 自己紹介
      - `website_url` (text) - ウェブサイトURL
      - `profile_image_url` (text) - プロフィール画像URL
      - `subscription_tier` (integer) - サブスクリプションプラン（0: 無料, 1: 有料）
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時

    - `works`
      - `id` (uuid, primary key) - 作品ID
      - `user_id` (uuid) - ユーザーID（外部キー）
      - `title` (text) - 作品タイトル
      - `description` (text) - 作品説明
      - `source_url` (text) - 元記事URL
      - `thumbnail_url` (text) - サムネイルURL
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時

  2. セキュリティ
    - 両テーブルでRLSを有効化
    - ユーザーは自分のデータのみ読み書き可能
*/

-- usersテーブルの作成
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  bio text,
  website_url text,
  profile_image_url text,
  subscription_tier integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分のデータを読み取り可能"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "ユーザーは自分のデータを更新可能"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- worksテーブルの作成
CREATE TABLE IF NOT EXISTS works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  source_url text NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは全ての作品を閲覧可能"
  ON works
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "ユーザーは自分の作品のみ作成可能"
  ON works
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の作品のみ更新可能"
  ON works
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の作品のみ削除可能"
  ON works
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS works_user_id_idx ON works(user_id);
CREATE INDEX IF NOT EXISTS works_created_at_idx ON works(created_at);