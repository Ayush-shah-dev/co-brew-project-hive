import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectChatMessage = {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
};

export async function getProjectMessages(projectId: string): Promise<ProjectChatMessage[]> {
  try {
    // Fetch messages
    const { data: messagesData, error: messagesError } = await supabase
      .from('project_chat_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
      
    if (messagesError) throw messagesError;
    
    if (!messagesData || messagesData.length === 0) {
      return [];
    }
    
    // Extract all unique sender IDs
    const senderIds = Array.from(new Set(messagesData.map(msg => msg.sender_id)));
    
    // Fetch profile data for all senders
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .in('id', senderIds);
      
    const { data: profileDetailsData, error: profileDetailsError } = await supabase
      .from('profile_details')
      .select('id, first_name, last_name')
      .in('id', senderIds);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }
    
    if (profileDetailsError) {
      console.error("Error fetching profile details:", profileDetailsError);
    }
    
    // Create a map of profiles for quick lookups
    const profilesMap: Record<string, any> = {};
    
    if (profilesData && profileDetailsData) {
      senderIds.forEach(id => {
        const profile = profilesData.find(p => p.id === id);
        const profileDetails = profileDetailsData.find(p => p.id === id);
        
        if (profile || profileDetails) {
          profilesMap[id] = {
            avatar_url: profile?.avatar_url || null,
            first_name: profileDetails?.first_name || "Unknown",
            last_name: profileDetails?.last_name || "User"
          };
        }
      });
    }
    
    // Attach sender info to each message
    return messagesData.map(msg => ({
      ...msg,
      sender: profilesMap[msg.sender_id] || {
        first_name: "Unknown",
        last_name: "User",
        avatar_url: null
      }
    }));
  } catch (error: any) {
    console.error(`Error getting messages for project ${projectId}:`, error);
    toast.error(error.message || "Failed to fetch messages");
    return [];
  }
}

export async function sendProjectMessage(projectId: string, content: string): Promise<ProjectChatMessage | null> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('project_chat_messages')
      .insert({
        project_id: projectId,
        sender_id: userData.user.id,
        content
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Get sender profile info
    const { data: profileData } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userData.user.id)
      .single();
      
    const { data: profileDetailsData } = await supabase
      .from('profile_details')
      .select('first_name, last_name')
      .eq('id', userData.user.id)
      .single();
    
    return {
      ...data,
      sender: {
        first_name: profileDetailsData?.first_name || "Unknown",
        last_name: profileDetailsData?.last_name || "User",
        avatar_url: profileData?.avatar_url || null
      }
    };
  } catch (error: any) {
    console.error(`Error sending message to project ${projectId}:`, error);
    toast.error(error.message || "Failed to send message");
    return null;
  }
}

export function setupMessageSubscription(
  projectId: string, 
  callback: (message: ProjectChatMessage) => void
): () => void {
  const subscription = supabase
    .channel(`project-messages-${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'project_chat_messages',
        filter: `project_id=eq.${projectId}`
      },
      async (payload) => {
        // Get the new message data
        const newMessage = payload.new as ProjectChatMessage;
        
        // Fetch the sender's profile info
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', newMessage.sender_id)
          .single();
          
        const { data: profileDetailsData } = await supabase
          .from('profile_details')
          .select('first_name, last_name')
          .eq('id', newMessage.sender_id)
          .single();
        
        // Add the sender info to the message
        const messageWithSender = {
          ...newMessage,
          sender: {
            first_name: profileDetailsData?.first_name || "Unknown",
            last_name: profileDetailsData?.last_name || "User",
            avatar_url: profileData?.avatar_url || null
          }
        };
        
        // Call the callback with the enriched message
        callback(messageWithSender);
      }
    )
    .subscribe();
    
  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(subscription);
  };
}
