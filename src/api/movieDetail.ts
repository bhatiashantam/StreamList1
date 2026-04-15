import { get } from './client';
import type {
  TMDBCastMember,
  TMDBDetailNormalized,
  TMDBMovie,
  TMDBPaginatedResponse,
} from './types';

interface TMDBApiMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface TMDBApiTvDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  episode_run_time: number[];
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface TMDBCreditsApi {
  cast: TMDBCastMember[];
}

function normalizeMovie(m: TMDBApiMovieDetail): TMDBDetailNormalized {
  return {
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    releaseYearLabel:
      m.release_date && m.release_date.length >= 4
        ? m.release_date.slice(0, 4)
        : null,
    runtimeMinutes:
      m.runtime != null && m.runtime > 0 ? m.runtime : null,
    vote_average: m.vote_average,
    genres: m.genres ?? [],
  };
}

function normalizeTv(t: TMDBApiTvDetail): TMDBDetailNormalized {
  const run =
    Array.isArray(t.episode_run_time) && t.episode_run_time.length > 0
      ? t.episode_run_time[0]
      : null;
  return {
    id: t.id,
    title: t.name,
    overview: t.overview,
    poster_path: t.poster_path,
    backdrop_path: t.backdrop_path,
    releaseYearLabel:
      t.first_air_date && t.first_air_date.length >= 4
        ? t.first_air_date.slice(0, 4)
        : null,
    runtimeMinutes: run != null && run > 0 ? run : null,
    vote_average: t.vote_average,
    genres: t.genres ?? [],
  };
}

export async function fetchMovieDetailNormalized(
  id: number,
  mediaType: 'movie' | 'tv',
): Promise<TMDBDetailNormalized> {
  if (mediaType === 'movie') {
    const m = await get<TMDBApiMovieDetail>(`/movie/${id}`);
    return normalizeMovie(m);
  }
  const t = await get<TMDBApiTvDetail>(`/tv/${id}`);
  return normalizeTv(t);
}

export async function fetchMediaCredits(
  id: number,
  mediaType: 'movie' | 'tv',
): Promise<TMDBCastMember[]> {
  const path =
    mediaType === 'movie'
      ? `/movie/${id}/credits`
      : `/tv/${id}/credits`;
  const res = await get<TMDBCreditsApi>(path);
  return Array.isArray(res.cast) ? res.cast : [];
}

interface TMDBMovieLike {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  vote_average: number;
}

export async function fetchSimilarMovies(
  id: number,
  mediaType: 'movie' | 'tv',
  page: number = 1,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const path =
    mediaType === 'movie'
      ? `/movie/${id}/similar`
      : `/tv/${id}/similar`;
  const res = await get<TMDBPaginatedResponse<TMDBMovieLike>>(path, { page });
  const results: TMDBMovie[] = res.results.map((r) => ({
    id: r.id,
    title: r.title ?? r.name ?? '',
    overview: r.overview,
    poster_path: r.poster_path,
    backdrop_path: r.backdrop_path,
    release_date: r.release_date ?? r.first_air_date ?? '',
    genre_ids: Array.isArray(r.genre_ids) ? r.genre_ids : [],
    vote_average: r.vote_average,
  }));
  return { ...res, results };
}
