import { Template, ColorOption } from "@/types/resume";

// Define color options that can be applied to templates
const COLORS: Record<string, ColorOption[]> = {
  professional: [
    { id: 'blue', name: 'Professional Blue', primary: '#2563eb', secondary: '#93c5fd' },
    { id: 'teal', name: 'Teal Accent', primary: '#0d9488', secondary: '#5eead4' },
    { id: 'purple', name: 'Royal Purple', primary: '#7e22ce', secondary: '#d8b4fe' },
    { id: 'gray', name: 'Executive Gray', primary: '#4b5563', secondary: '#cbd5e1' },
  ],
  medical: [
    { id: 'medical-blue', name: 'Medical Blue', primary: '#0284c7', secondary: '#7dd3fc' },
    { id: 'medical-green', name: 'Medical Green', primary: '#059669', secondary: '#6ee7b7' },
    { id: 'medical-purple', name: 'Medical Purple', primary: '#7c3aed', secondary: '#c4b5fd' },
  ],
  tech: [
    { id: 'tech-blue', name: 'Tech Blue', primary: '#3b82f6', secondary: '#93c5fd' },
    { id: 'tech-purple', name: 'Tech Purple', primary: '#8b5cf6', secondary: '#c4b5fd' },
    { id: 'tech-dark', name: 'Tech Dark', primary: '#1e293b', secondary: '#94a3b8' },
  ],
  retail: [
    { id: 'retail-green', name: 'Retail Green', primary: '#10b981', secondary: '#6ee7b7' },
    { id: 'retail-blue', name: 'Retail Blue', primary: '#0ea5e9', secondary: '#7dd3fc' },
    { id: 'retail-orange', name: 'Retail Orange', primary: '#f59e0b', secondary: '#fcd34d' },
  ],
  project: [
    { id: 'project-blue', name: 'Project Blue', primary: '#0369a1', secondary: '#7dd3fc' },
    { id: 'project-green', name: 'Project Green', primary: '#15803d', secondary: '#86efac' },
    { id: 'project-purple', name: 'Project Purple', primary: '#6d28d9', secondary: '#c4b5fd' },
  ],
  executive: [
    { id: 'executive-blue', name: 'Executive Blue', primary: '#1e40af', secondary: '#93c5fd' },
    { id: 'executive-gray', name: 'Executive Gray', primary: '#334155', secondary: '#cbd5e1' },
    { id: 'executive-gold', name: 'Executive Gold', primary: '#b45309', secondary: '#fcd34d' },
  ],
};

// Template data
const TEMPLATES: Template[] = [
  // Medical Assistant Template
  {
    id: 'medical-assistant',
    name: 'Medical Assistant',
    description: 'Professional template optimized for healthcare and medical positions',
    previewImage: '/templates/medical-assistant.png',
    isPro: false,
    colors: COLORS.medical,
    styles: {
      fontFamily: 'serif',
      spacing: 'standard',
      layout: 'traditional'
    },
    sections: [
      'personalInfo',
      'summary',
      'workExperience',
      'education',
      'skills',
      'certifications',
      'languages'
    ]
  },

  // IT Professional Template
  {
    id: 'it-professional',
    name: 'IT Professional',
    description: 'Modern template for IT and technology roles',
    previewImage: '/templates/it-professional.png',
    isPro: false,
    colors: COLORS.tech,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'compact',
      layout: 'modern'
    },
    sections: [
      'personalInfo',
      'summary',
      'expertise',
      'workExperience',
      'certifications',
      'education',
      'languages'
    ]
  },

  // Retail Professional Template
  {
    id: 'retail-professional',
    name: 'Retail Professional',
    description: 'Clean template for retail and customer service positions',
    previewImage: '/templates/retail-professional.png',
    isPro: false,
    colors: COLORS.retail,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'standard',
      layout: 'modern'
    },
    sections: [
      'personalInfo',
      'summary',
      'skills',
      'workExperience',
      'certifications',
      'education'
    ]
  },

  // Project Manager Template
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Professional template for project management roles',
    previewImage: '/templates/project-manager.png',
    isPro: false,
    colors: COLORS.project,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'standard',
      layout: 'modern'
    },
    sections: [
      'personalInfo',
      'summary',
      'expertise',
      'workExperience',
      'certifications',
      'education',
      'languages'
    ]
  },

  // Executive Template
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium template for senior executives and leaders',
    previewImage: '/templates/executive.png',
    isPro: false,
    colors: COLORS.executive,
    styles: {
      fontFamily: 'serif',
      spacing: 'spacious',
      layout: 'traditional'
    },
    sections: [
      'personalInfo',
      'summary',
      'workExperience',
      'expertise',
      'education',
      'honors',
      'languages'
    ]
  },

  // Add the existing templates here...
  // (Keep your existing template definitions)
];

export type { Template, ColorOption };
export default TEMPLATES;