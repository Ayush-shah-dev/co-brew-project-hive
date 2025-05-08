
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";
import JoinProjectButton from "@/components/dashboard/JoinProjectButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Filter, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { getProjectsWithApplicationStatus, StartupProject, ProjectCategory, ProjectStage } from "@/services/projectService";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  
  // Use the function that gets projects with application status
  const { 
    data: projects = [], 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['projects-with-status'],
    queryFn: getProjectsWithApplicationStatus,
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchOnMount: true,
  });
  
  // Refresh projects when component mounts or when user changes
  useEffect(() => {
    console.log("Refreshing projects data");
    refetch();
  }, [refetch, user?.id]); 
  
  const projectCategories = ["SaaS", "AI", "Marketplace", "FinTech", "EdTech", "HealthTech", "Other"];
  const projectStages = ["idea", "mvp", "growth", "scaling"];
  
  // Extract all unique roles from all projects
  const allRoles = Array.from(
    new Set(
      projects.flatMap((project: any) => project.roles_needed || [])
    )
  ).filter(Boolean);
  
  // Apply all filters
  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
    const matchesStage = stageFilter === "all" || project.stage === stageFilter;
    
    const matchesRole = 
      !roleFilter || 
      (project.roles_needed && 
       project.roles_needed.some((role: string) => 
         role.toLowerCase().includes(roleFilter.toLowerCase())
       ));
    
    return matchesSearch && matchesCategory && matchesStage && matchesRole;
  });
  
  // Filter projects by stage for the tabs
  const activeProjects = filteredProjects.filter((p: any) => ["mvp", "growth", "scaling"].includes(p.stage));
  const ideaProjects = filteredProjects.filter((p: any) => p.stage === "idea");

  // Get featured projects - select some of the most recent ones
  const featuredProjects = projects
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Manually trigger refresh when needed
  const handleRefresh = () => {
    toast.info("Refreshing projects...");
    refetch();
  };

  // Count projects matching filters
  const projectCount = filteredProjects.length;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            {/* Top header area with improved visuals */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Discover Projects</h1>
                <p className="text-gray-300 mt-2">Find exciting projects to join or create your own</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <JoinProjectButton />
                <CreateProjectButton />
              </div>
            </div>

            {/* Enhanced search and filters area */}
            <div className="bg-slate-800/70 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-8 shadow-lg shadow-purple-500/5">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Search projects by title, description, or category..."
                    className="pl-10 bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleRefresh}
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-purple-300"
                  >
                    <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-purple-300">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60 p-3 bg-slate-800 border-purple-500/20">
                      <DropdownMenuLabel className="text-purple-300">Filter Options</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Category</label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full bg-slate-700/70 border-white/10 text-white">
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10">
                              <SelectItem value="all" className="text-white">All Categories</SelectItem>
                              {projectCategories.map((category) => (
                                <SelectItem key={category} value={category} className="text-white">
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Stage</label>
                          <Select value={stageFilter} onValueChange={setStageFilter}>
                            <SelectTrigger className="w-full bg-slate-700/70 border-white/10 text-white">
                              <SelectValue placeholder="Filter by stage" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10">
                              <SelectItem value="all" className="text-white">All Stages</SelectItem>
                              {projectStages.map((stage) => (
                                <SelectItem key={stage} value={stage} className="text-white">
                                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Role</label>
                          <Input 
                            placeholder="Search by role..."
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-slate-700/70 border-white/10 text-white"
                          />
                          {allRoles.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {allRoles.slice(0, 6).map((role) => (
                                <Badge 
                                  key={role} 
                                  variant="outline" 
                                  className="cursor-pointer text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30"
                                  onClick={() => setRoleFilter(role)}
                                >
                                  {role}
                                </Badge>
                              ))}
                              {allRoles.length > 6 && (
                                <span className="text-xs text-gray-400 mt-1">
                                  +{allRoles.length - 6} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
                    <ToggleGroupItem value="grid" aria-label="Toggle grid view" className="bg-white/5 border-white/10 data-[state=on]:bg-purple-600/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="Toggle list view" className="bg-white/5 border-white/10 data-[state=on]:bg-purple-600/70">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              
              {/* Quick filter chips */}
              <div className="flex flex-wrap gap-2">
                <div className="text-gray-300 flex items-center mr-2">
                  Quick filters:
                </div>
                <Button 
                  variant={categoryFilter === "all" && stageFilter === "all" && !roleFilter ? "default" : "outline"}
                  size="sm" 
                  className={categoryFilter === "all" && stageFilter === "all" && !roleFilter 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:text-purple-300"}
                  onClick={() => {
                    setCategoryFilter("all");
                    setStageFilter("all");
                    setRoleFilter("");
                  }}
                >
                  All Projects
                </Button>
                
                <Button 
                  variant={stageFilter === "idea" ? "default" : "outline"}
                  size="sm" 
                  className={stageFilter === "idea" 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:text-blue-300"}
                  onClick={() => setStageFilter("idea")}
                >
                  Idea Stage
                </Button>
                
                <Button 
                  variant={stageFilter === "mvp" ? "default" : "outline"}
                  size="sm" 
                  className={stageFilter === "mvp" 
                    ? "bg-yellow-600 hover:bg-yellow-700" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:text-yellow-300"}
                  onClick={() => setStageFilter("mvp")}
                >
                  MVP Stage
                </Button>
                
                <Button 
                  variant={stageFilter === "growth" ? "default" : "outline"}
                  size="sm" 
                  className={stageFilter === "growth" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:text-green-300"}
                  onClick={() => setStageFilter("growth")}
                >
                  Growth Stage
                </Button>
                
                {user && (
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-purple-300 ml-auto"
                    onClick={() => navigate("/dashboard")}
                  >
                    My Projects
                  </Button>
                )}
              </div>
            </div>
            
            {/* Projects count display */}
            <div className="text-sm text-gray-400 mb-4">
              Projects matching filters: <span className="font-semibold text-white">{projectCount}</span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                  <p className="text-gray-400">Loading amazing projects...</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-10 text-center bg-red-500/10 rounded-lg border border-red-500/20 p-6">
                <p className="text-red-400 mb-3">Failed to load projects. Please try again.</p>
                <Button onClick={handleRefresh} variant="outline" className="border-red-500/30 hover:bg-red-500/20">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {/* Featured Projects Section with enhanced visuals */}
                {featuredProjects.length > 0 && (
                  <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Featured Projects
                      </h2>
                      
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="rounded-full w-8 h-8 p-0 bg-white/5 border-white/10 hover:bg-white/10 hover:text-purple-300">
                          <ArrowLeft size={16} />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full w-8 h-8 p-0 bg-white/5 border-white/10 hover:bg-white/10 hover:text-purple-300">
                          <ArrowRight size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-3 gap-6" 
                      : "space-y-4"}>
                      {featuredProjects.map((project: any) => (
                        <ProjectCard 
                          key={project.id}
                          id={project.id}
                          title={project.title}
                          description={project.description}
                          status={project.stage as any}
                          category={project.category}
                          progress={project.stage === "idea" ? 20 : project.stage === "mvp" ? 40 : project.stage === "growth" ? 70 : 90}
                          teamSize={3}
                          dueDate="2024-08-30"
                          roles_needed={project.roles_needed}
                          creator_id={project.creator_id}
                          application_status={project.application_status}
                        />
                      ))}
                    </div>
                  </div>
                )}
              
                {/* Main Projects Section with tabs */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">All Projects</h2>
                  
                  <Tabs defaultValue="all" className="mb-6">
                    <TabsList className="bg-slate-700/50 p-1 rounded-lg border border-purple-500/10">
                      <TabsTrigger value="all" className="text-white data-[state=active]:bg-purple-600/70 data-[state=active]:text-white">
                        All <span className="ml-1 text-xs">({filteredProjects.length})</span>
                      </TabsTrigger>
                      <TabsTrigger value="active" className="text-white data-[state=active]:bg-purple-600/70 data-[state=active]:text-white">
                        Active <span className="ml-1 text-xs">({activeProjects.length})</span>
                      </TabsTrigger>
                      <TabsTrigger value="idea" className="text-white data-[state=active]:bg-purple-600/70 data-[state=active]:text-white">
                        Ideas <span className="ml-1 text-xs">({ideaProjects.length})</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-6">
                      <div className={viewMode === "grid" 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"}>
                        {filteredProjects.map((project: any) => (
                          <ProjectCard 
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            description={project.description}
                            status={project.stage as any}
                            category={project.category}
                            progress={project.stage === "idea" ? 20 : project.stage === "mvp" ? 40 : project.stage === "growth" ? 70 : 90}
                            teamSize={3}
                            dueDate="2024-08-30"
                            roles_needed={project.roles_needed}
                            creator_id={project.creator_id}
                            application_status={project.application_status}
                          />
                        ))}
                        {filteredProjects.length === 0 && (
                          <div className={viewMode === "grid" ? "col-span-3 py-10 text-center text-gray-400" : "py-10 text-center text-gray-400"}>
                            <p>No projects found matching your filters.</p>
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
                            progress={project.stage === "idea" ? 20 : project.stage === "mvp" ? 40 : project.stage === "growth" ? 70 : 90}
                            teamSize={3}
                            dueDate="2024-08-30"
                            roles_needed={project.roles_needed}
                            creator_id={project.creator_id}
                            application_status={project.application_status}
                          />
                        ))}
                        {activeProjects.length === 0 && (
                          <div className={viewMode === "grid" ? "col-span-3 py-10 text-center text-gray-400" : "py-10 text-center text-gray-400"}>
                            <p>No active projects found.</p>
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
                            progress={project.stage === "idea" ? 20 : project.stage === "mvp" ? 40 : project.stage === "growth" ? 70 : 90}
                            teamSize={3}
                            dueDate="2024-08-30"
                            roles_needed={project.roles_needed}
                            creator_id={project.creator_id}
                            application_status={project.application_status}
                          />
                        ))}
                        {ideaProjects.length === 0 && (
                          <div className={viewMode === "grid" ? "col-span-3 py-10 text-center text-gray-400" : "py-10 text-center text-gray-400"}>
                            <p>No idea stage projects found.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
