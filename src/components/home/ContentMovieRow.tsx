import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
import type { TMDBMovie } from '../../api/types';
import { ContentCard } from '../common/ContentCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface ContentMovieRowProps {
  title: string;
  movies: TMDBMovie[];
  genreNameById: Map<number, string>;
  initialLoading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  emptyMessage: string;
  error: string | null;
  onPressSeeAll: () => void;
  onPressMovie: (movie: TMDBMovie) => void;
}

function RowSkeleton(): React.JSX.Element {
  return (
    <View style={styles.skeletonRow}>
      {[0, 1, 2].map((k) => (
        <View key={k} style={styles.skeletonCard}>
          <View style={styles.skeletonPoster} />
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        </View>
      ))}
    </View>
  );
}

export function ContentMovieRow({
  title,
  movies,
  genreNameById,
  initialLoading,
  loadingMore,
  hasMore,
  onLoadMore,
  emptyMessage,
  error,
  onPressSeeAll,
  onPressMovie,
}: ContentMovieRowProps): React.JSX.Element {
  const pendingRef = useRef<boolean>(false);

  const maybeLoadMore = useCallback((): void => {
    if (!hasMore || loadingMore || pendingRef.current) {
      return;
    }
    pendingRef.current = true;
    void Promise.resolve(onLoadMore()).finally(() => {
      pendingRef.current = false;
    });
  }, [hasMore, loadingMore, onLoadMore]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }): void => {
      if (movies.length === 0 || !hasMore || loadingMore) {
        return;
      }
      const indices = viewableItems
        .map((v) => v.index)
        .filter((i): i is number => typeof i === 'number');
      if (indices.length === 0) {
        return;
      }
      const maxIdx = Math.max(...indices);
      const threshold = Math.max(0, movies.length - 4);
      if (maxIdx >= threshold) {
        maybeLoadMore();
      }
    },
    [hasMore, loadingMore, maybeLoadMore, movies.length],
  );

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 30,
    minimumViewTime: 80,
  }).current;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onPressSeeAll}
          hitSlop={spacing.sm}
        >
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.rowError}>{error}</Text> : null}
      {initialLoading ? (
        <RowSkeleton />
      ) : movies.length === 0 ? (
        <Text style={styles.empty}>{emptyMessage}</Text>
      ) : (
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item): string => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          viewabilityConfig={viewabilityConfigRef}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item }): React.JSX.Element => (
            <ContentCard
              movie={item}
              genreNameById={genreNameById}
              onPress={onPressMovie}
            />
          )}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.rowSpinner}>
                <ActivityIndicator color={colors.on_surface_variant} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.on_surface,
  },
  seeAll: {
    ...typography.titleSm,
    color: colors.primary_container,
  },
  listContent: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
  empty: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    paddingHorizontal: spacing.lg,
  },
  rowError: {
    ...typography.labelSm,
    color: colors.primary_container,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingLeft: spacing.lg,
  },
  skeletonCard: {
    width: 132,
    marginRight: spacing.md,
  },
  skeletonPoster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.sm,
  },
  skeletonLine: {
    height: spacing.sm,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.xs,
  },
  skeletonLineShort: {
    width: '60%',
  },
  rowSpinner: {
    justifyContent: 'center',
    paddingLeft: spacing.md,
    minHeight: 180,
  },
});
