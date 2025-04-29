
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";

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

// Sample kanban data
const initialColumns: KanbanColumn[] = [
  {
    id: "to-explore",
    title: "To Explore",
    items: [
      {
        id: "item-1",
        title: "User authentication system",
        description: "Implement secure login with OAuth and email verification",
        priority: "high",
      },
      {
        id: "item-2",
        title: "Real-time collaboration",
        description: "Research WebSocket solutions for real-time updates",
        assignee: {
          name: "Sarah Kim",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        priority: "medium",
      },
      {
        id: "item-3",
        title: "Mobile responsive design",
        description: "Ensure all pages work well on mobile devices",
        priority: "low",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      {
        id: "item-4",
        title: "Dashboard UI design",
        description: "Create wireframes and high-fidelity mockups",
        assignee: {
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        priority: "high",
        dueDate: "2024-05-10",
      },
      {
        id: "item-5",
        title: "Database schema design",
        description: "Design normalized schema for project requirements",
        priority: "medium",
      },
    ],
  },
  {
    id: "finalized",
    title: "Finalized",
    items: [
      {
        id: "item-6",
        title: "Project requirements",
        description: "Document core features and user stories",
        assignee: {
          name: "Alex Chen",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        priority: "high",
      },
      {
        id: "item-7",
        title: "Tech stack selection",
        description: "Evaluate and select technologies for the project",
        assignee: {
          name: "Priya Sharma",
          avatar: "https://i.pravatar.cc/150?img=6",
        },
        priority: "medium",
      },
    ],
  },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  // Function to move an item from one column to another
  const moveItem = (itemId: string, sourceColId: string, destColId: string) => {
    if (sourceColId === destColId) return;

    setColumns((prevColumns) => {
      // Find the source column and item
      const sourceCol = prevColumns.find((col) => col.id === sourceColId);
      if (!sourceCol) return prevColumns;
      
      const item = sourceCol.items.find((item) => item.id === itemId);
      if (!item) return prevColumns;
      
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
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          items={column.items}
          onMoveItem={moveItem}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
