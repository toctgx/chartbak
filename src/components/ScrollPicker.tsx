import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

interface ScrollPickerProps<T extends string | number> {
  items: T[];
  selectedValue: T | null;
  onValueChange: (value: T) => void;
  renderLabel?: (item: T) => string;
}

export default function ScrollPicker<T extends string | number>({
  items,
  selectedValue,
  onValueChange,
  renderLabel,
}: ScrollPickerProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const getLabel = (item: T) => (renderLabel ? renderLabel(item) : String(item));

  const initialIndex = selectedValue !== null ? items.indexOf(selectedValue) : 0;
  const initialOffset = Math.max(0, initialIndex) * ITEM_HEIGHT;

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      onValueChange(items[clamped]);
    },
    [items, onValueChange],
  );

  return (
    <View style={styles.container}>
      {/* 선택 하이라이트 */}
      <View style={styles.selectorBar} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: PADDING }}
        contentOffset={{ x: 0, y: initialOffset }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {items.map((item, idx) => {
          const isSelected = item === selectedValue;
          return (
            <View key={idx} style={styles.itemWrap}>
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {getLabel(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* 위 페이드 */}
      <LinearGradient
        colors={[COLORS.surface, COLORS.surface + 'E0', 'transparent']}
        style={[styles.fade, styles.fadeTop]}
        pointerEvents="none"
      />
      {/* 아래 페이드 */}
      <LinearGradient
        colors={['transparent', COLORS.surface + 'E0', COLORS.surface]}
        style={[styles.fade, styles.fadeBottom]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  selectorBar: {
    position: 'absolute',
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.primary + '15',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.primary + '40',
    zIndex: 1,
  },
  itemWrap: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textTertiary,
    fontWeight: '400',
  },
  itemTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: FONTS.sizes.xl,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 2,
  },
  fadeTop: { top: 0 },
  fadeBottom: { bottom: 0 },
});
