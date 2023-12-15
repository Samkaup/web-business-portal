import { AppSupabaseClient, TableRow } from '@/types';
import { PaginationProps } from '../utilTypes';

export const getCompany = async (
  supabase: AppSupabaseClient,
  pagination: PaginationProps
): Promise<TableRow<'company'>[]> => {
  // RLS is enabled
  const query = supabase
    .from('company')
    .select('*, company_profile(id)')
    .order('name');

  // Set range if pagination details are provided
  if (pagination.pageSize && pagination.page) {
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    query.range(from, to);
  }

  const { data: companyData, error } = await query;

  if (error) {
    console.log(error);
    throw error;
  }

  return companyData;
};
