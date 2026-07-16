import { useEffect, useState } from "react";
import type { LoadedLanguage } from "./types/language";
import type { Profile } from "./types/profile";
import {
  clearActiveProfile,
  getActiveLanguageCode,
  getActiveProfile,
  setActiveLanguageCode,
  setActiveProfile,
} from "./lib/profiles";
import { getLanguageByCode } from "./lib/languages";
import { warmUpSpeech } from "./lib/tts";
import ProfileSelect from "./screens/ProfileSelect";
import LanguageSelect from "./screens/LanguageSelect";
import Home, { type Screen } from "./screens/Home";
import Flashcards from "./screens/Flashcards";
import Quiz from "./screens/Quiz";
import ProgressScreen from "./screens/Progress";
import "./App.css";

type View = "profile" | "language" | Screen | "home";

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(() => getActiveProfile());
  const [language, setLanguage] = useState<LoadedLanguage | null>(() => {
    const p = getActiveProfile();
    if (!p) return null;
    const code = getActiveLanguageCode(p.id);
    return code ? (getLanguageByCode(code) ?? null) : null;
  });
  const [view, setView] = useState<View>(() => {
    const p = getActiveProfile();
    if (!p) return "profile";
    const code = getActiveLanguageCode(p.id);
    return code && getLanguageByCode(code) ? "home" : "language";
  });

  useEffect(() => {
    warmUpSpeech();
  }, []);

  useEffect(() => {
    document.documentElement.dir = language ? language.meta.direction : "ltr";
  }, [language]);

  useEffect(() => {
    if (profile) {
      document.documentElement.dataset.mode = profile.mode;
    } else {
      delete document.documentElement.dataset.mode;
    }
  }, [profile]);

  function handleProfileSelected(p: Profile) {
    setActiveProfile(p.id);
    setProfile(p);
    const code = getActiveLanguageCode(p.id);
    const existing = code ? getLanguageByCode(code) : undefined;
    if (existing) {
      setLanguage(existing);
      setView("home");
    } else {
      setView("language");
    }
  }

  function handleLanguageSelected(lang: LoadedLanguage) {
    if (profile) setActiveLanguageCode(profile.id, lang.meta.code);
    setLanguage(lang);
    setView("home");
  }

  function handleChangeProfile() {
    clearActiveProfile();
    setProfile(null);
    setLanguage(null);
    setView("profile");
  }

  if (view === "profile" || !profile) {
    return <ProfileSelect onSelect={handleProfileSelected} />;
  }

  if (view === "language" || !language) {
    return <LanguageSelect profileName={profile.name} onSelect={handleLanguageSelected} />;
  }

  if (view === "flashcards") {
    return <Flashcards language={language} onBack={() => setView("home")} />;
  }

  if (view === "quiz") {
    return <Quiz profile={profile} language={language} onBack={() => setView("home")} />;
  }

  if (view === "progress") {
    return <ProgressScreen profile={profile} language={language} onBack={() => setView("home")} />;
  }

  return (
    <Home
      profile={profile}
      language={language}
      onNavigate={(screen) => setView(screen)}
      onChangeLanguage={() => setView("language")}
      onChangeProfile={handleChangeProfile}
    />
  );
}
