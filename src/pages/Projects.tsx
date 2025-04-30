
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";
import JoinProjectButton from "@/components/dashboard/JoinProjectButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { getProjects, StartupProject } from "@/services/projectService";
import { useQuery } from "@tanstack/react-query";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });
  
  const filteredProjects = projects.filter((project: StartupProject) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter projects by stage for the tabs
  const activeProjects = filteredProjects.filter(p => ["mvp", "growth", "scaling"].includes(p.stage));
  const ideaProjects = filteredProjects.filter(p => p.stage === "idea");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Startup Projects</h1>
                <p className="text-muted-foreground mt-1">
                  Browse and manage your startup projects
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <JoinProjectButton />
                <CreateProjectButton />
              </div>
            </div>

            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search projects by title, description, or category..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-cobrew-600" />
              </div>
            ) : error ? (
              <div className="py-10 text-center">
                <p className="text-red-500">Failed to load projects. Please try again.</p>
              </div>
            ) : (
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">
                    All <span className="ml-1 text-xs">({filteredProjects.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="active">
                    Active <span className="ml-1 text-xs">({activeProjects.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="idea">
                    Ideas <span className="ml-1 text-xs">({ideaProjects.length})</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project: StartupProject) => (
                      <ProjectCard 
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        status={project.stage as any}
                        category={project.category}
                        progress={50} // This would be calculated based on tasks/milestones
                        teamSize={3} // This would come from project members count
                        dueDate="2024-06-30" // This would be a new field to add
                      />
                    ))}
                    {filteredProjects.length === 0 && (
                      <div className="col-span-3 py-10 text-center">
                        <p className="text-muted-foreground">No projects found matching your search.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.map((project: StartupProject) => (
                      <ProjectCard 
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        status={project.stage as any}
                        category={project.category}
                        progress={50}
                        teamSize={3}
                        dueDate="2024-06-30"
                      />
                    ))}
                    {activeProjects.length === 0 && (
                      <div className="col-span-3 py-10 text-center">
                        <p className="text-muted-foreground">No active projects found.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="idea" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideaProjects.map((project: StartupProject) => (
                      <ProjectCard 
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        status={project.stage as any}
                        category={project.category}
                        progress={20}
                        teamSize={2}
                        dueDate="2024-08-30"
                      />
                    ))}
                    {ideaProjects.length === 0 && (
                      <div className="col-span-3 py-10 text-center">
                        <p className="text-muted-foreground">No idea stage projects found.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
