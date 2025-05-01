
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Calendar as CalendarIcon,
  Share,
  ArrowRight,
  Loader2,
  Trash2,
  Edit,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { getProjectById, getProjectMembers, deleteProject, StartupProject } from "@/services/projectService";
import ApplyProjectForm from "@/components/projects/ApplyProjectForm";
import ApplicationsList from "@/components/projects/ApplicationsList";

const ProjectDetails = () => {
  const { id, tab = "overview" } = useParams<{ id: string; tab: string }>();
  const [activeTab, setActiveTab] = useState(tab);
  const [project, setProject] = useState<StartupProject | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const isCreator = user?.id === project?.creator_id;
  const isMember = members.some(member => member.user_id === user?.id);

  useEffect(() => {
    if (id) {
      const fetchProjectData = async () => {
        setLoading(true);
        try {
          const projectData = await getProjectById(id);
          setProject(projectData);
          
          const membersData = await getProjectMembers(id);
          setMembers(membersData);
        } catch (error) {
          console.error("Failed to load project data", error);
          toast.error("Failed to load project data");
        } finally {
          setLoading(false);
        }
      };
      
      fetchProjectData();
    }
  }, [id]);

  const handleDeleteProject = async () => {
    if (!id) return;
    
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cobrew-600" />
          </main>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-hidden flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-4">Project not found</h1>
              <p className="mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate("/projects")}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const renderStageTag = (stage: string) => {
    const stageColors: Record<string, string> = {
      'idea': 'bg-blue-100 text-blue-800',
      'mvp': 'bg-yellow-100 text-yellow-800',
      'growth': 'bg-green-100 text-green-800',
      'scaling': 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={stageColors[stage] || 'bg-gray-100 text-gray-800'}>
        {stage}
      </Badge>
    );
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
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold mr-3">{project.title}</h1>
                    {renderStageTag(project.stage)}
                    <Badge variant="outline" className="ml-2">{project.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isCreator && (
                    <>
                      <Button variant="outline" onClick={() => toast.info("Edit functionality would be implemented here")}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                  {!isCreator && !isMember && user && (
                    <ApplyProjectForm projectId={id} projectTitle={project.title} />
                  )}
                  <Button className="bg-cobrew-600 hover:bg-cobrew-700">
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Created:</span>
                  <span>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">Team:</span>
                  <span>{members.length} members</span>
                </div>
                {project.funding_goal > 0 && (
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">Funding Goal:</span>
                    <span>${project.funding_goal.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Tabs */}
            <Tabs defaultValue={tab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-3 md:grid-cols-7 lg:inline-flex">
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
                {isCreator && (
                  <TabsTrigger value="applications">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Applications
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
                    <div className="bg-card rounded-lg border p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">About this startup</h3>
                      <p className="text-muted-foreground mb-6">
                        {project.description}
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Category</h4>
                          <Badge variant="outline">{project.category}</Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Stage</h4>
                          {renderStageTag(project.stage)}
                        </div>
                        
                        {project.tags && project.tags.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {project.funding_goal > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Funding Goal</h4>
                            <p>${project.funding_goal.toLocaleString()}</p>
                          </div>
                        )}
                        
                        {project.pitch_deck_url && (
                          <div>
                            <h4 className="font-medium mb-2">Resources</h4>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              <a 
                                href={project.pitch_deck_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-cobrew-600 hover:underline"
                              >
                                Pitch Deck
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                    <div className="space-y-3">
                      {members.length > 0 ? members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden mr-3">
                              {member.user?.avatar_url ? (
                                <img src={member.user.avatar_url} alt={`${member.user.first_name} ${member.user.last_name}`} />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-cobrew-100 text-cobrew-800 font-medium">
                                  {member.user?.first_name?.[0] || '?'}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {member.user?.first_name} {member.user?.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-muted-foreground">No team members found.</p>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => toast.info("Invite functionality would be implemented here")}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Invite Members
                      </Button>
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
              
              <TabsContent value="applications" className="mt-6">
                <div>
                  <h2 className="text-xl font-semibold mb-6">Applications</h2>
                  {id && isCreator && <ApplicationsList projectId={id} />}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project along with all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetails;
