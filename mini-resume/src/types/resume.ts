export interface Basics {
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  photo: string; 
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  level: string; 
}

export interface InterestEntry {
  id: string;
  name: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  level: string; 
}

export interface ResumeData {
  basics: Basics;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillEntry[];
  interests: InterestEntry[];
  languages: LanguageEntry[];
}

export interface Resume {
  id: string;
  name: string;
  slug: string;
  data: ResumeData;
  template: string; 
  createdAt: string;
  updatedAt: string;
}


export const defaultBasics: Basics = {
  name: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  photo: "",
};

export const defaultResumeData: ResumeData = {
  basics: { ...defaultBasics },
  experience: [],
  education: [],
  skills: [],
  interests: [],
  languages: [],
};

export function createId(): string {
  return crypto.randomUUID();
}

export function createResume(name: string = "Untitled Resume"): Resume {
  const id = createId();
  const now = new Date().toISOString();
  return {
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    data: { ...defaultResumeData, basics: { ...defaultBasics } },
    template: "leafish",
    createdAt: now,
    updatedAt: now,
  };
}
