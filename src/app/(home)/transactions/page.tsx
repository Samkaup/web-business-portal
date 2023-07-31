import createClient from '@/utils/supabase-server';
import { getTransactions } from '@/utils/supabase_queries/transaction';
import TransactionTable from './transactionTable';

export default async function HomePage() {
  const supabase = createClient();
  const transactions = await getTransactions(supabase);

  return (
    <div className="pt-10">
      <h1>Transactions</h1>
      <TransactionTable initialData={transactions} />
    </div>
  );
}
