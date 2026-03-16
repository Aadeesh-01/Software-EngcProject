import React from "react";
import type { ResumeData } from "../../types/resume";

interface Props {
  data: ResumeData;
}

export default function ResumePreview({ data }: Props) {
  const { basics, experience, education } = data;
  const hasContent =
    basics.name ||
    basics.email ||
    experience.length > 0 ||
    education.length > 0;

  return (
    <div className="resume-preview bg-white text-gray-900 w-full max-w-[210mm] mx-auto shadow-2xl rounded-sm min-h-[297mm] relative overflow-hidden">
      {/* ── Header / Basics ───────────────────────────── */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-6">
        <div className="flex items-center gap-5">
          {basics.photo && (
            <img
              src={basics.photo}
              alt={basics.name || "Profile"}
              className="w-20 h-20 rounded-full object-cover border-3 border-white/30 shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold leading-tight">
              {basics.name || "Your Name"}
            </h1>
            {basics.headline && (
              <p className="text-indigo-100 text-sm mt-0.5 font-medium">
                {basics.headline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-indigo-100">
              {basics.email && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {basics.email}
                </span>
              )}
              {basics.phone && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {basics.phone}
                </span>
              )}
              {basics.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  {basics.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body Content ──────────────────────────────── */}
      <div className="px-8 py-6 space-y-6">
        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 border-b-2 border-indigo-100 pb-1.5 mb-4">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {exp.position || "Position"}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        {exp.company || "Company"}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {exp.startDate || "Start"} —{" "}
                      {exp.current ? "Present" : exp.endDate || "End"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 border-b-2 border-indigo-100 pb-1.5 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {edu.institution || "Institution"}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        {edu.degree || "Degree"}
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && ` · ${edu.gpa} GPA`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {edu.startDate || "Start"} — {edu.endDate || "End"}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-sm font-medium">Start filling in your details</p>
            <p className="text-xs mt-1">
              Your resume will appear here in real time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
