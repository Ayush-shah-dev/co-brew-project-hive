
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateProjectButton = ({ variant = "default" }: { variant?: "default" | "outline" }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would be replaced with actual project creation
      console.log("Creating project:", { title, description });
      
      // Simulate creation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Project created successfully!");
      setOpen(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      
      // Navigate to the new project
      navigate("/project/1/overview");
    } catch (error) {
      console.error("Project creation error:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className={variant === "default" ? "bg-cobrew-600 hover:bg-cobrew-700" : ""}
          variant={variant}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Set up a new collaborative workspace for your team
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project's goals, scope, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-cobrew-600 hover:bg-cobrew-700"
              disabled={!title || isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectButton;
