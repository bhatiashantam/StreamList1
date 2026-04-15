import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import type { TMDBMovie } from '../api/types';
import { useSeeAllMovies } from '../hooks/useSeeAllMovies';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { tmdbPosterUrl } from '../utils/image';

export function SeeAllScreen({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackParamList, 'SeeAll'>): React.JSX.Element {
  const { listKind, genreId } = route.params;
  const {
    movies,
    initialLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  } = useSeeAllMovies({ kind: listKind, genreId });

  const onEndReached = useCallback((): void => {
    if (!hasMore || loadingMore) {
      return;
    }
    void loadMore();
  }, [hasMore, loadMore, loadingMore]);

  const renderItem = useCallback(
    ({ item }: { item: TMDBMovie }): React.JSX.Element => {
      const uri = tmdbPosterUrl(item.poster_path, 'w185');
      return (
        <Pressable
          accessibilityRole="button"
          style={styles.row}
          onPress={(): void => {
            navigation.navigate('Detail', { id: item.id, mediaType: 'movie' });
          }}
        >
          <View style={styles.thumbShell}>
            {uri ? (
              <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
            ) : (
              <View style={styles.thumbPlaceholder} />
            )}
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.rowMeta} numberOfLines={1}>
              {item.release_date?.slice(0, 4) ?? '—'}
            </Text>
          </View>
        </Pressable>
      );
    },
    [navigation],
  );

  if (initialLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary_container} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item): string => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.35}
      ListEmptyComponent={
        <Text style={styles.empty}>No movies to show.</Text>
      }
      ListFooterComponent={
        loadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.on_surface_variant} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  thumbShell: {
    borderRadius: spacing.sm,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  thumb: {
    width: 56,
    height: 84,
    backgroundColor: colors.surface_container_high,
  },
  thumbPlaceholder: {
    width: 56,
    height: 84,
    backgroundColor: colors.surface_container_high,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    ...typography.titleLg,
    color: colors.on_surface,
  },
  rowMeta: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  error: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
  },
  empty: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
});
