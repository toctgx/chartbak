import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { DISEASES, DISEASE_CATEGORIES, DiseaseCategory } from '../../constants/diseases';

interface Props {
  onNext: (diseaseIds: string[]) => void;
}

export default function DiseaseSelectScreen({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<DiseaseCategory | '전체'>('전체');

  const filtered = activeCategory === '전체'
    ? DISEASES
    : DISEASES.filter(d => d.category === activeCategory);

  const toggleDisease = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      if (selected.length >= 3) {
        Alert.alert('알림', '최대 3개까지 선택할 수 있어요');
        return;
      }
      setSelected([...selected, id]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>3 / 5</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>
      </View>

      <View style={styles.titleArea}>
        <Text style={styles.emoji}>🏷️</Text>
        <Text style={styles.title}>관련 질환을 선택해주세요</Text>
        <Text style={styles.desc}>
          최대 3개까지 선택 가능해요{' '}
          <Text style={styles.count}>({selected.length}/3)</Text>
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {(['전체', ...DISEASE_CATEGORIES] as const).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            onPress={() => setActiveCategory(cat as any)}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.grid}>
          {filtered.map(disease => {
            const isSelected = selected.includes(disease.id);
            return (
              <TouchableOpacity
                key={disease.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => toggleDisease(disease.id)}
              >
                <Text style={styles.chipEmoji}>{disease.emoji}</Text>
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {disease.name}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={() => selected.length > 0 && onNext(selected)}
          disabled={selected.length === 0}
        >
          <Text style={styles.buttonText}>
            {selected.length > 0 ? `${selected.length}개 선택 완료` : '질환을 선택해주세요'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.lg, paddingTop: 60 },
  step: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  progressBar: { height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  titleArea: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  emoji: { fontSize: 36, marginBottom: SPACING.xs },
  title: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  desc: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  count: { color: COLORS.primary, fontWeight: '600' },
  categories: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    maxHeight: 56, flexGrow: 0
  },
  catChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COLORS.border,
    marginRight: SPACING.sm, height: 38, justifyContent: 'center'
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '500' },
  catTextActive: { color: '#fff' },
  list: { flex: 1, paddingHorizontal: SPACING.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, paddingTop: SPACING.xs },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    gap: 6,
  },
  chipSelected: { backgroundColor: '#EBF5FF', borderColor: COLORS.primary },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, fontWeight: '500' },
  chipTextSelected: { color: COLORS.primary, fontWeight: '600' },
  checkmark: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.lg, backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  button: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, alignItems: 'center'
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '600' },
});
