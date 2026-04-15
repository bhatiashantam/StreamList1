import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDiscoverMovies } from '../api/movies';
import { hasTmdbApiKey } from '../api/client';
import type { TMDBMovie } from '../api/types';

export interface UseDiscoverMoviesRowResult {
  movies: TMDBMovie[];
  initialLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useDiscoverMoviesRow(
  genreId: number | null,
): UseDiscoverMoviesRowResult {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadingLock = useRef<boolean>(false);

  const hasMore = page < totalPages;

  const loadPage = useCallback(
    async (nextPage: number, gId: number | null): Promise<void> => {
      if (!hasTmdbApiKey()) {
        setError('Missing TMDB API key. Set TMDB_API_KEY in .env');
        setInitialLoading(false);
        return;
      }
      const res = await fetchDiscoverMovies(nextPage, gId);
      setTotalPages(res.total_pages);
      setMovies((prev) =>
        nextPage === 1 ? res.results : [...prev, ...res.results],
      );
      setPage(nextPage);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async (): Promise<void> => {
      setInitialLoading(true);
      setMovies([]);
      setPage(0);
      setError(null);
      try {
        await loadPage(1, genreId);
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : 'Failed to load discover list';
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
  }, [genreId, loadPage]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || loadingMore || loadingLock.current || page === 0) {
      return;
    }
    loadingLock.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      await loadPage(page + 1, genreId);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to load more discover';
      setError(message);
    } finally {
      setLoadingMore(false);
      loadingLock.current = false;
    }
  }, [genreId, hasMore, loadPage, loadingMore, page]);

  return {
    movies,
    initialLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
}
