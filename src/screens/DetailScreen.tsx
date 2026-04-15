import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  DetailFloatingHeaderChrome,
  DetailHeaderIconBlur,
  DETAIL_HEADER_ICON_CIRCLE,
} from '../components/detail/DetailHeaderGlassChrome';
import { DetailSectionError } from '../components/detail/DetailSectionError';
import {
  buildMetadataChips,
  DetailMetadataChips,
} from '../components/detail/DetailMetadataChips';
import { ContentCard } from '../components/common/ContentCard';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useMovieGenres } from '../hooks/useMovieGenres';
import type {
  HomeStackParamList,
  SearchStackParamList,
  WatchlistStackParamList,
} from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { tmdbBackdropUrl, tmdbPosterUrl, tmdbProfileUrl } from '../utils/image';
import type { TMDBCastMember, TMDBMovie } from '../api/types';
import { selectIsInWatchlist, useWatchlistStore } from '../store/watchlistStore';

const HERO_HEIGHT = 220;
const CAST_AVATAR = 60;
const GRADIENT_BOTTOM_PCT = 0.4;

/** Synopsis lines when collapsed (ellipsis until expanded). */
const SYNOPSIS_MAX_LINES = 3;

/** Show Read more when synopsis is long enough to likely truncate. */
const SYNOPSIS_READ_MORE_THRESHOLD = 140;

export type DetailScreenProps =
  | NativeStackScreenProps<HomeStackParamList, 'Detail'>
  | NativeStackScreenProps<SearchStackParamList, 'Detail'>
  | NativeStackScreenProps<WatchlistStackParamList, 'Detail'>;

function DetailHeaderBack({
  onPress,
  tintColor,
}: {
  onPress: () => void;
  tintColor?: string;
}): React.JSX.Element {
  const iconColor = tintColor ?? colors.on_hero;
  return (
    <View style={styles.headerIconLeft}>
      <DetailHeaderIconBlur>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={spacing.sm}
          onPress={onPress}
          style={styles.headerCirclePress}
        >
          <Ionicons name="arrow-back" size={22} color={iconColor} />
        </Pressable>
      </DetailHeaderIconBlur>
    </View>
  );
}

function DetailHeaderShare({
  tintColor,
  onPress,
  disabled,
}: {
  tintColor?: string;
  onPress: () => void;
  disabled?: boolean;
}): React.JSX.Element {
  const iconColor = tintColor ?? colors.on_hero;
  return (
    <View
      style={[styles.headerIconRight, disabled ? styles.headerIconDisabled : undefined]}
    >
      <DetailHeaderIconBlur>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share"
          accessibilityState={{ disabled: Boolean(disabled) }}
          disabled={disabled}
          hitSlop={spacing.sm}
          onPress={onPress}
          style={styles.headerCirclePress}
        >
          <Ionicons name="share-social" size={22} color={iconColor} />
        </Pressable>
      </DetailHeaderIconBlur>
    </View>
  );
}

function AddToWatchlistIcon(): React.JSX.Element {
  const c = colors.on_primary_gradient;
  return (
    <View style={styles.addWatchlistIconRow}>
      <Ionicons name="bookmark-outline" size={20} color={c} />
      <Ionicons name="add" size={18} color={c} />
    </View>
  );
}

function InWatchlistIcon(): React.JSX.Element {
  const c = colors.watchlist_ghost_accent;
  return (
    <View style={styles.inWatchlistIconRow}>
      <Ionicons name="bookmark-outline" size={20} color={c} />
      <Ionicons name="checkmark" size={18} color={c} />
    </View>
  );
}

function HeroPlaceholder(): React.JSX.Element {
  return (
    <View style={styles.heroPlaceholder}>
      <Ionicons name="film" size={48} color={colors.primary_container} />
    </View>
  );
}

function DetailsSkeleton(): React.JSX.Element {
  return (
    <View style={styles.detailsSkeleton}>
      <View style={styles.skHero} />
      <View style={styles.skTitle} />
      <View style={styles.skLine} />
      <View style={[styles.skLine, styles.skLineShort]} />
      <View style={styles.skBlock} />
    </View>
  );
}

function CastSkeleton(): React.JSX.Element {
  return (
    <View style={styles.castSkeletonRow}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.castSkItem}>
          <View style={styles.castSkCircle} />
          <View style={styles.castSkText} />
          <View style={[styles.castSkText, styles.castSkTextShort]} />
        </View>
      ))}
    </View>
  );
}

function SimilarSkeleton(): React.JSX.Element {
  return (
    <View style={styles.similarSkeletonRow}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.similarSkCard} />
      ))}
    </View>
  );
}

export function DetailScreen({
  navigation,
  route,
}: DetailScreenProps): React.JSX.Element {
  const { id, mediaType } = route.params;
  const colorScheme = useColorScheme();
  const { genreNameById } = useMovieGenres();
  const [synopsisExpanded, setSynopsisExpanded] = useState<boolean>(false);

  useEffect(() => {
    setSynopsisExpanded(false);
  }, [id, mediaType]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content', true);
      return (): void => {
        StatusBar.setBarStyle(
          colorScheme === 'dark' ? 'light-content' : 'dark-content',
          true,
        );
      };
    }, [colorScheme]),
  );

  const {
    details,
    credits,
    similar,
    retryDetails,
    retryCredits,
    retrySimilar,
  } = useMovieDetail({ id, mediaType });

  const inWatchlist = useWatchlistStore(selectIsInWatchlist(id, mediaType));
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);

  const onToggleWatchlist = useCallback((): void => {
    if (inWatchlist) {
      removeItem({ id, mediaType });
    } else {
      addItem({ id, mediaType });
    }
  }, [addItem, id, inWatchlist, mediaType, removeItem]);

  const onShare = useCallback((): void => {
    if (details.status !== 'success') {
      return;
    }
    const d = details.data;
    const path = mediaType === 'tv' ? 'tv' : 'movie';
    const url = `https://www.themoviedb.org/${path}/${id}`;
    void Share.share({
      title: d.title,
      message: `${d.title}\n${url}`,
    });
  }, [details, id, mediaType]);

  const heroUri = useMemo((): string | undefined => {
    if (details.status !== 'success') {
      return undefined;
    }
    const d = details.data;
    const backdrop = tmdbBackdropUrl(d.backdrop_path, 'w780');
    if (backdrop) {
      return backdrop;
    }
    return tmdbPosterUrl(d.poster_path, 'w500');
  }, [details]);

  const metadataChips = useMemo(() => {
    if (details.status !== 'success') {
      return [];
    }
    const d = details.data;
    return buildMetadataChips({
      releaseYearLabel: d.releaseYearLabel,
      voteAverage: d.vote_average,
      genres: d.genres,
      runtimeMinutes: d.runtimeMinutes,
    });
  }, [details]);

  const castList: TMDBCastMember[] = useMemo(() => {
    if (credits.status !== 'success') {
      return [];
    }
    return credits.data.slice(0, 18);
  }, [credits]);

  const similarList: TMDBMovie[] = useMemo(() => {
    if (similar.status !== 'success') {
      return [];
    }
    return similar.data;
  }, [similar]);

  const openSeeAllSimilar = useCallback((): void => {
    navigation.navigate('SeeAll', {
      listKind: 'similar',
      genreId: null,
      title: 'More Like This',
      sourceMovieId: id,
      sourceMediaType: mediaType,
    });
  }, [id, mediaType, navigation]);

  const onPressSimilarMovie = useCallback(
    (movie: TMDBMovie): void => {
      navigation.push('Detail', {
        id: movie.id,
        mediaType,
      });
    },
    [mediaType, navigation],
  );

  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.screenRoot}>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {details.status === 'loading' && <DetailsSkeleton />}

      {details.status === 'error' && (
        <DetailSectionError message={details.message} onRetry={retryDetails} />
      )}

      {details.status === 'success' && (
        <View>
          <View style={styles.heroWrap}>
            {heroUri ? (
              <Image
                source={{ uri: heroUri }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <HeroPlaceholder />
            )}
            <LinearGradient
              colors={['transparent', colors.surface]}
              locations={[0.45, 1]}
              style={styles.heroGradient}
            />
          </View>

          <View style={styles.bodyPad}>
            <Text style={styles.detailTitle}>
              {details.data.title}
            </Text>
            <DetailMetadataChips chips={metadataChips} />

            <View style={styles.watchlistBlock}>
              {/* Primary row: add (tappable) or saved confirmation (design: block above the secondary section) */}
              {inWatchlist ? (
                <View
                  accessibilityRole="text"
                  accessibilityLabel="Added to watchlist"
                  style={styles.watchlistGradientWrap}
                >
                  <LinearGradient
                    colors={[
                      colors.primary,
                      colors.primary_container,
                      colors.primary_container,
                    ]}
                    locations={[0, 0.55, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.watchlistGradient}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.on_primary_gradient}
                    />
                    <Text style={styles.watchlistDefaultLabel}>
                      Added to watchlist
                    </Text>
                  </LinearGradient>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={onToggleWatchlist}
                  style={styles.watchlistGradientWrap}
                >
                  <LinearGradient
                    colors={[
                      colors.primary,
                      colors.primary_container,
                      colors.primary_container,
                    ]}
                    locations={[0, 0.55, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.watchlistGradient}
                  >
                    <AddToWatchlistIcon />
                    <Text style={styles.watchlistDefaultLabel}>
                      Add to Watchlist
                    </Text>
                  </LinearGradient>
                </Pressable>
              )}

              {/* Design: separate section below the primary button — outline state + remove */}
              {inWatchlist ? (
                <View style={styles.watchlistSecondarySection}>
                  <Text style={styles.watchlistStateCaption}>
                    Watchlist state: added
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityHint="Removes this title from your watchlist"
                    style={styles.watchlistAdded}
                    onPress={onToggleWatchlist}
                  >
                    <InWatchlistIcon />
                    <Text style={styles.watchlistAddedLabel}>In Watchlist</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            <Text style={styles.sectionHeadline}>Synopsis</Text>
            <Text
              style={styles.synopsisBody}
              numberOfLines={
                synopsisExpanded
                  ? undefined
                  : SYNOPSIS_MAX_LINES
              }
              ellipsizeMode="tail"
            >
              {(details.data.overview ?? '').trim() || 'No synopsis available.'}
            </Text>
            {(details.data.overview ?? '').trim().length >
              SYNOPSIS_READ_MORE_THRESHOLD && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  synopsisExpanded ? 'Show less synopsis' : 'Read more synopsis'
                }
                hitSlop={spacing.sm}
                onPress={(): void => {
                  setSynopsisExpanded((v) => !v);
                }}
                style={styles.readMorePress}
              >
                <Text style={styles.readMoreText}>
                  {synopsisExpanded ? 'Show less' : 'Read more'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {credits.status === 'loading' && (
        <View style={styles.sectionPad}>
          <Text style={styles.sectionHeadline}>Cast</Text>
          <CastSkeleton />
        </View>
      )}

      {credits.status === 'error' && (
        <View style={styles.sectionPad}>
          <DetailSectionError
            message={credits.message}
            onRetry={retryCredits}
          />
        </View>
      )}

      {credits.status === 'success' && castList.length === 0 && (
        <View style={styles.sectionPad}>
          <Text style={styles.castUnavailable}>
            Cast information unavailable
          </Text>
        </View>
      )}

      {credits.status === 'success' && castList.length > 0 && (
        <View style={styles.sectionPad}>
          <Text style={styles.sectionHeadline}>Cast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castScroll}
          >
            {castList.map((c) => (
              <View key={String(c.id)} style={styles.castCard}>
                {tmdbProfileUrl(c.profile_path, 'w185') ? (
                  <Image
                    source={{ uri: tmdbProfileUrl(c.profile_path, 'w185') }}
                    style={styles.castAvatar}
                  />
                ) : (
                  <View style={styles.castAvatarPlaceholder} />
                )}
                <Text style={styles.castName} numberOfLines={2}>
                  {c.name}
                </Text>
                <Text style={styles.castCharacter} numberOfLines={2}>
                  {c.character}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {similar.status === 'loading' && (
        <View style={styles.sectionPad}>
          <View style={styles.moreHeader}>
            <Text style={[styles.sectionHeadline, styles.moreLikeTitle]}>
              More Like This
            </Text>
          </View>
          <SimilarSkeleton />
        </View>
      )}

      {similar.status === 'error' && (
        <View style={styles.sectionPad}>
          <View style={styles.moreHeader}>
            <Text style={[styles.sectionHeadline, styles.moreLikeTitle]}>
              More Like This
            </Text>
          </View>
          <DetailSectionError
            message={similar.message}
            onRetry={retrySimilar}
          />
        </View>
      )}

      {similar.status === 'success' && similarList.length > 0 && (
        <View style={styles.sectionPad}>
          <View style={styles.moreHeader}>
            <Text style={[styles.sectionHeadline, styles.moreLikeTitle]}>
              More Like This
            </Text>
            <Pressable onPress={openSeeAllSimilar}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similarScroll}
          >
            {similarList.map((m) => (
              <ContentCard
                key={m.id}
                movie={m}
                genreNameById={genreNameById}
                showSubtitle={false}
                onPress={onPressSimilarMovie}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
    <DetailFloatingHeaderChrome
      left={
        canGoBack ? (
          <DetailHeaderBack
            tintColor={colors.on_hero}
            onPress={(): void => {
              navigation.goBack();
            }}
          />
        ) : (
          <View
            style={{ width: DETAIL_HEADER_ICON_CIRCLE + spacing.md }}
            accessibilityElementsHidden
          />
        )
      }
      right={
        <DetailHeaderShare
          tintColor={colors.on_hero}
          onPress={onShare}
          disabled={details.status !== 'success'}
        />
      }
    />
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  headerCirclePress: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconLeft: {
    marginLeft: spacing.sm,
  },
  headerIconRight: {
    marginRight: spacing.sm,
  },
  headerIconDisabled: {
    opacity: 0.45,
  },
  addWatchlistIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inWatchlistIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  watchlistStateCaption: {
    ...typography.labelSm,
    color: colors.on_surface_caption,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  heroWrap: {
    height: HERO_HEIGHT,
    backgroundColor: colors.surface_container_high,
  },
  heroImage: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  heroPlaceholder: {
    width: '100%',
    height: HERO_HEIGHT,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT * GRADIENT_BOTTOM_PCT,
  },
  bodyPad: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  detailTitle: {
    ...typography.detailTitle,
    color: colors.on_hero,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  watchlistBlock: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  watchlistSecondarySection: {
    width: '100%',
  },
  watchlistGradientWrap: {
    borderRadius: spacing.md,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  watchlistGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  watchlistDefaultLabel: {
    ...typography.titleSm,
    color: colors.on_primary_gradient,
  },
  watchlistAdded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.md,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.watchlist_ghost_accent,
  },
  watchlistAddedLabel: {
    ...typography.titleSm,
    color: colors.watchlist_ghost_accent,
  },
  sectionHeadline: {
    ...typography.headlineMd,
    color: colors.on_hero,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  synopsisBody: {
    ...typography.bodyMd,
    color: colors.on_surface_variant,
    lineHeight: 24,
  },
  readMorePress: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  readMoreText: {
    ...typography.titleSm,
    color: colors.primary,
  },
  sectionPad: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  castUnavailable: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    marginTop: spacing.sm,
  },
  castScroll: {
    paddingVertical: spacing.sm,
    gap: spacing.md,
    flexDirection: 'row',
  },
  castCard: {
    width: CAST_AVATAR + spacing.lg,
    alignItems: 'center',
  },
  castAvatar: {
    width: CAST_AVATAR,
    height: CAST_AVATAR,
    borderRadius: CAST_AVATAR / 2,
    backgroundColor: colors.surface_container_high,
  },
  castAvatarPlaceholder: {
    width: CAST_AVATAR,
    height: CAST_AVATAR,
    borderRadius: CAST_AVATAR / 2,
    backgroundColor: colors.surface_container_high,
  },
  castName: {
    ...typography.labelSm,
    color: colors.on_hero,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  castCharacter: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  moreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  moreLikeTitle: {
    flex: 1,
    marginBottom: 0,
  },
  seeAll: {
    ...typography.titleSm,
    color: colors.primary,
  },
  similarScroll: {
    flexDirection: 'row',
    paddingBottom: spacing.md,
  },
  detailsSkeleton: {
    paddingBottom: spacing.lg,
  },
  skHero: {
    height: HERO_HEIGHT,
    backgroundColor: colors.surface_container_high,
  },
  skTitle: {
    height: 36,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_high,
  },
  skLine: {
    height: 14,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_low,
  },
  skLineShort: {
    width: '60%',
  },
  skBlock: {
    height: 72,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface_container_low,
  },
  castSkeletonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  castSkItem: {
    width: CAST_AVATAR + spacing.lg,
    alignItems: 'center',
  },
  castSkCircle: {
    width: CAST_AVATAR,
    height: CAST_AVATAR,
    borderRadius: CAST_AVATAR / 2,
    backgroundColor: colors.surface_container_high,
  },
  castSkText: {
    height: 10,
    width: '90%',
    marginTop: spacing.xs,
    borderRadius: spacing.xs,
    backgroundColor: colors.surface_container_low,
  },
  castSkTextShort: {
    width: '70%',
  },
  similarSkeletonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  similarSkCard: {
    width: 132,
    height: 200,
    borderRadius: spacing.md,
    backgroundColor: colors.surface_container_high,
  },
});
