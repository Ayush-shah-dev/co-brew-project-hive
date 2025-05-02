
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
  SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createApplication } from "@/services/applicationService";
import { useAuth } from "@/hooks/useAuth";

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
      toast.error("Please fill in all fields");
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
      
      // Close the sheet
      setOpen(false);
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-cobrew-600 hover:bg-cobrew-700 w-full">Apply to Join Project</Button>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Apply to {projectTitle}</SheetTitle>
          <SheetDescription>
            Tell the project creator why you're interested and how you can contribute to this project.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="introduction">
              Introduce yourself briefly
              <span className="text-red-500"> *</span>
            </Label>
            <Textarea
              id="introduction"
              name="introduction"
              placeholder="Hi! I'm a developer with a passion for..."
              className="min-h-[80px]"
              value={formData.introduction}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">
              What relevant experience do you have?
              <span className="text-red-500"> *</span>
            </Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="I've worked on several projects involving..."
              className="min-h-[100px]"
              value={formData.experience}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivation">
              Why are you interested in this specific project?
              <span className="text-red-500"> *</span>
            </Label>
            <Textarea
              id="motivation"
              name="motivation"
              placeholder="I'm excited about this project because..."
              className="min-h-[100px]"
              value={formData.motivation}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <SheetFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-cobrew-600 hover:bg-cobrew-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ApplyProjectForm;
