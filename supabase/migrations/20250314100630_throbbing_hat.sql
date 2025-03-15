/*
  # ソーシャルメディア連携フィールドの追加

  1. 変更内容
    - usersテーブルに以下のフィールドを追加:
      - twitter_username (text) - Xのユーザー名
      - instagram_username (text) - Instagramのユーザー名
      - facebook_username (text) - Facebookのユーザー名
*/

ALTER TABLE users
ADD COLUMN IF NOT EXISTS twitter_username text,
ADD COLUMN IF NOT EXISTS instagram_username text,
ADD COLUMN IF NOT EXISTS facebook_username text;