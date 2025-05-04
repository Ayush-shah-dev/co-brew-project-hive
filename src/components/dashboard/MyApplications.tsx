
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
        return <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/40 border">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-400/20 text-green-300 border-green-400/40 border">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-400/20 text-red-300 border-red-400/40 border">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="border-white/20">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">Loading...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300">You haven't applied to any projects yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">My Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {applications.map(application => (
            <div key={application.id} className="border border-white/10 rounded-md p-3 bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{application.project?.title || 'Unknown Project'}</h4>
                {renderStatusBadge(application.status)}
              </div>
              <div className="flex items-center text-xs text-gray-300 mb-3">
                <Clock className="h-3 w-3 mr-1" />
                Applied on {new Date(application.created_at).toLocaleDateString()}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-xs mt-1 text-gray-300 hover:text-white hover:bg-white/10"
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
