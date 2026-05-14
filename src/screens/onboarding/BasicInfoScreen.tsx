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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.step}>5 / 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>거의 다 됐어요!</Text>
          <Text style={styles.desc}>
            마지막으로 기본 정보를 알려주세요.{'\n'}
            더 비슷한 분들과 연결하는 데 도움이 돼요.
          </Text>

          {/* 닉네임 확인 */}
          <View style={styles.nicknameBox}>
            <Text style={styles.nicknameLabel}>내 닉네임</Text>
            <Text style={styles.nickname}>{nickname}</Text>
          </View>

          {/* 나이대 — 칩 토글 (wrap 그리드) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>나이대</Text>
            <View style={styles.chipGrid}>
              {AGE_GROUPS.map(age => (
                <TouchableOpacity
                  key={age}
                  style={[styles.chip, ageGroup === age && styles.chipSelected]}
                  onPress={() => setAgeGroup(prev => (prev === age ? null : age))}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, ageGroup === age && styles.chipTextSelected]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 진단연도 — 칩 토글 (가로 스크롤) */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>진단 받은 연도</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearScroll}>
              {YEARS.map(year => (
                <TouchableOpacity
                  key={year}
                  style={[styles.chip, diagnosisYear === year && styles.chipSelected]}
                  onPress={() => setDiagnosisYear(prev => (prev === year ? null : year))}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, diagnosisYear === year && styles.chipTextSelected]}>
                    {year}년
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 시작 버튼 */}
          <TouchableOpacity
            style={[styles.button, (!ageGroup || !diagnosisYear) && styles.buttonDisabled]}
            onPress={() => ageGroup && diagnosisYear && onNext(ageGroup, diagnosisYear)}
            disabled={!ageGroup || !diagnosisYear}
          >
            <Text style={styles.buttonText}>차트밖 시작하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, paddingBottom: SPACING.xl },
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60 },
  step: { fontSize: FONTS.sizes.sm, fontFamily: FONTS.regular, color: COLORS.textOnDarkSoft, marginBottom: SPACING.sm },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  emoji: { fontSize: 48, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xxl, fontFamily: FONTS.bold, color: COLORS.textOnDark, marginBottom: SPACING.sm },
  desc: { fontSize: FONTS.sizes.md, fontFamily: FONTS.regular, color: COLORS.textOnDarkSoft, lineHeight: 24, marginBottom: SPACING.lg },

  nicknameBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  nicknameLabel: { fontSize: FONTS.sizes.xs, fontFamily: FONTS.regular, color: COLORS.textOnDarkSoft },
  nickname: { fontSize: FONTS.sizes.md, fontFamily: FONTS.bold, color: COLORS.accent },

  section: { marginBottom: SPACING.xl },
  sectionLabel: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textOnDarkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },

  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDark,
  },
  chipTextSelected: {
    fontFamily: FONTS.bold,
    color: COLORS.textOnAccent,
  },

  yearScroll: {
    gap: 8,
    paddingVertical: 2,
  },

  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md, alignItems: 'center',
    marginTop: SPACING.sm, marginBottom: SPACING.lg,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: COLORS.textOnAccent, fontFamily: FONTS.bold, fontSize: FONTS.sizes.lg },
});
