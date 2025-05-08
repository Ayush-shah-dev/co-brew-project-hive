
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createApplication } from "@/services/applicationService";
import { useAuth } from "@/hooks/useAuth";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Dialog,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";

type ApplyProjectFormProps = {
  projectId: string;
  projectTitle: string;
};

const ApplyProjectForm = ({ projectId, projectTitle }: ApplyProjectFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    introduction: "",
    experience: "",
    motivation: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to apply");
      return;
    }
    
    // Basic validation
    if (!formData.introduction.trim() || !formData.experience.trim() || !formData.motivation.trim()) {
      toast.error("Please answer all questions");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createApplication({
        project_id: projectId,
        introduction: formData.introduction,
        experience: formData.experience,
        motivation: formData.motivation
      });
      
      // Reset form data
      setFormData({
        introduction: "",
        experience: "",
        motivation: ""
      });
      
      toast.success("Application submitted successfully!");
      toast.info("The project owner will review your application");
      
      // Close the sheet
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle case when user is not logged in
  if (!user) {
    return (
      <Button 
        onClick={() => toast.error("You must be logged in to apply", {
          description: "Please sign in or create an account to apply for this project.",
          action: {
            label: "Login",
            onClick: () => window.location.href = "/login"
          }
        })} 
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
      >
        Apply to Join Project
      </Button>
    );
  }

  // Use Dialog for larger screen, Sheet for mobile
  return (
    <>
      {/* For larger screens */}
      <div className="hidden md:block">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              Apply to Join Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-slate-900 border-purple-500/20">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Apply to {projectTitle}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Answer these questions to apply. The project owner will review your application.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="introduction" className="text-white">
                  Why do you want to join this team?
                  <span className="text-pink-500"> *</span>
                </Label>
                <Textarea
                  id="introduction"
                  name="introduction"
                  placeholder="Hi! I'm a developer with a passion for..."
                  className="min-h-[80px] bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-white">
                  What is your previous experience/proof of skill for this role?
                  <span className="text-pink-500"> *</span>
                </Label>
                <Textarea
                  id="experience"
                  name="experience"
                  placeholder="I've worked on several projects involving..."
                  className="min-h-[100px] bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motivation" className="text-white">
                  Why are you interested in this specific project?
                  <span className="text-pink-500"> *</span>
                </Label>
                <Textarea
                  id="motivation"
                  name="motivation"
                  placeholder="I'm excited about this project because..."
                  className="min-h-[100px] bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* For mobile screens */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              Apply to Join Project
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full md:max-w-md overflow-y-auto bg-slate-900 border-purple-500/20">
            <SheetHeader>
              <SheetTitle className="text-xl text-white">Apply to {projectTitle}</SheetTitle>
              <SheetDescription className="text-gray-400">
                Answer these questions to apply. The project owner will review your application.
              </SheetDescription>
            </SheetHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="mobile-introduction" className="text-white">
                  Why do you want to join this team?
                  <span className="text-pink-500"> *</span>
                </Label>
                <Textarea
                  id="mobile-introduction"
                  name="introduction"
                  placeholder="Hi! I'm a developer with a passion for..."
                  className="min-h-[80px] bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile-experience" className="text-white">
                  What is your previous experience/proof of skill for this role?
                  <span className="text-pink-500"> *</span>
                </Label>
                <Textarea
                  id="mobile-experience"
                  name="experience"
                  placeholder="I've worked on several projects involving..."
                  className="min-h-[100px] bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile-motivation" className="text-white">
                  Why are you interested in this specific project?
                  <span className="text-pink-500"> *</span>
                </Label>
                <Textarea
                  id="mobile-motivation"
                  name="motivation"
                  placeholder="I'm excited about this project because..."
                  className="min-h-[100px] bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <SheetFooter className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ApplyProjectForm;
