
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProjectCard, { ProjectCardProps } from "@/components/dashboard/ProjectCard";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";
import JoinProjectButton from "@/components/dashboard/JoinProjectButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample project data
const sampleProjects: ProjectCardProps[] = [
  {
    id: "1",
    title: "Co-Brew Platform Development",
    description: "Building a collaborative project management platform for teams",
    progress: 65,
    status: "active",
    teamSize: 4,
    dueDate: "2024-05-20",
  },
  {
    id: "2",
    title: "Website Redesign",
    description: "Improving the UX/UI of the company's main website",
    progress: 30,
    status: "active",
    teamSize: 3,
    dueDate: "2024-06-15",
  },
  {
    id: "3",
    title: "Mobile App Launch",
    description: "Preparing for the launch of our new mobile application",
    progress: 90,
    status: "active",
    teamSize: 5,
    dueDate: "2024-04-30",
  },
  {
    id: "4",
    title: "Marketing Campaign",
    description: "Q2 marketing campaign for product awareness",
    progress: 100,
    status: "completed",
    teamSize: 2,
    dueDate: "2024-04-01",
  },
  {
    id: "5",
    title: "Research Project",
    description: "Market research for new product opportunities",
    progress: 10,
    status: "draft",
    teamSize: 2,
    dueDate: "2024-07-15",
  },
  {
    id: "6",
    title: "Product Roadmap Planning",
    description: "Creating a roadmap for the next 12 months",
    progress: 100,
    status: "completed",
    teamSize: 6,
    dueDate: "2024-03-10",
  },
  {
    id: "7",
    title: "Budget Analysis",
    description: "Financial planning and budget analysis for Q3",
    progress: 45,
    status: "active",
    teamSize: 2,
    dueDate: "2024-05-30",
  },
  {
    id: "8",
    title: "Customer Journey Mapping",
    description: "Analyzing the customer experience across all touchpoints",
    progress: 15,
    status: "draft",
    teamSize: 3,
    dueDate: "2024-06-25",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<ProjectCardProps[]>(sampleProjects);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activeProjects = filteredProjects.filter(p => p.status === "active");
  const completedProjects = filteredProjects.filter(p => p.status === "completed");
  const draftProjects = filteredProjects.filter(p => p.status === "draft");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground mt-1">
                  Browse and manage all your projects
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
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">
                  All <span className="ml-1 text-xs">({filteredProjects.length})</span>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active <span className="ml-1 text-xs">({activeProjects.length})</span>
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed <span className="ml-1 text-xs">({completedProjects.length})</span>
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Drafts <span className="ml-1 text-xs">({draftProjects.length})</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map(project => (
                    <ProjectCard key={project.id} {...project} />
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
                  {activeProjects.map(project => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                  {activeProjects.length === 0 && (
                    <div className="col-span-3 py-10 text-center">
                      <p className="text-muted-foreground">No active projects found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="completed" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedProjects.map(project => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                  {completedProjects.length === 0 && (
                    <div className="col-span-3 py-10 text-center">
                      <p className="text-muted-foreground">No completed projects found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="draft" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftProjects.map(project => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                  {draftProjects.length === 0 && (
                    <div className="col-span-3 py-10 text-center">
                      <p className="text-muted-foreground">No draft projects found.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
