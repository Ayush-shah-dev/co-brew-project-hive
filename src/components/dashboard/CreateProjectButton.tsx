
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createProject, ProjectStage, ProjectCategory } from "@/services/projectService";
import { Badge } from "@/components/ui/badge";

const stageOptions: {value: ProjectStage; label: string}[] = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "growth", label: "Growth" },
  { value: "scaling", label: "Scaling" }
];

const categoryOptions: {value: ProjectCategory; label: string}[] = [
  { value: "SaaS", label: "SaaS" },
  { value: "AI", label: "AI" },
  { value: "Marketplace", label: "Marketplace" },
  { value: "FinTech", label: "FinTech" },
  { value: "EdTech", label: "EdTech" },
  { value: "HealthTech", label: "HealthTech" },
  { value: "Other", label: "Other" }
];

const predefinedRoleOptions = [
  "Developer",
  "Designer",
  "Product Manager",
  "Marketing",
  "Sales",
  "Finance",
  "Legal",
  "Operations",
  "Other"
];

const CreateProjectButton = ({ variant = "default" }: { variant?: "default" | "outline" }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<ProjectStage>("idea");
  const [category, setCategory] = useState<ProjectCategory>("SaaS");
  const [fundingGoal, setFundingGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Updated role handling
  const [rolesNeeded, setRolesNeeded] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customRole, setCustomRole] = useState<string>("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create project in the database
      const newProject = await createProject({
        title,
        description,
        stage,
        category,
        funding_goal: fundingGoal ? parseFloat(fundingGoal) : 0,
        tags: [],
        roles_needed: rolesNeeded
      });
      
      toast.success("Project created successfully!");
      setOpen(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setStage("idea");
      setCategory("SaaS");
      setFundingGoal("");
      setRolesNeeded([]);
      setSelectedRole("");
      setCustomRole("");
      
      // Navigate to the new project
      navigate(`/project/${newProject.id}/overview`);
    } catch (error) {
      console.error("Project creation error:", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const addSelectedRole = () => {
    if (selectedRole && !rolesNeeded.includes(selectedRole)) {
      setRolesNeeded([...rolesNeeded, selectedRole]);
      setSelectedRole("");
    }
  };

  const addCustomRole = () => {
    if (customRole.trim() && !rolesNeeded.includes(customRole.trim())) {
      setRolesNeeded([...rolesNeeded, customRole.trim()]);
      setCustomRole("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRolesNeeded(rolesNeeded.filter(role => role !== roleToRemove));
  };

  const handleCustomRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customRole.trim()) {
      e.preventDefault();
      addCustomRole();
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new startup project</DialogTitle>
          <DialogDescription>
            Set up a new collaborative workspace for your startup
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="E.g., AI-Powered Customer Service Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select value={stage} onValueChange={(value) => setStage(value as ProjectStage)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {stageOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ProjectCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your startup project, goals, vision, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Roles Needed</Label>
            
            {/* Predefined role selection */}
            <div className="flex gap-2 mb-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select predefined roles" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedRoleOptions.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                onClick={addSelectedRole} 
                variant="outline"
                disabled={!selectedRole}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Custom role input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type custom role (e.g., DevOps Engineer)"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                onKeyDown={handleCustomRoleKeyDown}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addCustomRole} 
                variant="outline"
                disabled={!customRole.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {rolesNeeded.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {rolesNeeded.map(role => (
                  <Badge key={role} variant="secondary" className="flex items-center gap-1">
                    {role}
                    <button type="button" onClick={() => removeRole(role)} className="ml-1 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fundingGoal">Funding Goal (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">$</span>
              <Input
                id="fundingGoal"
                placeholder="0"
                className="pl-7"
                value={fundingGoal}
                onChange={(e) => {
                  // Only allow numbers and decimals
                  const val = e.target.value;
                  if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) {
                    setFundingGoal(val);
                  }
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              className="bg-cobrew-600 hover:bg-cobrew-700"
              disabled={!title || !description || isLoading}
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
