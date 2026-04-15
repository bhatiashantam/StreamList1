import { useCallback, useEffect, useRef, useState } from 'react';
import type { TMDBCastMember, TMDBDetailNormalized, TMDBMovie } from '../api/types';
import {
  fetchMediaCredits,
  fetchMovieDetailNormalized,
  fetchSimilarMovies,
} from '../api/movieDetail';
import { hasTmdbApiKey } from '../api/client';
import type { WatchlistMediaType } from '../store/watchlistStore';

export type DetailSectionState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

export interface UseMovieDetailArgs {
  id: number;
  mediaType: WatchlistMediaType;
}

export interface UseMovieDetailResult {
  details: DetailSectionState<TMDBDetailNormalized>;
  credits: DetailSectionState<TMDBCastMember[]>;
  similar: DetailSectionState<TMDBMovie[]>;
  retryDetails: () => Promise<void>;
  retryCredits: () => Promise<void>;
  retrySimilar: () => Promise<void>;
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Something went wrong';
}

export function useMovieDetail({
  id,
  mediaType,
}: UseMovieDetailArgs): UseMovieDetailResult {
  const [details, setDetails] =
    useState<DetailSectionState<TMDBDetailNormalized>>({
      status: 'loading',
    });
  const [credits, setCredits] =
    useState<DetailSectionState<TMDBCastMember[]>>({ status: 'loading' });
  const [similar, setSimilar] =
    useState<DetailSectionState<TMDBMovie[]>>({ status: 'loading' });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadDetailsOnly = useCallback(async (): Promise<void> => {
    if (!hasTmdbApiKey()) {
      setDetails({
        status: 'error',
        message: 'Missing TMDB API key. Set TMDB_API_KEY or API_KEY in .env',
      });
      return;
    }
    setDetails({ status: 'loading' });
    try {
      const data = await fetchMovieDetailNormalized(id, mediaType);
      if (mounted.current) {
        setDetails({ status: 'success', data });
      }
    } catch (e) {
      if (mounted.current) {
        setDetails({ status: 'error', message: errorMessage(e) });
      }
    }
  }, [id, mediaType]);

  const loadCreditsOnly = useCallback(async (): Promise<void> => {
    if (!hasTmdbApiKey()) {
      setCredits({
        status: 'error',
        message: 'Missing TMDB API key. Set TMDB_API_KEY or API_KEY in .env',
      });
      return;
    }
    setCredits({ status: 'loading' });
    try {
      const data = await fetchMediaCredits(id, mediaType);
      if (mounted.current) {
        setCredits({ status: 'success', data });
      }
    } catch (e) {
      if (mounted.current) {
        setCredits({ status: 'error', message: errorMessage(e) });
      }
    }
  }, [id, mediaType]);

  const loadSimilarOnly = useCallback(async (): Promise<void> => {
    if (!hasTmdbApiKey()) {
      setSimilar({
        status: 'error',
        message: 'Missing TMDB API key. Set TMDB_API_KEY or API_KEY in .env',
      });
      return;
    }
    setSimilar({ status: 'loading' });
    try {
      const res = await fetchSimilarMovies(id, mediaType, 1);
      if (mounted.current) {
        setSimilar({ status: 'success', data: res.results });
      }
    } catch (e) {
      if (mounted.current) {
        setSimilar({ status: 'error', message: errorMessage(e) });
      }
    }
  }, [id, mediaType]);

  const loadParallel = useCallback(async (): Promise<void> => {
    if (!hasTmdbApiKey()) {
      const msg = 'Missing TMDB API key. Set TMDB_API_KEY or API_KEY in .env';
      setDetails({ status: 'error', message: msg });
      setCredits({ status: 'error', message: msg });
      setSimilar({ status: 'error', message: msg });
      return;
    }

    setDetails({ status: 'loading' });
    setCredits({ status: 'loading' });
    setSimilar({ status: 'loading' });

    const settled = await Promise.allSettled([
      fetchMovieDetailNormalized(id, mediaType),
      fetchMediaCredits(id, mediaType),
      fetchSimilarMovies(id, mediaType, 1),
    ]);

    if (!mounted.current) {
      return;
    }

    const [d, c, s] = settled;

    if (d.status === 'fulfilled') {
      setDetails({ status: 'success', data: d.value });
    } else {
      setDetails({ status: 'error', message: errorMessage(d.reason) });
    }

    if (c.status === 'fulfilled') {
      setCredits({ status: 'success', data: c.value });
    } else {
      setCredits({ status: 'error', message: errorMessage(c.reason) });
    }

    if (s.status === 'fulfilled') {
      setSimilar({ status: 'success', data: s.value.results });
    } else {
      setSimilar({ status: 'error', message: errorMessage(s.reason) });
    }
  }, [id, mediaType]);

  useEffect(() => {
    void loadParallel();
  }, [loadParallel]);

  return {
    details,
    credits,
    similar,
    retryDetails: loadDetailsOnly,
    retryCredits: loadCreditsOnly,
    retrySimilar: loadSimilarOnly,
  };
}
