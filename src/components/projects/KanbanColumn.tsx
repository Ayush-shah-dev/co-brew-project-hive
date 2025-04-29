
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanCard from "./KanbanCard";
import { KanbanItem } from "./KanbanBoard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface KanbanColumnProps {
  id: string;
  title: string;
  items: KanbanItem[];
  onMoveItem: (itemId: string, sourceColId: string, destColId: string) => void;
}

const KanbanColumn = ({ id, title, items, onMoveItem }: KanbanColumnProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

  const handleAddItem = () => {
    // This would typically make an API call
    console.log("Adding new item:", {
      title: newItemTitle,
      description: newItemDescription,
      columnId: id,
    });
    
    toast.success("New idea added!");
    
    // Reset and close
    setNewItemTitle("");
    setNewItemDescription("");
    setIsDialogOpen(false);
  };

  // Simulate drag and drop capabilities
  const handleMoveRight = (itemId: string) => {
    const columnIds = ["to-explore", "in-progress", "finalized"];
    const currentIndex = columnIds.indexOf(id);
    
    if (currentIndex < columnIds.length - 1) {
      onMoveItem(itemId, id, columnIds[currentIndex + 1]);
    }
  };

  const handleMoveLeft = (itemId: string) => {
    const columnIds = ["to-explore", "in-progress", "finalized"];
    const currentIndex = columnIds.indexOf(id);
    
    if (currentIndex > 0) {
      onMoveItem(itemId, id, columnIds[currentIndex - 1]);
    }
  };

  return (
    <div className="kanban-column">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          {title} <span className="ml-1 text-xs">({items.length})</span>
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <KanbanCard 
            key={item.id} 
            item={item} 
            onMoveRight={() => handleMoveRight(item.id)}
            onMoveLeft={() => handleMoveLeft(item.id)}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new idea</DialogTitle>
            <DialogDescription>
              Create a new idea card in the {title} column
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your idea"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAddItem}
              className="bg-cobrew-600 hover:bg-cobrew-700"
              disabled={!newItemTitle.trim()}
            >
              Add Idea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanColumn;
