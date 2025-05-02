
import { Calendar, ArrowRight, Users, Tag, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import ApplyProjectForm from "@/components/projects/ApplyProjectForm";
import { useAuth } from "@/hooks/useAuth";

export type ProjectStatus = "idea" | "mvp" | "growth" | "scaling";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  category: string;
  teamSize: number;
  dueDate?: string;
  roles_needed?: string[];
  creator_id?: string;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "idea":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "mvp":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "growth":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "scaling":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const ProjectCard = ({
  id,
  title,
  description,
  progress,
  status,
  category,
  teamSize,
  dueDate,
  roles_needed = [],
  creator_id,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const statusColor = getStatusColor(status);
  const isCreator = user?.id === creator_id;

  const formattedDate = dueDate ? 
    new Date(dueDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) : null;

  const handleClick = () => {
    navigate(`/project/${id}/overview`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{title}</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge className={statusColor}>{status}</Badge>
              <Badge variant="outline">{category}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
          {description}
        </p>
        
        {roles_needed && roles_needed.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm mb-1">
              <Briefcase size={14} className="mr-1" />
              <span className="font-medium">Open Roles:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {roles_needed.map((role, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            {formattedDate && (
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formattedDate}</span>
              </div>
            )}
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{teamSize}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col gap-2">
        <Button 
          onClick={handleClick} 
          variant="ghost" 
          className="w-full justify-between hover:bg-cobrew-50"
        >
          <span>View project</span>
          <ArrowRight size={16} />
        </Button>
        
        {roles_needed && roles_needed.length > 0 && !isCreator && user && (
          <ApplyProjectForm 
            projectId={id} 
            projectTitle={title} 
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
