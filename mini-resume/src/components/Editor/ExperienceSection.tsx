import React from "react";
import type { ExperienceEntry } from "../../types/resume";
import { createId } from "../../types/resume";

interface Props {
  entries: ExperienceEntry[];
  onChange: (entries: ExperienceEntry[]) => void;
}

function emptyEntry(): ExperienceEntry {
  return {
    id: createId(),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export default function ExperienceSection({ entries, onChange }: Props) {
  const addEntry = () => onChange([...entries, emptyEntry()]);

  const removeEntry = (id: string) =>
    onChange(entries.filter((e) => e.id !== id));

  const updateEntry = (
    id: string,
    field: keyof ExperienceEntry,
    value: string | boolean
  ) => {
    onChange(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          Experience
        </h2>
        <button onClick={addEntry} className="btn-ghost text-xs !px-2 !py-1">
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-lg">
          No experience entries yet. Click <strong>+ Add</strong> to get started.
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-background border border-border rounded-lg p-3 animate-slide-up"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted font-medium">
                #{index + 1}
              </span>
              <button
                onClick={() => removeEntry(entry.id)}
                className="btn-danger text-xs !px-2 !py-0.5"
              >
                Remove
              </button>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="Company"
                  value={entry.company}
                  onChange={(v) => updateEntry(entry.id, "company", v)}
                  placeholder="Cascade Studios"
                />
                <Field
                  label="Position"
                  value={entry.position}
                  onChange={(v) => updateEntry(entry.id, "position", v)}
                  placeholder="Senior Developer"
                />
              </div>
              <Field
                label="Location"
                value={entry.location}
                onChange={(v) => updateEntry(entry.id, "location", v)}
                placeholder="Seattle, WA"
              />
              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="Start Date"
                  value={entry.startDate}
                  onChange={(v) => updateEntry(entry.id, "startDate", v)}
                  placeholder="Mar 2022"
                />
                <div>
                  <Field
                    label="End Date"
                    value={entry.current ? "Present" : entry.endDate}
                    onChange={(v) => updateEntry(entry.id, "endDate", v)}
                    placeholder="Present"
                    disabled={entry.current}
                  />
                  <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry.current}
                      onChange={(e) =>
                        updateEntry(entry.id, "current", e.target.checked)
                      }
                      className="w-3 h-3 rounded border-border accent-primary"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Currently working here
                    </span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1 font-medium">
                  Description
                </label>
                <textarea
                  value={entry.description}
                  onChange={(e) =>
                    updateEntry(entry.id, "description", e.target.value)
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted input-focus resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Reusable Field ─────────────────────────────────── */
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function Field({ label, value, onChange, placeholder, disabled }: FieldProps) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1 font-medium">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted input-focus disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </div>
  );
}
