import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS, RADIUS } from '../constants/theme';
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
      {/* 상단: 역할 dot + 메타 + 시간 */}
      <View style={styles.metaRow}>
        <View style={[styles.roleDot, { backgroundColor: isPatient ? COLORS.accent : COLORS.lavender }]} />
        <Text style={styles.meta}>{metaParts.join(' · ')}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      {/* 제목 */}
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>

      {/* 공감/댓글 */}
      {(totalReactions > 0 || post.comment_count > 0) && (
        <Text style={styles.counts}>
          {totalReactions > 0 && `공감 ${totalReactions}`}
          {totalReactions > 0 && post.comment_count > 0 && '  '}
          {post.comment_count > 0 && `댓글 ${post.comment_count}`}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: 6,
    ...SHADOWS.card,
  },
  cardHighlight: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 5,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  meta: {
    flex: 1,
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  time: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  counts: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.semibold,
    color: COLORS.textSecondary,
  },
});
