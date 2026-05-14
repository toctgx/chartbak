import React from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { DISEASES } from '../constants/diseases';
import { MOCK_POSTS } from '../lib/mockData';

interface Props {
  navigation: any;
  userDiseaseIds: string[];
}

const POST_COUNTS: Record<string, number> = {};
MOCK_POSTS.forEach(p => {
  POST_COUNTS[p.disease_id] = (POST_COUNTS[p.disease_id] || 0) + 1;
});

export default function LoungeListScreen({ navigation, userDiseaseIds }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 — 인디고 */}
      <View style={styles.header}>
        <Text style={styles.title}>라운지</Text>
        <Text style={styles.subtitle}>질환별 환자·환우 커뮤니티</Text>
      </View>

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
              onPress={() => navigation.navigate('LoungeDetail', { disease: item })}
              activeOpacity={0.85}
            >
              {/* 왼쪽: 인디고 원 안에 첫 글자 */}
              <View style={styles.emojiBox}>
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
                  {postCount > 0 && <Text style={styles.statDot}>·</Text>}
                  <Text style={styles.statText}>{item.description}</Text>
                </View>
              </View>
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    marginTop: 2,
  },

  list: { padding: SPACING.md, paddingBottom: 96 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.card,
  },
  cardMine: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
  },
  emojiBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  emojiInitial: {
    fontSize: 20,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
  },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  cardName: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.extrabold,
    color: COLORS.textPrimary,
  },
  myBadge: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  myBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.textOnAccent,
  },
  cardCategory: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  cardStats: { flexDirection: 'row', alignItems: 'center' },
  statText: { fontSize: FONTS.sizes.xs, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  statDot: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginHorizontal: 4 },
  arrow: { fontSize: 22, color: COLORS.lavender, marginLeft: SPACING.sm },
});
