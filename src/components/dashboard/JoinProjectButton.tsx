
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const JoinProjectButton = () => {
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would be replaced with actual project joining logic
      console.log("Joining project with code:", inviteCode);
      
      // Simulate process delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (inviteCode === "12345") {
        toast.success("Joined project successfully!");
        setOpen(false);
        setInviteCode("");
        navigate("/project/1/overview");
      } else {
        toast.error("Invalid invite code. Please check and try again.");
      }
    } catch (error) {
      console.error("Project join error:", error);
      toast.error("Failed to join project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Join via Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Join a project</DialogTitle>
          <DialogDescription>
            Enter the invite code provided by the project creator
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="Enter invite code (e.g., 12345)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              The invite code is usually 5-6 characters long
            </p>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-cobrew-600 hover:bg-cobrew-700"
              disabled={!inviteCode || isLoading}
            >
              {isLoading ? "Joining..." : "Join Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectButton;
