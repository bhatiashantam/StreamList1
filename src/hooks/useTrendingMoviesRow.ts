import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTrendingMoviesWeek } from '../api/movies';
import { hasTmdbApiKey } from '../api/client';
import type { TMDBMovie } from '../api/types';

export interface UseTrendingMoviesRowResult {
  hero: TMDBMovie | null;
  movies: TMDBMovie[];
  initialLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useTrendingMoviesRow(): UseTrendingMoviesRowResult {
  const [hero, setHero] = useState<TMDBMovie | null>(null);
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadingLock = useRef<boolean>(false);

  const hasMore = page < totalPages;

  const loadPage = useCallback(async (nextPage: number): Promise<void> => {
    if (!hasTmdbApiKey()) {
      setError('Missing TMDB API key. Set TMDB_API_KEY or API_KEY in .env');
      setInitialLoading(false);
      return;
    }
    const res = await fetchTrendingMoviesWeek(nextPage);
    setTotalPages(res.total_pages);

    if (nextPage === 1) {
      if (res.results.length > 0) {
        setHero(res.results[0]);
        setMovies(res.results.slice(1));
      } else {
        setHero(null);
        setMovies([]);
      }
    } else {
      setMovies((prev) => [...prev, ...res.results]);
    }
    setPage(nextPage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async (): Promise<void> => {
      setInitialLoading(true);
      setError(null);
      try {
        await loadPage(1);
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : 'Failed to load trending';
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
  }, [loadPage]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || loadingMore || loadingLock.current || page === 0) {
      return;
    }
    loadingLock.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      await loadPage(page + 1);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to load more trending';
      setError(message);
    } finally {
      setLoadingMore(false);
      loadingLock.current = false;
    }
  }, [hasMore, loadPage, loadingMore, page]);

  return {
    hero,
    movies,
    initialLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
