import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import TEMPLATES, { Template, ColorOption } from '@/data/templateData';

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
  level: number; // 1-5
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
}

interface ResumeContextType {
  resumes: ResumeData[];
  templates: Template[];
  currentResume: ResumeData | null;
  loading: boolean;
  createResume: (templateId: string, colorId?: string) => Promise<string>; // returns resumeId
  updateResume: (resumeId: string, data: Partial<ResumeData>) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  getResume: (resumeId: string) => Promise<ResumeData | null>;
  setCurrentResume: (resume: ResumeData | null) => void;
  generatePdf: (resumeId: string) => Promise<void>;
  hasReachedFreeLimit: boolean; // New property to check if user has reached the free limit
}

const ResumeContext = createContext<ResumeContextType | null>(null);

// Example resume data
const EXAMPLE_RESUMES: ResumeData[] = [
  {
    id: '1',
    userId: '1',
    name: 'Software Developer Resume',
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T15:30:00Z',
    templateId: 'modern',
    personalInfo: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      address: 'San Francisco, CA',
      title: 'Senior Software Developer',
      summary: 'Experienced software developer with 5+ years of expertise in JavaScript, React, and Node.js. Passionate about creating efficient, scalable applications.',
      website: 'www.alexjohnson.dev',
      linkedin: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson'
    },
    education: [
      {
        id: 'edu1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2014-09-01',
        endDate: '2018-05-30',
        description: 'Dean\'s List, Software Engineering Club President'
      }
    ],
    experience: [
      {
        id: 'exp1',
        company: 'Tech Solutions Inc.',
        position: 'Senior Frontend Developer',
        location: 'San Francisco, CA',
        startDate: '2020-03-01',
        endDate: '',
        description: 'Lead a team of 5 developers in building responsive web applications with React and TypeScript. Improved site performance by 40% through code optimization.'
      },
      {
        id: 'exp2',
        company: 'StartUp Labs',
        position: 'Frontend Developer',
        location: 'San Francisco, CA',
        startDate: '2018-06-01',
        endDate: '2020-02-28',
        description: 'Developed user interfaces for various web applications using JavaScript, HTML5, and CSS3. Collaborated with design team to implement responsive designs.'
      }
    ],
    skills: [
      { id: 'skill1', name: 'JavaScript', level: 5 },
      { id: 'skill2', name: 'React', level: 5 },
      { id: 'skill3', name: 'TypeScript', level: 4 },
      { id: 'skill4', name: 'Node.js', level: 4 },
      { id: 'skill5', name: 'HTML/CSS', level: 5 },
      { id: 'skill6', name: 'Git', level: 4 }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Intermediate' }
    ],
    certifications: [
      { name: 'AWS Certified Developer', issuer: 'Amazon Web Services', date: '2021-05' }
    ]
  }
];

// Maximum number of resumes for free users
const FREE_PLAN_MAX_RESUMES = 3;

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Compute if the user has reached their free limit
  const hasReachedFreeLimit = resumes.length >= FREE_PLAN_MAX_RESUMES;

  // Load user's resumes when user changes
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch from an API
      const storedResumes = localStorage.getItem(`resumes-${user.id}`);
      if (storedResumes) {
        try {
          setResumes(JSON.parse(storedResumes));
        } catch (error) {
          console.error('Error parsing stored resumes:', error);
          // Initialize with example resume
          const userResumes = [...EXAMPLE_RESUMES].filter(r => r.userId === user.id);
          setResumes(userResumes);
          localStorage.setItem(`resumes-${user.id}`, JSON.stringify(userResumes));
        }
      } else {
        // Initialize with example resume
        const userResumes = [...EXAMPLE_RESUMES].filter(r => r.userId === user.id);
        setResumes(userResumes);
        localStorage.setItem(`resumes-${user.id}`, JSON.stringify(userResumes));
      }
    } else {
      setResumes([]);
    }
    setLoading(false);
  }, [user]);

  const saveResumes = (updatedResumes: ResumeData[]) => {
    if (user) {
      setResumes(updatedResumes);
      localStorage.setItem(`resumes-${user.id}`, JSON.stringify(updatedResumes));
    }
  };

  const createResume = async (templateId: string, colorId?: string): Promise<string> => {
    if (!user) throw new Error('User must be authenticated');
    
    // Check if the user has reached the maximum number of resumes for the free plan
    if (resumes.length >= FREE_PLAN_MAX_RESUMES) {
      toast({
        title: 'Free plan limit reached',
        description: `You can create up to ${FREE_PLAN_MAX_RESUMES} resumes on the free plan. Please upgrade to create more.`,
        variant: 'destructive'
      });
      throw new Error('Free plan limit reached');
    }
    
    // Create a new blank resume
    const newResumeId = `resume-${Date.now()}`;
    const now = new Date().toISOString();
    
    // Find the template
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Find the color scheme
    const defaultColorId = template.colors[0]?.id;
    const selectedColorId = colorId || defaultColorId;
    const selectedColor = template.colors.find(c => c.id === selectedColorId);
    
    if (!selectedColor) {
      throw new Error('Color scheme not found');
    }
    
    // Create the new resume with the selected color
    const newResume: ResumeData = {
      id: newResumeId,
      userId: user.id,
      name: 'Untitled Resume',
      createdAt: now,
      updatedAt: now,
      templateId: templateId,
      colorId: selectedColorId,
      colors: {
        primary: selectedColor.primary,
        secondary: selectedColor.secondary,
        accent: selectedColor.accent
      },
      personalInfo: {
        fullName: user.profile?.full_name || user.email?.split('@')[0] || '',
        email: user.email,
        phone: '',
        address: '',
        title: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: []
    };
    
    const updatedResumes = [...resumes, newResume];
    saveResumes(updatedResumes);
    
    toast({
      title: 'Resume created',
      description: 'Your new resume has been created successfully.'
    });
    
    return newResumeId;
  };

  const updateResume = async (resumeId: string, data: Partial<ResumeData>): Promise<void> => {
    const resumeIndex = resumes.findIndex(r => r.id === resumeId);
    if (resumeIndex === -1) {
      toast({
        title: 'Error',
        description: 'Resume not found',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedResume = {
      ...resumes[resumeIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    const updatedResumes = [...resumes];
    updatedResumes[resumeIndex] = updatedResume;
    saveResumes(updatedResumes);
    
    // Also update current resume if it's the one being edited
    if (currentResume && currentResume.id === resumeId) {
      setCurrentResume(updatedResume);
    }
    
    toast({
      title: 'Resume updated',
      description: 'Your changes have been saved.'
    });
  };

  const deleteResume = async (resumeId: string): Promise<void> => {
    const updatedResumes = resumes.filter(r => r.id !== resumeId);
    saveResumes(updatedResumes);
    
    // Clear current resume if it's the one being deleted
    if (currentResume && currentResume.id === resumeId) {
      setCurrentResume(null);
    }
    
    toast({
      title: 'Resume deleted',
      description: 'Your resume has been deleted successfully.'
    });
  };

  const getResume = async (resumeId: string): Promise<ResumeData | null> => {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) {
      toast({
        title: 'Error',
        description: 'Resume not found',
        variant: 'destructive'
      });
      return null;
    }
    return resume;
  };

  // PDF generation method using script loading to avoid import errors
  const generatePdf = async (resumeId: string): Promise<void> => {
    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) {
      toast({
        title: 'Error',
        description: 'Resume not found',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: "Generating PDF",
      description: "Please wait while your resume is being prepared..."
    });

    // Find the resume preview element - we'll select it by its class name
    setTimeout(async () => {
      try {
        const resumeElement = document.querySelector('.resume-paper');
        
        if (!resumeElement) {
          toast({
            title: 'Error',
            description: 'Could not find resume content to export',
            variant: 'destructive'
          });
          return;
        }

        // Create a clone of the element in a hidden container to ensure proper rendering
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        container.style.width = '8.5in'; // US Letter width
        container.style.backgroundColor = 'white';
        container.style.padding = '0.5in'; // 0.5 inch margins
        
        const clone = resumeElement.cloneNode(true) as HTMLElement;
        clone.style.boxShadow = 'none';
        clone.style.border = 'none';
        container.appendChild(clone);
        document.body.appendChild(container);

        try {
          // Load libraries using CDN
          await loadScriptFromCDN('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
          await loadScriptFromCDN('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          
          // Now we can safely use the window global objects
          const html2canvas = (window as any).html2canvas;
          const jspdf = (window as any).jspdf;
          
          if (!html2canvas || !jspdf) {
            throw new Error('PDF generation libraries could not be loaded');
          }
          
          // Generate PDF
          const canvas = await html2canvas(container, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 0;

          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          pdf.save(`${resume.name || 'resume'}.pdf`);
          
          toast({
            title: "PDF Downloaded",
            description: "Your resume has been downloaded successfully."
          });
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast({
            title: 'Error',
            description: 'Failed to generate PDF. Please try again.',
            variant: 'destructive'
          });
        } finally {
          // Clean up
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate PDF. Please try again.',
          variant: 'destructive'
        });
      }
    }, 100);
  };

  // Helper function to load scripts from CDN
  const loadScriptFromCDN = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (error) => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  return (
    <ResumeContext.Provider value={{
      resumes,
      templates: TEMPLATES,
      currentResume,
      loading,
      createResume,
      updateResume,
      deleteResume,
      getResume,
      setCurrentResume,
      generatePdf,
      hasReachedFreeLimit
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

// Augment the Window interface to recognize our dynamically loaded libraries
declare global {
  interface Window {
    html2canvas?: any;
    jspdf?: any;
  }
}
