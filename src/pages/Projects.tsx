
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search,
  Filter,
  LayoutGrid, 
  List as ListIcon,
  ChevronDown,
  User,
  Briefcase,
  Code,
  LineChart,
  BookOpen,
  Palette,
  Globe,
  ShoppingBag,
  HeartPulse,
  Laptop,
  Sparkles
} from "lucide-react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { 
  getProjectsWithApplicationStatus, 
  StartupProject, 
  ProjectStage, 
  ProjectCategory 
} from "@/services/projectService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use the function that gets projects with application status
  const { 
    data: projects, 
    isLoading, 
    error,
    refetch
  } = useProjectsWithStatus();

  useEffect(() => {
    // Refetch projects when user logs in/out
    if (user) {
      refetch();
    }
  }, [user, refetch]);
  
  function useProjectsWithStatus() {
    const [data, setData] = useState<StartupProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await getProjectsWithApplicationStatus();
        setData(fetchedProjects);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching projects'));
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };
    
    useEffect(() => {
      fetchProjects();
    }, []);
    
    return { 
      data, 
      isLoading, 
      error,
      refetch: fetchProjects
    };
  }

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || project.category === categoryFilter;
    const matchesStage = !stageFilter || project.stage === stageFilter;
    const matchesRole = !roleFilter || (project.roles_needed && project.roles_needed.includes(roleFilter));
    
    return matchesSearch && matchesCategory && matchesStage && matchesRole;
  });

  // Category icon mapping
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'SaaS': return <Code size={18} />;
      case 'AI': return <Sparkles size={18} />;
      case 'FinTech': return <LineChart size={18} />;
      case 'EdTech': return <BookOpen size={18} />;
      case 'HealthTech': return <HeartPulse size={18} />;
      case 'Marketplace': return <ShoppingBag size={18} />;
      case 'Design': return <Palette size={18} />;
      case 'Web3': return <Globe size={18} />;
      case 'Hardware': return <Laptop size={18} />;
      default: return <Briefcase size={18} />;
    }
  };

  // Categories data for filter
  const categories: { value: ProjectCategory; label: string; icon: React.ReactNode }[] = [
    { value: "SaaS", label: "SaaS", icon: <Code size={16} /> },
    { value: "AI", label: "AI", icon: <Sparkles size={16} /> },
    { value: "Marketplace", label: "Marketplace", icon: <ShoppingBag size={16} /> },
    { value: "FinTech", label: "FinTech", icon: <LineChart size={16} /> },
    { value: "EdTech", label: "EdTech", icon: <BookOpen size={16} /> },
    { value: "HealthTech", label: "HealthTech", icon: <HeartPulse size={16} /> },
    { value: "Other", label: "Other", icon: <Briefcase size={16} /> }
  ];

  // Stages data for filter
  const stages: { value: ProjectStage; label: string }[] = [
    { value: "idea", label: "Idea" },
    { value: "mvp", label: "MVP" },
    { value: "growth", label: "Growth" },
    { value: "scaling", label: "Scaling" }
  ];

  // Common roles data for filter
  const roles: string[] = [
    "Developer", 
    "Designer", 
    "Marketer", 
    "Product Manager", 
    "Data Scientist",
    "Content Writer"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Projects</h1>
          <p className="text-gray-300 text-lg">
            Find exciting startup projects to collaborate on
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-white/10 bg-white/5">
                    <Filter className="mr-2 h-4 w-4" />
                    Category
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-white/10">
                  <DropdownMenuItem 
                    className={!categoryFilter ? "bg-white/10" : ""}
                    onClick={() => setCategoryFilter("")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>All Categories</span>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.value}
                      className={categoryFilter === category.value ? "bg-white/10" : ""}
                      onClick={() => setCategoryFilter(category.value)}
                    >
                      {category.icon}
                      <span className="ml-2">{category.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-white/10 bg-white/5">
                    <Filter className="mr-2 h-4 w-4" />
                    Stage
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-white/10">
                  <DropdownMenuItem 
                    className={!stageFilter ? "bg-white/10" : ""}
                    onClick={() => setStageFilter("")}
                  >
                    <span>All Stages</span>
                  </DropdownMenuItem>
                  {stages.map((stage) => (
                    <DropdownMenuItem
                      key={stage.value}
                      className={stageFilter === stage.value ? "bg-white/10" : ""}
                      onClick={() => setStageFilter(stage.value)}
                    >
                      <span>{stage.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-white/10 bg-white/5">
                    <User className="mr-2 h-4 w-4" />
                    Roles
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-white/10">
                  <DropdownMenuItem 
                    className={!roleFilter ? "bg-white/10" : ""}
                    onClick={() => setRoleFilter("")}
                  >
                    <span>All Roles</span>
                  </DropdownMenuItem>
                  {roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      className={roleFilter === role ? "bg-white/10" : ""}
                      onClick={() => setRoleFilter(role)}
                    >
                      <span>{role}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center ml-2 space-x-1 bg-white/5 rounded-md p-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-white/10' : ''}`} 
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${viewMode === 'list' ? 'bg-white/10' : ''}`} 
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active filters display */}
          <div className="flex flex-wrap gap-2">
            {categoryFilter && (
              <Badge 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20 gap-1"
                onClick={() => setCategoryFilter("")}
              >
                {getCategoryIcon(categoryFilter)}
                {categoryFilter}
                <X className="h-3 w-3 ml-1 cursor-pointer" />
              </Badge>
            )}
            {stageFilter && (
              <Badge 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20"
                onClick={() => setStageFilter("")}
              >
                {stageFilter.charAt(0).toUpperCase() + stageFilter.slice(1)} Stage
                <X className="h-3 w-3 ml-1 cursor-pointer" />
              </Badge>
            )}
            {roleFilter && (
              <Badge 
                variant="secondary" 
                className="bg-white/10 hover:bg-white/20"
                onClick={() => setRoleFilter("")}
              >
                {roleFilter}
                <X className="h-3 w-3 ml-1 cursor-pointer" />
              </Badge>
            )}
          </div>
        </div>
        
        {/* Projects Display */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="backdrop-blur-sm bg-white/5 border-white/10 text-white animate-pulse">
                    <CardHeader className="h-24"></CardHeader>
                    <CardContent className="h-40"></CardContent>
                    <CardFooter className="h-12"></CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      progress={Math.floor(Math.random() * 100)} // Mock progress data
                      status={project.stage as "idea" | "mvp" | "growth" | "scaling"}
                      category={project.category}
                      teamSize={Math.floor(Math.random() * 10) + 1} // Mock team size data
                      dueDate={new Date(Date.now() + Math.random() * 10000000000).toISOString()} // Mock due date
                      roles_needed={project.roles_needed}
                      creator_id={project.creator_id}
                      application_status={project.application_status}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map(project => (
                    <Card 
                      key={project.id} 
                      className="backdrop-blur-sm bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => navigate(`/project/${project.id}/overview`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="border-white/20 bg-white/5">{project.category}</Badge>
                              <Badge 
                                className={`
                                  ${project.stage === 'idea' ? 'bg-blue-400/20 text-blue-300 border-blue-400/40' : ''}
                                  ${project.stage === 'mvp' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40' : ''}
                                  ${project.stage === 'growth' ? 'bg-green-400/20 text-green-300 border-green-400/40' : ''}
                                  ${project.stage === 'scaling' ? 'bg-purple-400/20 text-purple-300 border-purple-400/40' : ''}
                                  border
                                `}
                              >
                                {project.stage.charAt(0).toUpperCase() + project.stage.slice(1)} Stage
                              </Badge>
                              
                              {project.application_status && (
                                <Badge 
                                  className={`
                                    ${project.application_status === 'pending' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40' : ''}
                                    ${project.application_status === 'approved' ? 'bg-green-400/20 text-green-300 border-green-400/40' : ''}
                                    ${project.application_status === 'rejected' ? 'bg-red-400/20 text-red-300 border-red-400/40' : ''}
                                    border
                                  `}
                                >
                                  Application {project.application_status.charAt(0).toUpperCase() + project.application_status.slice(1)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {project.roles_needed && project.roles_needed.length > 0 && (
                              <Badge className="bg-purple-500/20 text-purple-200 border border-purple-500/20">
                                <Briefcase size={12} className="mr-1" />
                                Hiring: {project.roles_needed.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white">No projects found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="applied">
            {user ? (
              <div className="space-y-4">
                {filteredProjects
                  .filter(project => project.application_status)
                  .map(project => (
                    <Card 
                      key={project.id} 
                      className="backdrop-blur-sm bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => navigate(`/project/${project.id}/overview`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="border-white/20 bg-white/5">{project.category}</Badge>
                              {project.application_status && (
                                <Badge 
                                  className={`
                                    ${project.application_status === 'pending' ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40' : ''}
                                    ${project.application_status === 'approved' ? 'bg-green-400/20 text-green-300 border-green-400/40' : ''}
                                    ${project.application_status === 'rejected' ? 'bg-red-400/20 text-red-300 border-red-400/40' : ''}
                                    border
                                  `}
                                >
                                  Application {project.application_status.charAt(0).toUpperCase() + project.application_status.slice(1)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {filteredProjects.filter(project => project.application_status).length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">No applications yet</h3>
                    <p className="text-gray-400 mt-2">Browse projects and apply to join exciting startups</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Sign in to view your applications</h3>
                <p className="text-gray-400 mt-2">Track applications and join exciting startup projects</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="joined">
            {user ? (
              <div className="space-y-4">
                {filteredProjects
                  .filter(project => project.application_status === 'approved')
                  .map(project => (
                    <Card 
                      key={project.id} 
                      className="backdrop-blur-sm bg-gradient-to-br from-green-500/20 to-green-700/30 border-green-500/20 text-white hover:bg-green-500/30 transition-all cursor-pointer"
                      onClick={() => navigate(`/project/${project.id}/overview`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="border-white/20 bg-white/5">{project.category}</Badge>
                              <Badge className="bg-green-400/20 text-green-300 border-green-400/40 border">
                                Team Member
                              </Badge>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="bg-white/10 hover:bg-white/20"
                          >
                            Dashboard
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {filteredProjects.filter(project => project.application_status === 'approved').length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">No joined projects yet</h3>
                    <p className="text-gray-400 mt-2">When you're accepted to a project, it will appear here</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Sign in to view your projects</h3>
                <p className="text-gray-400 mt-2">Join exciting startup projects and collaborate</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
      </div>
    </div>
  );
};

export default Projects;

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
