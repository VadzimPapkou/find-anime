export type TLanguage = 'rus' | 'eng';
export type TTranslatedLanguage = Exclude<TLanguage, 'eng'>;