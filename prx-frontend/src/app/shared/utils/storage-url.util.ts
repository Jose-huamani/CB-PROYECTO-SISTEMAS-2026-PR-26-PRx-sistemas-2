import { environment } from '@env/environment';

function normalizePath(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path;
}

export function resolvePublicStorageUrl(path?: string | null): string {
  if (!path) {
    return '';
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = environment.storage.publicBaseUrl.replace(/\/+$/, '');
  const normalizedPath = normalizePath(path);

  return `${baseUrl}/${normalizedPath}`;
}
