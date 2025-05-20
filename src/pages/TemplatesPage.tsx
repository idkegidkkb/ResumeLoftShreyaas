
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useResume } from "@/contexts/ResumeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ColorOption } from "@/data/templateData";

// Lazy loaded images component
const TemplateImage = ({ src, alt }: { src: string, alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative w-full aspect-[3/4] bg-secondary overflow-hidden">
      {!loaded && (
        <Skeleton className="absolute inset-0" />
      )}
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          // Fallback to placeholder
          const target = e.target as HTMLImageElement;
          target.src = '/lovable-uploads/5bcb2607-70f0-4ee9-bc0e-d128f7763480.png';
          setLoaded(true);
        }}
      />
    </div>
  );
};

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { templates, createResume } = useResume();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [categoryTab, setCategoryTab] = useState('all');
  const [selectedColorId, setSelectedColorId] = useState<Record<string, string>>({});

  const filteredTemplates = templates.filter(template => {
    // Apply free/premium filter
    if (filter === 'all') return true;
    if (filter === 'free') return !template.isPro;
    if (filter === 'premium') return template.isPro;
    return true;
  }).filter(template => {
    // Apply category tab filter
    if (categoryTab === 'all') return true;
    if (categoryTab === 'traditional') return template.styles?.layout === 'traditional';
    if (categoryTab === 'modern') return template.styles?.layout === 'modern';
    if (categoryTab === 'creative') return template.styles?.layout === 'creative';
    return true;
  });

  const handleSelectTemplate = async (templateId: string, isPro: boolean) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a resume",
      });
      navigate('/signup');
      return;
    }

    if (isPro) {
      toast({
        title: "Premium Template",
        description: "This template requires a Pro subscription. Check out our pricing page for more information.",
      });
      navigate('/pricing');
      return;
    }

    try {
      // Use the selected color if available, otherwise use the default
      const colorId = selectedColorId[templateId];
      const resumeId = await createResume(templateId, colorId);
      navigate(`/resume/${resumeId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleColorSelect = (templateId: string, colorId: string) => {
    setSelectedColorId(prev => ({
      ...prev,
      [templateId]: colorId
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Choose Your Resume Template
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Select from our collection of professionally designed templates to create your perfect resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-12 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8">
            {/* Filter Controls */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-heading font-semibold">Resume Templates</h2>
                <Select 
                  defaultValue="all" 
                  onValueChange={(value) => setFilter(value as 'all' | 'free' | 'premium')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter templates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Templates</SelectItem>
                    <SelectItem value="free">Free Templates</SelectItem>
                    <SelectItem value="premium">Premium Templates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="all" value={categoryTab} onValueChange={setCategoryTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="traditional">Traditional</TabsTrigger>
                  <TabsTrigger value="modern">Modern</TabsTrigger>
                  <TabsTrigger value="creative">Creative</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                // Get the current selected color for this template
                const currentColorId = selectedColorId[template.id] || template.colors[0]?.id;
                const selectedColor = template.colors.find(c => c.id === currentColorId) || template.colors[0];

                return (
                <Card key={template.id} className="overflow-hidden flex flex-col">
                  <div className="bg-card overflow-hidden relative">
                    <TemplateImage src={template.previewImage} alt={template.name} />
                    {template.isPro && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        PRO
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-center">{template.name}</CardTitle>
                    <CardDescription className="text-center">{template.description}</CardDescription>
                  </CardHeader>
                  
                  {template.colors.length > 0 && (
                    <CardContent className="p-4 pt-2">
                      <div className="flex flex-col space-y-2">
                        <label className="text-sm text-muted-foreground text-center">Color Scheme</label>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {template.colors.map((color: ColorOption) => (
                            <button
                              key={color.id}
                              onClick={() => handleColorSelect(template.id, color.id)}
                              className={`w-6 h-6 rounded-full border ${
                                currentColorId === color.id ? 'ring-2 ring-primary ring-offset-2' : 'ring-0'
                              }`}
                              style={{ backgroundColor: color.primary }}
                              title={color.name}
                              aria-label={`Select ${color.name} color scheme`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                  
                  <CardFooter className="p-4 pt-2 mt-auto">
                    <Button 
                      className="w-full"
                      onClick={() => handleSelectTemplate(template.id, template.isPro)}
                      style={{
                        backgroundColor: !template.isPro ? selectedColor?.primary : undefined,
                        color: !template.isPro ? (selectedColor?.primary ? '#ffffff' : undefined) : undefined
                      }}
                    >
                      Use This Template
                    </Button>
                  </CardFooter>
                </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-4xl">
                Want Access to All Templates?
              </h2>
              <p className="mx-auto max-w-[600px] md:text-xl opacity-90">
                Upgrade to our Pro plan to access all premium templates and features.
              </p>
            </div>
            <Button variant="secondary" size="lg" asChild>
              <a href="/pricing">View Pricing</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TemplatesPage;
