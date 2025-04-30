
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectTask = {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assignee?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  creator?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
};

export async function getProjectTasks(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .select(`
        *,
        assignee:assigned_to (
          first_name,
          last_name,
          avatar_url
        ),
        creator:created_by (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error(`Error getting tasks for project ${projectId}:`, error);
    toast.error(error.message || "Failed to fetch project tasks");
    return [];
  }
}

export async function createTask(taskData: {
  project_id: string;
  title: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
}) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const { data, error } = await supabase
      .from('project_tasks')
      .insert({
        ...taskData,
        created_by: userData.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error creating task:", error);
    toast.error(error.message || "Failed to create task");
    throw error;
  }
}

export async function updateTask(taskId: string, taskData: Partial<ProjectTask>) {
  try {
    const { data, error } = await supabase
      .from('project_tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error updating task ${taskId}:`, error);
    toast.error(error.message || "Failed to update task");
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error deleting task ${taskId}:`, error);
    toast.error(error.message || "Failed to delete task");
    throw error;
  }
}
