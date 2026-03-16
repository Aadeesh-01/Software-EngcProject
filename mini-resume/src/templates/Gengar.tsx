import React from "react";
import type { ResumeData } from "../types/resume";

interface Props {
  data: ResumeData;
}

const ACCENT = "#a855f7"; // purple-500
const SIDEBAR_BG = "#1e1b2e";
const SIDEBAR_TEXT = "#e2e0ea";
const SIDEBAR_MUTED = "#9e9bb0";
const MAIN_BG = "#ffffff";
const MAIN_TEXT = "#1a1a2e";
const MAIN_MUTED = "#6b7280";

const PAGE: React.CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  display: "flex",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  fontSize: "10pt",
  lineHeight: 1.5,
  overflow: "hidden",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
};

/* ── Level bar (horizontal) ───────────────────────────── */
const LEVEL_MAP: Record<string, number> = {
  Beginner: 20, Basic: 20, Intermediate: 45, Advanced: 70, Fluent: 85, Expert: 95, Native: 100,
};

function LevelBar({ level }: { level: string }) {
  const pct = LEVEL_MAP[level] ?? 40;
  return (
    <div style={{ width: "100%", height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.15)", marginTop: 3 }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, backgroundColor: ACCENT, transition: "width 0.3s" }} />
    </div>
  );
}

function SideHeading({ children }: { children: string }) {
  return (
    <h4 style={{
      fontSize: "9pt", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em",
      color: ACCENT, marginBottom: 8, borderBottom: `1px solid ${ACCENT}40`, paddingBottom: 4,
    }}>
      {children}
    </h4>
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

export default function Gengar({ data }: Props) {
  const { basics, experience, education, skills, interests, languages } = data;

  const hasContent = basics.name || basics.headline || experience.length > 0 || education.length > 0;

  if (!hasContent) {
    return (
      <div style={{ ...PAGE, alignItems: "center", justifyContent: "center", backgroundColor: MAIN_BG }}>
        <div style={{ textAlign: "center", color: "#aaa" }}>
          <p style={{ fontSize: "12pt", fontWeight: 500 }}>Start filling in your details</p>
          <p style={{ fontSize: "9pt", marginTop: 4 }}>Your resume will appear here in real time</p>
        </div>
      </div>
    );
  }

  return (
    <div style={PAGE}>
      {/* ── LEFT SIDEBAR (~35%) ─────────────────────── */}
      <aside style={{
        width: "35%", backgroundColor: SIDEBAR_BG, color: SIDEBAR_TEXT,
        padding: "28px 22px", display: "flex", flexDirection: "column", gap: 20, flexShrink: 0,
      }}>
        {/* Photo */}
        {basics.photo && (
          <div style={{ textAlign: "center" }}>
            <img
              src={basics.photo}
              alt=""
              style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: `3px solid ${ACCENT}` }}
            />
          </div>
        )}

        {/* Contact */}
        <div>
          <SideHeading>Contact</SideHeading>
          <div style={{ fontSize: "8.5pt", display: "flex", flexDirection: "column", gap: 6, color: SIDEBAR_MUTED }}>
            {basics.email && <span>✉ {basics.email}</span>}
            {basics.phone && <span>☎ {basics.phone}</span>}
            {basics.location && <span>⊙ {basics.location}</span>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <SideHeading>Skills</SideHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {skills.map((s) => (
                <div key={s.id}>
                  <span style={{ fontSize: "9pt" }}>{s.name}</span>
                  <LevelBar level={s.level} />
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
                <div key={l.id}>
                  <span style={{ fontSize: "9pt" }}>{l.name}</span>
                  <LevelBar level={l.level} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div>
            <SideHeading>Interests</SideHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {interests.map((i) => (
                <span
                  key={i.id}
                  style={{
                    fontSize: "8pt", padding: "2px 8px", borderRadius: 999,
                    backgroundColor: `${ACCENT}25`, color: ACCENT, border: `1px solid ${ACCENT}40`,
                  }}
                >
                  {i.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── RIGHT MAIN AREA (~65%) ─────────────────── */}
      <main style={{
        flex: 1, backgroundColor: MAIN_BG, color: MAIN_TEXT, padding: "28px 28px 32px",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        {/* Name + Headline */}
        <div>
          <h1 style={{ fontSize: "24pt", fontWeight: 700, lineHeight: 1.15, margin: 0, color: MAIN_TEXT }}>
            {basics.name || "Your Name"}
          </h1>
          {basics.headline && (
            <p style={{ fontSize: "11pt", color: ACCENT, marginTop: 4, fontWeight: 500 }}>{basics.headline}</p>
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
                  <span style={{ fontSize: "9pt", fontStyle: "italic", color: "#444" }}>{exp.position}</span>
                  <span style={{ fontSize: "8.5pt", color: MAIN_MUTED }}>
                    {exp.startDate && `${exp.startDate} — ${exp.current ? "Present" : exp.endDate}`}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontSize: "9pt", color: "#555", marginTop: 4, whiteSpace: "pre-line" }}>{exp.description}</p>
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
                  <span style={{ fontSize: "9pt", fontStyle: "italic", color: "#444" }}>
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </span>
                  <span style={{ fontSize: "8.5pt", color: MAIN_MUTED }}>
                    {edu.startDate && `${edu.startDate} — ${edu.endDate}`}
                  </span>
                </div>
                {edu.description && (
                  <p style={{ fontSize: "9pt", color: "#555", marginTop: 4, whiteSpace: "pre-line" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
