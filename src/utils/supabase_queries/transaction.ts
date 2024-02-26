import { AppSupabaseClient, FilteredTransaction, Row, TableRow } from '@/types';
import { RangeProps, SortingProps } from '@/utils/utilTypes';
import { formatDate } from '../dateUtils';

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
  range?: RangeProps;
  sorting?: SortingProps;
  searchValue?: string | string[];
  dateRange?: Date[];
  departmentFilters?: string[];
  filters?: string[];
  companyId?: string;
  csv?: boolean;
};

export const getTransactionsTable = async ({
  supabaseClient,
  range,
  sorting,
  searchValue,
  dateRange,
  filters,
  companyId
}: TransactionTableProps) => {
  let query = supabaseClient.from('ledger_records').select(
    ` external_row_number,
      date,
      account_number,
      description,
      amount_debit,
      transaction(id,store_number,invoice_number),
      department!inner (
        name,
        company_id
      )`,
    { count: 'exact' }
  );

  if (range) query = query.range(range.from, range.to);

  if (sorting)
    query = query.order(sorting.column as string & keyof Row<'transaction'>, {
      ascending: sorting.options.ascending
    });

  // Apply additional filters
  query = filters.length > 0 ? query.or(filters.join()) : query;

  // Apply search
  query = searchValue ? query.ilike('description', `%${searchValue}%`) : query;

  // Set Date Range
  const start: Date | null = dateRange.at(0);
  const end: Date | null = dateRange.at(1);
  query = start ? query.filter('date', 'gte', formatDate(start)) : query;
  query = end ? query.filter('date', 'lte', formatDate(end)) : query;

  // Set company_id
  if (companyId) query = query.filter('department.company_id', 'eq', companyId);

  const { data, count, error } = await query;
  if (error) {
    console.error(error.message);
    throw error;
  }

  return {
    data: data.map((t) => ({
      id: t.external_row_number,
      date: t.date,
      store_number: t.transaction ? t.transaction.store_number : 0,
      department_name: t.department.name,
      description: t.description,
      amount_debit: t.amount_debit,
      transaction_id: t.transaction ? t.transaction.id : ''
    })),
    rowCount: count
  };
};

export const getAllTransactions = async ({
  supabaseClient,
  sorting,
  searchValue,
  dateRange,
  filters,
  companyId
}: TransactionTableProps) => {
  let allTransactions: FilteredTransaction[] = [];
  let pageIndex = 0;
  const pageSize = 1000;

  let { data } = await getTransactionsTable({
    supabaseClient,
    range: {
      from: pageIndex * pageSize,
      to: (pageIndex + 1) * (pageSize - 1)
    },
    sorting: sorting,
    searchValue,
    dateRange,
    filters: filters,
    companyId: companyId
  });

  while (!data || data.length > 0) {
    allTransactions = [...allTransactions, ...data];

    if (data.length < pageSize) break;

    pageIndex++;

    const result = await getTransactionsTable({
      supabaseClient,
      range: {
        from: pageIndex * pageSize,
        to: (pageIndex + 1) * (pageSize - 1)
      },
      sorting: sorting,
      searchValue,
      dateRange,
      filters: filters,
      companyId: companyId
    });

    data = result.data;
  }

  // Construct response
  return allTransactions;
};
