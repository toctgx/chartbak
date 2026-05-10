import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Modal,
  TouchableWithoutFeedback, TextInput,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { IconPatient, IconCaregiver, IconSearch } from '../components/Icons';
import { Post, ReactionType } from '../types';
import { MOCK_POSTS } from '../lib/mockData';
import PostCard from '../components/PostCard';

type FeedTab = 'my' | 'all' | 'popular';
type SortKey = 'latest' | 'popular' | 'reaction' | 'comment';

const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'latest',   label: '최신순',    icon: '🕐' },
  { key: 'popular',  label: '인기순',    icon: '🔥' },
  { key: 'reaction', label: '공감많은순', icon: '💙' },
  { key: 'comment',  label: '댓글많은순', icon: '💬' },
];

interface Props {
  navigation: any;
  userDiseaseIds: string[];
  userRole: string;
  nickname: string;
}

export default function HomeFeedScreen({ navigation, userDiseaseIds }: Props) {
  const [activeTab, setActiveTab]   = useState<FeedTab>('all');
  const [filter, setFilter]         = useState<'all' | 'patient' | 'caregiver'>('all');
  const [sort, setSort]             = useState<SortKey>('latest');
  const [sortOpen, setSortOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts]           = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const tabs: { key: FeedTab; label: string }[] = [
    { key: 'my',      label: '내 질환' },
    { key: 'all',     label: '전체' },
    { key: 'popular', label: '인기' },
  ];

  const currentSort = SORT_OPTIONS.find(s => s.key === sort)!;

  const filtered = useMemo(() => {
    let list = [...posts];

    // 검색 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }

    // 탭 필터
    list = list.filter(p => {
      if (activeTab === 'my')      return userDiseaseIds.includes(p.disease_id);
      if (activeTab === 'popular') return (p.reactions.helpful + p.reactions.same + p.reactions.cheer) > 20;
      return true;
    });

    // 역할 필터
    list = list.filter(p => {
      if (filter === 'patient')   return p.author_role === 'patient';
      if (filter === 'caregiver') return p.author_role === 'caregiver';
      return true;
    });

    // 정렬
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

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>

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

      {/* 필터 행 */}
      {searchOpen ? (
        /* 검색 모드 */
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="제목, 내용 검색..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchCloseBtn} onPress={closeSearch}>
            <Text style={styles.searchCloseTxt}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* 기본 필터 모드 */
        <View style={styles.filterRow}>
          {/* 역할 필터 칩 */}
          <View style={styles.filterChips}>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>전체</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'patient' && styles.filterChipActive]}
              onPress={() => setFilter('patient')}
            >
              <IconPatient size={12} />
              <Text style={[styles.filterText, filter === 'patient' && styles.filterTextActive]}> 환자글</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'caregiver' && styles.filterChipActive]}
              onPress={() => setFilter('caregiver')}
            >
              <IconCaregiver size={12} />
              <Text style={[styles.filterText, filter === 'caregiver' && styles.filterTextActive]}> 환우글</Text>
            </TouchableOpacity>
          </View>

          {/* 오른쪽: 검색 + 정렬 */}
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchOpen(true)}>
              <IconSearch size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortBtn} onPress={() => setSortOpen(true)}>
              <Text style={styles.sortBtnText}>{currentSort.icon} {currentSort.label}</Text>
              <Text style={styles.sortArrow}>⌄</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 검색 중 결과 수 표시 */}
      {searchQuery.trim() !== '' && (
        <View style={styles.searchResultBar}>
          <Text style={styles.searchResultText}>
            "{searchQuery}" — {filtered.length}건
          </Text>
        </View>
      )}

      {/* 피드 */}
      <FlatList
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>{searchQuery ? '🔎' : '🌱'}</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? `"${searchQuery}" 검색 결과가 없어요` : '아직 글이 없어요\n첫 번째 글을 남겨보세요!'}
            </Text>
          </View>
        }
      />

      {/* 정렬 드롭다운 모달 */}
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
              <Text style={styles.dropdownIcon}>{option.icon}</Text>
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

  // 기본 필터 행
  filterRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  filterChips: { flexDirection: 'row', gap: SPACING.xs },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.primary, fontWeight: '600' },

  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconBtn: {
    padding: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  sortBtnText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '500' },
  sortArrow: { fontSize: 11, color: COLORS.textTertiary },

  // 검색 행
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  searchCloseBtn: { padding: 6 },
  searchCloseTxt: { fontSize: 16, color: COLORS.textTertiary },

  searchResultBar: {
    paddingHorizontal: SPACING.lg, paddingVertical: 6,
    backgroundColor: COLORS.primaryPale,
    borderBottomWidth: 1, borderBottomColor: COLORS.primaryLight,
  },
  searchResultText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },

  list: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  empty: { paddingTop: 80, alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },

  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  dropdown: {
    position: 'absolute', top: 106, right: SPACING.lg,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, minWidth: 150,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: SPACING.md, gap: 8,
  },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dropdownItemActive: { backgroundColor: COLORS.primary + '10' },
  dropdownIcon: { fontSize: 15 },
  dropdownLabel: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textPrimary },
  dropdownLabelActive: { color: COLORS.primary, fontWeight: '700' },
  dropdownCheck: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});
