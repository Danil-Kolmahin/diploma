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

export enum SESSION_STORAGE {
  APP_THEME = 'DIPLOMA_V2_APP_THEME',
  APP_SIMPLE_DIFF_TEXT1 = 'DIPLOMA_V2_APP_SIMPLE_DIFF_TEXT1',
  APP_SIMPLE_DIFF_TEXT2 = 'DIPLOMA_V2_APP_SIMPLE_DIFF_TEXT2',
}
