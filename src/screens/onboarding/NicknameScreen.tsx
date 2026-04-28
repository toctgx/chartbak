import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { DISEASES } from '../../constants/diseases';
import { generateNickname } from '../../lib/supabase';

interface Props {
  diseaseIds: string[];
  onNext: (nickname: string) => void;
}

export default function NicknameScreen({ diseaseIds, onNext }: Props) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  const generateNew = () => {
    setLoading(true);
    const primaryDisease = DISEASES.find(d => d.id === diseaseIds[0]);
    const baseName = primaryDisease?.name || '이용자';
    setTimeout(() => {
      setNickname(generateNickname(baseName));
      setLoading(false);
    }, 500);
  };

  useEffect(() => { generateNew(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>4 / 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '80%' }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>🎭</Text>
        <Text style={styles.title}>익명 닉네임이 만들어졌어요</Text>
        <Text style={styles.desc}>
          모든 활동은 이 닉네임으로 이루어져요.{'\n'}
          실명이나 개인정보는 노출되지 않아요.
        </Text>

        {/* 닉네임 카드 */}
        <View style={styles.nicknameCard}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size="large" />
          ) : (
            <>
              <Text style={styles.nicknameEmoji}>✨</Text>
              <Text style={styles.nickname}>{nickname}</Text>
              <Text style={styles.nicknameDesc}>
                {DISEASES.find(d => d.id === diseaseIds[0])?.name || ''}
                으로 시작하는 익명 닉네임
              </Text>
            </>
          )}
        </View>

        {/* 재생성 */}
        <TouchableOpacity style={styles.regenerateBtn} onPress={generateNew}>
          <Text style={styles.regenerateText}>🔄 다른 닉네임 받기</Text>
        </TouchableOpacity>

        {/* 안내 */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            💡 닉네임은 언제든지 마이페이지에서 다시 생성할 수 있어요
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (loading || !nickname) && styles.buttonDisabled]}
          onPress={() => nickname && onNext(nickname)}
          disabled={loading || !nickname}
        >
          <Text style={styles.buttonText}>이 닉네임으로 할게요</Text>
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
  content: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  emoji: { fontSize: 48, marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  desc: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 24, marginBottom: SPACING.xl },
  nicknameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2, borderColor: COLORS.primaryLight,
    minHeight: 130, justifyContent: 'center',
  },
  nicknameEmoji: { fontSize: 32, marginBottom: SPACING.sm },
  nickname: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.sm },
  nicknameDesc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  regenerateBtn: {
    alignSelf: 'center', paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md, marginBottom: SPACING.lg,
  },
  regenerateText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  notice: {
    backgroundColor: COLORS.surfaceSecondary, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.lg,
  },
  noticeText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '600' },
});
