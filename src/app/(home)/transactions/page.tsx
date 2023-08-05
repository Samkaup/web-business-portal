import createClient from '@/utils/supabase-server';
import { getTransactions } from '@/utils/supabase_queries/transaction';
import TransactionTable from './transactionTable';
import Header from '@/components/Header/Header';

export default async function HomePage() {
  const supabase = createClient();
  const transactions = await getTransactions(supabase);

  return (
    <>
      <Header title="Hreyfingaryfirlit" />
      <TransactionTable initialData={transactions} />
    </>
  );
}
