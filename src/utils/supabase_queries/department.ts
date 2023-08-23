import { AppSupabaseClient, TableRow } from '@/types';

export const getDepartments = async (
  supabase: AppSupabaseClient
): Promise<TableRow<'department'>[]> => {
  // RLS is enabled
  const { data, error } = await supabase.from('department').select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};
