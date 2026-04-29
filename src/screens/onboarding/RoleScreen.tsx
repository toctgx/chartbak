import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { UserRole } from '../../types';

interface Props {
  onNext: (role: UserRole) => void;
}

export default function RoleScreen({ onNext }: Props) {
  const [selected, setSelected] = useState<UserRole | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.step}>2 / 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>🤝</Text>
          <Text style={styles.title}>어떤 분이신가요?</Text>
          <Text style={styles.desc}>
            역할에 따라 다른 관점의 이야기를 나눌 수 있어요.{'\n'}
            환자글과 보호자글은 구분되어 표시됩니다.
          </Text>

          <TouchableOpacity
            style={[
              styles.card,
              selected === 'patient' && styles.cardSelected,
              { borderColor: selected === 'patient' ? COLORS.patient : COLORS.border }
            ]}
            onPress={() => setSelected('patient')}
          >
            <Text style={styles.cardEmoji}>🏥</Text>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, selected === 'patient' && { color: COLORS.patient }]}>
                환자 (본인)
              </Text>
              <Text style={styles.cardDesc}>
                직접 진단받고 치료 중인 분{'\n'}1인칭 증상·부작용·심리 경험 공유
              </Text>
            </View>
            <View style={[styles.radio, selected === 'patient' && { backgroundColor: COLORS.patient, borderColor: COLORS.patient }]}>
              {selected === 'patient' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              selected === 'caregiver' && styles.cardSelected,
              { borderColor: selected === 'caregiver' ? COLORS.caregiver : COLORS.border }
            ]}
            onPress={() => setSelected('caregiver')}
          >
            <Text style={styles.cardEmoji}>🫂</Text>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, selected === 'caregiver' && { color: COLORS.caregiver }]}>
                환우 (보호자)
              </Text>
              <Text style={styles.cardDesc}>
                아픈 가족을 곁에서 돌보는 분{'\n'}관찰자 시점, 보호자 부담 공유
              </Text>
            </View>
            <View style={[styles.radio, selected === 'caregiver' && { backgroundColor: COLORS.caregiver, borderColor: COLORS.caregiver }]}>
              {selected === 'caregiver' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              💡 역할은 나중에 마이페이지에서 변경할 수 있어요
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !selected && styles.buttonDisabled]}
            onPress={() => selected && onNext(selected)}
            disabled={!selected}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingBottom: SPACING.xl },
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60 },
  step: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  emoji: { fontSize: 48, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  desc: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 2, padding: SPACING.md, marginBottom: SPACING.md,
    flexDirection: 'row', alignItems: 'center', ...SHADOWS.sm,
  },
  cardSelected: { ...SHADOWS.md },
  cardEmoji: { fontSize: 36, marginRight: SPACING.md },
  cardText: { flex: 1 },
  cardTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  notice: {
    backgroundColor: COLORS.surfaceSecondary, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.lg,
  },
  noticeText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: COLORS.textInverse, fontSize: FONTS.sizes.lg, fontWeight: '600' },
});
