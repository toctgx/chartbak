// 차트밖 — 명언으로 응원하기 모달
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
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { Quote, getRelevantQuotes } from '../data/quotes';

interface QuoteCheerModalProps {
  visible: boolean;
  diaryText: string;             // 일기 내용 (키워드 분석용)
  authorNickname: string;        // 일기 작성자 닉네임
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
          {/* 헤더 */}
          <View style={styles.handle} />
          <Text style={styles.title}>명언으로 응원하기</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.nickname}>{authorNickname}</Text>님의 오늘에 어울리는 명언을 골라주세요
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
            <TouchableOpacity style={styles.shuffleBtn} onPress={handleShuffle} activeOpacity={0.7}>
              <Text style={styles.shuffleBtnText}>다른 명언 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, !selected && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!selected || submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>이걸로 응원할게요</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#0D1B3E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingBottom: 40,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  nickname: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    gap: 12,
    paddingBottom: 8,
  },
  quoteCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quoteCardSelected: {
    backgroundColor: 'rgba(232,168,56,0.18)',
    borderColor: COLORS.primary,
  },
  quoteText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteTextSelected: {
    color: '#fff',
  },
  quoteAuthor: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
    textAlign: 'right',
  },
  quoteAuthorSelected: {
    color: COLORS.primary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selectedBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: '#fff',
    fontWeight: '700',
  },
  footer: {
    marginTop: 16,
    gap: 10,
  },
  shuffleBtn: {
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  shuffleBtnText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: 'rgba(232,168,56,0.30)',
  },
  submitBtnText: {
    fontSize: FONTS.sizes.md,
    color: '#fff',
    fontWeight: '700',
  },
});
