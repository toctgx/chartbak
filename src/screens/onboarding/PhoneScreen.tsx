import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Platform
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  onNext: (phone: string) => void;
}

export default function PhoneScreen({ onNext }: Props) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);

  const formatPhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handleSendCode = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 11) {
      Alert.alert('알림', '올바른 전화번호를 입력해주세요');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
      Alert.alert('인증번호 발송', '인증번호가 발송되었습니다.\n(MVP 테스트: 000000 입력)');
    }, 1000);
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      Alert.alert('알림', '6자리 인증번호를 입력해주세요');
      return;
    }
    if (code === '000000') {
      onNext(phone.replace(/\D/g, ''));
    } else {
      Alert.alert('오류', '인증번호가 올바르지 않습니다');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.step}>1 / 5</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
        </View>

        <View style={styles.content}>

          <Text style={styles.title}>
            {step === 'phone' ? '전화번호로 시작해요' : '인증번호를 입력해주세요'}
          </Text>
          <Text style={styles.desc}>
            {step === 'phone'
              ? '익명 서비스를 위해 전화번호만 사용하고\n번호는 암호화되어 저장됩니다'
              : `${phone}으로 발송된\n6자리 인증번호를 입력해주세요`}
          </Text>

          {step === 'phone' ? (
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => setPhone(formatPhone(t))}
              maxLength={13}
            />
          ) : (
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="000000"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />
          )}

          {step === 'phone' && (
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? '발송 중...' : '인증번호 받기'}
              </Text>
            </TouchableOpacity>
          )}

          {step === 'verify' && (
            <>
              <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep('phone')}>
                <Text style={styles.resend}>전화번호 다시 입력</Text>
              </TouchableOpacity>
            </>
          )}
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
  content: { flex: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl },
  emoji: { fontSize: 48, marginBottom: SPACING.md },
  title: {
    fontSize: FONTS.sizes.xxl, fontWeight: '700',
    color: COLORS.textPrimary, marginBottom: SPACING.sm
  },
  desc: {
    fontSize: FONTS.sizes.md, color: COLORS.textSecondary,
    lineHeight: 24, marginBottom: SPACING.xl
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  codeInput: { letterSpacing: 8, textAlign: 'center', fontSize: FONTS.sizes.xxl },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: COLORS.textInverse, fontSize: FONTS.sizes.lg, fontWeight: '600' },
  resend: {
    textAlign: 'center', color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm, marginTop: SPACING.xs
  },
});
