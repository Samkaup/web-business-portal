import { AppSupabaseClient, TableRow } from '@/types';

export const getContacts = async (
  supabase: AppSupabaseClient
): Promise<TableRow<'contact'>[]> => {
  const { data: transactionData, error } = await supabase
    .from('contact')
    .select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return transactionData;
};

export const getContactCount = async (
  supabase: AppSupabaseClient
): Promise<number> => {
  const { count, error } = await supabase
    .from('contact')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log(error.message);
    throw error;
  }
  return count;
};
