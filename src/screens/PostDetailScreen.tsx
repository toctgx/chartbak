import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Post, Comment, ReactionType, POST_TYPE_LABELS } from '../types';
import { DISEASES } from '../constants/diseases';
import { MOCK_COMMENTS } from '../lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  route?: { params?: { post?: Post } };
  navigation: any;
  nickname: string;
  userRole: string;
}

export default function PostDetailScreen({ route, navigation, nickname, userRole }: Props) {
  const post = route?.params?.post;
  if (!post) return null;

  const [comments, setComments] = useState<Comment[]>(
    MOCK_COMMENTS.filter(c => c.post_id === post.id)
  );
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [postState, setPostState] = useState(post);

  const disease = DISEASES.find(d => d.id === post.disease_id);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko });

  const reactions: { type: ReactionType; label: string }[] = [
    { type: 'helpful', label: '도움됐어요' },
    { type: 'same', label: '나도그래요' },
    { type: 'cheer', label: '힘내세요' },
  ];

  const handleReact = (type: ReactionType) => {
    const wasReacted = postState.user_reaction === type;
    setPostState(prev => ({
      ...prev,
      user_reaction: wasReacted ? null : type,
      reactions: { ...prev.reactions, [type]: wasReacted ? prev.reactions[type] - 1 : prev.reactions[type] + 1 },
    }));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      post_id: post.id,
      author_id: 'me',
      author_nickname: nickname,
      author_role: userRole as any,
      parent_id: replyTo,
      content: commentText.trim(),
      reactions: { helpful: 0, same: 0, cheer: 0 },
      created_at: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    setReplyTo(null);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 — 인디고 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        {disease && <Text style={styles.headerTitle}>{disease.name}</Text>}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 본문 카드 */}
        <View style={styles.postCard}>
          <View style={styles.tags}>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>
                {post.author_role === 'patient' ? '환자' : '환우'}
              </Text>
            </View>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>{POST_TYPE_LABELS[post.post_type]}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.nicknameTxt}>{post.author_nickname}</Text>
            <Text style={styles.separator}>·</Text>
            <Text style={styles.time}>{timeAgo}</Text>
          </View>

          <View style={styles.divider} />
          <Text style={styles.content}>{post.content}</Text>
          <View style={styles.divider} />

          {/* 공감 버튼 3개 */}
          <Text style={styles.reactionTitle}>이 글이 도움이 됐나요?</Text>
          <View style={styles.reactionRow}>
            {reactions.map(({ type, label }) => (
              <TouchableOpacity
                key={type}
                style={[styles.reactionBtn, postState.user_reaction === type && styles.reactionBtnActive]}
                onPress={() => handleReact(type)}
              >
                <Text style={[styles.reactionLabel, postState.user_reaction === type && styles.reactionLabelActive]}>
                  {label}
                </Text>
                <Text style={[styles.reactionCount, postState.user_reaction === type && styles.reactionCountActive]}>
                  {postState.reactions[type]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 댓글 섹션 */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
          {comments.map(comment => (
            <View
              key={comment.id}
              style={[styles.commentCard, comment.parent_id && styles.commentReply]}
            >
              <View style={styles.commentHeader}>
                <View style={styles.commentRoleTag}>
                  <Text style={styles.commentRoleText}>
                    {comment.author_role === 'patient' ? '환자' : '환우'}
                  </Text>
                </View>
                <Text style={styles.commentNickname}>{comment.author_nickname}</Text>
                <Text style={styles.commentTime}>
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
                </Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <TouchableOpacity onPress={() => setReplyTo(comment.id)}>
                <Text style={styles.replyBtn}>답글 달기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 댓글 입력 */}
        <View style={styles.commentInputArea}>
          {replyTo && (
            <View style={styles.replyIndicator}>
              <Text style={styles.replyIndicatorText}>답글 작성 중</Text>
              <TouchableOpacity onPress={() => setReplyTo(null)}>
                <Text style={styles.replyCancel}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={replyTo ? '답글을 입력하세요' : '댓글을 입력하세요'}
              placeholderTextColor={COLORS.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
              onPress={handleComment}
              disabled={!commentText.trim()}
            >
              <Text style={styles.sendBtnText}>전송</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // 헤더 — 인디고
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 56,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  backBtn: { marginRight: SPACING.md },
  back: { fontSize: FONTS.sizes.md, fontFamily: FONTS.bold, color: COLORS.textOnDark },
  headerTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.textOnDarkSoft,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 96 },

  // 본문 카드
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    margin: SPACING.md,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  tags: { flexDirection: 'row', marginBottom: SPACING.sm },
  roleTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginRight: 6,
  },
  roleTagText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  typeTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  typeTagText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: SPACING.sm,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  nicknameTxt: { fontSize: FONTS.sizes.sm, fontFamily: FONTS.semibold, color: COLORS.textSecondary },
  separator: { color: COLORS.textSecondary, marginHorizontal: 6 },
  time: { fontSize: FONTS.sizes.sm, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.borderCard, marginVertical: SPACING.md },
  content: { fontSize: FONTS.sizes.md, fontFamily: FONTS.regular, color: COLORS.textPrimary, lineHeight: 26 },

  // 공감 버튼
  reactionTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  reactionRow: { flexDirection: 'row', gap: SPACING.sm },
  reactionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.borderCard,
  },
  reactionBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reactionLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  reactionLabelActive: { color: COLORS.textOnDark },
  reactionCount: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  reactionCountActive: { color: COLORS.textOnDark },

  // 댓글
  commentsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    margin: SPACING.md,
    marginTop: 0,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  commentsTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  commentCard: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  commentReply: {
    marginLeft: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.lavender,
  },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  commentRoleTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginRight: 6,
  },
  commentRoleText: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.primary },
  commentNickname: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  commentTime: { fontSize: FONTS.sizes.xs, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  commentContent: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 20,
    marginBottom: SPACING.xs,
  },
  replyBtn: { fontSize: FONTS.sizes.xs, fontFamily: FONTS.bold, color: COLORS.primary },

  // 댓글 입력
  commentInputArea: {
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    marginTop: 0,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  replyIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
  },
  replyIndicatorText: { fontSize: FONTS.sizes.xs, fontFamily: FONTS.semibold, color: COLORS.primary },
  replyCancel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    maxHeight: 100,
    marginRight: SPACING.sm,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sendBtnDisabled: { backgroundColor: COLORS.lavender },
  sendBtnText: { color: COLORS.textOnDark, fontFamily: FONTS.bold, fontSize: FONTS.sizes.sm },
});
