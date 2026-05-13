import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, FlatList
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { DISEASES } from '../constants/diseases';
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

      {/* 질환 목록 */}
      <FlatList
        data={DISEASES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
                <Text style={styles.emojiInitial}>{item.name.charAt(0)}</Text>
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
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primaryPale,
  },
  emojiBox: {
    width: 50, height: 50,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  emojiInitial: { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  cardName: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.2 },
  myBadge: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.primaryPale,
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  myBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  cardCategory: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginBottom: 4 },
  cardStats: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  statDot: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginHorizontal: 4 },
  arrow: { fontSize: 22, color: COLORS.borderDark, marginLeft: SPACING.sm },
});
