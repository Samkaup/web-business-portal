import { AppSupabaseClient, TableRow } from '@/types';
import { PaginationProps } from '../utilTypes';

export const getCompany = async (
  supabase: AppSupabaseClient,
  pagination: PaginationProps,
  search?: string
): Promise<TableRow<'company'>[]> => {
  // RLS is enabled
  const query = supabase.from('company').select('*').order('name');

  // Set range if pagination details are provided
  if (pagination.pageSize && pagination.page) {
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    query.range(from, to);
  }

  // Set search if search string is provided
  if (search) {
    const searchTerm = `%${search}%`;
    query.or(
      `name.ilike.${searchTerm},external_identifier.ilike.${searchTerm}`
    );
  }

  const { data: companyData, error } = await query;
  if (error) {
    console.log(error);
    throw error;
  }

  return companyData;
};
