import { useCallback, useEffect, useState } from 'react';
import { fetchMovieGenres } from '../api/movies';
import { hasTmdbApiKey } from '../api/client';
import type { TMDBGenre } from '../api/types';

export type HomeGenreChip = {
  label: string;
  genreId: number | null;
};

const TARGET_CHIPS: ReadonlyArray<{
  label: string;
  apiName: string | null;
}> = [
  { label: 'All', apiName: null },
  { label: 'Action', apiName: 'Action' },
  { label: 'Drama', apiName: 'Drama' },
  { label: 'Comedy', apiName: 'Comedy' },
  { label: 'Sci-Fi', apiName: 'Science Fiction' },
  { label: 'Horror', apiName: 'Horror' },
  { label: 'Documentary', apiName: 'Documentary' },
];

function mapGenresToChips(genres: TMDBGenre[]): HomeGenreChip[] {
  const byName = new Map(
    genres.map((g) => [g.name.toLowerCase(), g.id] as const),
  );

  return TARGET_CHIPS.map((chip) => {
    if (chip.apiName === null) {
      return { label: chip.label, genreId: null };
    }
    const id = byName.get(chip.apiName.toLowerCase());
    return {
      label: chip.label,
      genreId: id ?? null,
    };
  });
}

export interface UseMovieGenresResult {
  chips: HomeGenreChip[];
  /** TMDB genre id → display name (for poster metadata). */
  genreNameById: Map<number, string>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMovieGenres(): UseMovieGenresResult {
  const [chips, setChips] = useState<HomeGenreChip[]>(
    TARGET_CHIPS.map((c) => ({
      label: c.label,
      genreId: c.label === 'All' ? null : null,
    })),
  );
  const [genreNameById, setGenreNameById] = useState<Map<number, string>>(
    () => new Map(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!hasTmdbApiKey()) {
      setError('Missing TMDB API key. Set TMDB_API_KEY in .env');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMovieGenres();
      setChips(mapGenresToChips(res.genres));
      setGenreNameById(new Map(res.genres.map((g) => [g.id, g.name])));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load genres';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { chips, genreNameById, isLoading, error, refetch: load };
}
