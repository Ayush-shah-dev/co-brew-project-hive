
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectIdea = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'to_explore' | 'in_progress' | 'finalized';
  created_by: string;
  votes: number;
  created_at: string;
  updated_at: string;
  creator?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
};

export async function getProjectIdeas(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('project_ideas')
      .select(`
        *,
        profiles:created_by (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('votes', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      creator: item.profiles
    }));
  } catch (error: any) {
    console.error(`Error getting ideas for project ${projectId}:`, error);
    toast.error(error.message || "Failed to fetch project ideas");
    return [];
  }
}

export async function createIdea(ideaData: {
  project_id: string;
  title: string;
  description: string;
  status: 'to_explore' | 'in_progress' | 'finalized';
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('project_ideas')
      .insert({
        ...ideaData,
        created_by: userData.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error creating idea:", error);
    toast.error(error.message || "Failed to create idea");
    throw error;
  }
}

export async function updateIdeaStatus(ideaId: string, status: 'to_explore' | 'in_progress' | 'finalized') {
  try {
    const { data, error } = await supabase
      .from('project_ideas')
      .update({ status })
      .eq('id', ideaId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error updating idea ${ideaId}:`, error);
    toast.error(error.message || "Failed to update idea status");
    throw error;
  }
}

export async function voteForIdea(ideaId: string) {
  try {
    // First get current votes
    const { data: currentIdea, error: fetchError } = await supabase
      .from('project_ideas')
      .select('votes')
      .eq('id', ideaId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Increment votes
    const newVotes = (currentIdea?.votes || 0) + 1;
    
    const { data, error } = await supabase
      .from('project_ideas')
      .update({ votes: newVotes })
      .eq('id', ideaId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error voting for idea ${ideaId}:`, error);
    toast.error(error.message || "Failed to vote for idea");
    throw error;
  }
}

export async function deleteIdea(ideaId: string) {
  try {
    const { error } = await supabase
      .from('project_ideas')
      .delete()
      .eq('id', ideaId);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error deleting idea ${ideaId}:`, error);
    toast.error(error.message || "Failed to delete idea");
    throw error;
  }
}
