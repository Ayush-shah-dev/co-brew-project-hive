
import { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import { getProjectIdeas, updateIdeaStatus, ProjectIdea } from "@/services/ideaService";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export interface KanbanItem {
  id: string;
  title: string;
  description: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

const KanbanBoard = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "to_explore",
      title: "To Explore",
      items: [],
    },
    {
      id: "in_progress",
      title: "In Progress",
      items: [],
    },
    {
      id: "finalized",
      title: "Finalized",
      items: [],
    },
  ]);

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const projectIdeas = await getProjectIdeas(projectId);
        setIdeas(projectIdeas);
        
        // Transform project ideas into kanban items and organize by status
        const newColumns = [...columns];
        
        // Reset items in each column
        newColumns.forEach(col => {
          col.items = [];
        });
        
        // Distribute ideas to columns based on status
        projectIdeas.forEach(idea => {
          const column = newColumns.find(col => col.id === idea.status);
          if (column) {
            const kanbanItem: KanbanItem = {
              id: idea.id,
              title: idea.title,
              description: idea.description || "",
              priority: determinePriority(idea.votes),
              assignee: idea.creator ? {
                name: `${idea.creator.first_name} ${idea.creator.last_name}`,
                avatar: idea.creator.avatar_url || "",
              } : undefined,
            };
            column.items.push(kanbanItem);
          }
        });
        
        setColumns(newColumns);
      } catch (error) {
        console.error("Error fetching project ideas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIdeas();
  }, [projectId]);

  // Function to determine priority based on votes
  const determinePriority = (votes?: number): "low" | "medium" | "high" => {
    if (!votes) return "low";
    if (votes >= 5) return "high";
    if (votes >= 2) return "medium";
    return "low";
  };

  // Function to move an item from one column to another
  const moveItem = async (itemId: string, sourceColId: string, destColId: string) => {
    if (sourceColId === destColId) return;

    try {
      // Update the status in the database
      await updateIdeaStatus(itemId, destColId as 'to_explore' | 'in_progress' | 'finalized');
      
      // Update local state for immediate UI feedback
      setColumns((prevColumns) => {
        // Find the source column and item
        const sourceCol = prevColumns.find((col) => col.id === sourceColId);
        if (!sourceCol) return prevColumns;
        
        const itemIndex = sourceCol.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) return prevColumns;
        
        const item = sourceCol.items[itemIndex];
        
        // Find the destination column
        const destCol = prevColumns.find((col) => col.id === destColId);
        if (!destCol) return prevColumns;
        
        // Create new columns array with the item moved
        return prevColumns.map((col) => {
          if (col.id === sourceColId) {
            return {
              ...col,
              items: col.items.filter((i) => i.id !== itemId),
            };
          }
          if (col.id === destColId) {
            return {
              ...col,
              items: [...col.items, item],
            };
          }
          return col;
        });
      });
    } catch (error) {
      console.error("Error updating idea status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-cobrew-600" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          items={column.items}
          onMoveItem={moveItem}
          projectId={projectId}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
