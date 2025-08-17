import React, { useEffect, useState } from "react";
import "./profile-manager.css";

// Storage key
const LS_PROFILES_KEY = "aa_profiles"; // Array<Profile>

// Simple id generator
const uid = () => Math.random().toString(36).slice(2, 10);

// Default allergen list (kann später durch json ersetzt werden)
const DEFAULT_ALLERGENS = [
  "gluten",
  "wheat",
  "rye",
  "barley",
  "oats",
  "milk",
  "lactose",
  "egg",
  "soybeans",
  "peanuts",
  "nuts",
  "almonds",
  "hazelnuts",
  "walnuts",
  "sesame-seeds",
  "celery",
  "mustard",
  "fish",
  "crustaceans",
  "molluscs",
  "lupin",
  "sulphites",
];

// Load from localStorage
function loadProfiles() {
  try {
    const raw = localStorage.getItem(LS_PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Save to localStorage
function saveProfiles(arr) {
  localStorage.setItem(LS_PROFILES_KEY, JSON.stringify(arr));
}

// Profile form
function ProfileForm({ onSave }) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(new Set());

  function toggle(code) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const profile = {
      id: uid(),
      name: name.trim(),
      allergens: [...selected],
    };
    onSave(profile);
    setName("");
    setSelected(new Set());
  }

  return (
    <form onSubmit={submit} className="pm-form">
      <div className="pm-field">
        <label>Profilname</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Nutten"
        />
      </div>

      <div className="pm-field">
        <label>Allergene</label>
        <div className="pm-grid">
          {DEFAULT_ALLERGENS.map((code) => (
            <label
              key={code}
              className={`pm-chip ${selected.has(code) ? "pm-chip--on" : ""}`}
            >
              <input
                type="checkbox"
                checked={selected.has(code)}
                onChange={() => toggle(code)}
              />
              <span>{code}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="pm-btn pm-btn--primary">
        Speichern
      </button>
    </form>
  );
}

// Profile list
function ProfilesList({ profiles, onDelete }) {
  if (profiles.length === 0) {
    return <p className="pm-empty">Noch keine Profile gespeichert.</p>;
  }
  return (
    <div className="pm-list">
      {profiles.map((p) => (
        <div key={p.id} className="pm-card">
          <div className="pm-card-title">
            <h3>{p.name}</h3>
          </div>
          <div className="pm-card-body">
            <strong>Allergene:</strong>{" "}
            {p.allergens.length ? p.allergens.join(", ") : "–"}
          </div>
          <div className="pm-card-actions">
            <button
              className="pm-btn pm-btn--danger"
              onClick={() => onDelete(p.id)}
            >
              Löschen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main component
export default function ProfileManager({ onBack }) {
  const [profiles, setProfiles] = useState(loadProfiles);

  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  function onSave(profile) {
    setProfiles((prev) => [profile, ...prev]);
  }

  function onDelete(id) {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="pm">
      <div className="pm-header">
        <div className="pm-title">Profile</div>
        {onBack && (
          <button className="pm-btn" onClick={onBack}>
            ← Zurück
          </button>
        )}
      </div>

      <ProfileForm onSave={onSave} />
      <ProfilesList profiles={profiles} onDelete={onDelete} />
    </div>
  );
}
