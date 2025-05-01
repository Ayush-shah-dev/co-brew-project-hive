
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserApplications, ProjectApplication } from "@/services/applicationService";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getUserApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
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
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">You haven't applied to any projects yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">My Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {applications.map(application => (
            <div key={application.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{application.project?.title || 'Unknown Project'}</h4>
                {renderStatusBadge(application.status)}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mb-3">
                <Clock className="h-3 w-3 mr-1" />
                Applied on {new Date(application.created_at).toLocaleDateString()}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs mt-1"
                onClick={() => navigate(`/project/${application.project_id}/overview`)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Project
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyApplications;
