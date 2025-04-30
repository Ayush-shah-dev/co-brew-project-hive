
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getProjects, StartupProject } from "@/services/projectService";
import { useQuery } from "@tanstack/react-query";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    enabled: !!user
  });

  const recentProjects = projects.slice(0, 3);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderWelcome = () => {
    if (loading) {
      return <p>Loading...</p>;
    }
    
    const firstName = profile?.first_name || user.email?.split('@')[0] || 'there';
    return <span>{firstName}</span>;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Hi, {renderWelcome()}</h1>
              <p className="text-muted-foreground mt-1">
                Welcome to your startup collaboration dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Your Projects
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    {projectsLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      projects.length
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/projects')}>
                    <span>View all</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Tasks
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    0
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/projects')}>
                    <span>Manage tasks</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    New Ideas
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    0
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/projects')}>
                    <span>Browse ideas</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Projects</h2>
                <CreateProjectButton variant="outline" />
              </div>
              
              {projectsLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-6 w-6 animate-spin text-cobrew-600" />
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProjects.map((project: StartupProject) => (
                    <Card key={project.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`/project/${project.id}/overview`)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                        <CardDescription>
                          {project.stage} · {project.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full">
                          <span>View details</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No projects yet</CardTitle>
                    <CardDescription>
                      Create your first startup project to get started
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <CreateProjectButton />
                  </CardFooter>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Create a project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Start by creating your first startup project
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <CreateProjectButton variant="outline" />
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Invite team members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Add collaborators to your projects
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" disabled>Coming soon</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Add startup ideas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Brainstorm and organize your ideas
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" onClick={() => navigate('/projects')}>Browse projects</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Complete your profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Add your expertise and skills
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" onClick={() => navigate('/profile')}>Edit profile</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
