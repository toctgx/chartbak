import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, FlatList
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { DISEASES, DISEASE_CATEGORIES, DiseaseCategory } from '../constants/diseases';
import { MOCK_POSTS } from '../lib/mockData';

interface Props {
  navigation: any;
  userDiseaseIds: string[];
}

// 질환별 글 수 계산
const POST_COUNTS: Record<string, number> = {};
MOCK_POSTS.forEach(p => {
  POST_COUNTS[p.disease_id] = (POST_COUNTS[p.disease_id] || 0) + 1;
});

export default function LoungeListScreen({ navigation, userDiseaseIds }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<DiseaseCategory | '전체' | '내 질환'>('전체');

  const filtered = useMemo(() => DISEASES.filter(d => {
    const matchSearch = d.name.includes(search) || d.category.includes(search);
    if (activeCategory === '내 질환') return matchSearch && userDiseaseIds.includes(d.id);
    if (activeCategory === '전체') return matchSearch;
    return matchSearch && d.category === activeCategory;
  }), [search, activeCategory, userDiseaseIds]);

  const categories = ['내 질환', '전체', ...DISEASE_CATEGORIES] as const;

  const handleLoungePress = (disease: typeof DISEASES[0]) => {
    navigation.navigate('LoungeDetail', { disease });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>라운지</Text>
        <Text style={styles.subtitle}>질환별 환자·환우 커뮤니티</Text>
      </View>

      {/* 검색 */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="질환명 검색"
            placeholderTextColor={COLORS.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: COLORS.textTertiary, paddingHorizontal: 4 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            onPress={() => setActiveCategory(cat as any)}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
              {cat === '내 질환' ? '⭐ 내 질환' : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 질환 목록 */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>검색 결과가 없어요</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMyDisease = userDiseaseIds.includes(item.id);
          const postCount = POST_COUNTS[item.id] || 0;
          return (
            <TouchableOpacity
              style={[styles.card, isMyDisease && styles.cardMine]}
              onPress={() => handleLoungePress(item)}
              activeOpacity={0.85}
            >
              {/* 왼쪽: 이모지 + 텍스트 */}
              <View style={[styles.emojiBox, { backgroundColor: isMyDisease ? COLORS.primaryPale : COLORS.surfaceSecondary }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  {isMyDisease && (
                    <View style={styles.myBadge}>
                      <Text style={styles.myBadgeText}>내 질환</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <View style={styles.cardStats}>
                  {postCount > 0 && (
                    <Text style={styles.statText}>글 {postCount}개</Text>
                  )}
                  <Text style={styles.statDot}>·</Text>
                  <Text style={styles.statText}>{item.description}</Text>
                </View>
              </View>
              {/* 오른쪽 화살표 */}
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },

  searchRow: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  searchIcon: { fontSize: 15, marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },

  catScroll: { flexGrow: 0, backgroundColor: COLORS.surface },
  catContent: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, flexDirection: 'row' },
  catChip: {
    paddingHorizontal: SPACING.md, paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1.5, borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '500' },
  catTextActive: { color: '#fff', fontWeight: '700' },

  list: { padding: SPACING.md, paddingBottom: SPACING.xxl },

  // ── 카드 — 가로 리스트 스타일 ──────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardMine: {
    borderColor: 'rgba(232,168,56,0.3)',
    backgroundColor: '#FFFAF2',
  },
  emojiBox: {
    width: 50, height: 50,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  emoji: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  cardName: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.2 },
  myBadge: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.primaryPale,
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  myBadgeText: { fontSize: 10, fontWeight: '700', color: '#92610A' },
  cardCategory: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginBottom: 4 },
  cardStats: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  statDot: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginHorizontal: 4 },
  arrow: { fontSize: 22, color: COLORS.borderDark, marginLeft: SPACING.sm },

  empty: { paddingTop: 60, alignItems: 'center' },
  emptyEmoji: { fontSize: 40, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
});
