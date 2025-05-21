export interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  isPro: boolean;
  colors: ColorOption[];
  styles?: {
    fontFamily?: string;
    spacing?: 'compact' | 'standard' | 'spacious';
    layout?: 'traditional' | 'modern' | 'creative';
  };
  sections: string[];
}

export interface ColorOption {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent?: string;
}

export interface ResumeSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'skills' | 'education' | 'experience';
  required?: boolean;
  fields?: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
  }[];
}

export interface ResumeData {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  templateId: string;
  colorId?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    title: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages?: { language: string; proficiency: string }[];
  certifications?: { name: string; issuer: string; date: string; }[];
  expertise?: string[];
  honors?: { title: string; issuer: string; date: string; description?: string; }[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}