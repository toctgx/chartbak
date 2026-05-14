// 차트밖 — 명언으로 응원하기 모달 (Wellness Aging Care 디자인)
import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { Quote, getRelevantQuotes } from '../data/quotes';

interface QuoteCheerModalProps {
  visible: boolean;
  diaryText: string;
  authorNickname: string;
  onClose: () => void;
  onSubmit: (quote: Quote) => void;
}

export default function QuoteCheerModal({
  visible,
  diaryText,
  authorNickname,
  onClose,
  onSubmit,
}: QuoteCheerModalProps) {
  const [quotes, setQuotes] = useState<Quote[]>(() => getRelevantQuotes(diaryText, 3));
  const [selected, setSelected] = useState<Quote | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleShuffle = useCallback(() => {
    setSelected(null);
    setQuotes(getRelevantQuotes(diaryText, 3));
  }, [diaryText]);

  const handleSubmit = useCallback(async () => {
    if (!selected) return;
    setSubmitting(true);
    await onSubmit(selected);
    setSubmitting(false);
    setSelected(null);
  }, [selected, onSubmit]);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

        <View style={styles.sheet}>
          {/* 핸들 — 라벤더 */}
          <View style={styles.handle} />

          <Text style={styles.title}>응원하기</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.nickname}>{authorNickname}</Text>
            님의 오늘에 어울리는 명언을 골라주세요
          </Text>

          {/* 명언 카드 목록 */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {quotes.map((quote, idx) => {
              const isSelected = selected?.text === quote.text;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.quoteCard, isSelected && styles.quoteCardSelected]}
                  onPress={() => setSelected(isSelected ? null : quote)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.quoteText, isSelected && styles.quoteTextSelected]}>
                    "{quote.text}"
                  </Text>
                  <Text style={[styles.quoteAuthor, isSelected && styles.quoteAuthorSelected]}>
                    — {quote.author}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓ 선택됨</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.shuffleBtn}
              onPress={handleShuffle}
              activeOpacity={0.7}
            >
              <Text style={styles.shuffleBtnText}>다른 명언 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, !selected && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!selected || submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.textOnAccent} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>응원할게요</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.md,
    paddingBottom: 40,
    maxHeight: '85%',
    ...SHADOWS.tabBar,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.lavender,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  nickname: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  list: { flexGrow: 0 },
  listContent: { gap: 12, paddingBottom: 8 },

  quoteCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderCard,
  },
  quoteCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quoteText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteTextSelected: {
    color: COLORS.textOnDark,
    fontFamily: FONTS.semibold,
  },
  quoteAuthor: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
  quoteAuthorSelected: { color: COLORS.textOnDarkSoft },

  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selectedBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textOnAccent,
  },

  footer: { marginTop: 16, gap: 10 },
  shuffleBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  shuffleBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: COLORS.lavender },
  submitBtnText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
    color: COLORS.textOnAccent,
  },
});
