import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import type { HomeGenreChip } from '../hooks/useMovieGenres';
import type { TMDBMovie } from '../api/types';
import { useDiscoverMoviesRow } from '../hooks/useDiscoverMoviesRow';
import { useMovieGenres } from '../hooks/useMovieGenres';
import { useTopRatedMoviesRow } from '../hooks/useTopRatedMoviesRow';
import { useTrendingMoviesRow } from '../hooks/useTrendingMoviesRow';
import { ContentMovieRow } from '../components/home/ContentMovieRow';
import { GenreChipStrip } from '../components/home/GenreChipStrip';
import { HeroFeaturedCard } from '../components/home/HeroFeaturedCard';
import { HomeHeader } from '../components/home/HomeHeader';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_CHIP: HomeGenreChip = { label: 'All', genreId: null };
const HEADER_BODY = 52;

export function HomeScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, 'Home'>): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedChip, setSelectedChip] =
    useState<HomeGenreChip>(DEFAULT_CHIP);

  const { chips, genreNameById, error: genresError } = useMovieGenres();
  const trending = useTrendingMoviesRow();
  const topRated = useTopRatedMoviesRow();
  const discover = useDiscoverMoviesRow(selectedChip.genreId);

  const onPressMovie = (movie: TMDBMovie): void => {
    navigation.navigate('Detail', { id: movie.id, mediaType: 'movie' });
  };

  const openSeeAllTrending = (): void => {
    navigation.navigate('SeeAll', {
      listKind: 'trending',
      genreId: null,
      title: 'Trending Now',
    });
  };

  const openSeeAllTopRated = (): void => {
    navigation.navigate('SeeAll', {
      listKind: 'top_rated',
      genreId: null,
      title: 'Top Rated',
    });
  };

  const openSeeAllGenre = (): void => {
    navigation.navigate('SeeAll', {
      listKind: 'discover',
      genreId: selectedChip.genreId,
      title: selectedChip.label,
    });
  };

  const anyHasMore =
    trending.hasMore || topRated.hasMore || discover.hasMore;
  const anyLoadingMore =
    trending.loadingMore || topRated.loadingMore || discover.loadingMore;

  const contentTop = insets.top + HEADER_BODY + spacing.sm;

  return (
    <View style={styles.root}>
      <HomeHeader scrollY={scrollY} paddingTopInset={insets.top} />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: contentTop,
            paddingBottom: insets.bottom + spacing.xxl + spacing.xl,
          },
        ]}
      >
        {genresError ? <Text style={styles.banner}>{genresError}</Text> : null}

        <GenreChipStrip
          chips={chips.length > 0 ? chips : [DEFAULT_CHIP]}
          selectedLabel={selectedChip.label}
          onSelect={(chip): void => {
            setSelectedChip(chip);
          }}
        />

        <HeroFeaturedCard
          movie={trending.hero}
          initialLoading={trending.initialLoading}
          onPressWatch={(m): void => {
            onPressMovie(m);
          }}
          onPressDetails={(m): void => {
            onPressMovie(m);
          }}
        />

        <ContentMovieRow
          title="Trending Now"
          movies={trending.movies}
          genreNameById={genreNameById}
          initialLoading={trending.initialLoading}
          loadingMore={trending.loadingMore}
          hasMore={trending.hasMore}
          onLoadMore={trending.loadMore}
          emptyMessage="No trending movies right now."
          error={trending.error}
          onPressSeeAll={openSeeAllTrending}
          onPressMovie={onPressMovie}
        />

        <ContentMovieRow
          title="Top Rated"
          movies={topRated.movies}
          genreNameById={genreNameById}
          initialLoading={topRated.initialLoading}
          loadingMore={topRated.loadingMore}
          hasMore={topRated.hasMore}
          onLoadMore={topRated.loadMore}
          emptyMessage="No top rated movies right now."
          error={topRated.error}
          onPressSeeAll={openSeeAllTopRated}
          onPressMovie={onPressMovie}
        />

        <View key={selectedChip.label}>
          <ContentMovieRow
            title={selectedChip.label}
            movies={discover.movies}
            genreNameById={genreNameById}
            initialLoading={discover.initialLoading}
            loadingMore={discover.loadingMore}
            hasMore={discover.hasMore}
            onLoadMore={discover.loadMore}
            emptyMessage="No movies found for this filter."
            error={discover.error}
            onPressSeeAll={openSeeAllGenre}
            onPressMovie={onPressMovie}
          />
        </View>

        {anyHasMore && anyLoadingMore ? (
          <View style={styles.loadMoreRow}>
            <View style={styles.loadSpinner}>
              <ActivityIndicator color={colors.on_surface_variant} />
            </View>
            <Text style={styles.loadMoreText}>LOADING MORE CONTENT</Text>
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  banner: {
    ...typography.bodyMd,
    color: colors.primary_container,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  loadMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  loadSpinner: {
    marginRight: spacing.md,
  },
  loadMoreText: {
    ...typography.labelSm,
    color: colors.on_surface_variant,
    textTransform: 'uppercase',
  },
});
