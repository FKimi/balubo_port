/*
  # AI分析関連テーブルの作成

  1. 新規テーブル
    - `tags`
      - `id` (uuid, primary key) - タグID
      - `name` (text) - タグ名
      - `created_at` (timestamptz) - 作成日時

    - `work_tags`
      - `work_id` (uuid) - 作品ID（外部キー）
      - `tag_id` (uuid) - タグID（外部キー）
      - `created_at` (timestamptz) - 作成日時

    - `ai_analyses`
      - `id` (uuid, primary key) - 分析ID
      - `work_id` (uuid) - 作品ID（外部キー）
      - `expertise` (jsonb) - 専門性分析結果
      - `content_style` (jsonb) - 内容の特徴分析結果
      - `interests` (jsonb) - 興味・関心分析結果
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時

    - `user_analyses`
      - `id` (uuid, primary key) - 分析ID
      - `user_id` (uuid) - ユーザーID（外部キー）
      - `expertise_summary` (jsonb) - 専門性総合評価
      - `style_summary` (jsonb) - スタイル総合評価
      - `interests_summary` (jsonb) - 興味関心総合評価
      - `talent_score` (jsonb) - 才能総合評価
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時

  2. セキュリティ
    - すべてのテーブルでRLSを有効化
    - ユーザーは自分の関連データのみアクセス可能
*/

-- tagsテーブルの作成
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "全ユーザーがタグを閲覧可能"
  ON tags
  FOR SELECT
  TO authenticated
  USING (true);

-- work_tagsテーブルの作成
CREATE TABLE IF NOT EXISTS work_tags (
  work_id uuid REFERENCES works(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (work_id, tag_id)
);

ALTER TABLE work_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分の作品のタグを閲覧可能"
  ON work_tags
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_tags.work_id
      AND works.user_id = auth.uid()
    )
  );

CREATE POLICY "ユーザーは自分の作品にタグを追加可能"
  ON work_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_tags.work_id
      AND works.user_id = auth.uid()
    )
  );

CREATE POLICY "ユーザーは自分の作品のタグを削除可能"
  ON work_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = work_tags.work_id
      AND works.user_id = auth.uid()
    )
  );

-- ai_analysesテーブルの作成
CREATE TABLE IF NOT EXISTS ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id uuid REFERENCES works(id) ON DELETE CASCADE,
  expertise jsonb NOT NULL,
  content_style jsonb NOT NULL,
  interests jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分の作品の分析を閲覧可能"
  ON ai_analyses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = ai_analyses.work_id
      AND works.user_id = auth.uid()
    )
  );

CREATE POLICY "ユーザーは自分の作品の分析を作成可能"
  ON ai_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = ai_analyses.work_id
      AND works.user_id = auth.uid()
    )
  );

CREATE POLICY "ユーザーは自分の作品の分析を更新可能"
  ON ai_analyses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM works
      WHERE works.id = ai_analyses.work_id
      AND works.user_id = auth.uid()
    )
  );

-- user_analysesテーブルの作成
CREATE TABLE IF NOT EXISTS user_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  expertise_summary jsonb NOT NULL,
  style_summary jsonb NOT NULL,
  interests_summary jsonb NOT NULL,
  talent_score jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザーは自分の分析を閲覧可能"
  ON user_analyses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "ユーザーは自分の分析を作成可能"
  ON user_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ユーザーは自分の分析を更新可能"
  ON user_analyses
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- インデックスの作成
CREATE INDEX IF NOT EXISTS work_tags_work_id_idx ON work_tags(work_id);
CREATE INDEX IF NOT EXISTS work_tags_tag_id_idx ON work_tags(tag_id);
CREATE INDEX IF NOT EXISTS ai_analyses_work_id_idx ON ai_analyses(work_id);
CREATE INDEX IF NOT EXISTS user_analyses_user_id_idx ON user_analyses(user_id);