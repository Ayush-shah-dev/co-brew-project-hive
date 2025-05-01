
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectIdea = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'to_explore' | 'in_progress' | 'finalized';
  votes: number | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  creator?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

export async function getProjectIdeas(projectId: string): Promise<ProjectIdea[]> {
  try {
    const { data, error } = await supabase
      .from('project_ideas')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get all unique creator IDs
    const creatorIds = Array.from(new Set(data.map(idea => idea.created_by)));
    
    // Fetch profiles for creators
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .in('id', creatorIds);
      
    // Fetch additional profile details
    const { data: profileDetailsData, error: profileDetailsError } = await supabase
      .from('profile_details')
      .select('id, first_name, last_name')
      .in('id', creatorIds);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    if (profileDetailsError) {
      console.error("Error fetching profile details:", profileDetailsError);
    }
    
    // Map profile data
    const profilesMap: Record<string, any> = {};
    if (profilesData && profileDetailsData) {
      creatorIds.forEach(id => {
        const profile = profilesData.find(p => p.id === id);
        const profileDetails = profileDetailsData.find(p => p.id === id);
        
        if (profile || profileDetails) {
          profilesMap[id] = {
            avatar_url: profile?.avatar_url || null,
            first_name: profileDetails?.first_name || null,
            last_name: profileDetails?.last_name || null
          };
        }
      });
    }
    
    // Map all ideas with their creator profiles
    return data.map(idea => ({
      ...idea,
      status: idea.status as 'to_explore' | 'in_progress' | 'finalized',
      creator: profilesMap[idea.created_by] || null
    }));
  } catch (error: any) {
    console.error("Error getting ideas:", error);
    toast.error(error.message || "Failed to fetch project ideas");
    return [];
  }
}

export async function createIdea(ideaData: { 
  project_id: string; 
  title: string; 
  description: string;
  status?: string;
}): Promise<ProjectIdea | null> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('project_ideas')
      .insert({
        ...ideaData,
        created_by: userData.user.id,
        votes: 0,
        status: ideaData.status || 'to_explore'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("Idea created successfully");
    return data as ProjectIdea;
  } catch (error: any) {
    console.error("Error creating idea:", error);
    toast.error(error.message || "Failed to create idea");
    return null;
  }
}

export async function updateIdeaStatus(ideaId: string, status: 'to_explore' | 'in_progress' | 'finalized'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project_ideas')
      .update({ status })
      .eq('id', ideaId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating idea status:", error);
    toast.error(error.message || "Failed to update idea status");
    return false;
  }
}

export async function voteForIdea(ideaId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('project_ideas')
      .select('votes')
      .eq('id', ideaId)
      .single();
      
    if (error) throw error;
    
    const currentVotes = data.votes || 0;
    const newVotes = currentVotes + 1;
    
    const { error: updateError } = await supabase
      .from('project_ideas')
      .update({ votes: newVotes })
      .eq('id', ideaId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error: any) {
    console.error("Error voting for idea:", error);
    toast.error(error.message || "Failed to vote for idea");
    return false;
  }
}
