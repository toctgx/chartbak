import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, KeyboardAvoidingView,
  Platform, Alert
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { PostType, POST_TYPE_LABELS, POST_TYPE_EMOJIS } from '../types';
import { DISEASES } from '../constants/diseases';

interface Props {
  navigation: any;
  userDiseaseIds: string[];
  userRole: string;
  nickname: string;
  onSubmit: (post: any) => void;
}

const POST_TYPES: PostType[] = [
  'treatment_experience',
  'unsaid_to_doctor',
  'question',
  'hospital_review',
];

export default function WritePostScreen({ navigation, userDiseaseIds, userRole, nickname, onSubmit }: Props) {
  const [postType, setPostType] = useState<PostType | null>(null);
  const [diseaseId, setDiseaseId] = useState<string>(userDiseaseIds[0] || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const selectedDisease = DISEASES.find(d => d.id === diseaseId);
  const userDiseases = DISEASES.filter(d => userDiseaseIds.includes(d.id));
  const isReady = postType && diseaseId && title.trim() && content.trim().length >= 10;

  const handleSubmit = () => {
    if (!isReady) return;
    Alert.alert(
      '글 올리기',
      '이 글을 라운지에 올릴까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '올리기',
          onPress: () => {
            onSubmit({
              post_type: postType,
              disease_id: diseaseId,
              title: title.trim(),
              content: content.trim(),
              author_nickname: nickname,
              author_role: userRole,
            });
            navigation.goBack();
          }
        }
      ]
    );
  };

  const PLACEHOLDER_BY_TYPE: Record<PostType, string> = {
    treatment_experience: '나의 치료 과정을 공유해주세요. 어떤 치료를 받고 계신지, 어떤 경험이 있으신지 솔직하게 써주세요.',
    unsaid_to_doctor: '진료실에서 시간이 없거나 부끄러워서 못 했던 말, 여기서는 편하게 털어놓으세요.',
    question: '같은 경험을 한 분들에게 묻고 싶은 것이 있으신가요? 구체적으로 써주실수록 도움이 돼요.',
    hospital_review: '진료를 받은 병원이나 의사에 대한 솔직한 후기를 남겨주세요.',
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>글쓰기</Text>
        <TouchableOpacity
          style={[styles.submitBtn, !isReady && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isReady}
        >
          <Text style={[styles.submitText, !isReady && styles.submitTextDisabled]}>올리기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 글 유형 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>글 유형 선택</Text>
          <View style={styles.typeGrid}>
            {POST_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.typeCard, postType === type && styles.typeCardActive]}
                onPress={() => setPostType(type)}
              >
                <Text style={styles.typeEmoji}>{POST_TYPE_EMOJIS[type]}</Text>
                <Text style={[styles.typeText, postType === type && styles.typeTextActive]}>
                  {POST_TYPE_LABELS[type]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 질환 선택 */}
        <View style={styles.section}>
          <Text style={styles.label}>어느 라운지에 올릴까요?</Text>
          {userDiseases.map(disease => (
            <TouchableOpacity
              key={disease.id}
              style={[styles.diseaseRow, diseaseId === disease.id && styles.diseaseRowActive]}
              onPress={() => setDiseaseId(disease.id)}
            >
              <Text style={styles.diseaseEmoji}>{disease.emoji}</Text>
              <Text style={[styles.diseaseName, diseaseId === disease.id && { color: COLORS.primary, fontWeight: '700' }]}>
                {disease.name}
              </Text>
              {diseaseId === disease.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* 제목 */}
        <View style={styles.section}>
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력해주세요"
            placeholderTextColor={COLORS.textTertiary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* 내용 */}
        <View style={styles.section}>
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={styles.contentInput}
            placeholder={postType ? PLACEHOLDER_BY_TYPE[postType] : '먼저 글 유형을 선택해주세요'}
            placeholderTextColor={COLORS.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{content.length}자 (최소 10자)</Text>
        </View>

        {/* 익명 안내 */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            🔒 글은 닉네임({nickname})으로 익명 게시됩니다.{'\n'}
            개인정보(이름, 연락처, 병원명 등)는 포함하지 마세요.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  cancel: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  headerTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.textPrimary },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  submitBtnDisabled: { backgroundColor: COLORS.border },
  submitText: { color: '#fff', fontWeight: '700', fontSize: FONTS.sizes.sm },
  submitTextDisabled: { color: COLORS.textTertiary },
  scroll: { flex: 1 },
  section: { padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  typeCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.md,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeCardActive: { borderColor: COLORS.primary, backgroundColor: '#EBF5FF' },
  typeEmoji: { fontSize: 28, marginBottom: 6 },
  typeText: { fontSize: FONTS.sizes.sm, fontWeight: '500', color: COLORS.textPrimary, textAlign: 'center' },
  typeTextActive: { color: COLORS.primary, fontWeight: '700' },
  diseaseRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  diseaseRowActive: { borderColor: COLORS.primary, backgroundColor: '#EBF5FF' },
  diseaseEmoji: { fontSize: 24, marginRight: SPACING.sm },
  diseaseName: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  checkmark: { color: COLORS.primary, fontWeight: '700' },
  titleInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md, color: COLORS.textPrimary,
  },
  contentInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md, color: COLORS.textPrimary,
    minHeight: 200,
  },
  charCount: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, textAlign: 'right', marginTop: 4 },
  notice: {
    margin: SPACING.lg, padding: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary, borderRadius: RADIUS.md,
  },
  noticeText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
});
