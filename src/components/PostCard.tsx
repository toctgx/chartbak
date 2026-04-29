import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconPatient, IconCaregiver } from './Icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
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

  return (
    <TouchableOpacity
      style={[styles.card, highlight && styles.cardHighlight]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* 태그 행 */}
      <View style={styles.tagRow}>
        {/* 역할 */}
        <View style={[styles.roleTag, { backgroundColor: post.author_role === 'patient' ? '#EFF6FF' : '#F0FDF4' }]}>
          {post.author_role === 'patient'
            ? <IconPatient size={10} />
            : <IconCaregiver size={10} />
          }
          <Text style={[styles.roleText, { color: post.author_role === 'patient' ? COLORS.patient : COLORS.caregiver }]}>
            {post.author_role === 'patient' ? '환자' : '환우'}
          </Text>
        </View>

        {/* 글 유형 */}
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{POST_TYPE_LABELS[post.post_type]}</Text>
        </View>

        {/* 질환 */}
        {disease && (
          <View style={styles.diseaseTag}>
            <Text style={styles.diseaseText}>{disease.name}</Text>
          </View>
        )}

        {/* 시간 */}
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      {/* 제목 */}
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>

      {/* 반응 수 (있을 때만 작게) */}
      {totalReactions > 0 && (
        <Text style={styles.reactionCount}>공감 {totalReactions} · 댓글 {post.comment_count}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHighlight: {
    backgroundColor: '#F4F8F0',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  roleTag: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: RADIUS.full, marginRight: 5,
  },
  roleText: { fontSize: 11, fontWeight: '700', marginLeft: 3 },
  typeTag: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: RADIUS.full, marginRight: 5,
  },
  typeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  diseaseTag: {
    backgroundColor: COLORS.primaryPale,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: RADIUS.full, marginRight: 5,
  },
  diseaseText: { fontSize: 11, color: '#92610A', fontWeight: '600' },
  time: { fontSize: 11, color: COLORS.textTertiary, marginLeft: 'auto' as any },
  title: {
    fontSize: FONTS.sizes.md, fontWeight: '700',
    color: COLORS.textPrimary, lineHeight: 22, letterSpacing: -0.2,
    marginBottom: 4,
  },
  reactionCount: {
    fontSize: 11, color: COLORS.textTertiary, marginTop: 2,
  },
});
