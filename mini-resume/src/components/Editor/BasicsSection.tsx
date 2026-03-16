import React, { useRef } from "react";
import type { Basics } from "../../types/resume";

interface Props {
  basics: Basics;
  onChange: (basics: Basics) => void;
}

export default function BasicsSection({ basics, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof Basics, value: string) => {
    onChange({ ...basics, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update("photo", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    update("photo", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="section-card animate-fade-in">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        Basics
      </h2>

      {/* Photo Upload */}
      <div className="mb-5 flex items-center gap-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-16 h-16 rounded-full bg-surface-hover border-2 border-dashed border-border-light flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden shrink-0"
        >
          {basics.photo ? (
            <img
              src={basics.photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-6 h-6 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Profile Photo</p>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost text-xs !px-2 !py-1"
            >
              Upload
            </button>
            {basics.photo && (
              <button
                onClick={removePhoto}
                className="btn-danger text-xs !px-2 !py-1"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <FieldInput
          label="Full Name"
          value={basics.name}
          onChange={(v) => update("name", v)}
          placeholder="David Kowalski"
        />
        <FieldInput
          label="Headline"
          value={basics.headline}
          onChange={(v) => update("headline", v)}
          placeholder="Game Developer"
        />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput
            label="Email"
            value={basics.email}
            onChange={(v) => update("email", v)}
            placeholder="john@example.com"
            type="email"
          />
          <FieldInput
            label="Phone"
            value={basics.phone}
            onChange={(v) => update("phone", v)}
            placeholder="+1 (555) 291-4756"
            type="tel"
          />
        </div>
        <FieldInput
          label="Location"
          value={basics.location}
          onChange={(v) => update("location", v)}
          placeholder="Seattle, WA"
        />
      </div>
    </div>
  );
}

/* ── Reusable Field Input ───────────────────────────── */
interface FieldInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldInputProps) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1 font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted input-focus"
      />
    </div>
  );
}
