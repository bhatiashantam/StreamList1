import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { TMDBMovie } from '../../api/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { tmdbPosterUrl } from '../../utils/image';

export interface ContentCardProps {
  movie: TMDBMovie;
  genreNameById: Map<number, string>;
  onPress: (movie: TMDBMovie) => void;
  /**
   * When false, only the title appears under the poster (detail “More Like This” design).
   * Default true for home rows (year • genre).
   */
  showSubtitle?: boolean;
}

function formatYear(date: string): string {
  if (!date || date.length < 4) {
    return '—';
  }
  return date.slice(0, 4);
}

function primaryGenreLabel(
  movie: TMDBMovie,
  genreNameById: Map<number, string>,
): string {
  const firstId = movie.genre_ids[0];
  if (firstId === undefined) {
    return '—';
  }
  return genreNameById.get(firstId) ?? '—';
}

export function ContentCard({
  movie,
  genreNameById,
  onPress,
  showSubtitle = true,
}: ContentCardProps): React.JSX.Element {
  const uri = tmdbPosterUrl(movie.poster_path, 'w342');

  return (
    <Pressable
      accessibilityRole="button"
      style={styles.wrap}
      onPress={(): void => {
        onPress(movie);
      }}
    >
      <View style={styles.posterShell}>
        {uri ? (
          <Image source={{ uri }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.posterPlaceholder} />
        )}
      </View>
      <Text
        style={[styles.title, !showSubtitle && styles.titleDetailSimilar]}
        numberOfLines={2}
      >
        {movie.title}
      </Text>
      {showSubtitle ? (
        <Text style={styles.meta} numberOfLines={1}>
          {`${formatYear(movie.release_date)} • ${primaryGenreLabel(movie, genreNameById)}`}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 132,
    marginRight: spacing.md,
  },
  posterShell: {
    borderRadius: spacing.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: colors.surface_container_high,
  },
  posterPlaceholder: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: colors.surface_container_high,
  },
  title: {
    ...typography.titleLg,
    color: colors.on_surface,
  },
  titleDetailSimilar: {
    color: colors.on_hero,
  },
  meta: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.xs,
  },
});
