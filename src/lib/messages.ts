/** Celebration messages shown on quiz completion (child mode). `{name}` is replaced with the profile name. */
export const CELEBRATION_MESSAGES: string[] = [
  "{name}, sen bu işte harikasın! 🏆",
  "Süpersin {name}! Yıldızların parlıyor ⭐",
  "Vay canına {name}, çok başarılısın! 🎉",
  "{name}, kelime ustası oluyorsun! 🚀",
  "Harika iş {name}! Böyle devam! 🌟",
  "{name} bugün de öğrenmeye devam etti, aferin! 🥳",
];

/** Encouraging messages shown on a wrong answer (child mode) — never punitive. */
export const ENCOURAGEMENT_MESSAGES: string[] = [
  "Çok yaklaştın, bir daha dene!",
  "Neredeyse! Bir sonrakinde yakalarsın 💪",
  "Sorun değil, öğrenmenin bir parçası bu 🙂",
  "İyi denemeydi! Devam et 🌈",
  "Az kaldı, pes etme! ✨",
];

export function pickRandom(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatCelebration(profileName: string): string {
  return pickRandom(CELEBRATION_MESSAGES).replace("{name}", profileName);
}
