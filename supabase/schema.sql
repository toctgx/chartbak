-- 병갔왔 MVP Supabase 스키마
-- Supabase 대시보드 → SQL Editor에서 실행

-- ① 사용자 프로필
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_hash TEXT NOT NULL,
  nickname TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('patient', 'caregiver')),
  disease_ids TEXT[] NOT NULL DEFAULT '{}',
  age_group TEXT NOT NULL,
  diagnosis_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ② 게시글
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  disease_id TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN (
    'treatment_experience', 'unsaid_to_doctor', 'question', 'hospital_review'
  )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ③ 댓글
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글
  content TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ④ 공감 (중복 방지)
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('helpful', 'same', 'cheer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id) -- 1인 1공감
);

-- ⑤ 알림
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reaction', 'comment', 'new_post')),
  content TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_posts_disease ON posts(disease_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- 게시글 공감수 뷰 (성능 최적화)
CREATE VIEW posts_with_reactions AS
SELECT
  p.*,
  pr.nickname AS author_nickname,
  pr.role AS author_role,
  COUNT(CASE WHEN r.reaction_type = 'helpful' THEN 1 END) AS helpful_count,
  COUNT(CASE WHEN r.reaction_type = 'same' THEN 1 END) AS same_count,
  COUNT(CASE WHEN r.reaction_type = 'cheer' THEN 1 END) AS cheer_count,
  COUNT(c.id) AS comment_count
FROM posts p
JOIN profiles pr ON p.author_id = pr.id
LEFT JOIN reactions r ON r.target_type = 'post' AND r.target_id = p.id
LEFT JOIN comments c ON c.post_id = p.id AND NOT c.is_deleted
WHERE NOT p.is_deleted
GROUP BY p.id, pr.nickname, pr.role;

-- RLS (Row Level Security) 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 프로필: 본인만 수정, 전체 읽기 가능
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 게시글: 전체 읽기, 본인만 작성/수정
CREATE POLICY "posts_select" ON posts FOR SELECT USING (NOT is_deleted);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (auth.uid() = author_id);

-- 댓글: 전체 읽기, 본인만 작성
CREATE POLICY "comments_select" ON comments FOR SELECT USING (NOT is_deleted);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 공감: 로그인 사용자만
CREATE POLICY "reactions_select" ON reactions FOR SELECT USING (TRUE);
CREATE POLICY "reactions_insert" ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete" ON reactions FOR DELETE USING (auth.uid() = user_id);

-- 알림: 본인만
CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (auth.uid() = user_id);
