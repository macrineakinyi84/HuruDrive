/**
 * Base URL for API and static assets in production.
 * In development this is empty so Vite proxy handles /api and /images.
 * In production set VITE_API_URL to your backend URL (e.g. https://hurudrive-api.onrender.com).
 */
export const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
