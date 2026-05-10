// 차트밖 — 한줄일기 피드
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

// ── 타입 ──────────────────────────────────────────────────
interface DiaryEntry {
  id: string;
  author_nickname: string;
  author_role: UserRole;
  text: string;
  created_at: string;
  cheers: QuoteCheer[];       // 받은 명언 응원들
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

// ── 목업 데이터 ───────────────────────────────────────────
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
    cheers: [
      { id: 'c4', from_nickname: '당뇨_1203', quote_text: '가장 어두운 밤도 끝나고, 해는 뜬다.', quote_author: '빅토르 위고' },
    ],
  },
  {
    id: '5',
    author_nickname: '크론병_7741',
    author_role: 'patient',
    text: '오늘은 통증이 조금 덜하다. 작은 거지만 감사하다.',
    created_at: '어제',
    cheers: [],
  },
];

// ── 유틸 ──────────────────────────────────────────────────
function getRoleBadge(role: UserRole) {
  return role === 'patient'
    ? { label: '환자', color: COLORS.patient }
    : { label: '환우', color: COLORS.caregiver };
}

// ── 한줄일기 카드 ─────────────────────────────────────────
interface DiaryCardProps {
  entry: DiaryEntry;
  onCheerPress: (entry: DiaryEntry) => void;
}

function DiaryCard({ entry, onCheerPress }: DiaryCardProps) {
  const [showCheers, setShowCheers] = useState(false);
  const badge = getRoleBadge(entry.author_role);

  return (
    <View style={styles.card}>
      {/* 작성자 */}
      <View style={styles.cardHeader}>
        <View style={[styles.roleBadge, { backgroundColor: badge.color + '22' }]}>
          <Text style={[styles.roleBadgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
        <Text style={styles.nickname}>{entry.author_nickname}</Text>
        <Text style={styles.time}>{entry.created_at}</Text>
      </View>

      {/* 일기 본문 */}
      <Text style={styles.diaryText}>{entry.text}</Text>

      {/* 받은 명언 응원 */}
      {entry.cheers.length > 0 && (
        <TouchableOpacity
          style={styles.cheersPreview}
          onPress={() => setShowCheers(!showCheers)}
          activeOpacity={0.7}
        >
          <Text style={styles.cheersPreviewText}>
            💌 명언 응원 {entry.cheers.length}개
            <Text style={styles.cheersToggle}> {showCheers ? '접기' : '보기'}</Text>
          </Text>
        </TouchableOpacity>
      )}

      {showCheers && (
        <View style={styles.cheersList}>
          {entry.cheers.map((cheer) => (
            <View key={cheer.id} style={styles.cheerItem}>
              <Text style={styles.cheerQuote}>"{cheer.quote_text}"</Text>
              <Text style={styles.cheerMeta}>— {cheer.quote_author} · {cheer.from_nickname}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 명언으로 응원하기 버튼 */}
      <TouchableOpacity
        style={styles.cheerBtn}
        onPress={() => onCheerPress(entry)}
        activeOpacity={0.75}
      >
        <Text style={styles.cheerBtnText}>✉️ 명언으로 응원하기</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── 메인 화면 ────────────────────────────────────────────
export default function DiaryScreen({ nickname, userRole }: DiaryScreenProps) {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState<DiaryEntry[]>(MOCK_ENTRIES);
  const [inputText, setInputText] = useState('');
  const [todayWritten, setTodayWritten] = useState(false);
  const [modalTarget, setModalTarget] = useState<DiaryEntry | null>(null);

  // 오늘 일기 작성
  const handleWrite = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    if (trimmed.length > 100) {
      Alert.alert('한 줄만요!', '100자 이내로 써주세요 😊');
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

    setEntries((prev) => [newEntry, ...prev]);
    setInputText('');
    setTodayWritten(true);
  }, [inputText, nickname, userRole]);

  // 명언 응원 제출
  const handleCheerSubmit = useCallback((quote: Quote) => {
    if (!modalTarget) return;
    const newCheer: QuoteCheer = {
      id: Date.now().toString(),
      from_nickname: nickname,
      quote_text: quote.text,
      quote_author: quote.author,
    };
    setEntries((prev) =>
      prev.map((e) =>
        e.id === modalTarget.id ? { ...e, cheers: [...e.cheers, newCheer] } : e
      )
    );
    setModalTarget(null);
  }, [modalTarget, nickname]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>한줄일기</Text>
        <Text style={styles.headerSub}>오늘의 감정을 한 줄로</Text>
      </View>

      {/* 작성 입력창 */}
      {!todayWritten ? (
        <View style={styles.writeBox}>
          <TextInput
            style={styles.input}
            placeholder="오늘 하루 어떠셨나요? (100자 이내)"
            placeholderTextColor={COLORS.textTertiary}
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
            activeOpacity={0.8}
          >
            <Text style={styles.writeBtnText}>등록</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.todayDone}>
          <Text style={styles.todayDoneText}>✅ 오늘 일기 작성 완료 · 내일 또 만나요</Text>
        </View>
      )}

      {/* 피드 */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DiaryCard
            entry={item}
            onCheerPress={setModalTarget}
          />
        )}
        contentContainerStyle={[styles.feed, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* 명언 응원 모달 */}
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

// ── 스타일 ────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  // 작성 박스
  writeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    paddingVertical: 12,
  },
  writeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  writeBtnDisabled: {
    backgroundColor: 'rgba(232,168,56,0.30)',
  },
  writeBtnText: {
    fontSize: FONTS.sizes.sm,
    color: '#fff',
    fontWeight: '700',
  },
  todayDone: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(52,211,153,0.1)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.3)',
  },
  todayDoneText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.caregiver,
    textAlign: 'center',
  },

  // 피드
  feed: {
    paddingHorizontal: SPACING.md,
    paddingTop: 4,
  },

  // 카드
  card: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  roleBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  roleBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  nickname: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  time: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
  },
  diaryText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },

  // 받은 응원
  cheersPreview: {
    marginBottom: 8,
  },
  cheersPreviewText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cheersToggle: {
    fontWeight: '400',
    color: COLORS.textTertiary,
  },
  cheersList: {
    gap: 8,
    marginBottom: 10,
  },
  cheerItem: {
    backgroundColor: 'rgba(232,168,56,0.10)',
    borderRadius: RADIUS.md,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  cheerQuote: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cheerMeta: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
    marginTop: 4,
    textAlign: 'right',
  },

  // 응원 버튼
  cheerBtn: {
    marginTop: 4,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(232,168,56,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(232,168,56,0.30)',
    alignItems: 'center',
  },
  cheerBtnText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
