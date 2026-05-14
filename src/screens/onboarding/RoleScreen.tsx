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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.step}>2 / 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>어떤 분이신가요?</Text>
          <Text style={styles.desc}>
            역할에 따라 다른 관점의 이야기를 나눌 수 있어요.{'\n'}
            환자글과 보호자글은 구분되어 표시됩니다.
          </Text>

          {([
            { role: 'patient' as UserRole, title: '환자 (본인)', desc: '직접 진단받고 치료 중인 분\n1인칭 증상·부작용·심리 경험 공유' },
            { role: 'caregiver' as UserRole, title: '환우 (보호자)', desc: '아픈 가족을 곁에서 돌보는 분\n관찰자 시점, 보호자 부담 공유' },
          ]).map(item => (
            <TouchableOpacity
              key={item.role}
              style={[styles.card, selected === item.role && styles.cardSelected]}
              onPress={() => setSelected(item.role)}
            >
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, selected === item.role && styles.cardTitleSelected]}>
                  {item.title}
                </Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
              <View style={[styles.radio, selected === item.role && styles.radioSelected]}>
                {selected === item.role && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.notice}>
            <Text style={styles.noticeText}>역할은 나중에 마이페이지에서 변경할 수 있어요</Text>
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
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollContent: { flexGrow: 1, paddingBottom: SPACING.xl },
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60 },
  step: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    marginBottom: SPACING.sm,
  },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textOnDark,
    marginBottom: SPACING.sm,
  },
  desc: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: COLORS.accent,
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textOnDark,
    marginBottom: 4,
  },
  cardTitleSelected: { color: COLORS.accent },
  cardDesc: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    lineHeight: 20,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.textOnAccent },
  notice: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  noticeText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: COLORS.textOnAccent,
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
  },
});
