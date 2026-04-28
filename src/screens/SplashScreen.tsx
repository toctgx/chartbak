import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 1200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.emoji}>🏥</Text>
        <Text style={styles.title}>병갔왔</Text>
        <Text style={styles.subtitle}>병원 갔다 왔어</Text>
        <Text style={styles.tagline}>의사한테 못 한 말, 여기서 써요</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: COLORS.textInverse,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  tagline: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: SPACING.lg,
  },
});
