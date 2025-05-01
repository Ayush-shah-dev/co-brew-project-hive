
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";
import JoinProjectButton from "@/components/dashboard/JoinProjectButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Filter } from "lucide-react";
import { getProjects, StartupProject, ProjectCategory, ProjectStage } from "@/services/projectService";
import { useQuery } from "@tanstack/react-query";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });
  
  const projectCategories = ["SaaS", "AI", "Marketplace", "FinTech", "EdTech", "HealthTech", "Other"];
  const projectStages = ["idea", "mvp", "growth", "scaling"];
  
  // Apply all filters
  const filteredProjects = projects.filter((project: StartupProject) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesStage = stageFilter === "all" || project.stage === stageFilter;
    
    return matchesSearch && matchesCategory && matchesStage;
  });
  
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

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search projects by title, description, or category..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-60 p-3">
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {projectCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Stage</label>
                        <Select value={stageFilter} onValueChange={setStageFilter}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            {projectStages.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage.charAt(0).toUpperCase() + stage.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
                  <ToggleGroupItem value="grid" aria-label="Toggle grid view">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="Toggle list view">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
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
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"}>
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
                      <div className={viewMode === "grid" ? "col-span-3 py-10 text-center" : "py-10 text-center"}>
                        <p className="text-muted-foreground">No projects found matching your filters.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"}>
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
                      <div className={viewMode === "grid" ? "col-span-3 py-10 text-center" : "py-10 text-center"}>
                        <p className="text-muted-foreground">No active projects found.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="idea" className="mt-6">
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"}>
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
                      <div className={viewMode === "grid" ? "col-span-3 py-10 text-center" : "py-10 text-center"}>
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
