import { AppSupabaseClient, TableRow } from '@/types';

export const getTransactions = async (
  supabase: AppSupabaseClient
): Promise<TableRow<'transaction'>[]> => {
  const { data: transactionData, error } = await supabase
    .from('transaction')
    .select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return transactionData;
};

export const getTransactionCount = async (
  supabase: AppSupabaseClient
): Promise<number> => {
  const { count, error } = await supabase
    .from('transaction')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.log(error.message);
    throw error;
  }
  return count;
};
