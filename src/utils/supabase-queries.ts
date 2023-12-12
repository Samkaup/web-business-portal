import { AppSupabaseClient, Row, RowName } from '@/types';
import { formatDate } from './dateUtils';

type RangeProps = {
  from: number;
  to: number;
};

type SortingProps = {
  column: string;
  options: {
    ascending: boolean;
  };
};

type TableProps<T extends RowName> = {
  supabaseClient: AppSupabaseClient;
  table: T;
  selectQuery: string;
  range?: RangeProps;
  sorting?: SortingProps;
  searchValue?: string | string[];
  filter?: string;
  dateRange?: Date[];
};

export const getTable = async <T extends RowName>({
  supabaseClient,
  table,
  range,
  selectQuery,
  sorting,
  searchValue,
  filter,
  dateRange
}: TableProps<T>) => {
  let query = supabaseClient
    .from(table)
    .select(selectQuery, { count: 'exact' });

  if (range) query = query.range(range.from, range.to);

  /* eslint-disable */
  if (sorting)
    query = query.order(sorting.column as string & keyof Row<T>, {
      ascending: sorting.options.ascending
    });
  /* eslint-enable */

  if (searchValue) {
    // query = query.or(
    //   `full_name.ilike.*${searchValue}*, name.ilike.*${searchValue}*`,
    //   {
    //     foreignTable: 'contact, contact.department',
    //   }
    // );
    // query = query.textSearch('full_text_search', `'${searchValue}'`, {
    //   type: 'websearch',
    // });
  } else if (filter) query.or(filter);

  // Set Date Range
  const start: Date | null = dateRange.at(0);
  const end: Date | null = dateRange.at(1);
  query = start ? query.filter('created_at', 'gte', formatDate(start)) : query;
  query = end ? query.filter('created_at', 'lte', formatDate(end)) : query;

  const { data, count, error } = await query;

  if (error) {
    console.log(error.message);
    throw error;
  }

  return { data, count };
};
