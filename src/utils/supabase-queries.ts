import { AppSupabaseClient } from '@/types';

// type TableCountProps = {
//   table: any
// }
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

type TableProps = {
  supabaseClient: AppSupabaseClient;
  table: string;
  selectQuery: string;
  range?: RangeProps;
  sorting?: SortingProps;
  searchColumns?: string[];
  searchValue?: string | string[];
  filter?: string;
};

export const getTable = async ({
  supabaseClient,
  table,
  range,
  selectQuery,
  sorting,
  searchColumns,
  searchValue,
  filter,
}: TableProps) => {
  let query = supabaseClient.from(table).select(selectQuery);

  if (range) {
    query = query.range(range.from, range.to);
  }
  if (sorting) {
    query = query.order(sorting.column, {
      ascending: sorting.options.ascending,
    });
  }

  if (searchColumns && searchValue) {
    const orStr = searchColumns.map(
      (col: string) => `${col}.ilike.%${searchValue}%`
    );

    query = query.or(orStr.join(', '));
  } else if (filter) {
    query.or(filter);
  }

  const { data, error } = await query;
  if (error) {
    console.log(error.message);
    throw error;
  }
  return (data as any) || [];
};
