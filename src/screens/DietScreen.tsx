// 차트밖 - AI 식단 분석 화면
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { COLORS, FONTS, SHADOWS, RADIUS, SPACING } from '../constants/theme';
import { DietEntry, MEAL_TYPE_LABELS } from '../types';
import { DietAnalysisResult, DietVerdict, analyzeDiet } from '../lib/dietAI';

// ── 유틸 ─────────────────────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function verdictConfig(verdict: DietVerdict) {
  switch (verdict) {
    case 'good':
      return {
        label: '✓ 적합',
        color: '#4A6741',
        bg: 'rgba(74,103,65,0.08)',
        border: 'rgba(74,103,65,0.20)',
      };
    case 'caution':
      return {
        label: '⚠ 주의',
        color: '#92600A',
        bg: 'rgba(146,96,10,0.08)',
        border: 'rgba(146,96,10,0.20)',
      };
    case 'bad':
      return {
        label: '✗ 부적합',
        color: '#B91C1C',
        bg: 'rgba(185,28,28,0.08)',
        border: 'rgba(185,28,28,0.20)',
      };
  }
}

// ── 분석 결과 카드 ────────────────────────────────────────

function AnalysisCard({ analysis }: { analysis: DietAnalysisResult }) {
  const cfg = verdictConfig(analysis.verdict);
  return (
    <View style={[styles.analysisCard, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      {/* 뱃지 + 점수 */}
      <View style={styles.analysisHeader}>
        <View style={[styles.verdictBadge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
          <Text style={[styles.verdictLabel, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        <Text style={[styles.scoreText, { color: cfg.color }]}>{analysis.score}점</Text>
      </View>

      {/* 요약 */}
      <Text style={styles.summaryText}>{analysis.summary}</Text>

      {/* 판단 근거 */}
      {analysis.reasons.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>판단 근거</Text>
          {analysis.reasons.map((r, i) => (
            <Text key={i} style={styles.bulletItem}>• {r}</Text>
          ))}
        </View>
      )}

      {/* 개선 추천 */}
      {analysis.improvements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>개선 추천</Text>
          {analysis.improvements.map((imp, i) => (
            <Text key={i} style={styles.bulletItem}>• {imp}</Text>
          ))}
        </View>
      )}

      {/* 응원 메시지 */}
      <Text style={styles.encouragement}>{analysis.encouragement}</Text>
    </View>
  );
}

// ── 식단 카드 ─────────────────────────────────────────────

function DietCard({ entry }: { entry: DietEntry }) {
  return (
    <View style={styles.card}>
      {/* 이미지 (있을 때) */}
      {entry.imageUri && (
        <Image source={{ uri: entry.imageUri }} style={styles.foodImage} resizeMode="cover" />
      )}

      {/* 메타 */}
      <View style={styles.cardMeta}>
        <View style={styles.mealTypeBadge}>
          <Text style={styles.mealTypeText}>{MEAL_TYPE_LABELS[entry.meal_type]}</Text>
        </View>
        <Text style={styles.timeText}>{formatRelativeTime(entry.created_at)}</Text>
      </View>

      {/* 설명 */}
      {entry.description ? (
        <Text style={styles.descriptionText}>{entry.description}</Text>
      ) : null}

      {/* 분석 중 */}
      {entry.isAnalyzing && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>AI가 분석 중이에요...</Text>
        </View>
      )}

      {/* 분석 결과 */}
      {!entry.isAnalyzing && entry.analysis && (
        <AnalysisCard analysis={entry.analysis} />
      )}
    </View>
  );
}

// ── 이미지 선택 ───────────────────────────────────────────

async function pickImage(): Promise<{ uri: string; base64: string } | null> {
  if (Platform.OS === 'web') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(',')[1];
          resolve({ uri: dataUrl, base64 });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  } else {
    // 네이티브 (expo-image-picker가 없을 수 있으므로 try/catch)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ImagePicker = require('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진 접근 권한이 필요해요.');
        return null;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });
      if (result.canceled || !result.assets?.[0]) return null;
      const asset = result.assets[0];
      return { uri: asset.uri, base64: asset.base64 ?? '' };
    } catch {
      Alert.alert('오류', '이미지 선택 기능을 사용할 수 없어요.');
      return null;
    }
  }
}

// ── 메인 화면 ─────────────────────────────────────────────

interface DietScreenProps {
  userDiseaseIds: string[];
  userId: string;
}

export default function DietScreen({ userDiseaseIds, userId }: DietScreenProps) {
  const [entries, setEntries] = useState<DietEntry[]>([]);
  const [mealType, setMealType] = useState<DietEntry['meal_type']>('lunch');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ uri: string; base64: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const mealTypes: DietEntry['meal_type'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const handlePickImage = useCallback(async () => {
    const img = await pickImage();
    if (img) setSelectedImage(img);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    const trimmed = description.trim();
    if (!trimmed && !selectedImage) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    inputRef.current?.blur();

    const newEntry: DietEntry = {
      id: `diet-${Date.now()}`,
      author_id: userId,
      imageUri: selectedImage?.uri,
      description: trimmed || (selectedImage ? '(사진으로 입력)' : ''),
      meal_type: mealType,
      created_at: new Date().toISOString(),
      isAnalyzing: true,
    };

    setEntries(prev => [newEntry, ...prev]);
    setDescription('');
    setSelectedImage(null);
    setIsSubmitting(false);

    // AI 분석 호출
    try {
      const result = await analyzeDiet({
        foodDescription: newEntry.description,
        diseaseIds: userDiseaseIds,
        imageBase64: selectedImage?.base64,
      });

      setEntries(prev =>
        prev.map(e =>
          e.id === newEntry.id
            ? { ...e, isAnalyzing: false, analysis: result }
            : e
        )
      );
    } catch {
      setEntries(prev =>
        prev.map(e =>
          e.id === newEntry.id
            ? { ...e, isAnalyzing: false }
            : e
        )
      );
    }
  }, [description, selectedImage, mealType, isSubmitting, userId, userDiseaseIds]);

  const canSubmit = (description.trim().length > 0 || !!selectedImage) && !isSubmitting;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>식단 분석</Text>
        <Text style={styles.headerSub}>AI가 질환 맞춤 식단을 분석해드려요</Text>
      </View>

      {/* 입력 영역 */}
      <View style={styles.inputCard}>
        {/* 식사 유형 선택 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {mealTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, mealType === type && styles.chipActive]}
              onPress={() => setMealType(type)}
            >
              <Text style={[styles.chipText, mealType === type && styles.chipTextActive]}>
                {MEAL_TYPE_LABELS[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 이미지 미리보기 */}
        {selectedImage && (
          <View style={styles.imagePreviewRow}>
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} resizeMode="cover" />
            <TouchableOpacity style={styles.imageRemoveBtn} onPress={handleRemoveImage}>
              <Text style={styles.imageRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 텍스트 입력 + 사진 버튼 */}
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage}>
            <Text style={styles.photoBtnText}>📷</Text>
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="오늘 뭐 드셨나요? (예: 현미밥, 된장찌개, 나물)"
            placeholderTextColor={COLORS.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline={false}
            returnKeyType="done"
            onSubmitEditing={canSubmit ? handleAnalyze : undefined}
          />
        </View>

        {/* 분석 버튼 */}
        <TouchableOpacity
          style={[styles.analyzeBtn, !canSubmit && styles.analyzeBtnDisabled]}
          onPress={handleAnalyze}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.analyzeBtnText}>
            {isSubmitting ? '분석 중...' : '분석하기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 피드 */}
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🥗</Text>
          <Text style={styles.emptyTitle}>첫 식단을 기록해보세요</Text>
          <Text style={styles.emptyDesc}>AI가 질환에 맞는 식단인지{'\n'}분석해드려요</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <DietCard entry={item} />}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </KeyboardAvoidingView>
  );
}

// ── 스타일 ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // 헤더
  header: {
    paddingTop: 56,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    letterSpacing: -0.2,
  },

  // 입력 카드
  inputCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md,
  },

  chipRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.primaryPale,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },
  chipTextActive: {
    color: COLORS.primary,
  },

  imagePreviewRow: {
    marginBottom: SPACING.sm,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageRemoveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  photoBtn: {
    padding: 8,
  },
  photoBtnText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    paddingVertical: 12,
    paddingHorizontal: 4,
    letterSpacing: -0.2,
  },

  analyzeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeBtnDisabled: {
    backgroundColor: COLORS.textTertiary,
  },
  analyzeBtnText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  // 피드
  feedContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },

  // 카드
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  foodImage: {
    width: '100%',
    height: 180,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingBottom: 8,
  },
  mealTypeBadge: {
    backgroundColor: COLORS.primaryPale,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  mealTypeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
  timeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textTertiary,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    letterSpacing: -0.2,
    lineHeight: 20,
  },

  // 로딩
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: 8,
  },
  loadingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    letterSpacing: -0.2,
  },

  // 분석 카드
  analysisCard: {
    margin: SPACING.sm,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verdictBadge: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  verdictLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  scoreText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  summaryText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  bulletItem: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  encouragement: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 6,
    letterSpacing: -0.2,
    lineHeight: 20,
  },

  // 빈 상태
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  emptyDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
});
