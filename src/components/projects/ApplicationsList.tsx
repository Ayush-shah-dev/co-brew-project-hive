import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { ProjectApplication, getProjectApplications, updateApplicationStatus } from "@/services/applicationService";
import { toast } from "sonner";

type ApplicationsListProps = {
  projectId: string;
};

const ApplicationsList = ({ projectId }: ApplicationsListProps) => {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewApplication, setViewApplication] = useState<ProjectApplication | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    open: boolean;
    type: 'approve' | 'reject';
    applicationId: string;
  }>({
    open: false,
    type: 'approve',
    applicationId: '',
  });
  
  const { user } = useAuth();
  
  useEffect(() => {
    fetchApplications();
  }, [projectId]);
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getProjectApplications(projectId);
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await updateApplicationStatus(applicationId, status);
      // Update the local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      setConfirmAction({ open: false, type: 'approve', applicationId: '' });
      
      // Show appropriate toast message
      if (status === 'approved') {
        toast.success("Applicant has been approved and added to your team!");
      } else {
        toast.info("Application has been rejected");
      }
    } catch (error) {
      console.error(`Failed to ${status} application:`, error);
      toast.error(`Failed to ${status} application`);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading applications...</div>;
  }
  
  if (!applications.length) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No applications received yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Applications ({applications.length})</h3>
      
      {applications.map(application => (
        <Card key={application.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">
                  {application.applicant?.first_name} {application.applicant?.last_name || ''}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Applied {new Date(application.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {renderStatusBadge(application.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm line-clamp-2">
              {application.introduction}
            </p>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => setViewApplication(application)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Application
            </Button>
            {application.status === 'pending' && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 text-xs"
                  onClick={() => setConfirmAction({
                    open: true,
                    type: 'reject',
                    applicationId: application.id,
                  })}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-50 hover:bg-green-100 border-green-200 text-green-600 text-xs"
                  onClick={() => setConfirmAction({
                    open: true,
                    type: 'approve',
                    applicationId: application.id,
                  })}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
      
      {/* Application Detail Sheet */}
      <Sheet open={!!viewApplication} onOpenChange={(open) => !open && setViewApplication(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Application Details</SheetTitle>
            <SheetDescription>
              From {viewApplication?.applicant?.first_name} {viewApplication?.applicant?.last_name || ''}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-6 py-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Status</h4>
              {viewApplication && renderStatusBadge(viewApplication.status)}
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Introduction</h4>
              <p className="text-sm whitespace-pre-wrap">{viewApplication?.introduction}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Experience</h4>
              <p className="text-sm whitespace-pre-wrap">{viewApplication?.experience}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Motivation</h4>
              <p className="text-sm whitespace-pre-wrap">{viewApplication?.motivation}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Applied on</h4>
              <p className="text-sm">
                {viewApplication && new Date(viewApplication.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          <SheetFooter className="mt-6">
            {viewApplication?.status === 'pending' && (
              <div className="flex space-x-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                  onClick={() => {
                    setConfirmAction({
                      open: true,
                      type: 'reject',
                      applicationId: viewApplication.id,
                    });
                    setViewApplication(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setConfirmAction({
                      open: true,
                      type: 'approve',
                      applicationId: viewApplication.id,
                    });
                    setViewApplication(null);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
            {viewApplication?.status !== 'pending' && (
              <SheetClose asChild>
                <Button className="w-full">
                  Close
                </Button>
              </SheetClose>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmAction.open} 
        onOpenChange={(open) => !open && setConfirmAction({ ...confirmAction, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction.type === 'approve' ? 'Approve Application' : 'Reject Application'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.type === 'approve' 
                ? 'Are you sure you want to approve this application? The applicant will be added to your project team.'
                : 'Are you sure you want to reject this application? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirmAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={() => handleStatusUpdate(
                confirmAction.applicationId,
                confirmAction.type === 'approve' ? 'approved' : 'rejected'
              )}
            >
              {confirmAction.type === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApplicationsList;
