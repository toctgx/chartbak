// v2-glass
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FONTS, SPACING } from '../constants/theme';

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
        <Text style={styles.title}>차트밖</Text>
        <Text style={styles.subtitle}>Chart Outside</Text>
        <Text style={styles.tagline}>의사한테 못 한 말, 여기서 써요</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.87)',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(0,0,0,0.50)',
    marginTop: SPACING.xs,
  },
  tagline: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(0,0,0,0.35)',
    marginTop: SPACING.lg,
  },
});
