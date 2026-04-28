import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { Post, ReactionType } from '../types';
import { MOCK_POSTS } from '../lib/mockData';
import PostCard from '../components/PostCard';

type FeedTab = 'my' | 'all' | 'popular';

interface Props {
  navigation: any;
  userDiseaseIds: string[];
  userRole: string;
  nickname: string;
}

export default function HomeFeedScreen({ navigation, userDiseaseIds, nickname }: Props) {
  const [activeTab, setActiveTab] = useState<FeedTab>('all');
  const [filter, setFilter] = useState<'all' | 'patient' | 'caregiver'>('all');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'my', label: '내 질환' },
    { key: 'all', label: '전체' },
    { key: 'popular', label: '인기' },
  ];

  const filtered = posts
    .filter(p => {
      if (activeTab === 'my') return userDiseaseIds.includes(p.disease_id);
      if (activeTab === 'popular') return (p.reactions.helpful + p.reactions.same + p.reactions.cheer) > 20;
      return true;
    })
    .filter(p => {
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
        reactions: {
          ...p.reactions,
          [reaction]: wasReacted ? p.reactions[reaction] - 1 : p.reactions[reaction] + 1,
        },
      };
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>안녕하세요 👋</Text>
          <Text style={styles.nickname}>{nickname}</Text>
        </View>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() => navigation.navigate('WritePost')}
        >
          <Text style={styles.writeBtnText}>✏️ 글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 필터 */}
      <View style={styles.filterRow}>
        {(['all', 'patient', 'caregiver'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? '전체' : f === 'patient' ? '🏥 환자글' : '🫂 환우글'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 피드 */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
            onReact={handleReact}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>아직 글이 없어요{'\n'}첫 번째 글을 남겨보세요!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  greeting: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  nickname: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  writeBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  writeBtnText: { color: '#fff', fontWeight: '600', fontSize: FONTS.sizes.sm },
  tabRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1, paddingVertical: SPACING.md, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm, gap: SPACING.xs, backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.primary, fontWeight: '600' },
  list: { padding: SPACING.md },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },
});
