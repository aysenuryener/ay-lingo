import type { LanguageFile, LanguageMeta, Word, WordLevel } from "../types/language";

const LEVELS: WordLevel[] = ["baslangic", "orta", "ileri"];
const DIRECTIONS = ["ltr", "rtl"];

class LanguageFileError extends Error {}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function validateMeta(raw: unknown, fileName: string): LanguageMeta {
  if (typeof raw !== "object" || raw === null) {
    throw new LanguageFileError(`${fileName}: "meta" bloğu bulunamadı veya geçersiz.`);
  }
  const meta = raw as Record<string, unknown>;
  const problems: string[] = [];

  if (!isNonEmptyString(meta.code)) problems.push('"code" (dil kodu, örn. "en") eksik veya boş');
  if (!isNonEmptyString(meta.name)) problems.push('"name" (Türkçe görünen ad, örn. "İngilizce") eksik veya boş');
  if (!isNonEmptyString(meta.nativeName)) problems.push('"nativeName" (dilin kendi adı) eksik veya boş');
  if (!isNonEmptyString(meta.bcp47)) problems.push('"bcp47" (örn. "en-US") eksik veya boş');
  if (!isNonEmptyString(meta.speechLang)) problems.push('"speechLang" eksik veya boş');
  if (!isNonEmptyString(meta.direction) || !DIRECTIONS.includes(meta.direction as string)) {
    problems.push('"direction" değeri "ltr" ya da "rtl" olmalı');
  }

  if (problems.length > 0) {
    throw new LanguageFileError(
      `${fileName}: dosyanın "meta" bloğunda sorunlar var:\n- ${problems.join("\n- ")}`
    );
  }

  return meta as unknown as LanguageMeta;
}

function validateWord(raw: unknown, index: number, fileName: string): Word {
  if (typeof raw !== "object" || raw === null) {
    throw new LanguageFileError(`${fileName}: words[${index}] bir nesne (object) değil.`);
  }
  const w = raw as Record<string, unknown>;
  const problems: string[] = [];

  if (!isNonEmptyString(w.word)) problems.push('"word" eksik veya boş');
  if (!isNonEmptyString(w.reading)) problems.push('"reading" eksik veya boş');
  if (!isNonEmptyString(w.meaning)) problems.push('"meaning" eksik veya boş');
  if (!isNonEmptyString(w.category)) problems.push('"category" eksik veya boş');
  if (!isString(w.emoji)) problems.push('"emoji" alanı metin (string) olmalı (boş olabilir)');
  if (!isString(w.image)) problems.push('"image" alanı metin (string) olmalı (boş olabilir)');
  if (!isNonEmptyString(w.level) || !LEVELS.includes(w.level as WordLevel)) {
    problems.push('"level" değeri "baslangic", "orta" veya "ileri" olmalı');
  }

  if (problems.length > 0) {
    throw new LanguageFileError(
      `${fileName}: words[${index}] (${isNonEmptyString(w.word) ? w.word : "isimsiz kelime"}) içinde sorunlar var:\n- ${problems.join("\n- ")}`
    );
  }

  return w as unknown as Word;
}

/**
 * Validates a raw parsed JSON value against the language-file schema.
 * Throws a LanguageFileError with a human-readable (Turkish) message on the
 * first structural problem found, naming the offending file.
 */
export function validateLanguageFile(raw: unknown, fileName: string): LanguageFile {
  if (typeof raw !== "object" || raw === null) {
    throw new LanguageFileError(`${fileName}: dosyanın kökü bir JSON nesnesi olmalı.`);
  }
  const data = raw as Record<string, unknown>;
  const meta = validateMeta(data.meta, fileName);

  if (!Array.isArray(data.words)) {
    throw new LanguageFileError(`${fileName}: "words" bir dizi (array) olmalı.`);
  }
  const words = data.words.map((w, i) => validateWord(w, i, fileName));

  return { meta, words };
}

export { LanguageFileError };
