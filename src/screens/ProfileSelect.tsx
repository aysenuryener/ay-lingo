import { useState } from "react";
import type { Profile } from "../types/profile";
import { createProfile, deleteProfile, getProfiles } from "../lib/profiles";

interface ProfileSelectProps {
  onSelect: (profile: Profile) => void;
}

const FLOATIES = Array.from({ length: 14 }, (_, i) => i);

export default function ProfileSelect({ onSelect }: ProfileSelectProps) {
  const [profiles, setProfiles] = useState<Profile[]>(getProfiles());
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const canCreate = name.trim().length > 0 && age !== "" && Number(age) > 0;

  function handleCreate() {
    const trimmed = name.trim();
    const parsedAge = Number(age);
    if (!trimmed || !Number.isFinite(parsedAge) || parsedAge <= 0) return;
    const profile = createProfile(trimmed, Math.round(parsedAge));
    setProfiles(getProfiles());
    setName("");
    setAge("");
    onSelect(profile);
  }

  function handleDelete(id: string) {
    deleteProfile(id);
    setProfiles(getProfiles());
  }

  return (
    <div className="screen screen--center cover-screen">
      <div className="cover-bg" aria-hidden="true">
        {FLOATIES.map((i) => (
          <span key={i} className={`cover-bg__item cover-bg__item--${i % 4}`} />
        ))}
      </div>
      <h1 className="app-title">AY Lingo</h1>
      <p className="app-slogan">Eğlenerek Öğren! 🎉</p>
      <p className="subtitle">Kimsin? Profilini seç ya da yeni bir profil oluştur.</p>

      <div className="profile-list">
        {profiles.map((p) => (
          <div key={p.id} className="profile-row">
            <button type="button" className="profile-chip" onClick={() => onSelect(p)}>
              <span className="profile-chip__avatar">{p.name.charAt(0).toUpperCase()}</span>
              <span>{p.name}</span>
            </button>
            <button
              type="button"
              className="icon-button-danger"
              aria-label={`${p.name} profilini sil`}
              onClick={() => handleDelete(p.id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="new-profile-form">
        <input
          className="text-input"
          placeholder="Yeni profil adı (örn. Ayşe)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          maxLength={24}
        />
        <input
          className="text-input"
          type="number"
          inputMode="numeric"
          placeholder="Yaşın (örn. 9)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          min={1}
          max={99}
        />
        <button type="button" className="btn btn--primary" disabled={!canCreate} onClick={handleCreate}>
          Profil Oluştur
        </button>
      </div>
    </div>
  );
}
