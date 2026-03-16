import React from "react";
import type { InterestEntry } from "../../types/resume";
import { createId } from "../../types/resume";

interface Props {
  entries: InterestEntry[];
  onChange: (entries: InterestEntry[]) => void;
}

function emptyEntry(): InterestEntry {
  return { id: createId(), name: "" };
}

export default function InterestsSection({ entries, onChange }: Props) {
  const addEntry = () => onChange([...entries, emptyEntry()]);

  const removeEntry = (id: string) =>
    onChange(entries.filter((e) => e.id !== id));

  const updateEntry = (id: string, name: string) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, name } : e)));
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Interests
        </h2>
        <button onClick={addEntry} className="btn-ghost text-xs !px-2 !py-1">
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-lg">
          No interests yet. Click <strong>+ Add</strong> to get started.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-1.5 bg-background border border-border rounded-full pl-3 pr-1.5 py-1 animate-slide-up"
          >
            <input
              type="text"
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, e.target.value)}
              placeholder="e.g. Photography"
              className="bg-transparent border-none text-sm text-foreground placeholder:text-muted outline-none w-28"
            />
            <button
              onClick={() => removeEntry(entry.id)}
              className="text-red-400 hover:text-red-300 text-xs shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-500/10"
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
