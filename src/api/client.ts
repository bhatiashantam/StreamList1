import axios, { type AxiosInstance } from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Reads TMDB key from env (inlined by `react-native-dotenv` from `.env`).
 * Prefer `TMDB_API_KEY`; `API_KEY` is supported as an alias so `.env` matches common naming.
 */
function getTmdbApiKey(): string {
  const primary = process.env.TMDB_API_KEY;
  if (typeof primary === 'string' && primary.trim().length > 0) {
    return primary.trim();
  }
  const alias = process.env.API_KEY;
  if (typeof alias === 'string' && alias.trim().length > 0) {
    return alias.trim();
  }
  return '';
}

let client: AxiosInstance | null = null;

function getAxios(): AxiosInstance {
  if (client === null) {
    client = axios.create({
      baseURL: TMDB_BASE_URL,
      headers: {
        Accept: 'application/json',
      },
    });
    client.interceptors.request.use((config) => {
      const nextParams = {
        ...(config.params as Record<string, unknown> | undefined),
        api_key: getTmdbApiKey(),
      };
      return { ...config, params: nextParams };
    });
  }
  return client;
}

export function hasTmdbApiKey(): boolean {
  return getTmdbApiKey().length > 0;
}

export async function get<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const { data } = await getAxios().get<T>(url, { params });
  return data;
}

export async function post<T>(
  url: string,
  body?: unknown,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const { data } = await getAxios().post<T>(url, body, { params });
  return data;
}

export async function put<T>(
  url: string,
  body?: unknown,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const { data } = await getAxios().put<T>(url, body, { params });
  return data;
}

export async function deleteRequest<T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const { data } = await getAxios().delete<T>(url, { params });
  return data;
}
