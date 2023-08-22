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
  filters?: string[];
};

export const getTransactionsTable = async ({
  supabaseClient,
  range,
  sorting,
  searchValue,
  dateRange,
  filters,
}: Payload) => {
  let query = supabaseClient
    .from('transaction')
    .select('*', { count: 'exact' });

  if (range) query = query.range(range.from, range.to);

  if (sorting)
    query = query.order(sorting.column as string & keyof Row<'transaction'>, {
      ascending: sorting.options.ascending,
    });

  if (searchValue || filters) {
    let filterString: string = filters ? filters.join() : '';

    if (searchValue)
      filterString = `${filterString}, contact_name.ilike.*${searchValue}*, department_name.ilike.*${searchValue}*`;

    if (filterString.length > 0) query = query.or(filterString);
  }

  // Set Date Range
  const start: Date | null = dateRange.at(0);
  const end: Date | null = dateRange.at(1);
  query = start ? query.filter('date', 'gte', formatDate(start)) : query;
  query = end ? query.filter('date', 'lte', formatDate(end)) : query;

  const { data, count, error } = await query;

  if (error) {
    console.error(error.message);
    throw error;
  }

  return { data, rowCount: count };
};
