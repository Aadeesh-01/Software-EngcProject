import React from "react";
import type { EducationEntry } from "../../types/resume";
import { createId } from "../../types/resume";

interface Props {
  entries: EducationEntry[];
  onChange: (entries: EducationEntry[]) => void;
}

function emptyEntry(): EducationEntry {
  return {
    id: createId(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
    description: "",
  };
}

export default function EducationSection({ entries, onChange }: Props) {
  const addEntry = () => onChange([...entries, emptyEntry()]);

  const removeEntry = (id: string) =>
    onChange(entries.filter((e) => e.id !== id));

  const updateEntry = (
    id: string,
    field: keyof EducationEntry,
    value: string
  ) => {
    onChange(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning" />
          Education
        </h2>
        <button onClick={addEntry} className="btn-ghost text-xs !px-2 !py-1">
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-lg">
          No education entries yet. Click <strong>+ Add</strong> to get started.
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
              <Field
                label="Institution"
                value={entry.institution}
                onChange={(v) => updateEntry(entry.id, "institution", v)}
                placeholder="University of Washington"
              />
              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="Degree"
                  value={entry.degree}
                  onChange={(v) => updateEntry(entry.id, "degree", v)}
                  placeholder="Bachelor of Science"
                />
                <Field
                  label="Field of Study"
                  value={entry.field}
                  onChange={(v) => updateEntry(entry.id, "field", v)}
                  placeholder="Computer Science"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Field
                  label="Start Date"
                  value={entry.startDate}
                  onChange={(v) => updateEntry(entry.id, "startDate", v)}
                  placeholder="2014"
                />
                <Field
                  label="End Date"
                  value={entry.endDate}
                  onChange={(v) => updateEntry(entry.id, "endDate", v)}
                  placeholder="2018"
                />
                <Field
                  label="GPA"
                  value={entry.gpa}
                  onChange={(v) => updateEntry(entry.id, "gpa", v)}
                  placeholder="3.6"
                />
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
                  placeholder="Relevant coursework, honors, activities..."
                  rows={2}
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
}

function Field({ label, value, onChange, placeholder }: FieldProps) {
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
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted input-focus"
      />
    </div>
  );
}
