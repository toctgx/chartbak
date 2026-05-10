import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Alert
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { DISEASES } from '../../constants/diseases';

interface Props {
  onNext: (diseaseIds: string[]) => void;
  onBack?: () => void;
}

// 암 카테고리 분리
const CANCER_DISEASES = DISEASES.filter(d => d.category === '암');
const NON_CANCER_DISEASES = DISEASES.filter(d => d.category !== '암');
const CANCER_IDS = new Set(CANCER_DISEASES.map(d => d.id));

export default function DiseaseSelectScreen({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [cancerExpanded, setCancerExpanded] = useState(false);

  const isSearching = search.trim().length > 0;

  const filteredNonCancer = useMemo(() =>
    NON_CANCER_DISEASES.filter(d =>
      !isSearching ||
      d.name.includes(search.trim()) ||
      d.category.includes(search.trim()) ||
      (d.description || '').includes(search.trim())
    ), [search, isSearching]
  );

  const filteredCancer = useMemo(() =>
    CANCER_DISEASES.filter(d =>
      !isSearching ||
      d.name.includes(search.trim()) ||
      (d.description || '').includes(search.trim())
    ), [search, isSearching]
  );

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(s => s !== id));
    } else {
      if (selected.length >= 5) {
        Alert.alert('알림', '최대 5개까지 선택할 수 있어요');
        return;
      }
      setSelected(prev => [...prev, id]);
    }
  };

  const selectedCancerCount = selected.filter(id => CANCER_IDS.has(id)).length;
  const selectedDiseases = DISEASES.filter(d => selected.includes(d.id));

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.step}>3 / 5</Text>
              <Text style={styles.title}>질환 선택</Text>
              <Text style={styles.desc}>최대 5개 · <Text style={styles.count}>{selected.length}/5</Text></Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.doneBtn, selected.length === 0 && styles.doneBtnDisabled]}
            onPress={() => selected.length > 0 && onNext(selected)}
            disabled={selected.length === 0}
          >
            <Text style={[styles.doneBtnText, selected.length === 0 && styles.doneBtnTextDisabled]}>
              {selected.length > 0 ? `완료 (${selected.length})` : '선택 후 완료'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>
      </View>

      {/* 선택된 질환 태그 */}
      {selectedDiseases.length > 0 && (
        <View style={styles.selectedRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedContent}>
            {selectedDiseases.map(d => (
              <TouchableOpacity key={d.id} style={styles.selectedTag} onPress={() => toggle(d.id)}>
                <Text style={styles.selectedTagText}>{d.name} ✕</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 검색 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="질환 검색 (예: 당뇨, 루푸스, 아토피...)"
          placeholderTextColor={COLORS.textTertiary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 질환 목록 */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 암 그룹 (검색 중이 아닐 때 or 검색 결과 있을 때) */}
        {filteredCancer.length > 0 && (
          <>
            {/* 암 그룹 헤더 */}
            <TouchableOpacity
              style={[styles.item, styles.groupItem, selectedCancerCount > 0 && styles.itemSelected]}
              onPress={() => setCancerExpanded(prev => !prev)}
              activeOpacity={0.8}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.itemEmoji}>🎗️</Text>
                <View>
                  <Text style={[styles.itemName, selectedCancerCount > 0 && styles.itemNameSelected]}>
                    암{selectedCancerCount > 0 ? ` (${selectedCancerCount}종 선택)` : ''}
                  </Text>
                  <Text style={styles.itemCategory}>암 전체 · {CANCER_DISEASES.length}종류</Text>
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {(cancerExpanded || isSearching) ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {/* 암 서브 목록 */}
            {(cancerExpanded || isSearching) && filteredCancer.map(disease => {
              const isSelected = selected.includes(disease.id);
              return (
                <TouchableOpacity
                  key={disease.id}
                  style={[styles.item, styles.subItem, isSelected && styles.itemSelected]}
                  onPress={() => toggle(disease.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemLeft}>
                    <Text style={styles.subItemEmoji}>{disease.emoji}</Text>
                    <View>
                      <Text style={[styles.itemName, styles.subItemName, isSelected && styles.itemNameSelected]}>
                        {disease.name}
                      </Text>
                      {disease.description ? (
                        <Text style={styles.itemCategory}>{disease.description}</Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={[styles.check, isSelected && styles.checkSelected]}>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* 일반 질환 목록 */}
        {filteredNonCancer.length === 0 && filteredCancer.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>검색 결과가 없어요</Text>
          </View>
        ) : (
          filteredNonCancer.map(disease => {
            const isSelected = selected.includes(disease.id);
            return (
              <TouchableOpacity
                key={disease.id}
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => toggle(disease.id)}
                activeOpacity={0.8}
              >
                <View style={styles.itemLeft}>
                  <Text style={styles.itemEmoji}>{disease.emoji}</Text>
                  <View>
                    <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>
                      {disease.name}
                    </Text>
                    <Text style={styles.itemCategory}>{disease.category}</Text>
                  </View>
                </View>
                <View style={[styles.check, isSelected && styles.checkSelected]}>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: { paddingHorizontal: SPACING.lg, paddingTop: 60, paddingBottom: SPACING.sm, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingRight: 4 },
  backIcon: { fontSize: 22, color: COLORS.textPrimary, fontWeight: '300' },
  step: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary, marginBottom: 2 },
  progressBar: { height: 3, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  desc: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  count: { color: COLORS.primary, fontWeight: '700' },
  doneBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
  },
  doneBtnDisabled: { backgroundColor: COLORS.border },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: FONTS.sizes.sm },
  doneBtnTextDisabled: { color: COLORS.textTertiary },

  selectedRow: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  selectedContent: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, flexDirection: 'row' },
  selectedTag: {
    backgroundColor: COLORS.primaryPale, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 6,
    borderWidth: 1, borderColor: COLORS.primaryLight,
  },
  selectedTagText: { fontSize: FONTS.sizes.sm, color: COLORS.primaryDark, fontWeight: '700' },

  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  searchInput: {
    flex: 1, fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  clearBtn: { padding: SPACING.sm },
  clearText: { fontSize: 14, color: COLORS.textTertiary },

  list: { flex: 1 },
  listContent: { paddingBottom: SPACING.xxl },

  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  groupItem: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  subItem: {
    paddingLeft: SPACING.lg + 16,
    backgroundColor: COLORS.surface,
  },
  subItemEmoji: { fontSize: 18, marginRight: 10, width: 24, textAlign: 'center' },
  subItemName: { fontSize: FONTS.sizes.sm },
  itemSelected: { backgroundColor: COLORS.primaryPale },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemEmoji: { fontSize: 22, marginRight: 12, width: 28, textAlign: 'center' },
  itemName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  itemNameSelected: { color: COLORS.primaryDark, fontWeight: '800' },
  itemCategory: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary },
  expandIcon: { fontSize: 12, color: COLORS.textTertiary, marginLeft: 8 },

  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '800' },

  empty: { paddingTop: 40, alignItems: 'center' },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textTertiary },
});
