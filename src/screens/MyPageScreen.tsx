import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { User } from '../types';
import { DISEASES } from '../constants/diseases';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function MyPageScreen({ user, onLogout }: Props) {
  const insets = useSafeAreaInsets();
  const userDiseases = DISEASES.filter(d => user.disease_ids.includes(d.id));
  const initial = user.nickname.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 96 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 프로필 섹션 — 인디고 배경 */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.nickname}>{user.nickname}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user.role === 'patient' ? '환자' : '환우(보호자)'}
          </Text>
        </View>
      </View>

      {/* 통계 카드 3개 */}
      <View style={styles.statsRow}>
        {[
          { label: '작성한 글', value: '3' },
          { label: '받은 공감', value: '47' },
          { label: '댓글', value: '12' },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* 내 질환 */}
      {userDiseases.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 질환 라운지</Text>
          {userDiseases.map(disease => (
            <View key={disease.id} style={styles.diseaseCard}>
              <View style={styles.diseaseIconBox}>
                <Text style={styles.diseaseInitial}>{disease.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.diseaseName}>{disease.name}</Text>
                <Text style={styles.diseaseCategory}>{disease.category}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 설정 메뉴 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정</Text>
        {[
          { label: '내 게시글 보기' },
          { label: '내가 공감한 글' },
          { label: '알림 설정' },
          { label: '개인정보 처리방침' },
          { label: '서비스 이용약관' },
          { label: '문의하기' },
        ].map((item, idx, arr) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, idx < arr.length - 1 && styles.menuItemBorder]}
            onPress={() => {}}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 로그아웃 */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
          { text: '취소', style: 'cancel' },
          { text: '로그아웃', style: 'destructive', onPress: onLogout },
        ])}
      >
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      {/* 면책 고지 */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          차트밖의 모든 게시글은 의료 조언이 아닙니다.{'\n'}
          증상 및 치료에 대해서는 반드시 전문 의료인과 상담하세요.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // 프로필 섹션 — 인디고
  profileSection: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnAccent,
  },
  nickname: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  roleText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textOnDark,
  },

  // 통계 카드
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.md,
    paddingBottom: 0,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.extrabold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // 섹션
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    margin: SPACING.md,
    marginBottom: 0,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  diseaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
    gap: SPACING.md,
  },
  diseaseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diseaseInitial: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textOnDark,
  },
  diseaseName: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  diseaseCategory: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
  },
  menuLabel: { fontSize: FONTS.sizes.md, fontFamily: FONTS.regular, color: COLORS.textPrimary },
  menuArrow: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary },

  logoutBtn: {
    margin: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.error + '60',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.semibold,
    color: COLORS.error,
  },

  disclaimer: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  disclaimerText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
});
