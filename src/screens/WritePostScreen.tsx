import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Alert, Image, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { PostType, POST_TYPE_LABELS } from '../types';
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
  const [images, setImages] = useState<string[]>([]);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showDiseaseMenu, setShowDiseaseMenu] = useState(false);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = (e: any) => {
        const files = Array.from(e.target.files || []) as File[];
        files.forEach(file => {
          const url = URL.createObjectURL(file);
          setImages(prev => prev.length < 3 ? [...prev, url] : prev);
        });
      };
      input.click();
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setImages(prev => [...prev, ...uris].slice(0, 3));
    }
  };

  const userDiseases = DISEASES.filter(d => userDiseaseIds.includes(d.id));
  const isReady = postType && diseaseId && title.trim() && content.trim().length >= 10;
  const selectedDisease = DISEASES.find(d => d.id === diseaseId);

  const handleSubmit = () => {
    if (!isReady) return;
    Alert.alert('글 올리기', '이 글을 라운지에 올릴까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '올리기',
        onPress: () => {
          onSubmit({ post_type: postType, disease_id: diseaseId, title: title.trim(), content: content.trim(), author_nickname: nickname, author_role: userRole });
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 — 흰 배경 (작성 집중) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>취소</Text>
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

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="제목"
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          returnKeyType="next"
        />

        <View style={styles.divider} />

        <TextInput
          style={styles.contentInput}
          placeholder={postType
            ? ({
                treatment_experience: '나의 치료 과정을 공유해주세요.',
                unsaid_to_doctor: '진료실에서 못 했던 말을 편하게 털어놓으세요.',
                question: '같은 경험을 한 분들에게 묻고 싶은 것이 있으신가요?',
                hospital_review: '진료를 받은 병원이나 의사에 대한 솔직한 후기를 남겨주세요.',
              } as Record<PostType, string>)[postType]
            : '내용을 입력해주세요 (최소 10자)'}
          placeholderTextColor={COLORS.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {images.length > 0 && (
          <View style={styles.imageRow}>
            {images.map((uri, idx) => (
              <View key={idx} style={styles.imageThumbnail}>
                <Image source={{ uri }} style={styles.thumbnailImg} />
                <TouchableOpacity
                  style={styles.removeImg}
                  onPress={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                >
                  <Text style={styles.removeImgText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 하단 툴바 */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          {images.length < 3 && (
            <TouchableOpacity style={styles.toolBtn} onPress={pickImage}>
              <Text style={styles.toolBtnText}>사진</Text>
            </TouchableOpacity>
          )}

          {/* 글 유형 */}
          <View>
            <TouchableOpacity
              style={[styles.toolChip, postType && styles.toolChipActive]}
              onPress={() => { setShowTypeMenu(v => !v); setShowDiseaseMenu(false); }}
            >
              <Text style={[styles.toolChipText, postType && styles.toolChipTextActive]}>
                {postType ? POST_TYPE_LABELS[postType] : '유형'}
              </Text>
              <Text style={[styles.toolChipArrow, postType && styles.toolChipTextActive]}>▾</Text>
            </TouchableOpacity>
            {showTypeMenu && (
              <View style={styles.popupMenu}>
                {POST_TYPES.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.popupItem, postType === type && styles.popupItemActive]}
                    onPress={() => { setPostType(type); setShowTypeMenu(false); }}
                  >
                    <Text style={[styles.popupItemText, postType === type && styles.popupItemTextActive]}>
                      {POST_TYPE_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 질환 */}
          {userDiseases.length > 1 && (
            <View>
              <TouchableOpacity
                style={[styles.toolChip, styles.toolChipActive]}
                onPress={() => { setShowDiseaseMenu(v => !v); setShowTypeMenu(false); }}
              >
                <Text style={styles.toolChipTextActive}>
                  {selectedDisease ? selectedDisease.name : '질환'}
                </Text>
                <Text style={[styles.toolChipArrow, styles.toolChipTextActive]}>▾</Text>
              </TouchableOpacity>
              {showDiseaseMenu && (
                <View style={styles.popupMenu}>
                  {userDiseases.map(d => (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.popupItem, diseaseId === d.id && styles.popupItemActive]}
                      onPress={() => { setDiseaseId(d.id); setShowDiseaseMenu(false); }}
                    >
                      <Text style={[styles.popupItemText, diseaseId === d.id && styles.popupItemTextActive]}>
                        {d.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
  },
  cancelBtn: { paddingVertical: 4, paddingRight: 8 },
  cancelText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.lavender,
  },
  submitText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textOnAccent,
  },
  submitTextDisabled: {
    color: COLORS.textSecondary,
  },

  scroll: { flex: 1 },
  titleInput: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    lineHeight: 30,
  } as any,
  divider: {
    marginHorizontal: SPACING.lg,
    height: 1,
    backgroundColor: COLORS.borderCard,
    marginBottom: SPACING.sm,
  },
  contentInput: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    lineHeight: 26,
    minHeight: 300,
  } as any,

  imageRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: 8,
  },
  imageThumbnail: { position: 'relative' },
  thumbnailImg: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
  },
  removeImg: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImgText: { color: COLORS.textOnDark, fontSize: 10, fontFamily: FONTS.bold },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
    backgroundColor: COLORS.surface,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  toolBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
  },
  toolBtnText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.textSecondary,
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    backgroundColor: COLORS.background,
    gap: 3,
  },
  toolChipActive: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accent,
  },
  toolChipText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  toolChipTextActive: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.textPrimary,
  },
  toolChipArrow: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  popupMenu: {
    position: 'absolute',
    bottom: 42,
    left: 0,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    minWidth: 160,
    zIndex: 100,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  popupItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderCard,
  },
  popupItemActive: { backgroundColor: COLORS.accentLight },
  popupItemText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
  popupItemTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
