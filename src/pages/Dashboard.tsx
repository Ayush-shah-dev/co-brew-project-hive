
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getProjects, StartupProject } from "@/services/projectService";
import { useQuery } from "@tanstack/react-query";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";
import MyApplications from "@/components/dashboard/MyApplications";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    enabled: !!user
  });

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
      }
    };
    
    fetchProfile();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const renderWelcome = () => {
    const firstName = profile?.first_name || user.email?.split('@')[0] || 'there';
    return <span>{firstName}</span>;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto p-6">
            <div className="mb-8 bg-gradient-to-r from-cobrew-600 to-purple-700 p-6 rounded-xl text-white shadow-xl">
              <h1 className="text-3xl font-bold">Welcome back, {renderWelcome()}</h1>
              <p className="mt-2 opacity-90">
                Here are all available startup projects. Ready to collaborate?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Available Projects
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-white">
                    {projectsLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      projects.length
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-300 hover:text-white" onClick={() => navigate('/projects')}>
                    <span>Browse all</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    My Applications
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-300 hover:text-white">
                    <span>View applications</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white shadow-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Create Project
                  </CardTitle>
                  <CardDescription className="text-2xl font-bold text-white">
                    <span className="text-cobrew-400">+</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <CreateProjectButton variant="ghost" />
                </CardFooter>
              </Card>
            </div>
            
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="bg-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-cobrew-600">All Projects</TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-cobrew-600">Trending</TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-cobrew-600">Recently Added</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {projectsLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-6 w-6 animate-spin text-cobrew-600" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project: StartupProject) => (
                      <Card 
                        key={project.id} 
                        className="overflow-hidden hover:shadow-lg transition-all duration-200 backdrop-blur-sm bg-white/10 border-white/10 text-white cursor-pointer"
                        onClick={() => navigate(`/project/${project.id}/overview`)}
                      >
                        <div className="h-2 bg-gradient-to-r from-cobrew-500 to-purple-600"></div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                              <CardDescription className="text-gray-300">
                                {project.stage} · {project.category}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {project.description}
                          </p>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 pt-4 flex justify-between">
                          <div className="flex gap-1">
                            {(project.roles_needed || []).slice(0, 2).map((role, i) => (
                              <span key={i} className="inline-block bg-white/10 rounded-full px-2 py-1 text-xs">
                                {role}
                              </span>
                            ))}
                            {(project.roles_needed || []).length > 2 && (
                              <span className="inline-block bg-white/10 rounded-full px-2 py-1 text-xs">
                                +{(project.roles_needed || []).length - 2}
                              </span>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0">
                            <span>View</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="trending">
                <div className="p-12 text-center text-gray-400">
                  Trending projects coming soon
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="p-12 text-center text-gray-400">
                  Recently added projects coming soon
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/5 border-white/10 text-white h-full">
                  <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-400">Activity feed coming soon</p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <MyApplications />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
