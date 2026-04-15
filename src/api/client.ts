import axios, { type AxiosInstance } from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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
      const apiKey =
        typeof process.env.TMDB_API_KEY === 'string'
          ? process.env.TMDB_API_KEY
          : '';
      const nextParams = {
        ...(config.params as Record<string, unknown> | undefined),
        api_key: apiKey,
      };
      return { ...config, params: nextParams };
    });
  }
  return client;
}

export function hasTmdbApiKey(): boolean {
  const key = process.env.TMDB_API_KEY;
  return typeof key === 'string' && key.length > 0;
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
