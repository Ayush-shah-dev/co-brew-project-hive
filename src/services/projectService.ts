import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type StartupProject = {
  id: string;
  title: string;
  description: string;
  stage: string;
  category: string;
  tags: string[];
  funding_goal: number;
  pitch_deck_url?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
};

export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
};

export type ProjectStage = "idea" | "mvp" | "growth" | "scaling";
export type ProjectCategory = "SaaS" | "AI" | "Marketplace" | "FinTech" | "EdTech" | "HealthTech" | "Other";

// Project CRUD operations
export async function createProject(projectData: Omit<StartupProject, 'id' | 'created_at' | 'updated_at' | 'creator_id'>) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('startup_projects')
      .insert({
        ...projectData,
        creator_id: userData.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Add creator as admin member
    await supabase
      .from('project_members')
      .insert({
        project_id: data.id,
        user_id: userData.user.id,
        role: 'admin'
      });
      
    return data;
  } catch (error: any) {
    console.error("Error creating project:", error);
    toast.error(error.message || "Failed to create project");
    throw error;
  }
}

export async function getProjects() {
  try {
    // Fetch all projects without any filtering by creator_id
    // This ensures all users can see all projects
    const { data, error } = await supabase
      .from('startup_projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    console.log("Projects fetched:", data?.length || 0);
    return data || [];
  } catch (error: any) {
    console.error("Error getting projects:", error);
    toast.error(error.message || "Failed to fetch projects");
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    const { data, error } = await supabase
      .from('startup_projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error getting project ${id}:`, error);
    toast.error(error.message || "Failed to fetch project");
    throw error;
  }
}

export async function updateProject(id: string, projectData: Partial<StartupProject>) {
  try {
    const { data, error } = await supabase
      .from('startup_projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error updating project ${id}:`, error);
    toast.error(error.message || "Failed to update project");
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabase
      .from('startup_projects')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error deleting project ${id}:`, error);
    toast.error(error.message || "Failed to delete project");
    throw error;
  }
}

// Project members operations
export async function getProjectMembers(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId);
      
    if (error) throw error;
    
    // Format the data to match ProjectMember type
    return (data || []).map(item => ({
      ...item,
      user: item.profiles
    }));
  } catch (error: any) {
    console.error(`Error getting members for project ${projectId}:`, error);
    toast.error(error.message || "Failed to fetch project members");
    return [];
  }
}

export async function addProjectMember(projectId: string, email: string, role: string) {
  try {
    // First find the user ID from the email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) throw userError;
    if (!userData) throw new Error("User not found");
    
    const { data, error } = await supabase
      .from('project_members')
      .insert({
        project_id: projectId,
        user_id: userData.id,
        role
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error adding member to project ${projectId}:`, error);
    toast.error(error.message || "Failed to add project member");
    throw error;
  }
}

export async function removeProjectMember(memberId: string) {
  try {
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error removing project member ${memberId}:`, error);
    toast.error(error.message || "Failed to remove project member");
    throw error;
  }
}
