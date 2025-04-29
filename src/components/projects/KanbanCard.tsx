
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { KanbanItem } from "./KanbanBoard";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  medium: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  high: "bg-red-100 text-red-800 hover:bg-red-200"
};

interface KanbanCardProps {
  item: KanbanItem;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

const KanbanCard = ({ item, onMoveLeft, onMoveRight }: KanbanCardProps) => {
  const { title, description, assignee, priority, dueDate } = item;

  const formattedDate = dueDate 
    ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="kanban-card group">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mt-2">
          {priority && (
            <Badge className={priorityColors[priority]}>
              {priority}
            </Badge>
          )}
          
          {!priority && <div></div>}
          
          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>
        
        {formattedDate && (
          <div className="text-xs text-muted-foreground mt-1">
            Due: {formattedDate}
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onMoveLeft}
          >
            <ArrowLeft size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onMoveRight}
          >
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
