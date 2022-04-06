export enum APP_THEMES {
  LIGHT = 'light',
  DARK = 'dark',
}

export const DEFAULT_APP_THEME = APP_THEMES.DARK;

export enum ROUTES {
  ROOT = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  SETTINGS = '/settings',
  SIMPLE_DIFF = '/simple-difference',
  DEEP_ANALYZE = '/deep-analyze',
  HISTORY = '/history',
}

export const DEFAULT_REDIRECT_ROUTE = ROUTES.SIMPLE_DIFF;
