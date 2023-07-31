import { AppSupabaseClient, Table } from '@/types';

export const getCompany = async (
  supabase: AppSupabaseClient
): Promise<Table<'company'>[]> => {
  // RLS is enabled
  const { data: companyData, error } = await supabase
    .from('company')
    .select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return companyData;
};
