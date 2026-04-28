import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { AGE_GROUPS } from '../../types';

interface Props {
  nickname: string;
  onNext: (ageGroup: string, diagnosisYear: number) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export default function BasicInfoScreen({ nickname, onNext }: Props) {
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [diagnosisYear, setDiagnosisYear] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>5 / 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>거의 다 됐어요!</Text>
        <Text style={styles.desc}>
          마지막으로 기본 정보를 알려주세요.{'\n'}
          더 비슷한 분들과 연결하는 데 도움이 돼요.
        </Text>

        {/* 닉네임 확인 */}
        <View style={styles.nicknameBox}>
          <Text style={styles.nicknameLabel}>내 닉네임</Text>
          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.nicknameNote}>* 닉네임은 익명으로 자동 생성됩니다</Text>
        </View>

        {/* 나이대 선택 */}
        <Text style={styles.sectionTitle}>나이대</Text>
        <View style={styles.grid}>
          {AGE_GROUPS.map(age => (
            <TouchableOpacity
              key={age}
              style={[styles.chip, ageGroup === age && styles.chipSelected]}
              onPress={() => setAgeGroup(age)}
            >
              <Text style={[styles.chipText, ageGroup === age && styles.chipTextSelected]}>
                {age}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 진단 연도 */}
        <Text style={styles.sectionTitle}>진단 받은 연도</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.yearRow}>
            {YEARS.map(year => (
              <TouchableOpacity
                key={year}
                style={[styles.yearChip, diagnosisYear === year && styles.chipSelected]}
                onPress={() => setDiagnosisYear(year)}
              >
                <Text style={[styles.chipText, diagnosisYear === year && styles.chipTextSelected]}>
                  {year}년
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, (!ageGroup || !diagnosisYear) && styles.buttonDisabled]}
          onPress={() => ageGroup && diagnosisYear && onNext(ageGroup, diagnosisYear)}
          disabled={!ageGroup || !diagnosisYear}
        >
          <Text style={styles.buttonText}>🏥 병갔왔 시작하기!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60 },
  step: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  emoji: { fontSize: 48, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  desc: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.lg },
  nicknameBox: {
    backgroundColor: COLORS.primaryLight + '22',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1, borderColor: COLORS.primaryLight,
  },
  nicknameLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginBottom: 4 },
  nickname: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.primary },
  nicknameNote: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginTop: 4 },
  sectionTitle: {
    fontSize: FONTS.sizes.md, fontWeight: '600',
    color: COLORS.textPrimary, marginBottom: SPACING.sm
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  yearRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  yearChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  chipSelected: { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary },
  chipText: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, fontWeight: '500' },
  chipTextSelected: { color: COLORS.primary, fontWeight: '700' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.lg, backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, alignItems: 'center'
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '600' },
});
