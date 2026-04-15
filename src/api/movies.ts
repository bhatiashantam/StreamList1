import { get } from './client';
import type {
  TMDBGenreListResponse,
  TMDBMovie,
  TMDBPaginatedResponse,
} from './types';

export async function fetchTrendingMoviesWeek(
  page: number = 1,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return get<TMDBPaginatedResponse<TMDBMovie>>('/trending/movie/week', {
    page,
  });
}

export async function fetchTopRatedMovies(
  page: number = 1,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  return get<TMDBPaginatedResponse<TMDBMovie>>('/movie/top_rated', { page });
}

export async function fetchDiscoverMovies(
  page: number = 1,
  genreId: number | null,
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  if (genreId === null) {
    return get<TMDBPaginatedResponse<TMDBMovie>>('/discover/movie', {
      page,
      sort_by: 'popularity.desc',
    });
  }
  return get<TMDBPaginatedResponse<TMDBMovie>>('/discover/movie', {
    page,
    with_genres: genreId,
    sort_by: 'popularity.desc',
  });
}

export async function fetchMovieGenres(): Promise<TMDBGenreListResponse> {
  return get<TMDBGenreListResponse>('/genre/movie/list');
}
