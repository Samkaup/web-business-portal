import { TableName, TableRow } from '@/types';
import { type ColumnDef } from '@tanstack/react-table';

export type DefaultSort = {
  id: string;
  desc: boolean;
};

export type Props<T extends TableName> = {
  columns: any;
  tableName: T;
  defaultSort: DefaultSort;
  selectQuery: string;
  queryKey?: string;
  searchColumns?: string[];
  searchValue?: string;
  filter?: string;
  initialData?: TableRow<T>[] | null;
};

export type ManualProps = {
  columns: ColumnDef<any>[];
  data: any;
  defaultSort: DefaultSort;
};
