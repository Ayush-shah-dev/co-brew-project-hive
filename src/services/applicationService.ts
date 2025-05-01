
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectApplication = {
  id: string;
  project_id: string;
  applicant_id: string;
  status: 'pending' | 'approved' | 'rejected';
  introduction: string | null;
  experience: string | null;
  motivation: string | null;
  created_at: string;
  updated_at: string | null;
  applicant?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  project?: {
    title: string;
    description: string;
    category: string;
    stage: string;
  };
};

export async function createApplication(applicationData: {
  project_id: string;
  introduction: string;
  experience: string;
  motivation: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('project_applications')
      .insert({
        ...applicationData,
        applicant_id: userData.user.id,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) throw error;
    toast.success("Application submitted successfully");
    return data;
  } catch (error: any) {
    console.error("Error creating application:", error);
    toast.error(error.message || "Failed to submit application");
    throw error;
  }
}

export async function getProjectApplications(projectId: string): Promise<ProjectApplication[]> {
  try {
    // Fetch all applications for the project
    const { data: applicationsData, error: applicationsError } = await supabase
      .from('project_applications')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (applicationsError) throw applicationsError;
    
    if (!applicationsData || applicationsData.length === 0) {
      return [];
    }
    
    // Get all unique applicant IDs
    const applicantIds = Array.from(new Set(applicationsData.map(app => app.applicant_id)));
    
    // Fetch profiles for those applicants
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .in('id', applicantIds);

    // Fetch additional profile details for those applicants  
    const { data: profileDetailsData, error: profileDetailsError } = await supabase
      .from('profile_details')
      .select('id, first_name, last_name')
      .in('id', applicantIds);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      // Continue without profiles rather than failing completely
    }
    
    if (profileDetailsError) {
      console.error("Error fetching profile details:", profileDetailsError);
      // Continue without profile details rather than failing completely
    }
    
    // Map profiles to a dictionary for quick lookup
    const profilesMap: Record<string, any> = {};
    if (profilesData && profileDetailsData) {
      applicantIds.forEach(id => {
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
    
    // Combine applications with applicant profiles
    return applicationsData.map(application => {
      return {
        ...application,
        applicant: profilesMap[application.applicant_id] || null
      } as ProjectApplication;
    });
    
  } catch (error: any) {
    console.error(`Error getting applications for project ${projectId}:`, error);
    toast.error(error.message || "Failed to fetch project applications");
    return [];
  }
}

export async function getUserApplications(): Promise<ProjectApplication[]> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('project_applications')
      .select(`
        *,
        project:startup_projects!project_id (
          title,
          description,
          category,
          stage
        )
      `)
      .eq('applicant_id', userData.user.id);
      
    if (error) {
      console.error("Error in query:", error);
      throw error;
    }
    
    // Type cast to ensure compatibility with the ProjectApplication type
    const typedData = data?.map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected',
      project: item.project as ProjectApplication['project']
    })) || [];
    
    return typedData;
  } catch (error: any) {
    console.error("Error fetching user applications:", error);
    toast.error(error.message || "Failed to fetch your applications");
    return [];
  }
}

export async function updateApplicationStatus(applicationId: string, status: 'approved' | 'rejected') {
  try {
    const { data, error } = await supabase
      .from('project_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    return data;
  } catch (error: any) {
    console.error(`Error updating application ${applicationId}:`, error);
    toast.error(error.message || "Failed to update application status");
    throw error;
  }
}
