import { API_BASE_URL } from './api-config';
import { getAuthSession } from './auth-storage';

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};
/**
 * Resolves a unique, stable userId from the current session.
 * Fallback to 'anonymous_user' if not logged in.
 */
export async function getActiveUserId(): Promise<string> {
  const session = await getAuthSession();

  if (!session?.email) {
    throw new Error(
      'No authenticated session found. User must login first.'
    );
  }

  return session.email
    .split('@')[0]
    .trim()
    .toLowerCase();
}

/**
 * Generic request wrapper around the standard Fetch API.
 */
async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  options?: RequestOptions
): Promise<T> {
  // Construct the absolute URL
  // const pathClean = path.startsWith('/') ? path : `/${path}`;
  // const url = new URL(`${API_BASE_URL}${pathClean}`);

  // // Append query params if present
  // if (options?.params) {
  //   Object.entries(options.params).forEach(([key, val]) => {
  //     url.searchParams.append(key, val);
  //   });
  // }

  // // Construct request headers
  // const headers = new Headers({
  //   'Content-Type': 'application/json',
  //   ...options?.headers,
  // });

  // const config: RequestInit = {
  //   method,
  //   headers,
  // };

  // if (body) {
  //   config.body = JSON.stringify(body);
  // }
  // console.log("API CLIENT LOADED");
  // console.log("API_BASE_URL =", API_BASE_URL);
  const pathClean = path.startsWith('/') ? path : `/${path}`;

  // 1. AVOID 'new URL()'. Use string concatenation.
  let url = `${API_BASE_URL}${pathClean}`;

  // 2. Append query params manually if they exist
  if (options?.params) {
    const query = new URLSearchParams(options.params).toString();
    url += `?${query}`;
  }

  // DEBUG LOG: This will show you EXACTLY what is being called
  // console.log(`[apiClient] Sending ${method} to: ${url}`);

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options?.headers,
  });

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    // Try reading text as fallback, or return empty object
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return {} as any;
    }
  } catch (error) {
    console.error(`[apiClient] ${method} ${pathClean} failed:`, error);
    throw error;
  }
}

/**
 * Reusable apiClient helpers for REST calls.
 */
export const apiClient = {
  get: <T>(path: any, options?: RequestOptions) =>
    request<T>(path, 'GET', undefined, options),

  post: <T>(path: any, body?: any, options?: RequestOptions) =>
    request<T>(path, 'POST', body, options),

  put: <T>(path: string, body?: any, options?: RequestOptions) =>
    request<T>(path, 'PUT', body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, 'DELETE', undefined, options),
};
