import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Alert
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { DISEASES } from '../../constants/diseases';

interface Props {
  onNext: (diseaseIds: string[]) => void;
}

export default function DiseaseSelectScreen({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    search.trim()
      ? DISEASES.filter(d =>
          d.name.includes(search.trim()) ||
          d.category.includes(search.trim()) ||
          (d.description || '').includes(search.trim())
        )
      : DISEASES,
    [search]
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

  const selectedDiseases = DISEASES.filter(d => selected.includes(d.id));

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.step}>3 / 5</Text>
            <Text style={styles.title}>질환 선택</Text>
            <Text style={styles.desc}>최대 5개 · <Text style={styles.count}>{selected.length}/5</Text></Text>
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
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>검색 결과가 없어요</Text>
          </View>
        ) : (
          filtered.map(disease => {
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
    borderWidth: 1, borderColor: 'rgba(232,168,56,0.3)',
  },
  selectedTagText: { fontSize: FONTS.sizes.sm, color: '#92610A', fontWeight: '700' },

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
  itemSelected: { backgroundColor: '#FFFAF2' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemEmoji: { fontSize: 22, marginRight: 12, width: 28, textAlign: 'center' },
  itemName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  itemNameSelected: { color: '#92610A', fontWeight: '800' },
  itemCategory: { fontSize: FONTS.sizes.xs, color: COLORS.textTertiary },

  check: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '800' },

  empty: { paddingTop: 40, alignItems: 'center' },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textTertiary },

  buttonArea: { padding: SPACING.lg },
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '700' },
});
// FORCE_REBUILD_1777461126
