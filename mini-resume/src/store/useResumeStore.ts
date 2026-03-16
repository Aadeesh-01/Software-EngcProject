import { useState, useEffect, useCallback } from "react";
import type { Resume, ResumeData } from "../types/resume";
import { createResume } from "../types/resume";

const STORAGE_KEY = "mini-resume-all";


function migrateResume(r: any): Resume {
  const data = r.data ?? {};
  return {
    ...r,
    template: r.template ?? "leafish",
    data: {
      basics: data.basics ?? { name: "", email: "", phone: "", location: "", headline: "", photo: "" },
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      interests: Array.isArray(data.interests) ? data.interests : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
    },
  };
}


function loadAll(): Resume[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as any[];
      return parsed.map(migrateResume);
    }
  } catch {
    
  }
  return [];
}

function saveAll(resumes: Resume[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}


export function useResumeList() {
  const [resumes, setResumes] = useState<Resume[]>(loadAll);

  useEffect(() => {
    saveAll(resumes);
  }, [resumes]);

  const addResume = useCallback((name: string = "Untitled Resume") => {
    const r = createResume(name);
    setResumes((prev) => [r, ...prev]);
    return r.id;
  }, []);

  const deleteResume = useCallback((id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const duplicateResume = useCallback((id: string) => {
    setResumes((prev) => {
      const source = prev.find((r) => r.id === id);
      if (!source) return prev;
      const copy = createResume(`${source.name} (Copy)`);
      copy.data = JSON.parse(JSON.stringify(source.data));
      copy.template = source.template;
      return [copy, ...prev];
    });
  }, []);

  const renameResume = useCallback((id: string, name: string) => {
    setResumes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, name, slug: name.toLowerCase().replace(/\s+/g, "-"), updatedAt: new Date().toISOString() }
          : r
      )
    );
  }, []);

  return { resumes, addResume, deleteResume, duplicateResume, renameResume };
}


export function useResumeEditor(id: string) {
  const [resume, setResume] = useState<Resume | null>(() => {
    const all = loadAll();
    return all.find((r) => r.id === id) ?? null;
  });

  useEffect(() => {
    if (!resume) return;
    const timeout = setTimeout(() => {
      const all = loadAll();
      const updated = all.map((r) =>
        r.id === resume.id ? { ...resume, updatedAt: new Date().toISOString() } : r
      );
      saveAll(updated);
    }, 400);
    return () => clearTimeout(timeout);
  }, [resume]);

  const updateData = useCallback(
    (updater: (prev: ResumeData) => ResumeData) => {
      setResume((prev) => {
        if (!prev) return prev;
        return { ...prev, data: updater(prev.data), updatedAt: new Date().toISOString() };
      });
    },
    []
  );

  const updateName = useCallback((name: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      return { ...prev, name, slug: name.toLowerCase().replace(/\s+/g, "-"), updatedAt: new Date().toISOString() };
    });
  }, []);

  const updateTemplate = useCallback((template: string) => {
    setResume((prev) => {
      if (!prev) return prev;
      return { ...prev, template, updatedAt: new Date().toISOString() };
    });
  }, []);

  return { resume, updateData, updateName, updateTemplate };
}
