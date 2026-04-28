import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Post, POST_TYPE_LABELS, POST_TYPE_EMOJIS, REACTION_LABELS, ReactionType } from '../types';
import { DISEASES } from '../constants/diseases';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  post: Post;
  onPress: () => void;
  onReact: (postId: string, reaction: ReactionType) => void;
}

export default function PostCard({ post, onPress, onReact }: Props) {
  const disease = DISEASES.find(d => d.id === post.disease_id);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko });

  const reactions: { type: ReactionType; label: string }[] = [
    { type: 'helpful', label: '💙 도움됐어요' },
    { type: 'same', label: '🤝 나도그래요' },
    { type: 'cheer', label: '💪 힘내세요' },
  ];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      {/* 상단: 태그 + 시간 */}
      <View style={styles.topRow}>
        <View style={styles.tags}>
          <View style={[
            styles.roleTag,
            { backgroundColor: post.author_role === 'patient' ? '#EBF5FF' : '#EAFAF1' }
          ]}>
            <Text style={[
              styles.roleTagText,
              { color: post.author_role === 'patient' ? COLORS.patient : COLORS.caregiver }
            ]}>
              {post.author_role === 'patient' ? '환자' : '환우'}
            </Text>
          </View>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>
              {POST_TYPE_EMOJIS[post.post_type]} {POST_TYPE_LABELS[post.post_type]}
            </Text>
          </View>
          {disease && (
            <View style={styles.diseaseTag}>
              <Text style={styles.diseaseTagText}>{disease.emoji} {disease.name}</Text>
            </View>
          )}
        </View>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      {/* 닉네임 */}
      <Text style={styles.nickname}>{post.author_nickname}</Text>

      {/* 제목 */}
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>

      {/* 내용 미리보기 */}
      <Text style={styles.content} numberOfLines={3}>{post.content}</Text>

      {/* 공감 버튼 */}
      <View style={styles.reactions}>
        {reactions.map(({ type, label }) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.reactionBtn,
              post.user_reaction === type && styles.reactionBtnActive
            ]}
            onPress={(e) => { e.stopPropagation(); onReact(post.id, type); }}
          >
            <Text style={styles.reactionText}>
              {label} {post.reactions[type] > 0 ? post.reactions[type] : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 댓글 수 */}
      {post.comment_count > 0 && (
        <Text style={styles.commentCount}>💬 댓글 {post.comment_count}개</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, flex: 1 },
  roleTag: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  roleTagText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  typeTag: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
  },
  typeTagText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  diseaseTag: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
  },
  diseaseTagText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  time: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginLeft: 8 },
  nickname: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginBottom: 6 },
  title: {
    fontSize: FONTS.sizes.md, fontWeight: '700',
    color: COLORS.textPrimary, marginBottom: 6, lineHeight: 22
  },
  content: {
    fontSize: FONTS.sizes.sm, color: COLORS.textSecondary,
    lineHeight: 20, marginBottom: SPACING.sm
  },
  reactions: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap', marginBottom: 6 },
  reactionBtn: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  reactionBtnActive: {
    backgroundColor: COLORS.primaryLight + '30',
    borderColor: COLORS.primary,
  },
  reactionText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  commentCount: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary },
});
