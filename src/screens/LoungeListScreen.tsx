import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { DISEASES, DISEASE_CATEGORIES, DiseaseCategory } from '../constants/diseases';

interface Props {
  navigation: any;
  userDiseaseIds: string[];
}

export default function LoungeListScreen({ navigation, userDiseaseIds }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<DiseaseCategory | '전체' | '내 질환'>('전체');

  const filtered = DISEASES.filter(d => {
    const matchSearch = d.name.includes(search) || d.category.includes(search);
    if (activeCategory === '내 질환') return matchSearch && userDiseaseIds.includes(d.id);
    if (activeCategory === '전체') return matchSearch;
    return matchSearch && d.category === activeCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>라운지</Text>
        <Text style={styles.subtitle}>질환별 커뮤니티</Text>
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
        </View>
      </View>

      {/* 카테고리 필터 */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['내 질환', '전체', ...DISEASE_CATEGORIES]}
        keyExtractor={item => item}
        style={styles.catList}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.xs }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            onPress={() => setActiveCategory(item as any)}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>
              {item === '내 질환' ? '⭐ 내 질환' : item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 라운지 목록 */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const isMyDisease = userDiseaseIds.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, isMyDisease && styles.cardMine]}
              onPress={() => navigation.navigate('LoungeDetail', { disease: item })}
            >
              {isMyDisease && (
                <View style={styles.mineBadge}>
                  <Text style={styles.mineBadgeText}>⭐ 내 질환</Text>
                </View>
              )}
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.stats}>
                <Text style={styles.stat}>글 {Math.floor(Math.random() * 300 + 50)}</Text>
                <Text style={styles.statDot}>·</Text>
                <Text style={styles.stat}>멤버 {Math.floor(Math.random() * 1000 + 100)}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>검색 결과가 없어요</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.lg, paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  searchRow: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  catList: { flexGrow: 0, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface },
  catChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1.5, borderColor: COLORS.border, height: 36, justifyContent: 'center',
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '500' },
  catTextActive: { color: '#fff' },
  grid: { padding: SPACING.md },
  row: { gap: SPACING.sm, marginBottom: SPACING.sm },
  card: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    ...SHADOWS.sm, borderWidth: 1.5, borderColor: COLORS.border,
  },
  cardMine: { borderColor: COLORS.primary + '60', backgroundColor: '#F8FBFF' },
  mineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8, paddingVertical: 3, marginBottom: SPACING.xs,
  },
  mineBadgeText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },
  emoji: { fontSize: 36, marginBottom: SPACING.sm },
  name: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  category: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginBottom: SPACING.sm },
  stats: { flexDirection: 'row', alignItems: 'center' },
  stat: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  statDot: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginHorizontal: 4 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyEmoji: { fontSize: 40, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
});
