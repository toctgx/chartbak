import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  FlatList, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { MOCK_POSTS } from '../lib/mockData';
import { Post, ReactionType } from '../types';
import PostCard from '../components/PostCard';

const RECENT_KEYWORDS = ['항암 부작용', '탈모', '수술 후기', '당뇨 식단', '파킨슨'];

interface Props {
  navigation: any;
}

export default function SearchScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const results = useMemo(() => {
    if (!submitted) return [];
    const q = submitted.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.author_nickname.toLowerCase().includes(q)
    );
  }, [submitted, posts]);

  const handleSearch = (keyword?: string) => {
    const q = keyword ?? query;
    setQuery(q);
    setSubmitted(q);
  };

  const handleReact = (postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const wasReacted = p.user_reaction === reaction;
      return {
        ...p,
        user_reaction: wasReacted ? null : reaction,
        reactions: { ...p.reactions, [reaction]: wasReacted ? p.reactions[reaction] - 1 : p.reactions[reaction] + 1 },
      };
    }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 — 인디고 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>검색</Text>

        {/* 검색바 */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="질환명, 증상, 키워드로 검색"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => { setQuery(''); setSubmitted(''); }}
              style={styles.clearBtn}
            >
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 검색 전: 추천 키워드 */}
      {!submitted ? (
        <View style={styles.recentWrap}>
          <Text style={styles.recentTitle}>많이 찾는 키워드</Text>
          <View style={styles.chipRow}>
            {RECENT_KEYWORDS.map(kw => (
              <TouchableOpacity
                key={kw}
                style={styles.chip}
                onPress={() => handleSearch(kw)}
              >
                <Text style={styles.chipText}>{kw}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              "{submitted}" 검색 결과 {results.length}건
            </Text>
          }
          renderItem={({ item, index }) => {
            const total = item.reactions.helpful + item.reactions.same + item.reactions.cheer;
            return (
              <PostCard
                post={item}
                onPress={() => navigation.navigate('PostDetail', { post: item })}
                onReact={handleReact}
                highlight={index === 0 || total > 50}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                "{submitted}"에 대한{'\n'}검색 결과가 없어요
              </Text>
              <Text style={styles.emptyHint}>다른 키워드로 검색해보세요</Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // 헤더 — 인디고
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontFamily: FONTS.extrabold,
    color: COLORS.textOnDark,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: 2,
    ...SHADOWS.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    paddingVertical: 10,
  },
  clearBtn: { padding: 4 },
  clearText: { fontSize: 14, color: COLORS.textSecondary },

  recentWrap: { padding: SPACING.lg },
  recentTitle: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.lavender,
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
  },

  resultCount: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  list: { paddingVertical: SPACING.sm, paddingBottom: 96 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: {
    fontSize: FONTS.sizes.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  emptyHint: {
    fontSize: FONTS.sizes.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});
