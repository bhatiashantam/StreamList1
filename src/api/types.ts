/** Subset of TMDB movie fields used by the app. */
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenreListResponse {
  genres: TMDBGenre[];
}

/** Normalized movie/TV detail for UI (single shape for both media types). */
export interface TMDBDetailNormalized {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  releaseYearLabel: string | null;
  runtimeMinutes: number | null;
  vote_average: number;
  genres: TMDBGenre[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
