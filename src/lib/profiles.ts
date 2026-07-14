import type { Profile } from "../types/profile";

const PROFILES_KEY = "ay-lingo:profiles";
const ACTIVE_PROFILE_KEY = "ay-lingo:active-profile";

function readProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Profile[]) : [];
  } catch {
    return [];
  }
}

function writeProfiles(profiles: Profile[]): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getProfiles(): Profile[] {
  return readProfiles();
}

export function createProfile(name: string): Profile {
  const profiles = readProfiles();
  const profile: Profile = {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  profiles.push(profile);
  writeProfiles(profiles);
  return profile;
}

export function deleteProfile(id: string): void {
  writeProfiles(readProfiles().filter((p) => p.id !== id));
  if (getActiveProfileId() === id) {
    clearActiveProfile();
  }
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfile(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function clearActiveProfile(): void {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}

export function getActiveProfile(): Profile | null {
  const id = getActiveProfileId();
  if (!id) return null;
  return readProfiles().find((p) => p.id === id) ?? null;
}

function activeLanguageKey(profileId: string): string {
  return `ay-lingo:active-language:${profileId}`;
}

export function getActiveLanguageCode(profileId: string): string | null {
  return localStorage.getItem(activeLanguageKey(profileId));
}

export function setActiveLanguageCode(profileId: string, code: string): void {
  localStorage.setItem(activeLanguageKey(profileId), code);
}
