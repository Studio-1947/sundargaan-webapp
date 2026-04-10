const ADMIN_TOKEN_STORAGE_KEY = 'sundargaan_admin_token';

export function getAdminToken(): string {
  return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '';
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}
