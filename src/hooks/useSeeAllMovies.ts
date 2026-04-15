import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSimilarMovies } from '../api/movieDetail';
import {
  fetchDiscoverMovies,
  fetchTopRatedMovies,
  fetchTrendingMoviesWeek,
} from '../api/movies';
import { hasTmdbApiKey } from '../api/client';
import type { TMDBMovie } from '../api/types';
import type { SeeAllListKind } from '../navigation/types';

export interface UseSeeAllMoviesArgs {
  kind: SeeAllListKind;
  genreId: number | null;
  sourceMovieId?: number;
  sourceMediaType?: 'movie' | 'tv';
}

export interface UseSeeAllMoviesResult {
  movies: TMDBMovie[];
  initialLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useSeeAllMovies({
  kind,
  genreId,
  sourceMovieId,
  sourceMediaType,
}: UseSeeAllMoviesArgs): UseSeeAllMoviesResult {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadingLock = useRef<boolean>(false);

  const hasMore = page < totalPages;

  const fetchKindPage = useCallback(
    async (nextPage: number): Promise<void> => {
      if (!hasTmdbApiKey()) {
        setError('Missing TMDB API key. Set TMDB_API_KEY or API_KEY in .env');
        setInitialLoading(false);
        return;
      }
      if (kind === 'trending') {
        const res = await fetchTrendingMoviesWeek(nextPage);
        setTotalPages(res.total_pages);
        setMovies((prev) =>
          nextPage === 1 ? res.results : [...prev, ...res.results],
        );
      } else if (kind === 'top_rated') {
        const res = await fetchTopRatedMovies(nextPage);
        setTotalPages(res.total_pages);
        setMovies((prev) =>
          nextPage === 1 ? res.results : [...prev, ...res.results],
        );
      } else if (kind === 'similar') {
        if (
          sourceMovieId === undefined ||
          sourceMediaType === undefined
        ) {
          throw new Error('Similar list requires source id and media type');
        }
        const res = await fetchSimilarMovies(
          sourceMovieId,
          sourceMediaType,
          nextPage,
        );
        setTotalPages(res.total_pages);
        setMovies((prev) =>
          nextPage === 1 ? res.results : [...prev, ...res.results],
        );
      } else {
        const res = await fetchDiscoverMovies(nextPage, genreId);
        setTotalPages(res.total_pages);
        setMovies((prev) =>
          nextPage === 1 ? res.results : [...prev, ...res.results],
        );
      }
      setPage(nextPage);
    },
    [genreId, kind, sourceMediaType, sourceMovieId],
  );

  useEffect(() => {
    let cancelled = false;
    (async (): Promise<void> => {
      setInitialLoading(true);
      setMovies([]);
      setPage(0);
      setError(null);
      try {
        await fetchKindPage(1);
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : 'Failed to load movies';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setInitialLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchKindPage]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || loadingMore || loadingLock.current || page === 0) {
      return;
    }
    loadingLock.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      await fetchKindPage(page + 1);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to load more movies';
      setError(message);
    } finally {
      setLoadingMore(false);
      loadingLock.current = false;
    }
  }, [fetchKindPage, hasMore, loadingMore, page]);

  return {
    movies,
    initialLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
