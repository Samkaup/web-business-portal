import { AppSupabaseClient, TableName, TableRow } from '@/types';

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

type TableProps<T extends TableName> = {
  supabaseClient: AppSupabaseClient;
  table: T;
  selectQuery: string;
  range?: RangeProps;
  sorting?: SortingProps;
  searchValue?: string | string[];
  filter?: string;
};

export const getTable = async <T extends TableName>({
  supabaseClient,
  table,
  range,
  selectQuery,
  sorting,
  searchValue,
  filter,
}: TableProps<T>) => {
  let query = supabaseClient
    .from(table)
    .select(selectQuery, { count: 'exact' });

  if (range) query = query.range(range.from, range.to);

  /* eslint-disable */
  if (sorting)
    query = query.order(sorting.column as string & keyof TableRow<T>, {
      ascending: sorting.options.ascending,
    });
  /* eslint-enable */

  if (searchValue) {
    query = query.textSearch('full_text_search', `'${searchValue}'`, {
      type: 'websearch',
    });
  } else if (filter) query.or(filter);

  const { data, count, error } = await query;

  if (error) {
    console.log(error.message);
    throw error;
  }

  return { data, count };
};
