import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Modal,
  TouchableWithoutFeedback, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { IconPatient, IconCaregiver, IconSearch } from '../components/Icons';
import { Post, ReactionType } from '../types';
import { MOCK_POSTS } from '../lib/mockData';
import PostCard from '../components/PostCard';

type FeedTab = 'my' | 'all' | 'popular';
type SortKey = 'latest' | 'popular' | 'reaction' | 'comment';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'latest',   label: '최신순' },
  { key: 'popular',  label: '인기순' },
  { key: 'reaction', label: '공감많은순' },
  { key: 'comment',  label: '댓글많은순' },
];

interface Props {
  navigation: any;
  userDiseaseIds: string[];
  userRole: string;
  nickname: string;
}

export default function HomeFeedScreen({ navigation, userDiseaseIds, nickname }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab]   = useState<FeedTab>('all');
  const [filter, setFilter]         = useState<'all' | 'patient' | 'caregiver'>('all');
  const [sort, setSort]             = useState<SortKey>('latest');
  const [sortOpen, setSortOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts]           = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'all',     label: '전체' },
    { key: 'my',      label: '내 질환' },
    { key: 'popular', label: '인기' },
  ];

  const currentSort = SORT_OPTIONS.find(s => s.key === sort)!;

  const filtered = useMemo(() => {
    let list = [...posts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }
    list = list.filter(p => {
      if (activeTab === 'my')      return userDiseaseIds.includes(p.disease_id);
      if (activeTab === 'popular') return (p.reactions.helpful + p.reactions.same + p.reactions.cheer) > 20;
      return true;
    });
    list = list.filter(p => {
      if (filter === 'patient')   return p.author_role === 'patient';
      if (filter === 'caregiver') return p.author_role === 'caregiver';
      return true;
    });
    list.sort((a, b) => {
      if (sort === 'latest')   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'popular')  return (b.reactions.helpful + b.reactions.same + b.reactions.cheer) - (a.reactions.helpful + a.reactions.same + a.reactions.cheer);
      if (sort === 'reaction') return b.reactions.helpful - a.reactions.helpful;
      if (sort === 'comment')  return (b.comment_count ?? 0) - (a.comment_count ?? 0);
      return 0;
    });
    return list;
  }, [posts, searchQuery, activeTab, filter, sort]);

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 — 인디고 배경 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerSub}>안녕하세요, {nickname}</Text>
            <Text style={styles.headerTitle}>커뮤니티 피드</Text>
          </View>
          <TouchableOpacity
            style={styles.searchIconBtn}
            onPress={() => setSearchOpen(v => !v)}
          >
            <IconSearch size={20} />
          </TouchableOpacity>
        </View>

        {/* 세그먼트 탭 */}
        <View style={styles.segmentContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.segmentTab, activeTab === tab.key && styles.segmentTabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.segmentText, activeTab === tab.key && styles.segmentTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 검색창 */}
      {searchOpen && (
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="제목, 내용 검색..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchCloseBtn}
            onPress={() => { setSearchOpen(false); setSearchQuery(''); }}
          >
            <Text style={styles.searchCloseTxt}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 역할 필터 칩 + 정렬 */}
      <View style={styles.filterRow}>
        <View style={styles.filterChips}>
          {([['all', '전체'], ['patient', '환자글'], ['caregiver', '환우글']] as const).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, filter === key && styles.filterChipActive]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setSortOpen(true)}>
          <Text style={styles.sortBtnText}>{currentSort.label} ⌄</Text>
        </TouchableOpacity>
      </View>

      {/* 피드 */}
      <View style={{ flex: 1, overflow: 'hidden' }}>
      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => {
          const total = item.reactions.helpful + item.reactions.same + item.reactions.cheer;
          return (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('PostDetail', { post: item })}
              onReact={handleReact}
              highlight={index === 0 || total > 50}
            />
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} tintColor={COLORS.accent} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? `"${searchQuery}" 검색 결과가 없어요` : '아직 글이 없어요\n첫 번째 글을 남겨보세요!'}
            </Text>
          </View>
        }
      />

      </View>

      {/* 정렬 모달 */}
      <Modal transparent visible={sortOpen} animationType="fade" onRequestClose={() => setSortOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setSortOpen(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.dropdown}>
          {SORT_OPTIONS.map((option, idx) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.dropdownItem,
                sort === option.key && styles.dropdownItemActive,
                idx < SORT_OPTIONS.length - 1 && styles.dropdownItemBorder,
              ]}
              onPress={() => { setSort(option.key); setSortOpen(false); }}
            >
              <Text style={[styles.dropdownLabel, sort === option.key && styles.dropdownLabelActive]}>
                {option.label}
              </Text>
              {sort === option.key && <Text style={styles.dropdownCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // 헤더 — 인디고
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
    letterSpacing: 1,
  },
  searchIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 세그먼트 탭
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.full,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  segmentTabActive: {
    backgroundColor: COLORS.accent,
  },
  segmentText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.6)',
  },
  segmentTextActive: {
    color: COLORS.textOnAccent,
  },

  // 검색
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchCloseBtn: { padding: 6 },
  searchCloseTxt: { fontSize: 16, color: COLORS.textOnDarkSoft },

  // 필터 행
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
  },
  filterChips: { flexDirection: 'row', gap: SPACING.xs },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textOnAccent,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  sortBtnText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.semibold,
    color: COLORS.textSecondary,
  },

  // 피드
  list: { paddingBottom: 96 },
  empty: { paddingTop: 80, alignItems: 'center', paddingHorizontal: SPACING.xl },
  emptyText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // 드롭다운
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  dropdown: {
    position: 'absolute', top: 200, right: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.borderCard,
    minWidth: 150,
    ...SHADOWS.card,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: SPACING.md,
  },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.borderCard },
  dropdownItemActive: { backgroundColor: COLORS.accentLight },
  dropdownLabel: { flex: 1, fontSize: FONTS.sizes.sm, fontFamily: FONTS.regular, color: COLORS.textPrimary },
  dropdownLabelActive: { color: COLORS.primary, fontFamily: FONTS.bold },
  dropdownCheck: { fontSize: 13, color: COLORS.primary, fontFamily: FONTS.bold },
});
