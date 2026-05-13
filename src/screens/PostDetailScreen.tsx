import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { Post, Comment, ReactionType, POST_TYPE_LABELS, POST_TYPE_EMOJIS } from '../types';
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
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← 뒤로</Text>
        </TouchableOpacity>
        {disease && <Text style={styles.headerTitle}>{disease.name} 라운지</Text>}
      </View>

      {/* 전체 스크롤 */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 게시글 */}
        <View style={styles.post}>
          <View style={styles.tags}>
            <View style={[styles.roleTag, { backgroundColor: COLORS.surfaceSecondary }]}>
              <Text style={[styles.roleTagText, { color: COLORS.textSecondary }]}>
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

          {/* 공감 */}
          <Text style={styles.reactionTitle}>이 글이 도움이 됐나요?</Text>
          <View style={styles.reactionRow}>
            {reactions.map(({ type, label }) => (
              <TouchableOpacity
                key={type}
                style={[styles.reactionBtn, postState.user_reaction === type && styles.reactionBtnActive]}
                onPress={() => handleReact(type)}
              >
                <Text style={[styles.reactionLabel, postState.user_reaction === type && { color: COLORS.primary }]}>{label}</Text>
                <Text style={[styles.reactionCount, postState.user_reaction === type && { color: COLORS.primary }]}>
                  {postState.reactions[type]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 댓글 */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
          {comments.map(comment => (
            <View key={comment.id} style={[styles.commentCard, comment.parent_id && styles.commentReply]}>
              <View style={styles.commentHeader}>
                <View style={[styles.roleTagSmall, { backgroundColor: COLORS.surfaceSecondary }]}>
                  <Text style={[styles.roleTagSmallText, { color: COLORS.textSecondary }]}>
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

        {/* 댓글 입력 - 스크롤 안으로 이동 */}
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
              placeholderTextColor={COLORS.textTertiary}
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  back: { fontSize: FONTS.sizes.md, color: COLORS.primary, marginRight: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xxl },
  post: { backgroundColor: COLORS.surface, padding: SPACING.lg, marginBottom: SPACING.sm },
  tags: { flexDirection: 'row', marginBottom: SPACING.sm },
  roleTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, marginRight: 6 },
  roleTagText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  typeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceSecondary },
  typeTagText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  title: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary, lineHeight: 28, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  nicknameTxt: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  separator: { color: COLORS.textTertiary, marginHorizontal: 6 },
  time: { fontSize: FONTS.sizes.sm, color: COLORS.textTertiary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  content: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, lineHeight: 26 },
  reactionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  reactionRow: { flexDirection: 'row' },
  reactionBtn: {
    flex: 1, alignItems: 'center', padding: SPACING.sm, marginRight: SPACING.xs,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  reactionBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryPale },
  reactionEmoji: { fontSize: 22, marginBottom: 4 },
  reactionLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: 2 },
  reactionCount: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textSecondary },
  commentsSection: { backgroundColor: COLORS.surface, padding: SPACING.lg, marginBottom: SPACING.sm },
  commentsTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  commentCard: {
    padding: SPACING.md, backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md, marginBottom: SPACING.sm,
  },
  commentReply: { marginLeft: SPACING.lg, borderLeftWidth: 3, borderLeftColor: COLORS.primary + '40' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  roleTagSmall: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full, marginRight: 6 },
  roleTagSmallText: { fontSize: 10, fontWeight: '700' },
  commentNickname: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textPrimary },
  commentTime: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary },
  commentContent: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, lineHeight: 20, marginBottom: SPACING.xs },
  replyBtn: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },
  // 댓글 입력창 - 스크롤 안에 포함
  commentInputArea: {
    backgroundColor: COLORS.surface, margin: SPACING.md,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  replyIndicator: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingBottom: SPACING.xs,
  },
  replyIndicatorText: { fontSize: FONTS.sizes.xs, color: COLORS.primary },
  replyCancel: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  input: {
    flex: 1, backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, maxHeight: 100, marginRight: SPACING.sm,
  },
  sendBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  sendBtnDisabled: { backgroundColor: COLORS.border },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: FONTS.sizes.sm },
});
