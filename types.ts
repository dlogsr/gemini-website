export interface Project {
  id: string;
  title: string;
  role: string;
  year?: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  logo?: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
  logo: string;
  description: string[];
}

export interface SkillMetric {
  subject: string;
  A: number; // Proficiency score
  fullMark: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  PRESS = 'press',
  PHOTOGRAPHY = 'photography',
  CONTACT = 'contact'
}

declare global {
  interface WindowEventMap {
    'trigger-ai-chat': CustomEvent<{ message: string }>;
  }
  interface Window {
    process: {
      env: {
        [key: string]: string | undefined;
      };
    };
  }
}
