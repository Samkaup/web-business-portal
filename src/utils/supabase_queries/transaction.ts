import { AppSupabaseClient, TableRow } from '@/types';
import { formatDate } from '../dateUtils';
import { getLastStatement } from './statement';

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

type RecentCompanyTransactionsProps = {
  supabase: AppSupabaseClient;
  companyId: string;
  limit: number;
};
export const getRecentCompanyTransactions = async ({
  supabase,
  companyId,
  limit
}: RecentCompanyTransactionsProps) => {
  const { data, error } = await supabase
    .from('transaction')
    .select('*, department!inner (*), store (name)')
    .filter('department.company_id', 'eq', companyId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

type TransactionsByMonthProps = {
  supabase: AppSupabaseClient;
  companyId: string;
  year: number;
};
export const getTransactionsAndSumByMonth = async ({
  supabase,
  companyId,
  year
}: TransactionsByMonthProps): Promise<{ name: string; total: number }[]> => {
  // Fetch transactions for the specified year
  const { data: transactions, error } = await supabase
    .from('transaction')
    .select('date, amount_debit, department!inner(company_id)')
    .filter('transaction_type', 'eq', '2')
    .filter('department.company_id', 'eq', companyId)
    .gte('date', formatDate(new Date(`${year}-01-01`)))
    .lte('date', formatDate(new Date(`${year}-12-31`)));

  if (error) throw error;

  // Group and sum transactions by month
  const monthlySums: { [key: string]: number } = {};
  for (let month = 1; month <= 12; month++) {
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`; // YYYY-MM format
    monthlySums[monthKey] = 0;
  }
  // Sum transactions by month
  transactions?.forEach((transaction) => {
    const month = transaction.date.slice(0, 7); // Get YYYY-MM format
    monthlySums[month] = (monthlySums[month] || 0) + transaction.amount_debit;
  });

  // Convert to array of objects
  return Object.entries(monthlySums).map(([month, total]) => {
    const monthDate = new Date(`${month}-01`); // Date object for the first day of the month
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    return { name: `${monthName}`, total };
  });
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

type TransactionSumByDateProps = {
  supabase: AppSupabaseClient;
  companyId: string;
  dateFrom: Date;
  dateTo: Date;
};
export const getTransactionSumByDate = async ({
  supabase,
  companyId,
  dateFrom,
  dateTo
}: TransactionSumByDateProps): Promise<{
  amount: number;
  count: number;
  average: number;
  min: number;
  max: number;
}> => {
  let query = supabase.from('transaction').select(
    ` date,
      store_number,
      account_number,
      description,
      amount_debit,
      department!inner (
        company_id
      )`
  );
  // Set Date Range
  const start: Date | null = dateFrom;
  const end: Date | null = dateTo;
  query = start ? query.filter('date', 'gte', formatDate(start)) : query;
  query = end ? query.filter('date', 'lte', formatDate(end)) : query;
  query = query.filter('transaction_type', 'eq', 2);
  query = companyId
    ? query.filter('department.company_id', 'eq', companyId)
    : query;
  const { data, error } = await query;
  if (error) {
    console.log('Transaction error: ', error.message);
    throw error;
  }

  let amount = 0;
  let min = 0;
  let max = 0;

  data.forEach((item) => {
    amount += item.amount_debit;
    if (item.amount_debit <= min) min = item.amount_debit;
    if (item.amount_debit >= max) max = item.amount_debit;
  });

  if (error) {
    console.log(error.message);
    throw error;
  }
  const count = data.length;
  const average = count > 0 ? amount / count : 0;

  return { amount, count, average, min, max };
};

export type TransactionTableProps = {
  supabaseClient: AppSupabaseClient;
  searchValue?: string | string[];
  dateRange?: Date[];
  departmentFilters?: string[];
  companyId?: string;
  csv?: boolean;
};

export const getTransactionsTable = async ({
  supabaseClient,
  searchValue,
  dateRange,
  companyId
}: TransactionTableProps) => {
  let query = supabaseClient.from('ledger').select(
    `external_row_number,
     date,
     account_number,
     description,
     amount_debit,
     statement_number,
     transaction(id,store_number,invoice_number),
     department!inner (
       name,
       company_id
     )`,
    { count: 'exact' }
  );

  // Always sort by date initially for correct saldo calculation
  query = query.order('date', { ascending: true });

  // Apply additional filters and search
  if (searchValue) {
    query = searchValue
      ? query.ilike('description', `%${searchValue}%`)
      : query;
  }

  // Set Date Range
  const start: Date | null = dateRange.at(0);
  const end: Date | null = dateRange.at(1);
  if (start) query = query.filter('date', 'gte', formatDate(start));
  if (end) query = query.filter('date', 'lte', formatDate(end));

  // Set company_id
  if (companyId) query = query.filter('department.company_id', 'eq', companyId);

  const { data, count, error } = await query;
  if (error) {
    console.error(error.message);
    throw error;
  }

  console.log(data);

  const statement = await getLastStatement({
    supabase: supabaseClient,
    date: start,
    accountNumber: companyId
  });

  let currentSaldo = statement.end_saldo;

  const updatedData = data.map((t) => {
    if (t.amount_debit < 0) {
      currentSaldo += t.amount_debit; // Add the absolute value of the negative debit
    } else {
      currentSaldo -= t.amount_debit; // Subtract the debit normally
    }

    return {
      id: t.external_row_number,
      date: t.date,
      store_number: t.transaction ? t.transaction.store_number : 0,
      department_name: t.department.name,
      description: t.description,
      amount_debit: t.amount_debit,
      transaction_id: t.transaction ? t.transaction.id : '',
      statement_saldo: currentSaldo
    };
  });

  return {
    data: updatedData,
    rowCount: count
  };
};

export const getAllTransactions = async ({
  supabaseClient,
  searchValue,
  dateRange,
  companyId
}: TransactionTableProps) => {
  const { data } = await getTransactionsTable({
    supabaseClient,
    searchValue,
    dateRange,
    companyId: companyId
  });

  // Construct response
  return data;
};
