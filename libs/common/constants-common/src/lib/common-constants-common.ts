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
  SIMPLE_DIFF = '/simpleDifference',
  DEEP_ANALYZE = '/deepAnalyze',
  HISTORY = '/history',
  ROBOTS = '/robots',
}

export const DEFAULT_REDIRECT_ROUTE = ROUTES.SIMPLE_DIFF;

export enum SESSION_STORAGE {
  APP_THEME = 'DIPLOMA_V2_APP_THEME',
  APP_SIMPLE_DIFF_TEXT1 = 'DIPLOMA_V2_APP_SIMPLE_DIFF_TEXT1',
  APP_SIMPLE_DIFF_TEXT2 = 'DIPLOMA_V2_APP_SIMPLE_DIFF_TEXT2',
}

export const POSSIBLE_FILE_TYPES: { [key: string]: string[] } = {
  'JavaScript': ['.js', '.jsx'],
  'TypeScript': ['.ts', '.tsx'],
};

export enum COMPARING_METHODS {
  FTC = 'FTC',
  DLD = 'DLD',
}

export interface ComparisonResult {
  [key: string]: ComparisonProjectResult;
}

export type RobotsChromosome = { [key in COMPARING_METHODS]: number };

export interface ComparisonProjectResult extends RobotsChromosome {
  'simplePieces': string[];
  'percent': number;
}

export interface CookieTokenDataI {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export const MAX_32BIT_INT = 2 ** 31 - 1;
export const BASE_CHROMOSOME: RobotsChromosome = {
  'FTC': 0.5,
  'DLD': 0.5,
};
export const DEFAULT_OPTIONS = {
  minGeneValue: 0,
  maxGeneValue: 1,
  crossoverLine: 1,
  minMutationsValue: -0.05,
  maxMutationsValue: +0.05,
  mutationChance: 0.5,
};
export type makeGeneticCycleOptionT = typeof DEFAULT_OPTIONS;
