import { AppSupabaseClient, Row, TableRow } from '@/types';
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

export const getRecentCompanyTransactions = async (
  supabase: AppSupabaseClient,
  companyId: string
): Promise<TableRow<'transaction'>[]> => {
  const { data, error } = await supabase
    .from('transaction')
    .select('*, department!inner (*)')
    .filter('department.company_id', 'eq', companyId)
    .order('date', { ascending: false })
    .limit(3);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
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

export type Payload = {
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
  companyId,
}: Payload) => {
  let query = supabaseClient.from('transaction').select(
    ` date,
      store_number,
      account_number,
      description,
      amount_debit,
      department!inner ( 
        name,
        company_id 
      )`,
    { count: 'exact' }
  );

  if (range) query = query.range(range.from, range.to);

  if (sorting)
    query = query.order(sorting.column as string & keyof Row<'transaction'>, {
      ascending: sorting.options.ascending,
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
      date: t.date,
      store_number: t.store_number,
      department_name: t.department.name,
      description: t.description,
      amount_debit: t.amount_debit,
    })),
    rowCount: count,
  };
};

export const getAllTransactions = async ({
  supabaseClient,
  sorting,
  searchValue,
  dateRange,
  filters,
  companyId,
}: Payload) => {
  let allTransactions: any[] = [];
  let pageIndex = 0;
  const pageSize = 1000;

  let { data } = await getTransactionsTable({
    supabaseClient,
    range: {
      from: pageIndex * pageSize,
      to: (pageIndex + 1) * (pageSize - 1),
    },
    sorting: sorting,
    searchValue,
    dateRange,
    filters: filters,
    companyId: companyId,
  });

  while (!data || data.length > 0) {
    allTransactions = [...allTransactions, ...data];

    if (data.length < pageSize) break;

    pageIndex++;

    const result = await getTransactionsTable({
      supabaseClient,
      range: {
        from: pageIndex * pageSize,
        to: (pageIndex + 1) * (pageSize - 1),
      },
      sorting: sorting,
      searchValue,
      dateRange,
      filters: filters,
      companyId: companyId,
    });

    data = result.data;
  }

  // Construct response
  return allTransactions;
};
