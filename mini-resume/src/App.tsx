import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResumeEditor } from "./store/useResumeStore";
import BasicsSection from "./components/Editor/BasicsSection";
import ExperienceSection from "./components/Editor/ExperienceSection";
import EducationSection from "./components/Editor/EducationSection";
import SkillsSection from "./components/Editor/SkillsSection";
import InterestsSection from "./components/Editor/InterestsSection";
import LanguagesSection from "./components/Editor/LanguagesSection";

import Leafish from "./templates/Leafish";
import Gengar from "./templates/Gengar";
import Castaway from "./templates/Castaway";

import { downloadResumePdf } from "./utils/downloadPdf";

const TEMPLATES: Record<string, React.FC<{ data: any }>> = {
  leafish: Leafish,
  gengar: Gengar,
  castaway: Castaway,
};

const TEMPLATE_LABELS: Record<string, string> = {
  leafish: "🍃 Leafish — Minimalist",
  gengar: "👻 Gengar — Two-Column",
  castaway: "🏝️ Castaway — Sidebar",
};

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resume, updateData, updateName, updateTemplate } = useResumeEditor(id!);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-foreground text-lg font-medium">Resume not found</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    if (!previewRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      // Temporarily remove preview scaling so html2canvas captures at full size
      const wrapper = previewRef.current;
      const prevTransform = wrapper.style.transform;
      wrapper.style.transform = "none";

      const safeName = (resume.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await downloadResumePdf(wrapper, `${safeName}.pdf`);

      // Restore scaling
      wrapper.style.transform = prevTransform;
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const ActiveTemplate = TEMPLATES[resume.template] || Leafish;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top Bar ────────────────────────────────────── */}
      <header className="no-print bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="btn-ghost !px-2 !py-1.5 flex items-center gap-1 text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-border" />

          {/* Logo */}
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">MR</span>
          </div>

          {/* Resume Name */}
          <input
            type="text"
            value={resume.name}
            onChange={(e) => updateName(e.target.value)}
            className="bg-transparent text-foreground text-sm font-medium border-none outline-none placeholder:text-muted w-40 sm:w-56 hover:bg-surface-hover focus:bg-surface-hover px-2 py-1 rounded transition-colors"
            placeholder="Resume name..."
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Template Switcher */}
          <select
            value={resume.template}
            onChange={(e) => updateTemplate(e.target.value)}
            className="bg-surface border border-border rounded-lg px-2 py-1.5 text-xs text-foreground cursor-pointer hover:border-primary transition-colors"
          >
            {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Save Status */}
          <span className="text-[10px] text-muted hidden sm:flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Auto-saved
          </span>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="btn-success text-xs"
            id="download-pdf-btn"
          >
            <span className="flex items-center gap-1.5">
              {isDownloading ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              )}
              {isDownloading ? "Generating…" : "Download PDF"}
            </span>
          </button>

          {/* Print */}
          <button onClick={handlePrint} className="btn-ghost text-xs">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-3 0h.008v.008h-.008V12z" />
              </svg>
              Print
            </span>
          </button>
        </div>
      </header>

      {/* ── Split Screen Layout ────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ── LEFT: Form/Editor Pane ───────────────────── */}
        <aside className="no-print w-full lg:w-[420px] xl:w-[460px] border-r border-border bg-background overflow-y-auto shrink-0">
          <div className="p-4 space-y-4">
            <BasicsSection
              basics={resume.data.basics}
              onChange={(basics) =>
                updateData((prev) => ({ ...prev, basics }))
              }
            />
            <ExperienceSection
              entries={resume.data.experience}
              onChange={(experience) =>
                updateData((prev) => ({ ...prev, experience }))
              }
            />
            <EducationSection
              entries={resume.data.education}
              onChange={(education) =>
                updateData((prev) => ({ ...prev, education }))
              }
            />
            <SkillsSection
              entries={resume.data.skills}
              onChange={(skills) =>
                updateData((prev) => ({ ...prev, skills }))
              }
            />
            <LanguagesSection
              entries={resume.data.languages}
              onChange={(languages) =>
                updateData((prev) => ({ ...prev, languages }))
              }
            />
            <InterestsSection
              entries={resume.data.interests}
              onChange={(interests) =>
                updateData((prev) => ({ ...prev, interests }))
              }
            />
          </div>
        </aside>

        {/* ── RIGHT: Live Preview Pane ─────────────────── */}
        <main className="flex-1 bg-[#1a1a2e] overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full flex items-start justify-center">
            <div
              ref={previewRef}
              className="w-full max-w-[210mm] transform origin-top scale-[0.65] sm:scale-75 lg:scale-[0.8] xl:scale-90"
            >
              <ActiveTemplate data={resume.data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
