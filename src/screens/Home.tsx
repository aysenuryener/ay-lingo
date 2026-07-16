import type { LoadedLanguage } from "../types/language";
import type { Profile } from "../types/profile";
import HomeAdult from "./HomeAdult";
import HomeChild from "./HomeChild";

export type Screen = "flashcards" | "quiz" | "progress";

interface HomeProps {
  profile: Profile;
  language: LoadedLanguage;
  onNavigate: (screen: Screen) => void;
  onChangeLanguage: () => void;
  onChangeProfile: () => void;
}

export default function Home(props: HomeProps) {
  if (props.profile.mode === "cocuk") {
    return <HomeChild {...props} />;
  }
  return <HomeAdult {...props} />;
}
