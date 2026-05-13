import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { User } from '../types';
import { DISEASES } from '../constants/diseases';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function MyPageScreen({ user, onLogout }: Props) {
  const userDiseases = DISEASES.filter(d => user.disease_ids.includes(d.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={[
            styles.avatar,
            { backgroundColor: user.role === 'patient' ? COLORS.patient + '20' : COLORS.caregiver + '20' }
          ]}>
            <Text style={styles.avatarEmoji}>{user.role === 'patient' ? '환' : '원'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nickname}>{user.nickname}</Text>
            <View style={[
              styles.roleBadge,
              { backgroundColor: COLORS.surfaceSecondary }
            ]}>
              <Text style={[
                styles.roleText,
                { color: user.role === 'patient' ? COLORS.primary : COLORS.caregiver }
              ]}>
                {user.role === 'patient' ? '환자' : '환우(보호자)'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>나이대</Text>
            <Text style={styles.infoValue}>{user.age_group}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>진단 연도</Text>
            <Text style={styles.infoValue}>{user.diagnosis_year}년</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>가입</Text>
            <Text style={styles.infoValue}>
              {new Date(user.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </Text>
          </View>
        </View>
      </View>

      {/* 내 질환 라운지 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 질환 라운지</Text>
        {userDiseases.map(disease => (
          <View key={disease.id} style={styles.diseaseCard}>
  
            <View>
              <Text style={styles.diseaseName}>{disease.name}</Text>
              <Text style={styles.diseaseCategory}>{disease.category}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 활동 통계 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>나의 활동</Text>
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
      </View>

      {/* 설정 메뉴 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정</Text>
        {[
          { label: '내 게시글 보기', action: () => {} },
          { label: '내가 공감한 글', action: () => {} },
          { label: '알림 설정', action: () => {} },
          { label: '개인정보 처리방침', action: () => {} },
          { label: '서비스 이용약관', action: () => {} },
          { label: '문의하기', action: () => {} },
        ].map(item => (
          <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.action}>
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
          { text: '로그아웃', style: 'destructive', onPress: onLogout }
        ])}
      >
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      {/* 법적 고지 */}
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
  profileCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingTop: 64,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarEmoji: { fontSize: 22, fontWeight: '800', color: COLORS.primary } as any,
  profileInfo: { flex: 1 },
  nickname: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  roleText: { fontSize: FONTS.sizes.sm, fontWeight: '700' },
  infoGrid: { flexDirection: 'row' },
  infoItem: { flex: 1, alignItems: 'center', marginRight: SPACING.xs },
  infoLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginBottom: 4 },
  infoValue: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  section: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.md },
  diseaseCard: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  diseaseEmoji: { fontSize: 28, marginRight: SPACING.md },
  diseaseName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  diseaseCategory: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary },
  statsRow: { flexDirection: 'row' },
  statCard: {
    flex: 1, backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center',
    marginRight: SPACING.sm,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuLabel: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  menuArrow: { fontSize: FONTS.sizes.lg, color: COLORS.textTertiary },
  logoutBtn: {
    margin: SPACING.lg, padding: SPACING.md,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.error + '50',
    alignItems: 'center',
  },
  logoutText: { fontSize: FONTS.sizes.md, color: COLORS.error, fontWeight: '600' },
  disclaimer: {
    margin: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  disclaimerText: {
    fontSize: FONTS.sizes.xs, color: COLORS.textSecondary,
    lineHeight: 18, textAlign: 'center',
  },
});
