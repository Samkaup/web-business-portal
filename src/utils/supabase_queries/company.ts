import { AppSupabaseClient, TableRow } from '@/types';

export const getCompany = async (
  supabase: AppSupabaseClient
): Promise<TableRow<'company'>[]> => {
  // RLS is enabled
  const { data: companyData, error } = await supabase
    .from('company')
    .select('*')
    .order('name');

  if (error) {
    console.log(error);
    throw error;
  }

  return companyData;
};
