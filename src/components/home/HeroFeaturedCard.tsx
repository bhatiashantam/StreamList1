import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { TMDBMovie } from '../../api/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { tmdbBackdropUrl } from '../../utils/image';

export interface HeroFeaturedCardProps {
  movie: TMDBMovie | null;
  initialLoading: boolean;
  onPressWatch: (movie: TMDBMovie) => void;
  onPressDetails: (movie: TMDBMovie) => void;
}

function HeroSkeleton({ width }: { width: number }): React.JSX.Element {
  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonBlock}>
        <View style={styles.skeletonBadge} />
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        <View style={styles.skeletonActions}>
          <View style={styles.skeletonButton} />
          <View style={styles.skeletonButton} />
        </View>
      </View>
    </View>
  );
}

export function HeroFeaturedCard({
  movie,
  initialLoading,
  onPressWatch,
  onPressDetails,
}: HeroFeaturedCardProps): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = Math.round(screenWidth * 0.9);

  if (initialLoading || movie === null) {
    return <HeroSkeleton width={cardWidth} />;
  }

  const backdrop = tmdbBackdropUrl(movie.backdrop_path, 'w780');

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.image}>
        {backdrop ? (
          <Image
            source={{ uri: backdrop }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.backdropFallback} />
        )}
        <LinearGradient
          colors={['transparent', colors.surface]}
          locations={[0.55, 1]}
          style={styles.imageGradient}
        />
        <View style={styles.inner}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW RELEASE</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title.toUpperCase()}
          </Text>
          <Text style={styles.synopsis} numberOfLines={2}>
            {movie.overview}
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={styles.watchPressable}
              onPress={(): void => {
                onPressWatch(movie);
              }}
            >
              <LinearGradient
                colors={[colors.primary, colors.primary_container]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.watchGradient}
              >
                <Ionicons
                  name="play"
                  size={spacing.lg}
                  color={colors.surface}
                />
                <Text style={styles.watchLabel}>Watch Now</Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.detailsButton}
              onPress={(): void => {
                onPressDetails(movie);
              }}
            >
              <Text style={styles.detailsLabel}>Details</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: spacing.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  image: {
    width: '100%',
    minHeight: 420,
    justifyContent: 'flex-end',
    borderRadius: spacing.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface_container_low,
  },
  backdropImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface_container_high,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  inner: {
    padding: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary_container,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.lg,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography.labelSm,
    color: colors.on_surface,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.displayMd,
    color: colors.on_surface,
    marginBottom: spacing.sm,
  },
  synopsis: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
  },
  watchPressable: {
    flex: 1,
    marginRight: spacing.md,
  },
  watchGradient: {
    borderRadius: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchLabel: {
    ...typography.titleSm,
    color: colors.surface,
    marginLeft: spacing.sm,
  },
  detailsButton: {
    flex: 1,
    borderRadius: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface_container_highest,
  },
  detailsLabel: {
    ...typography.titleSm,
    color: colors.on_surface,
  },
  skeletonImage: {
    height: 320,
    backgroundColor: colors.surface_container_high,
  },
  skeletonBlock: {
    padding: spacing.lg,
  },
  skeletonBadge: {
    height: spacing.lg,
    width: 120,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.md,
  },
  skeletonTitle: {
    height: spacing.xxl,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.md,
  },
  skeletonLine: {
    height: spacing.sm,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_high,
    marginBottom: spacing.xs,
  },
  skeletonLineShort: {
    width: '70%',
    marginBottom: spacing.lg,
  },
  skeletonActions: {
    flexDirection: 'row',
  },
  skeletonButton: {
    flex: 1,
    height: 48,
    borderRadius: spacing.lg,
    backgroundColor: colors.surface_container_high,
    marginRight: spacing.md,
  },
});
