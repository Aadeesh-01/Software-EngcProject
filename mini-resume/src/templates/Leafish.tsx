import React from "react";
import type { ResumeData } from "../types/resume";

interface Props {
  data: ResumeData;
}

const PAGE: React.CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  fontSize: "10pt",
  lineHeight: 1.5,
  color: "#1a1a2e",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  overflow: "hidden",
};

const PRIMARY = "#6366f1";

function Heading({ children }: { children: string }) {
  return (
    <h3
      style={{
        fontSize: "11pt",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: PRIMARY,
        borderBottom: `1.5px solid ${PRIMARY}`,
        paddingBottom: 3,
        marginBottom: 8,
      }}
    >
      {children}
    </h3>
  );
}

const LEVEL_MAP: Record<string, number> = {
  Beginner: 1, Basic: 1, Intermediate: 2, Advanced: 3, Fluent: 4, Expert: 4, Native: 5,
};

function LevelDots({ level }: { level: string }) {
  const filled = LEVEL_MAP[level] ?? 2;
  return (
    <span style={{ display: "inline-flex", gap: 2, marginLeft: 6 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: i <= filled ? PRIMARY : "#d1d5db",
          }}
        />
      ))}
    </span>
  );
}

export default function Leafish({ data }: Props) {
  const { basics, experience, education, skills, interests, languages } = data;

  const hasContent =
    basics.name || basics.headline || experience.length > 0 || education.length > 0;

  const contacts = [basics.email, basics.phone, basics.location].filter(Boolean);

  if (!hasContent) {
    return (
      <div style={{ ...PAGE, display: "flex", alignItems: "center", justifyContent: "center", height: "297mm" }}>
        <div style={{ textAlign: "center", color: "#aaa" }}>
          <p style={{ fontSize: "12pt", fontWeight: 500 }}>Start filling in your details</p>
          <p style={{ fontSize: "9pt", marginTop: 4 }}>Your resume will appear here in real time</p>
        </div>
      </div>
    );
  }

  return (
    <div style={PAGE}>
      {/* ── Header ────────────────────────────────────── */}
      <header style={{ backgroundColor: PRIMARY, color: "#fff", padding: "28px 32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {basics.photo && (
            <img
              src={basics.photo}
              alt=""
              style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }}
            />
          )}
          <div>
            <h1 style={{ fontSize: "22pt", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              {basics.name || "Your Name"}
            </h1>
            {basics.headline && <p style={{ fontSize: "10.5pt", opacity: 0.9, marginTop: 2 }}>{basics.headline}</p>}
          </div>
        </div>
        {contacts.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: "8.5pt", opacity: 0.85 }}>
            {basics.email && <span>✉ {basics.email}</span>}
            {basics.phone && <span>☎ {basics.phone}</span>}
            {basics.location && <span>⊙ {basics.location}</span>}
          </div>
        )}
      </header>

      {/* ── Body ──────────────────────────────────────── */}
      <div style={{ padding: "24px 32px 32px" }}>
        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <Heading>Experience</Heading>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "10.5pt" }}>{exp.company}</span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>{exp.location}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "9pt", fontStyle: "italic", color: "#444" }}>{exp.position}</span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>
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
          <section style={{ marginBottom: 20 }}>
            <Heading>Education</Heading>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: "10.5pt" }}>{edu.institution}</span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>{edu.gpa && `GPA: ${edu.gpa}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "9pt", fontStyle: "italic", color: "#444" }}>
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </span>
                  <span style={{ fontSize: "8.5pt", color: "#666" }}>
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

        {/* Skills — pill grid */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <Heading>Skills</Heading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: "8.5pt",
                    fontWeight: 500,
                    backgroundColor: `${PRIMARY}18`,
                    color: PRIMARY,
                    border: `1px solid ${PRIMARY}40`,
                  }}
                >
                  {s.name}
                  <LevelDots level={s.level} />
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <Heading>Languages</Heading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px" }}>
              {languages.map((l) => (
                <span key={l.id} style={{ fontSize: "9pt", display: "inline-flex", alignItems: "center" }}>
                  {l.name} <LevelDots level={l.level} />
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <Heading>Interests</Heading>
            <p style={{ fontSize: "9pt", color: "#555" }}>
              {interests.map((i) => i.name).filter(Boolean).join(" · ")}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
