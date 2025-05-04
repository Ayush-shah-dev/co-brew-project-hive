
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
      return "bg-blue-400/20 text-blue-300 border-blue-400/40";
    case "mvp":
      return "bg-yellow-400/20 text-yellow-300 border-yellow-400/40";
    case "growth":
      return "bg-green-400/20 text-green-300 border-green-400/40";
    case "scaling":
      return "bg-purple-400/20 text-purple-300 border-purple-400/40";
    default:
      return "bg-gray-400/20 text-gray-300 border-gray-400/40";
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cobrew-500/10 border-white/10 backdrop-blur-sm bg-white/5 text-white">
      <div className="h-2 bg-gradient-to-r from-cobrew-500 to-purple-600"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <h3 className="font-semibold text-lg line-clamp-1 mb-2">{title}</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge className={`${statusColor} border`}>{status}</Badge>
              <Badge variant="outline" className="border-white/20 bg-white/10">{category}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-gray-300 text-sm line-clamp-2 mb-4 h-10">
          {description}
        </p>
        
        {roles_needed && roles_needed.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-sm mb-1 text-gray-300">
              <Briefcase size={14} className="mr-1" />
              <span className="font-medium">Hiring for:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {roles_needed.map((role, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-white">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Progress</span>
              <span className="font-medium text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/10" indicatorClassName="bg-gradient-to-r from-cobrew-500 to-purple-600" />
          </div>
          <div className="flex justify-between text-sm text-gray-300">
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
      <CardFooter className="pt-2 border-t border-white/10 flex flex-col gap-2">
        <Button 
          onClick={handleClick} 
          variant="ghost" 
          className="w-full justify-between text-gray-300 hover:text-white hover:bg-white/10"
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
