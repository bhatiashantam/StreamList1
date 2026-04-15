const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export type PosterSize = 'w185' | 'w342' | 'w500';
export type BackdropSize = 'w780' | 'w1280';

export function tmdbPosterUrl(
  path: string | null,
  size: PosterSize = 'w342',
): string | undefined {
  if (!path) {
    return undefined;
  }
  return `${IMAGE_BASE}/${size}${path}`;
}

export function tmdbBackdropUrl(
  path: string | null,
  size: BackdropSize = 'w780',
): string | undefined {
  if (!path) {
    return undefined;
  }
  return `${IMAGE_BASE}/${size}${path}`;
}
