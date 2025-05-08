import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type StartupProject = {
  id: string;
  title: string;
  description: string;
  stage: string;
  category: string;
  tags: string[];
  roles_needed: string[];
  funding_goal: number;
  pitch_deck_url?: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  application_status?: 'pending' | 'approved' | 'rejected' | null; // Added application_status to the type
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
    
    toast.success("Project created successfully!");
    return data;
  } catch (error: any) {
    console.error("Error creating project:", error);
    toast.error(error.message || "Failed to create project");
    throw error;
  }
}

// PUBLIC: Get all projects for everyone - no auth required
export async function getProjects() {
  try {
    console.log("Fetching all projects for public viewing");
    
    const { data, error } = await supabase
      .from('startup_projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Database error fetching projects:", error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} projects for public display`);
    return data || [];
  } catch (error: any) {
    console.error("Error getting projects:", error);
    toast.error(error.message || "Failed to fetch projects");
    return [];
  }
}

export async function getMyProjects() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return [];
    
    // Fetch projects where the current user is the creator
    const { data, error } = await supabase
      .from('startup_projects')
      .select('*')
      .eq('creator_id', userData.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error getting my projects:", error);
    toast.error(error.message || "Failed to fetch your projects");
    return [];
  }
}

export async function getMyJoinedProjects() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return [];
    
    // Get projects where the user is a member (not necessarily the creator)
    const { data: memberships, error: membershipError } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', userData.user.id);
      
    if (membershipError) throw membershipError;
    
    if (!memberships || memberships.length === 0) return [];
    
    const projectIds = memberships.map(m => m.project_id);
    
    // Get the actual projects
    const { data, error } = await supabase
      .from('startup_projects')
      .select('*')
      .in('id', projectIds)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error getting joined projects:", error);
    toast.error(error.message || "Failed to fetch projects you've joined");
    return [];
  }
}

export async function getFeaturedProjects(limit = 3) {
  try {
    // Fetch featured projects - all projects are now publicly visible
    // In a real app, you might want to have a "featured" flag in the database
    const { data, error } = await supabase
      .from('startup_projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    console.log(`Fetched ${data?.length || 0} featured projects for public display`);
    return data || [];
  } catch (error: any) {
    console.error("Error getting featured projects:", error);
    return [];
  }
}

export async function getProjectById(id: string) {
  try {
    // Public access to any project by ID
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
    // First check if the user is the creator of the project
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data: projectData, error: projectError } = await supabase
      .from('startup_projects')
      .select('creator_id')
      .eq('id', id)
      .single();
      
    if (projectError) throw projectError;
    
    // Check if the current user is the creator
    if (projectData.creator_id !== userData.user.id) {
      throw new Error("Only the project creator can update this project");
    }
    
    // Proceed with the update
    const { data, error } = await supabase
      .from('startup_projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    toast.success("Project updated successfully!");
    return data;
  } catch (error: any) {
    console.error(`Error updating project ${id}:`, error);
    toast.error(error.message || "Failed to update project");
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    // First check if the user is the creator of the project
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data: projectData, error: projectError } = await supabase
      .from('startup_projects')
      .select('creator_id')
      .eq('id', id)
      .single();
      
    if (projectError) throw projectError;
    
    // Check if the current user is the creator
    if (projectData.creator_id !== userData.user.id) {
      throw new Error("Only the project creator can delete this project");
    }
    
    // Delete project members
    await supabase
      .from('project_members')
      .delete()
      .eq('project_id', id);
      
    // Delete project applications
    await supabase
      .from('project_applications')
      .delete()
      .eq('project_id', id);
    
    // Delete project ideas
    await supabase
      .from('project_ideas')
      .delete()
      .eq('project_id', id);
      
    // Finally delete the project
    const { error } = await supabase
      .from('startup_projects')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success("Project deleted successfully!");
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
    console.log("Fetching members for project:", projectId);
    
    // Get project members without using the nested relationship
    const { data: membersData, error: membersError } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId);
      
    if (membersError) {
      console.error("Error fetching members:", membersError);
      throw membersError;
    }
    
    // Now fetch user profiles separately for each member
    const members = await Promise.all(
      (membersData || []).map(async (member) => {
        try {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email, avatar_url')
            .eq('id', member.user_id)
            .single();
            
          if (userError) {
            console.warn(`Could not fetch user data for member ${member.id}:`, userError);
            return member; // Return member without user data
          }
          
          return {
            ...member,
            user: {
              ...userData,
              first_name: "Team", // Placeholder since profiles table doesn't have first_name
              last_name: "Member"  // Placeholder since profiles table doesn't have last_name
            }
          };
        } catch (error) {
          console.warn(`Error processing member ${member.id}:`, error);
          return member; // Return member without user data
        }
      })
    );
    
    console.log("Project members fetched:", members.length);
    return members;
  } catch (error: any) {
    console.error(`Error getting members for project ${projectId}:`, error);
    toast.error(error.message || "Failed to fetch project members");
    return [];
  }
}

// Function to get project member count - publicly accessible
export async function getProjectMemberCount(projectId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('project_members')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId);
      
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error(`Error getting member count for project ${projectId}:`, error);
    return 0;
  }
}

// Function to check if user is a project creator
export async function isProjectCreator(projectId: string) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) return false;
    
    const { data: projectData, error: projectError } = await supabase
      .from('startup_projects')
      .select('creator_id')
      .eq('id', projectId)
      .single();
      
    if (projectError) return false;
    
    return projectData.creator_id === userData.user.id;
  } catch (error) {
    console.error("Error checking if user is project creator:", error);
    return false;
  }
}

// Function to check if user is a project member
export async function isProjectMember(projectId: string) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) return false;
    
    const { data, error } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userData.user.id)
      .single();
      
    return !error && !!data;
  } catch (error) {
    console.error("Error checking if user is project member:", error);
    return false;
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
    toast.success(`Team member added successfully!`);
    return data;
  } catch (error: any) {
    console.error(`Error adding member to project ${projectId}:`, error);
    toast.error(error.message || "Failed to add project member");
    throw error;
  }
}

export async function removeProjectMember(memberId: string) {
  try {
    // First check if the authenticated user is the creator of the project
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    // Get the member data to get the project_id
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('project_id, user_id')
      .eq('id', memberId)
      .single();
      
    if (memberError) throw memberError;
    
    // Get the project data to check if user is creator
    const { data: projectData, error: projectError } = await supabase
      .from('startup_projects')
      .select('creator_id')
      .eq('id', memberData.project_id)
      .single();
      
    if (projectError) throw projectError;
    
    // Check if the user is the creator or if they are removing themselves
    if (projectData.creator_id !== userData.user.id && memberData.user_id !== userData.user.id) {
      throw new Error("Only the project creator can remove members");
    }
    
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId);
      
    if (error) throw error;
    toast.success("Team member removed successfully!");
    return true;
  } catch (error: any) {
    console.error(`Error removing project member ${memberId}:`, error);
    toast.error(error.message || "Failed to remove project member");
    throw error;
  }
}

// Function to check if user has applied to a project - returns application status if exists
export async function getUserApplicationStatus(projectId: string) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;
    
    const { data, error } = await supabase
      .from('project_applications')
      .select('status')
      .eq('project_id', projectId)
      .eq('applicant_id', userData.user.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      throw error;
    }
    
    return data?.status;
  } catch (error) {
    console.error("Error checking application status:", error);
    return null;
  }
}

// Get all projects with application status for the current user
export async function getProjectsWithApplicationStatus() {
  try {
    // First fetch all projects - public access
    const { data: projects, error: projectsError } = await supabase
      .from('startup_projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (projectsError) throw projectsError;
    
    // Check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      // Return projects without application status for anonymous users
      return projects || [];
    }
    
    // Get all applications for the current user
    const { data: applications, error: applicationsError } = await supabase
      .from('project_applications')
      .select('project_id, status')
      .eq('applicant_id', userData.user.id);
      
    if (applicationsError) throw applicationsError;
    
    // Create a map of project_id -> application_status
    const applicationMap = applications?.reduce((map, app) => {
      map[app.project_id] = app.status;
      return map;
    }, {} as Record<string, string>) || {};
    
    // Merge project data with application status
    const projectsWithStatus = projects?.map(project => ({
      ...project,
      application_status: applicationMap[project.id] || null
    })) || [];
    
    return projectsWithStatus;
  } catch (error: any) {
    console.error("Error getting projects with application status:", error);
    toast.error(error.message || "Failed to fetch projects");
    return [];
  }
}
