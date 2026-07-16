export interface SpeakHandlers {
  onStart?: () => void;
  onEnd?: () => void;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let warmedUp = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function refreshVoices(): void {
  if (!isSpeechSupported()) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) cachedVoices = voices;
}

/**
 * Primes the speech engine as soon as the app opens, so the first real press
 * of a speaker button doesn't pay the engine's cold-start latency. Voice
 * lists load asynchronously on some browsers (notably mobile), so we also
 * listen for `voiceschanged` to pick them up once they arrive.
 */
export function warmUpSpeech(): void {
  if (!isSpeechSupported() || warmedUp) return;
  warmedUp = true;

  refreshVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);

  try {
    const primer = new SpeechSynthesisUtterance(" ");
    primer.volume = 0;
    primer.rate = 10;
    window.speechSynthesis.speak(primer);
  } catch {
    // Some browsers (e.g. iOS Safari) block synthesis before any user
    // gesture — the next real speak() call still works once permitted.
  }
}

function scoreVoice(voice: SpeechSynthesisVoice, langCode: string): number {
  const voiceLang = voice.lang.toLowerCase();
  const wanted = langCode.toLowerCase();
  const wantedBase = wanted.split("-")[0];

  if (voiceLang === wanted) {
    // exact match, e.g. requested en-US and voice is en-US
  } else if (voiceLang.split("-")[0] === wantedBase) {
    // same base language, different region
  } else {
    return -1;
  }

  let score = voiceLang === wanted ? 100 : 50;
  if (wantedBase === "en" && (voiceLang === "en-us" || voiceLang === "en-gb")) score += 20;
  if (!voice.localService) score += 10; // network voices are usually more natural
  if (/natural|enhanced|premium|google/i.test(voice.name)) score += 15;
  if (voice.default) score += 5;
  return score;
}

function pickBestVoice(langCode: string): SpeechSynthesisVoice | undefined {
  refreshVoices();
  let best: SpeechSynthesisVoice | undefined;
  let bestScore = -1;
  for (const voice of cachedVoices) {
    const score = scoreVoice(voice, langCode);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }
  return best;
}

export function speak(text: string, langCode: string, handlers?: SpeakHandlers): void {
  if (!isSpeechSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // overlap protection — stop whatever is currently playing first

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.9;
  const voice = pickBestVoice(langCode);
  if (voice) utterance.voice = voice;

  let ended = false;
  function finish() {
    if (ended) return;
    ended = true;
    handlers?.onEnd?.();
  }

  utterance.onstart = () => handlers?.onStart?.();
  utterance.onend = finish;
  utterance.onerror = finish;

  // Safety net: some browsers/voice configurations never fire onend/onerror
  // (observed when the requested language has no matching installed voice).
  // Without this, a speaker button could stay stuck in "playing" forever.
  window.setTimeout(finish, 6000);

  currentUtterance = utterance;
  // Chrome occasionally drops speak() if it's called in the same tick as
  // cancel(); deferring one tick makes the queued utterance reliably start.
  window.setTimeout(() => {
    if (currentUtterance === utterance) synth.speak(utterance);
  }, 0);
}
