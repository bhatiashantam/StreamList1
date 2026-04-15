import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTopRatedMovies } from '../api/movies';
import { hasTmdbApiKey } from '../api/client';
import type { TMDBMovie } from '../api/types';

export interface UseTopRatedMoviesRowResult {
  movies: TMDBMovie[];
  initialLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useTopRatedMoviesRow(): UseTopRatedMoviesRowResult {
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
      setError('Missing TMDB API key. Set TMDB_API_KEY in .env');
      setInitialLoading(false);
      return;
    }
    const res = await fetchTopRatedMovies(nextPage);
    setTotalPages(res.total_pages);
    setMovies((prev) =>
      nextPage === 1 ? res.results : [...prev, ...res.results],
    );
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
            e instanceof Error ? e.message : 'Failed to load top rated';
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
        e instanceof Error ? e.message : 'Failed to load more top rated';
      setError(message);
    } finally {
      setLoadingMore(false);
      loadingLock.current = false;
    }
  }, [hasMore, loadPage, loadingMore, page]);

  return {
    movies,
    initialLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
