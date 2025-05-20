
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
}

export interface ColorOption {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent?: string;
}

// Define color options that can be applied to templates
const COLORS: Record<string, ColorOption[]> = {
  professional: [
    { id: 'blue', name: 'Professional Blue', primary: '#2563eb', secondary: '#93c5fd' },
    { id: 'teal', name: 'Teal Accent', primary: '#0d9488', secondary: '#5eead4' },
    { id: 'purple', name: 'Royal Purple', primary: '#7e22ce', secondary: '#d8b4fe' },
    { id: 'gray', name: 'Executive Gray', primary: '#4b5563', secondary: '#cbd5e1' },
  ],
  creative: [
    { id: 'coral', name: 'Coral Sunset', primary: '#f43f5e', secondary: '#fecdd3' },
    { id: 'emerald', name: 'Vibrant Emerald', primary: '#059669', secondary: '#6ee7b7' },
    { id: 'amber', name: 'Golden Amber', primary: '#d97706', secondary: '#fcd34d' },
    { id: 'indigo', name: 'Deep Indigo', primary: '#4f46e5', secondary: '#c7d2fe' },
  ],
  minimal: [
    { id: 'monochrome', name: 'Monochrome', primary: '#262626', secondary: '#e5e5e5' },
    { id: 'light', name: 'Light Minimal', primary: '#737373', secondary: '#f5f5f5' },
    { id: 'warm', name: 'Warm Gray', primary: '#78716c', secondary: '#f5f5f4' },
    { id: 'cool', name: 'Cool Gray', primary: '#64748b', secondary: '#f1f5f9' },
  ],
}

// Template data
const TEMPLATES: Template[] = [
  { 
    id: 'classic', 
    name: 'Classic', 
    description: 'A timeless template with a professional look', 
    previewImage: '/templates/classic.png', 
    isPro: false,
    colors: COLORS.professional,
    styles: {
      fontFamily: 'serif',
      spacing: 'standard',
      layout: 'traditional'
    }
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Clean and contemporary design', 
    previewImage: '/templates/modern.png', 
    isPro: false,
    colors: [...COLORS.professional, ...COLORS.minimal],
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'spacious',
      layout: 'modern'
    }
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    description: 'Simple and elegant with plenty of white space', 
    previewImage: '/templates/minimal.png', 
    isPro: false,
    colors: COLORS.minimal,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'spacious',
      layout: 'traditional'
    }
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    description: 'Stand out with this unique design', 
    previewImage: '/templates/creative.png', 
    isPro: true,
    colors: COLORS.creative,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'standard',
      layout: 'creative'
    }
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    description: 'Corporate style for senior positions', 
    previewImage: '/templates/professional.png', 
    isPro: true,
    colors: COLORS.professional,
    styles: {
      fontFamily: 'serif',
      spacing: 'compact',
      layout: 'traditional'
    }
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    description: 'Sophisticated design for leadership roles', 
    previewImage: '/templates/executive.png', 
    isPro: true,
    colors: [...COLORS.professional, COLORS.minimal[0]],
    styles: {
      fontFamily: 'serif',
      spacing: 'standard',
      layout: 'traditional'
    }
  },
  { 
    id: 'tech', 
    name: 'Tech', 
    description: 'Perfect for IT and tech professionals', 
    previewImage: '/templates/tech.png', 
    isPro: true,
    colors: [...COLORS.professional, ...COLORS.minimal],
    styles: {
      fontFamily: 'mono',
      spacing: 'compact',
      layout: 'modern'
    }
  },
  { 
    id: 'academic', 
    name: 'Academic', 
    description: 'Ideal for researchers and educators', 
    previewImage: '/templates/academic.png', 
    isPro: true,
    colors: COLORS.professional,
    styles: {
      fontFamily: 'serif',
      spacing: 'standard',
      layout: 'traditional'
    }
  },
  { 
    id: 'corporate', 
    name: 'Corporate', 
    description: 'Traditional business style', 
    previewImage: '/templates/corporate.png', 
    isPro: true,
    colors: COLORS.professional,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'standard',
      layout: 'traditional'
    }
  },
  { 
    id: 'compact', 
    name: 'Compact', 
    description: 'Fits more information on one page', 
    previewImage: '/templates/compact.png', 
    isPro: true,
    colors: [...COLORS.professional, ...COLORS.minimal],
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'compact',
      layout: 'modern'
    }
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Ultra-clean design that puts content first',
    previewImage: '/templates/minimalist.png',
    isPro: true,
    colors: COLORS.minimal,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'spacious',
      layout: 'modern'
    }
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong visual elements that make an impact',
    previewImage: '/templates/bold.png',
    isPro: true,
    colors: COLORS.creative,
    styles: {
      fontFamily: 'sans-serif',
      spacing: 'standard',
      layout: 'creative'
    }
  }
];

export default TEMPLATES;
