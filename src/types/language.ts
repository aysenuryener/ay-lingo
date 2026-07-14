export type Direction = "ltr" | "rtl";

export type WordLevel = "baslangic" | "orta" | "ileri";

export interface LanguageMeta {
  /** Folder-derived key, e.g. "en" */
  code: string;
  /** Display name shown to the Turkish-speaking user, e.g. "İngilizce" */
  name: string;
  /** Name of the language in itself, e.g. "English" */
  nativeName: string;
  /** BCP-47 locale tag, e.g. "en-US" */
  bcp47: string;
  /** Text direction for the whole learning UI when this language is active */
  direction: Direction;
  /** Language code passed to the Web Speech API for pronunciation */
  speechLang: string;
}

export interface Word {
  /** Spelling in the target language (any script/alphabet) */
  word: string;
  /** Approximate Turkish-phonetic reading, for a Turkish speaker with no prior knowledge */
  reading: string;
  /** Turkish meaning */
  meaning: string;
  level: WordLevel;
  /** Free-form topic tag, e.g. "yemek", "seyahat" */
  category: string;
  /** Single emoji, or empty string if none fits */
  emoji: string;
  /** Reserved for future image support; always empty in v1 */
  image: string;
}

export interface LanguageFile {
  meta: LanguageMeta;
  words: Word[];
}

/** A word plus a stable id derived from its content, used as a storage key. */
export interface WordWithId extends Word {
  id: string;
}

export interface LoadedLanguage {
  meta: LanguageMeta;
  words: WordWithId[];
}
