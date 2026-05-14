// 차트밖 — 한줄일기 (Wellness Aging Care 디자인)
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { UserRole } from '../types';
import { Quote } from '../data/quotes';
import QuoteCheerModal from '../components/QuoteCheerModal';

interface DiaryEntry {
  id: string;
  author_nickname: string;
  author_role: UserRole;
  text: string;
  created_at: string;
  cheers: QuoteCheer[];
}

interface QuoteCheer {
  id: string;
  from_nickname: string;
  quote_text: string;
  quote_author: string;
}

interface DiaryScreenProps {
  nickname: string;
  userRole: UserRole;
}

const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: '1',
    author_nickname: '폐암_4721',
    author_role: 'patient',
    text: '항암 3차 맞고 왔다. 이번엔 유독 힘드네. 그래도 버텼다.',
    created_at: '2시간 전',
    cheers: [
      { id: 'c1', from_nickname: '위암_1023', quote_text: '버티는 것도 나아가는 것이다.', quote_author: '류시화' },
    ],
  },
  {
    id: '2',
    author_nickname: '당뇨_8834',
    author_role: 'patient',
    text: '오늘 혈당이 또 튀었다. 뭘 먹어야 할지 모르겠어. 지쳐간다.',
    created_at: '4시간 전',
    cheers: [],
  },
  {
    id: '3',
    author_nickname: '유방암_2290_환우',
    author_role: 'caregiver',
    text: '엄마가 오늘 웃었다. 오랜만에 보는 미소. 그것만으로 충분하다.',
    created_at: '6시간 전',
    cheers: [
      { id: 'c2', from_nickname: '폐암_0091', quote_text: '살아있다는 것 자체가 기적이다.', quote_author: '틱낫한' },
      { id: 'c3', from_nickname: '뇌종양_3310', quote_text: '오늘 살아낸 것, 그것으로 충분하다.', quote_author: '혜민 스님' },
    ],
  },
  {
    id: '4',
    author_nickname: '루푸스_5590',
    author_role: 'patient',
    text: '두렵다. 다음 주 검사 결과가. 잘 잘 수가 없다.',
    created_at: '어제',
    cheers: [],
  },
];

function DiaryCard({ entry, onCheerPress }: { entry: DiaryEntry; onCheerPress: (e: DiaryEntry) => void }) {
  const [showCheers, setShowCheers] = useState(false);
  const isPatient = entry.author_role === 'patient';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.roleBadge, isPatient ? styles.roleBadgePatient : styles.roleBadgeCare]}>
          <Text style={[styles.roleBadgeText, isPatient ? styles.roleBadgeTextPatient : styles.roleBadgeTextCare]}>
            {isPatient ? '환자' : '환우'}
          </Text>
        </View>
        <Text style={styles.nickname}>{entry.author_nickname}</Text>
        <Text style={styles.time}>{entry.created_at}</Text>
      </View>

      <Text style={styles.diaryText}>{entry.text}</Text>

      {entry.cheers.length > 0 && (
        <TouchableOpacity
          style={styles.cheersPreview}
          onPress={() => setShowCheers(!showCheers)}
        >
          <Text style={styles.cheersPreviewText}>
            응원 {entry.cheers.length}개 {showCheers ? '접기 ▲' : '보기 ▼'}
          </Text>
        </TouchableOpacity>
      )}

      {showCheers && (
        <View style={styles.cheersList}>
          {entry.cheers.map(cheer => (
            <View key={cheer.id} style={styles.cheerItem}>
              <Text style={styles.cheerQuote}>"{cheer.quote_text}"</Text>
              <Text style={styles.cheerMeta}>— {cheer.quote_author} · {cheer.from_nickname}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.cheerBtn}
        onPress={() => onCheerPress(entry)}
        activeOpacity={0.75}
      >
        <Text style={styles.cheerBtnText}>응원하기</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DiaryScreen({ nickname, userRole }: DiaryScreenProps) {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<DiaryEntry[]>(MOCK_ENTRIES);
  const [inputText, setInputText] = useState('');
  const [todayWritten, setTodayWritten] = useState(false);
  const [modalTarget, setModalTarget] = useState<DiaryEntry | null>(null);

  const handleWrite = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    if (trimmed.length > 100) {
      Alert.alert('한 줄만요!', '100자 이내로 써주세요.');
      return;
    }
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      author_nickname: nickname,
      author_role: userRole,
      text: trimmed,
      created_at: '방금',
      cheers: [],
    };
    setEntries(prev => [newEntry, ...prev]);
    setInputText('');
    setTodayWritten(true);
  }, [inputText, nickname, userRole]);

  const handleCheerSubmit = useCallback((quote: Quote) => {
    if (!modalTarget) return;
    const newCheer: QuoteCheer = {
      id: Date.now().toString(),
      from_nickname: nickname,
      quote_text: quote.text,
      quote_author: quote.author,
    };
    setEntries(prev =>
      prev.map(e => e.id === modalTarget.id ? { ...e, cheers: [...e.cheers, newCheer] } : e)
    );
    setModalTarget(null);
  }, [modalTarget, nickname]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 — 인디고 배경 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>한줄일기</Text>
        <Text style={styles.headerSub}>오늘의 감정을 한 줄로</Text>

        {/* 입력창 */}
        {!todayWritten ? (
          <View style={styles.writeBox}>
            <TextInput
              style={styles.input}
              placeholder="오늘 하루 어떠셨나요? (100자 이내)"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
              maxLength={100}
              returnKeyType="done"
              onSubmitEditing={handleWrite}
            />
            <TouchableOpacity
              style={[styles.writeBtn, !inputText.trim() && styles.writeBtnDisabled]}
              onPress={handleWrite}
              disabled={!inputText.trim()}
            >
              <Text style={styles.writeBtnText}>등록</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.todayDone}>
            <Text style={styles.todayDoneText}>오늘 일기 작성 완료 · 내일 또 만나요 ✓</Text>
          </View>
        )}
      </View>

      {/* 피드 */}
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DiaryCard entry={item} onCheerPress={setModalTarget} />
        )}
        contentContainerStyle={[styles.feed, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {modalTarget && (
        <QuoteCheerModal
          visible={!!modalTarget}
          diaryText={modalTarget.text}
          authorNickname={modalTarget.author_nickname}
          onClose={() => setModalTarget(null)}
          onSubmit={handleCheerSubmit}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // 헤더
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDarkSoft,
    marginBottom: SPACING.md,
  },

  // 입력창
  writeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textOnDark,
    paddingVertical: 12,
  },
  writeBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  writeBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  writeBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textOnAccent,
  },
  todayDone: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  todayDoneText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.accent,
    textAlign: 'center',
  },

  // 피드
  feed: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },

  // 카드
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  roleBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgePatient: { backgroundColor: COLORS.accentLight },
  roleBadgeCare: { backgroundColor: COLORS.lavender + '50' },
  roleBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.bold,
  },
  roleBadgeTextPatient: { color: COLORS.textPrimary },
  roleBadgeTextCare: { color: COLORS.primary },
  nickname: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  time: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  diaryText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  cheersPreview: { marginBottom: 8 },
  cheersPreviewText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },
  cheersList: { gap: 8, marginBottom: 10 },
  cheerItem: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.accent,
  },
  cheerQuote: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cheerMeta: {
    fontSize: FONTS.sizes.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
  cheerBtn: {
    marginTop: 4,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
  },
  cheerBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
