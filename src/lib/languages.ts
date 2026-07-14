import type { LoadedLanguage, WordWithId } from "../types/language";
import { validateLanguageFile, LanguageFileError } from "./languageSchema";

// Vite discovers every JSON file under src/data/languages at build time.
// Adding a new file here is the ONLY step required to add a new language.
const modules = import.meta.glob("../data/languages/*.json", { eager: true });

function makeWordId(word: string, meaning: string, index: number): string {
  const base = `${word}__${meaning}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/gi, "-");
  return `${base}-${index}`;
}

function loadLanguages(): { languages: LoadedLanguage[]; errors: string[] } {
  const languages: LoadedLanguage[] = [];
  const errors: string[] = [];

  for (const path in modules) {
    const fileName = path.split("/").pop() ?? path;
    try {
      const mod = modules[path] as { default: unknown };
      const file = validateLanguageFile(mod.default, fileName);
      const words: WordWithId[] = file.words.map((w, i) => ({
        ...w,
        id: makeWordId(w.word, w.meaning, i),
      }));
      languages.push({ meta: file.meta, words });
    } catch (err) {
      if (err instanceof LanguageFileError) {
        errors.push(err.message);
      } else {
        errors.push(`${fileName}: beklenmeyen hata - ${(err as Error).message}`);
      }
    }
  }

  languages.sort((a, b) => a.meta.name.localeCompare(b.meta.name, "tr"));
  return { languages, errors };
}

const { languages: LANGUAGES, errors: LANGUAGE_ERRORS } = loadLanguages();

export function getLanguages(): LoadedLanguage[] {
  return LANGUAGES;
}

export function getLanguageErrors(): string[] {
  return LANGUAGE_ERRORS;
}

export function getLanguageByCode(code: string): LoadedLanguage | undefined {
  return LANGUAGES.find((l) => l.meta.code === code);
}
