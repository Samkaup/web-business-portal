import { AppSupabaseClient, TableRow } from '@/types';

type TGetStatementsProps = {
  supabase: AppSupabaseClient;
  date: Date;
  accountNumber: string;
};
export const getLastStatement = async ({
  supabase,
  date,
  accountNumber
}: TGetStatementsProps): Promise<TableRow<'statement'>> => {
  // Find statement before / closest to a particular date
  const { data, error } = await supabase
    .from('statement')
    .select('*')
    .eq('account_number', accountNumber)
    .lte('statement_date', date.toISOString())
    .order('statement_date', { ascending: false })
    .limit(1);

  if (error) {
    console.log(error);
    throw error;
  }
  return data[0];
};
