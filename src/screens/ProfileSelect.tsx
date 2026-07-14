import { useState } from "react";
import type { Profile } from "../types/profile";
import { createProfile, deleteProfile, getProfiles } from "../lib/profiles";

interface ProfileSelectProps {
  onSelect: (profile: Profile) => void;
}

export default function ProfileSelect({ onSelect }: ProfileSelectProps) {
  const [profiles, setProfiles] = useState<Profile[]>(getProfiles());
  const [name, setName] = useState("");

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profile = createProfile(trimmed);
    setProfiles(getProfiles());
    setName("");
    onSelect(profile);
  }

  function handleDelete(id: string) {
    deleteProfile(id);
    setProfiles(getProfiles());
  }

  return (
    <div className="screen screen--center">
      <h1 className="app-title">AY Lingo</h1>
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
        <button type="button" className="btn btn--primary" onClick={handleCreate}>
          Profil Oluştur
        </button>
      </div>
    </div>
  );
}
