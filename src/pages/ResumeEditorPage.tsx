
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useResume, ResumeData } from "@/contexts/ResumeContext";
import { useToast } from "@/hooks/use-toast";

const ResumeEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResume, updateResume, generatePdf, currentResume, setCurrentResume } = useResume();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("personal");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaveConfirmDialogOpen, setIsSaveConfirmDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const loadResume = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const resume = await getResume(id);
        if (resume) {
          setResumeData(resume);
          setCurrentResume(resume);
        } else {
          navigate("/dashboard", { replace: true });
          toast({
            title: "Resume not found",
            description: "The requested resume could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading resume:", error);
        toast({
          title: "Error",
          description: "Failed to load resume. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();

    // Clean up function to prevent memory leaks
    return () => {
      setCurrentResume(null);
    };
  }, [id, getResume, navigate, toast, setCurrentResume]);

  // Handle page navigation/exit with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleChange = (section: keyof ResumeData, field: string, value: any) => {
    if (!resumeData) return;

    const updatedResumeData = { ...resumeData };

    if (section === "personalInfo") {
      updatedResumeData.personalInfo = {
        ...updatedResumeData.personalInfo,
        [field]: value,
      };
    } else if (section === "education" && field.includes(".")) {
      // Handle nested education field updates (e.g., "0.institution")
      const [index, nestedField] = field.split(".");
      const educationIndex = parseInt(index);
      updatedResumeData.education = [...updatedResumeData.education];
      updatedResumeData.education[educationIndex] = {
        ...updatedResumeData.education[educationIndex],
        [nestedField]: value,
      };
    } else if (section === "experience" && field.includes(".")) {
      // Handle nested experience field updates
      const [index, nestedField] = field.split(".");
      const experienceIndex = parseInt(index);
      updatedResumeData.experience = [...updatedResumeData.experience];
      updatedResumeData.experience[experienceIndex] = {
        ...updatedResumeData.experience[experienceIndex],
        [nestedField]: value,
      };
    } else if (section === "skills" && field.includes(".")) {
      // Handle nested skills field updates
      const [index, nestedField] = field.split(".");
      const skillIndex = parseInt(index);
      updatedResumeData.skills = [...updatedResumeData.skills];
      updatedResumeData.skills[skillIndex] = {
        ...updatedResumeData.skills[skillIndex],
        [nestedField]: nestedField === "level" ? parseInt(value) : value,
      };
    } else {
      // Handle other section updates
      (updatedResumeData as any)[section] = value;
    }

    setResumeData(updatedResumeData);
    setHasUnsavedChanges(true);
  };

  const handleAddEducation = () => {
    if (!resumeData) return;

    const newEducation = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation],
    });
    setHasUnsavedChanges(true);
  };

  const handleRemoveEducation = (index: number) => {
    if (!resumeData) return;

    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);

    setResumeData({
      ...resumeData,
      education: updatedEducation,
    });
    setHasUnsavedChanges(true);
  };

  const handleAddExperience = () => {
    if (!resumeData) return;

    const newExperience = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience],
    });
    setHasUnsavedChanges(true);
  };

  const handleRemoveExperience = (index: number) => {
    if (!resumeData) return;

    const updatedExperience = [...resumeData.experience];
    updatedExperience.splice(index, 1);

    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    });
    setHasUnsavedChanges(true);
  };

  const handleAddSkill = () => {
    if (!resumeData) return;

    const newSkill = {
      id: `skill-${Date.now()}`,
      name: "",
      level: 3,
    };

    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
    setHasUnsavedChanges(true);
  };

  const handleRemoveSkill = (index: number) => {
    if (!resumeData) return;

    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);

    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!resumeData || !id) return;

    try {
      await updateResume(id, resumeData);
      setHasUnsavedChanges(false);
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPdf = async () => {
    if (!resumeData || !id) return;

    // If there are unsaved changes, prompt to save first
    if (hasUnsavedChanges) {
      setIsSaveConfirmDialogOpen(true);
      return;
    }

    await exportToPdf();
  };

  const exportToPdf = async () => {
    if (!id) return;

    setIsGeneratingPdf(true);
    try {
      await generatePdf(id);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveAndExport = async () => {
    if (!resumeData || !id) return;

    setIsSaveConfirmDialogOpen(false);
    
    try {
      await updateResume(id, resumeData);
      setHasUnsavedChanges(false);
      await exportToPdf();
    } catch (error) {
      console.error("Error saving and exporting:", error);
      toast({
        title: "Error",
        description: "Failed to save and export. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportWithoutSaving = () => {
    setIsSaveConfirmDialogOpen(false);
    exportToPdf();
  };

  const togglePreviewMode = () => {
    setPreviewMode(prevMode => prevMode === "edit" ? "preview" : "edit");
  };

  if (isLoading || !resumeData) {
    return (
      <Layout hideFooter>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>
    );
  }

  // Get the theme colors from the resume data
  const primaryColor = resumeData.colors?.primary || "#000000";
  const secondaryColor = resumeData.colors?.secondary || "#666666";
  
  return (
    <Layout hideFooter>
      <div className="container flex flex-col py-6">
        {/* Header with controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-semibold truncate">
              {resumeData.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {resumeData.templateId} template
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={togglePreviewMode}>
              {previewMode === "edit" ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back
            </Button>
            <Button 
              variant={hasUnsavedChanges ? "default" : "outline"} 
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              {hasUnsavedChanges ? "Save*" : "Saved"}
            </Button>
            <Button 
              onClick={handleExportPdf} 
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {previewMode === "preview" ? (
          <div className="w-full flex justify-center">
            <div className="bg-white text-black p-8 shadow-lg max-w-2xl w-full">
              <div className="resume-paper">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
                    {resumeData.personalInfo.fullName || "Your Name"}
                  </h1>
                  {resumeData.personalInfo.title && (
                    <p className="text-xl mt-1">{resumeData.personalInfo.title}</p>
                  )}
                  <div className="flex flex-wrap justify-center gap-x-3 mt-3 text-sm">
                    {resumeData.personalInfo.email && (
                      <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.phone && (
                      <span>{resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.address && (
                      <span>{resumeData.personalInfo.address}</span>
                    )}
                  </div>
                </div>

                {resumeData.personalInfo.summary && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-3" style={{ borderColor: primaryColor }}>Summary</h2>
                    <p className="whitespace-pre-line">{resumeData.personalInfo.summary}</p>
                  </div>
                )}

                {resumeData.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-3" style={{ borderColor: primaryColor }}>Experience</h2>
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="mb-5 last:mb-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-lg font-medium" style={{ color: secondaryColor }}>
                            {exp.position || "Position"}
                          </h3>
                          <div className="text-sm">
                            {exp.startDate && (
                              <>
                                {new Date(exp.startDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                })}
                                {" - "}
                                {exp.endDate
                                  ? new Date(exp.endDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                    })
                                  : "Present"}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{exp.company || "Company"}</span>
                          <span>{exp.location}</span>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-sm whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-3" style={{ borderColor: primaryColor }}>Education</h2>
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="mb-5 last:mb-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-lg font-medium" style={{ color: secondaryColor }}>
                            {edu.degree || "Degree"}{" "}
                            {edu.field ? `in ${edu.field}` : ""}
                          </h3>
                          <div className="text-sm">
                            {edu.startDate && (
                              <>
                                {new Date(edu.startDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                })}
                                {" - "}
                                {edu.endDate
                                  ? new Date(edu.endDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                    })
                                  : "Present"}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{edu.institution || "Institution"}</div>
                        {edu.description && (
                          <p className="mt-2 text-sm whitespace-pre-line">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-3" style={{ borderColor: primaryColor }}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: skill.level > 3 ? `${primaryColor}20` : "" }}
                        >
                          {skill.name || "Skill"}
                          {skill.level > 0 && (
                            <span className="ml-1 text-xs" style={{ color: primaryColor }}>
                              {Array(skill.level).fill('●').join('')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Editor Panel */}
            <div className="md:w-1/2 lg:w-2/5 flex flex-col gap-4">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Add your basic information for the resume header
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) =>
                            handleChange("personalInfo", "fullName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                          id="title"
                          placeholder="Software Engineer"
                          value={resumeData.personalInfo.title}
                          onChange={(e) =>
                            handleChange("personalInfo", "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="johndoe@example.com"
                          value={resumeData.personalInfo.email}
                          onChange={(e) =>
                            handleChange("personalInfo", "email", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="(123) 456-7890"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) =>
                            handleChange("personalInfo", "phone", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address/Location</Label>
                        <Input
                          id="address"
                          placeholder="City, State"
                          value={resumeData.personalInfo.address}
                          onChange={(e) =>
                            handleChange("personalInfo", "address", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea
                          id="summary"
                          placeholder="Write a brief summary of your professional background and skills..."
                          value={resumeData.personalInfo.summary}
                          onChange={(e) =>
                            handleChange("personalInfo", "summary", e.target.value)
                          }
                          className="min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>
                          Add your educational background
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddEducation}>Add Education</Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {resumeData.education.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No education entries yet. Click "Add Education" to add your first entry.
                        </div>
                      ) : (
                        resumeData.education.map((edu, index) => (
                          <div key={edu.id} className="space-y-4 border-b pb-6 last:border-0">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Education #{index + 1}</h3>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveEducation(index)}
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label>Institution</Label>
                              <Input
                                placeholder="University Name"
                                value={edu.institution}
                                onChange={(e) =>
                                  handleChange("education", `${index}.institution`, e.target.value)
                                }
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Degree</Label>
                                <Input
                                  placeholder="Bachelor of Science"
                                  value={edu.degree}
                                  onChange={(e) =>
                                    handleChange("education", `${index}.degree`, e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Field of Study</Label>
                                <Input
                                  placeholder="Computer Science"
                                  value={edu.field}
                                  onChange={(e) =>
                                    handleChange("education", `${index}.field`, e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                  type="date"
                                  value={edu.startDate}
                                  onChange={(e) =>
                                    handleChange("education", `${index}.startDate`, e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                  type="date"
                                  value={edu.endDate}
                                  onChange={(e) =>
                                    handleChange("education", `${index}.endDate`, e.target.value)
                                  }
                                  placeholder="Present (if current)"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Relevant achievements, activities, etc."
                                value={edu.description}
                                onChange={(e) =>
                                  handleChange("education", `${index}.description`, e.target.value)
                                }
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Work Experience</CardTitle>
                        <CardDescription>
                          Add your professional experience
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddExperience}>Add Experience</Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {resumeData.experience.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No experience entries yet. Click "Add Experience" to add your first entry.
                        </div>
                      ) : (
                        resumeData.experience.map((exp, index) => (
                          <div key={exp.id} className="space-y-4 border-b pb-6 last:border-0">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveExperience(index)}
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label>Company/Organization</Label>
                              <Input
                                placeholder="Company Name"
                                value={exp.company}
                                onChange={(e) =>
                                  handleChange("experience", `${index}.company`, e.target.value)
                                }
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Position/Title</Label>
                                <Input
                                  placeholder="Software Engineer"
                                  value={exp.position}
                                  onChange={(e) =>
                                    handleChange("experience", `${index}.position`, e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                  placeholder="City, State or Remote"
                                  value={exp.location}
                                  onChange={(e) =>
                                    handleChange("experience", `${index}.location`, e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                  type="date"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    handleChange("experience", `${index}.startDate`, e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                  type="date"
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    handleChange("experience", `${index}.endDate`, e.target.value)
                                  }
                                  placeholder="Leave blank if current"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Describe your responsibilities, achievements, and the skills you utilized..."
                                value={exp.description}
                                onChange={(e) =>
                                  handleChange("experience", `${index}.description`, e.target.value)
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>
                          Add your professional skills
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddSkill}>Add Skill</Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {resumeData.skills.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No skills added yet. Click "Add Skill" to add your first skill.
                        </div>
                      ) : (
                        resumeData.skills.map((skill, index) => (
                          <div key={skill.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                            <div className="flex-1">
                              <Input
                                placeholder="Skill name (e.g., JavaScript)"
                                value={skill.name}
                                onChange={(e) =>
                                  handleChange("skills", `${index}.name`, e.target.value)
                                }
                              />
                            </div>
                            <div className="w-24">
                              <select
                                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={skill.level}
                                onChange={(e) =>
                                  handleChange("skills", `${index}.level`, e.target.value)
                                }
                              >
                                <option value="1">Beginner</option>
                                <option value="2">Elementary</option>
                                <option value="3">Intermediate</option>
                                <option value="4">Advanced</option>
                                <option value="5">Expert</option>
                              </select>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveSkill(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Panel */}
            <div className="md:w-1/2 lg:w-3/5 flex flex-col gap-4">
              <div className="bg-muted rounded-lg p-4 sticky top-[80px]">
                <div className="overflow-auto max-h-[calc(100vh-200px)]">
                  <div className="resume-paper bg-white text-black p-6">
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
                        {resumeData.personalInfo.fullName || "Your Name"}
                      </h1>
                      {resumeData.personalInfo.title && (
                        <p className="text-lg">{resumeData.personalInfo.title}</p>
                      )}
                      <div className="flex flex-wrap justify-center gap-x-3 mt-2 text-sm">
                        {resumeData.personalInfo.email && (
                          <span>{resumeData.personalInfo.email}</span>
                        )}
                        {resumeData.personalInfo.phone && (
                          <span>{resumeData.personalInfo.phone}</span>
                        )}
                        {resumeData.personalInfo.address && (
                          <span>{resumeData.personalInfo.address}</span>
                        )}
                      </div>
                    </div>

                    {resumeData.personalInfo.summary && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                          Summary
                        </h2>
                        <p className="whitespace-pre-line">{resumeData.personalInfo.summary}</p>
                      </div>
                    )}

                    {resumeData.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                          Experience
                        </h2>
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="mb-4">
                            <div className="flex justify-between">
                              <h3 className="font-medium" style={{ color: secondaryColor }}>
                                {exp.position || "Position"}
                              </h3>
                              <div className="text-sm">
                                {exp.startDate && (
                                  <>
                                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                    })}
                                    {" - "}
                                    {exp.endDate
                                      ? new Date(exp.endDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                        })
                                      : "Present"}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{exp.company || "Company"}</span>
                              <span>{exp.location}</span>
                            </div>
                            {exp.description && (
                              <p className="mt-2 text-sm whitespace-pre-line">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                          Education
                        </h2>
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="mb-4">
                            <div className="flex justify-between">
                              <h3 className="font-medium" style={{ color: secondaryColor }}>
                                {edu.degree || "Degree"}{" "}
                                {edu.field ? `in ${edu.field}` : ""}
                              </h3>
                              <div className="text-sm">
                                {edu.startDate && (
                                  <>
                                    {new Date(edu.startDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                    })}
                                    {" - "}
                                    {edu.endDate
                                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "short",
                                        })
                                      : "Present"}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-sm">{edu.institution || "Institution"}</div>
                            {edu.description && (
                              <p className="mt-2 text-sm whitespace-pre-line">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                              style={{ backgroundColor: skill.level > 3 ? `${primaryColor}20` : "" }}
                            >
                              {skill.name || "Skill"}
                              {skill.level > 0 && (
                                <span className="ml-1 text-xs" style={{ color: primaryColor }}>
                                  {Array(skill.level).fill('●').join('')}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={isSaveConfirmDialogOpen} onOpenChange={setIsSaveConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Would you like to save them before exporting?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={handleExportWithoutSaving}
            >
              Export Without Saving
            </Button>
            <Button onClick={handleSaveAndExport}>
              Save and Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ResumeEditorPage;
