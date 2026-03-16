import React from "react";
import type { ResumeData } from "../types/resume";

interface Props {
  data: ResumeData;
}

const ACCENT = "#0ea5e9"; // sky-500
const SIDEBAR_BG = "#f0f9ff"; // sky-50
const SIDEBAR_BORDER = "#bae6fd"; // sky-200
const MAIN_TEXT = "#0f172a"; // slate-900
const MAIN_MUTED = "#64748b"; // slate-500

const PAGE: React.CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  display: "flex",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  fontSize: "10pt",
  lineHeight: 1.5,
  backgroundColor: "#ffffff",
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
};

const LEVEL_MAP: Record<string, number> = {
  Beginner: 1, Basic: 1, Intermediate: 2, Advanced: 3, Fluent: 4, Expert: 4, Native: 5,
};

function LevelDots({ level, color = ACCENT }: { level: string; color?: string }) {
  const filled = LEVEL_MAP[level] ?? 2;
  return (
    <span style={{ display: "inline-flex", gap: 3, marginLeft: 6 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: i <= filled ? color : "#d1d5db",
          }}
        />
      ))}
    </span>
  );
}

function MainHeading({ children }: { children: string }) {
  return (
    <h3 style={{
      fontSize: "11pt", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
      color: ACCENT, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 3, marginBottom: 10,
    }}>
      {children}
    </h3>
  );
}

function SideHeading({ children }: { children: string }) {
  return (
    <h4 style={{
      fontSize: "9pt", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
      color: ACCENT, marginBottom: 8,
    }}>
      {children}
    </h4>
  );
}

/* ── Main template ────────────────────────────────────── */
export default function Castaway({ data }: Props) {
  const { basics, experience, education, skills, interests, languages } = data;

  const hasContent = basics.name || basics.headline || experience.length > 0 || education.length > 0;

  if (!hasContent) {
    return (
      <div style={{ ...PAGE, alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#aaa" }}>
          <p style={{ fontSize: "12pt", fontWeight: 500 }}>Start filling in your details</p>
          <p style={{ fontSize: "9pt", marginTop: 4 }}>Your resume will appear here in real time</p>
        </div>
      </div>
    );
  }

  return (
    <div style={PAGE}>
      {/* ── LEFT: Main Content (~70%) ──────────────── */}
      <main style={{
        flex: 1, padding: "28px 28px 32px", color: MAIN_TEXT,
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        {/* Name Banner */}
        <div style={{
          borderBottom: `3px solid ${ACCENT}`, paddingBottom: 16,
        }}>
          <h1 style={{ fontSize: "26pt", fontWeight: 700, lineHeight: 1.15, margin: 0, color: MAIN_TEXT }}>
            {basics.name || "Your Name"}
          </h1>
          {basics.headline && (
            <p style={{ fontSize: "11pt", color: MAIN_MUTED, marginTop: 4 }}>{basics.headline}</p>
          )}
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <MainHeading>Experience</MainHeading>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "10.5pt" }}>{exp.company}</span>
                  <span style={{ fontSize: "8.5pt", color: MAIN_MUTED }}>{exp.location}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "9pt", fontStyle: "italic", color: "#64748b" }}>{exp.position}</span>
                  <span style={{ fontSize: "8.5pt", color: MAIN_MUTED }}>
                    {exp.startDate && `${exp.startDate} — ${exp.current ? "Present" : exp.endDate}`}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontSize: "9pt", color: "#475569", marginTop: 4, whiteSpace: "pre-line" }}>{exp.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <MainHeading>Education</MainHeading>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "10.5pt" }}>{edu.institution}</span>
                  <span style={{ fontSize: "8.5pt", color: MAIN_MUTED }}>{edu.gpa && `GPA: ${edu.gpa}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "9pt", fontStyle: "italic", color: "#64748b" }}>
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </span>
                  <span style={{ fontSize: "8.5pt", color: MAIN_MUTED }}>
                    {edu.startDate && `${edu.startDate} — ${edu.endDate}`}
                  </span>
                </div>
                {edu.description && (
                  <p style={{ fontSize: "9pt", color: "#475569", marginTop: 4, whiteSpace: "pre-line" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Interests — footer area */}
        {interests.length > 0 && (
          <section style={{ marginTop: "auto" }}>
            <MainHeading>Interests</MainHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {interests.map((i) => (
                <span
                  key={i.id}
                  style={{
                    fontSize: "8.5pt", padding: "3px 10px", borderRadius: 999,
                    backgroundColor: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}40`,
                    fontWeight: 500,
                  }}
                >
                  {i.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── RIGHT SIDEBAR (~30%) ───────────────────── */}
      <aside style={{
        width: "30%", backgroundColor: SIDEBAR_BG, borderLeft: `1px solid ${SIDEBAR_BORDER}`,
        padding: "28px 20px", display: "flex", flexDirection: "column", gap: 22, flexShrink: 0,
      }}>
        {/* Photo */}
        {basics.photo && (
          <div style={{ textAlign: "center" }}>
            <img
              src={basics.photo}
              alt=""
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${ACCENT}` }}
            />
          </div>
        )}

        {/* Contact */}
        <div>
          <SideHeading>Contact</SideHeading>
          <div style={{ fontSize: "8.5pt", display: "flex", flexDirection: "column", gap: 8, color: "#475569" }}>
            {basics.email && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: ACCENT, fontWeight: 600, fontSize: "9pt" }}>✉</span>
                <span style={{ wordBreak: "break-all" }}>{basics.email}</span>
              </div>
            )}
            {basics.phone && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: ACCENT, fontWeight: 600, fontSize: "9pt" }}>☎</span>
                <span>{basics.phone}</span>
              </div>
            )}
            {basics.location && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ color: ACCENT, fontWeight: 600, fontSize: "9pt" }}>⊙</span>
                <span>{basics.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <SideHeading>Skills</SideHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {skills.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9pt", color: "#334155" }}>{s.name}</span>
                  <LevelDots level={s.level} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <SideHeading>Languages</SideHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {languages.map((l) => (
                <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9pt", color: "#334155" }}>{l.name}</span>
                  <LevelDots level={l.level} />
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
