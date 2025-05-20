import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useResume } from "@/contexts/ResumeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { resumes, templates, deleteResume, createResume, hasReachedFreeLimit } = useResume();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameResumeId, setRenameResumeId] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteResumeId, setDeleteResumeId] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const handleOpenRenameDialog = (resume: any) => {
    setRenameResumeId(resume.id);
    setRenameValue(resume.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameResume = async () => {
    if (renameValue.trim()) {
      await updateResume(renameResumeId, { name: renameValue });
      setIsRenameDialogOpen(false);
    }
  };

  const handleOpenDeleteDialog = (resumeId: string) => {
    setDeleteResumeId(resumeId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteResume = async () => {
    await deleteResume(deleteResumeId);
    setIsDeleteDialogOpen(false);
  };

  const handleSelectTemplate = async (templateId: string) => {
    try {
      const resumeId = await createResume(templateId);
      setIsTemplateDialogOpen(false);
      navigate(`/resume/${resumeId}`);
    } catch (error) {
      // Error message is already displayed by the ResumeContext
      setIsTemplateDialogOpen(false);
    }
  };

  const updateResume = async (resumeId: string, data: any) => {
    try {
      await updateResume(resumeId, data);
      toast({
        title: "Resume updated",
        description: "The resume has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter out premium templates for free users
  const freeTemplates = templates.filter(template => !template.isPro);

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-heading font-bold tracking-tighter">
              My Resumes
            </h1>
            <p className="text-muted-foreground">
              Manage and edit your saved resumes
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
              </span>
              <span className="text-sm text-muted-foreground">
                ({resumes.length}/3 on free plan)
              </span>
            </div>
            <Button 
              onClick={() => setIsTemplateDialogOpen(true)}
              disabled={hasReachedFreeLimit}
            >
              Create New Resume
            </Button>
          </div>
          
          {hasReachedFreeLimit && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertDescription>
                You've reached the limit of 3 resumes on the free plan. Upgrade to create more!
                <div className="mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="flex flex-col overflow-hidden">
                  <CardHeader className="pb-0">
                    <CardTitle className="truncate">{resume.name}</CardTitle>
                    <CardDescription>
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="bg-muted aspect-[3/4] flex items-center justify-center rounded-md mt-4 overflow-hidden">
                      {/* This would be a preview of the resume */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground opacity-25"
                      >
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                        <path d="M18 14h-8"/>
                        <path d="M15 18h-5"/>
                        <path d="M10 6h8v4h-8V6Z"/>
                      </svg>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" asChild>
                      <Link to={`/resume/${resume.id}`}>Edit</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenRenameDialog(resume)}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDeleteDialog(resume.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 border-dashed border-2 rounded-lg flex items-center justify-center p-10 text-center">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">No resumes yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You don't have any resumes yet. Create your first resume to get started.
                </p>
                <Button 
                  onClick={() => setIsTemplateDialogOpen(true)}
                  disabled={hasReachedFreeLimit}
                >
                  Create Your First Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
            <DialogDescription>
              Enter a new name for your resume.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename">Name</Label>
              <Input
                id="rename"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleRenameResume}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteResume}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Choose Template Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
            <DialogDescription>
              Select a template for your new resume.
            </DialogDescription>
          </DialogHeader>
          {hasReachedFreeLimit ? (
            <div className="py-6 text-center">
              <p className="mb-4 text-amber-600">
                You've reached the limit of 3 resumes on the free plan. Upgrade to create more!
              </p>
              <Button asChild>
                <Link to="/pricing">View Pricing Options</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 max-h-[400px] overflow-y-auto">
              {freeTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    {/* This would be a preview image of the template */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground opacity-25"
                    >
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                      <path d="M18 14h-8"/>
                      <path d="M15 18h-5"/>
                      <path d="M10 6h8v4h-8V6Z"/>
                    </svg>
                  </div>
                  <div className="p-2 text-sm font-medium text-center truncate">
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DashboardPage;
