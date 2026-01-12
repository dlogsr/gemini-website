export interface Project {
  id: string;
  title: string;
  role: string; // Added for Credits/Film roles
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
  SKILLS = 'skills',
  PROJECTS = 'projects', // Used for Credits
  PRESS = 'press',
  CONTACT = 'contact'
}