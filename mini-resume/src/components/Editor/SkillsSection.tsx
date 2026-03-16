import React from "react";
import type { SkillEntry } from "../../types/resume";
import { createId } from "../../types/resume";

interface Props {
  entries: SkillEntry[];
  onChange: (entries: SkillEntry[]) => void;
}

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

function emptyEntry(): SkillEntry {
  return { id: createId(), name: "", level: "Intermediate" };
}

export default function SkillsSection({ entries, onChange }: Props) {
  const addEntry = () => onChange([...entries, emptyEntry()]);

  const removeEntry = (id: string) =>
    onChange(entries.filter((e) => e.id !== id));

  const updateEntry = (id: string, field: keyof SkillEntry, value: string) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          Skills
        </h2>
        <button onClick={addEntry} className="btn-ghost text-xs !px-2 !py-1">
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-lg">
          No skills yet. Click <strong>+ Add</strong> to get started.
        </p>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-2 bg-background border border-border rounded-lg p-2 animate-slide-up"
          >
            <input
              type="text"
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, "name", e.target.value)}
              placeholder="e.g. React, Python…"
              className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted outline-none min-w-0"
            />
            <select
              value={entry.level}
              onChange={(e) => updateEntry(entry.id, "level", e.target.value)}
              className="bg-surface border border-border rounded px-2 py-1 text-xs text-foreground cursor-pointer"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <button
              onClick={() => removeEntry(entry.id)}
              className="text-red-400 hover:text-red-300 text-xs shrink-0 px-1"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
