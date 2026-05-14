import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Post, ReactionType } from '../types';
import { MOCK_POSTS } from '../lib/mockData';
import PostCard from '../components/PostCard';
import { DISEASES } from '../constants/diseases';

interface Props {
  route?: { params?: { disease?: typeof DISEASES[0] } };
  navigation: any;
  nickname: string;
  userRole: string;
}

export default function LoungeDetailScreen({ route, navigation, nickname, userRole }: Props) {
  const disease = route?.params?.disease;
  const [posts, setPosts] = useState<Post[]>(
    MOCK_POSTS.filter(p => p.disease_id === disease?.id)
  );
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'patient' | 'caregiver'>('all');

  const filtered = posts.filter(p => {
    if (filter === 'patient') return p.author_role === 'patient';
    if (filter === 'caregiver') return p.author_role === 'caregiver';
    return true;
  });

  const handleReact = (postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const wasReacted = p.user_reaction === reaction;
      return {
        ...p,
        user_reaction: wasReacted ? null : reaction,
        reactions: { ...p.reactions, [reaction]: wasReacted ? p.reactions[reaction] - 1 : p.reactions[reaction] + 1 },
      };
    }));
  };

  return (
    <View style={styles.container}>
      {/* 헤더 — 인디고 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{disease?.name} 라운지</Text>
          <Text style={styles.headerSub}>{disease?.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() => navigation.navigate('WritePost')}
        >
          <Text style={styles.writeBtnText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* 필터 칩 */}
      <View style={styles.filterRow}>
        {(['all', 'patient', 'caregiver'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '전체' : f === 'patient' ? '환자글' : '환우글'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
            onReact={handleReact}
            highlight={index === 0}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }}
            tintColor={COLORS.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{disease?.name} 라운지</Text>
            <Text style={styles.emptyText}>아직 글이 없어요{'\n'}첫 번째 글을 남겨보세요!</Text>
            <TouchableOpacity style={styles.writeEmptyBtn} onPress={() => navigation.navigate('WritePost')}>
              <Text style={styles.writeEmptyText}>첫 글 쓰기</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 56,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  backBtn: { paddingRight: SPACING.md },
  backText: { fontSize: FONTS.sizes.xl, color: COLORS.textOnDark },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
  },
  headerSub: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
  },
  writeBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  writeBtnText: {
    color: COLORS.textOnAccent,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
  },

  // 필터
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    gap: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textOnDark,
  },
  filterTextActive: { color: COLORS.textOnAccent },

  list: { paddingVertical: SPACING.md, paddingBottom: 96 },
  empty: { paddingTop: 60, alignItems: 'center', paddingHorizontal: SPACING.lg },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.extrabold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  writeEmptyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  writeEmptyText: { color: COLORS.textOnDark, fontFamily: FONTS.bold, fontSize: FONTS.sizes.md },
});
