import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { DISEASES } from '../../constants/diseases';
import { generateNickname } from '../../lib/supabase';

interface Props {
  diseaseIds: string[];
  onNext: (nickname: string) => void;
}

export default function NicknameScreen({ diseaseIds, onNext }: Props) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const autoGenerate = () => {
    setLoading(true);
    const primaryDisease = DISEASES.find(d => d.id === diseaseIds[0]);
    const baseName = primaryDisease?.name || '이용자';
    setTimeout(() => {
      setNickname(generateNickname(baseName));
      setLoading(false);
      setTouched(false);
    }, 400);
  };

  const trimmed = nickname.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 16;
  const showError = touched && !isValid && trimmed.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>4 / 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '80%' }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>닉네임을 정해주세요</Text>
        <Text style={styles.desc}>
          모든 활동은 이 닉네임으로 이루어져요.{'\n'}
          실명이나 개인정보는 노출되지 않아요.
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={(v) => { setNickname(v); setTouched(true); }}
            placeholder="닉네임 입력 (2~16자)"
            placeholderTextColor="rgba(255,255,255,0.5)"
            maxLength={16}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Text style={styles.charCount}>{trimmed.length}/16</Text>
        </View>
        {showError && <Text style={styles.errorText}>2자 이상 입력해주세요</Text>}

        <TouchableOpacity
          style={styles.autoBtn}
          onPress={autoGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.accent} size="small" />
          ) : (
            <Text style={styles.autoBtnText}>닉네임 자동 생성하기</Text>
          )}
        </TouchableOpacity>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>닉네임은 마이페이지에서 언제든지 변경할 수 있어요</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={() => isValid && onNext(trimmed)}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60 },
  step: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    marginBottom: SPACING.sm,
  },
  progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.semibold,
    color: COLORS.textOnDark,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
  } as any,
  charCount: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  autoBtn: {
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.full,
    minWidth: 180,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  autoBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.accent,
  },
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
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: COLORS.textOnAccent,
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
  },
});
