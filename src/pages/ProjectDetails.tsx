
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import KanbanBoard from "@/components/projects/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Clock,
  LayoutDashboard, 
  MessageSquare, 
  ListTodo, 
  FileText, 
  Timeline,
  Share
} from "lucide-react";

const ProjectDetails = () => {
  const { id, tab = "overview" } = useParams<{ id: string; tab: string }>();
  const [activeTab, setActiveTab] = useState(tab);

  // This would be fetched from an API based on the project ID
  const project = {
    title: "Co-Brew Platform Development",
    description: "Building a collaborative project management platform for teams to ideate, plan, and execute projects together in real-time.",
    progress: 65,
    status: "active",
    teamSize: 4,
    startDate: "2024-01-15",
    dueDate: "2024-05-20",
    members: [
      {
        id: "1",
        name: "Alex Chen",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "Admin"
      },
      {
        id: "2",
        name: "Sarah Kim",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "Collaborator"
      },
      {
        id: "3",
        name: "Mike Johnson",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "Collaborator"
      },
      {
        id: "4",
        name: "Priya Sharma",
        avatar: "https://i.pravatar.cc/150?img=6",
        role: "Viewer"
      }
    ]
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {/* Project Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold">{project.title}</h1>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    {project.description}
                  </p>
                </div>
                <Button className="bg-cobrew-600 hover:bg-cobrew-700">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Timeline:</span>
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Team:</span>
                  <span>{project.teamSize} members</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock size={16} className="mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Progress:</span>
                  <span>{project.progress}% complete</span>
                </div>
              </div>
            </div>

            {/* Project Tabs */}
            <Tabs defaultValue="ideas" className="mb-6">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:inline-flex">
                <TabsTrigger value="overview">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="ideas">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ideas
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <ListTodo className="mr-2 h-4 w-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="docs">
                  <FileText className="mr-2 h-4 w-4" />
                  Docs
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Timeline className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                    <p className="text-muted-foreground mb-6">
                      This page would contain a summary dashboard with key metrics, recent activities,
                      and upcoming milestones.
                    </p>
                    <div className="p-12 border border-dashed rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Project overview dashboard will be displayed here</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                    <div className="space-y-3">
                      {project.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-3">
                              <img src={member.avatar} alt={member.name} />
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="ideas" className="mt-6">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Idea Board</h2>
                  <KanbanBoard />
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-6">
                <div className="p-12 border border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Task management board will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="docs" className="mt-6">
                <div className="p-12 border border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Document editor will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-6">
                <div className="p-12 border border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Chat interface will be displayed here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-6">
                <div className="p-12 border border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Gantt chart timeline will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
