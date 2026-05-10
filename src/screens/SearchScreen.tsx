import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  FlatList, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { MOCK_POSTS } from '../lib/mockData';
import { Post, ReactionType } from '../types';
import PostCard from '../components/PostCard';

const RECENT_KEYWORDS = ['항암 부작용', '탈모', '수술 후기', '당뇨 식단', '파킨슨'];

interface Props {
  navigation: any;
}

export default function SearchScreen({ navigation }: Props) {
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
        reactions: {
          ...p.reactions,
          [reaction]: wasReacted ? p.reactions[reaction] - 1 : p.reactions[reaction] + 1,
        },
      };
    }));
  };

  const handleClear = () => {
    setQuery('');
    setSubmitted('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>검색</Text>
      </View>

      {/* 검색창 */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="질환명, 증상, 키워드로 검색"
          placeholderTextColor={COLORS.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 검색 전: 추천 키워드 */}
      {!submitted ? (
        <View style={styles.recentWrap}>
          <Text style={styles.recentTitle}>🔥 많이 찾는 키워드</Text>
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
        /* 검색 결과 */
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
              <Text style={styles.emptyEmoji}>🔎</Text>
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

  header: {
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surfaceSecondary ?? COLORS.background,
    borderRadius: RADIUS.md,
  },
  clearBtn: { padding: 4 },
  clearText: { fontSize: 14, color: COLORS.textTertiary },

  recentWrap: {
    padding: SPACING.lg,
  },
  recentTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  resultCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textTertiary,
    marginBottom: SPACING.md,
    paddingHorizontal: 2,
  },
  list: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  empty: { paddingTop: 60, alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  emptyHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textTertiary,
  },
});
