
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProjectCard, { ProjectCardProps } from "@/components/dashboard/ProjectCard";
import CreateProjectButton from "@/components/dashboard/CreateProjectButton";
import JoinProjectButton from "@/components/dashboard/JoinProjectButton";

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
];

const Dashboard = () => {
  const [projects, setProjects] = useState<ProjectCardProps[]>(sampleProjects);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage your projects
                </p>
              </div>
              <div className="flex gap-2">
                <JoinProjectButton />
                <CreateProjectButton />
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Active Projects <span className="text-muted-foreground font-normal">({projects.filter(p => p.status === "active").length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter(project => project.status === "active")
                  .map(project => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">
                Completed <span className="text-muted-foreground font-normal">({projects.filter(p => p.status === "completed").length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter(project => project.status === "completed")
                  .map(project => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Drafts <span className="text-muted-foreground font-normal">({projects.filter(p => p.status === "draft").length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects
                  .filter(project => project.status === "draft")
                  .map(project => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
