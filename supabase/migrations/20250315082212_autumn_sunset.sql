/*
  # デザイン作品のフィールド追加

  1. 変更内容
    - `works` テーブルに以下のフィールドを追加:
      - `work_type` (text) - 作品の種類（'writing' または 'design'）
      - `design_type` (text) - デザインの種類（UIデザイン、グラフィックデザインなど）
      - `tools_used` (text[]) - 使用したツール（Figma、Photoshopなど）
      - `design_url` (text) - デザイン作品のURL
      - `behance_url` (text) - BehanceのURL
      - `dribbble_url` (text) - DribbbleのURL

  2. セキュリティ
    - 既存のRLSポリシーを維持
*/

-- 新しいフィールドの追加
ALTER TABLE works
ADD COLUMN IF NOT EXISTS work_type text DEFAULT 'writing',
ADD COLUMN IF NOT EXISTS design_type text,
ADD COLUMN IF NOT EXISTS tools_used text[],
ADD COLUMN IF NOT EXISTS design_url text,
ADD COLUMN IF NOT EXISTS behance_url text,
ADD COLUMN IF NOT EXISTS dribbble_url text;

-- work_typeにデフォルト値を設定
UPDATE works SET work_type = 'writing' WHERE work_type IS NULL;

-- work_typeに制約を追加
ALTER TABLE works
ADD CONSTRAINT works_work_type_check
CHECK (work_type IN ('writing', 'design'));