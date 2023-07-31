import { Database } from '@/lib/database.types';
import { Table } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export type DefaultSort = {
  id: string;
  desc: boolean;
};

export type Props<T extends keyof Database['public']['Tables']> = {
  columns: ColumnDef<Table<T>>[];
  tableName: string;
  defaultSort: DefaultSort;
  selectQuery: string;
  queryKey?: string;
  searchColumns?: string[];
  searchValue?: string;
  filter?: string;
  initialData?: Table<T>[] | null;
};

export type ManualProps = {
  columns: ColumnDef<any>[];
  data: any;
  defaultSort: DefaultSort;
};
