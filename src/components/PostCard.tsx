import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { Post, POST_TYPE_LABELS, ReactionType } from '../types';
import { DISEASES } from '../constants/diseases';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  post: Post;
  onPress: () => void;
  onReact: (postId: string, reaction: ReactionType) => void;
  highlight?: boolean;
}

export default function PostCard({ post, onPress, highlight }: Props) {
  const disease = DISEASES.find(d => d.id === post.disease_id);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko });
  const totalReactions = post.reactions.helpful + post.reactions.same + post.reactions.cheer;
  const isPatient = post.author_role === 'patient';

  // 메타 텍스트: "환자 · 경험나눔 · 당뇨"
  const metaParts = [
    isPatient ? '환자' : '환우',
    POST_TYPE_LABELS[post.post_type],
    disease?.name,
  ].filter(Boolean);

  return (
    <TouchableOpacity
      style={[styles.card, highlight && styles.cardHighlight]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 제목 */}
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>

      {/* 메타 + 공감/댓글 */}
      <View style={styles.footer}>
        {/* 역할 인디케이터 + 메타 */}
        <View style={styles.metaRow}>
          <View style={[styles.roleDot, { backgroundColor: isPatient ? COLORS.patient : COLORS.caregiver }]} />
          <Text style={styles.meta}>{metaParts.join(' · ')}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>

        {/* 공감/댓글 수 */}
        {(totalReactions > 0 || post.comment_count > 0) && (
          <Text style={styles.counts}>
            {totalReactions > 0 && `공감 ${totalReactions}`}
            {totalReactions > 0 && post.comment_count > 0 && '  '}
            {post.comment_count > 0 && `댓글 ${post.comment_count}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHighlight: {
    // 하이라이트: 배경 살짝 크림 틴트, 왼쪽 얇은 선
    backgroundColor: COLORS.primaryPale,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },

  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 22,
    letterSpacing: -0.2,
    marginBottom: 6,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  roleDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    marginRight: 2,
  },
  meta: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  dot: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
  },
  time: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
  },

  counts: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
    flexShrink: 0,
  },
});
