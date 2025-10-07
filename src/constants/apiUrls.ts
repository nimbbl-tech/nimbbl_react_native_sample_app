export const API_URLS = {
  QA: 'https://qa1api.nimbbl.tech/',
  PRE_PROD: 'https://apipp.nimbbl.tech/',
  PROD: 'https://api.nimbbl.tech/',
} as const;

export type Environment = keyof typeof API_URLS;
