
import { Calendar, ArrowRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export type ProjectStatus = "active" | "completed" | "draft";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  teamSize: number;
  dueDate: string;
}

const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "draft":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
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
  teamSize,
  dueDate,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const statusColor = getStatusColor(status);

  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleClick = () => {
    navigate(`/project/${id}/overview`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{title}</h3>
            <Badge className={statusColor}>{status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
          {description}
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Users size={14} className="mr-1" />
              <span>{teamSize}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={handleClick} 
          variant="ghost" 
          className="w-full justify-between hover:bg-cobrew-50"
        >
          <span>View project</span>
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
