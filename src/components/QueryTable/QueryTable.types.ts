import { UseQueryResult } from '@tanstack/react-query';
import {
  SortingState,
  type ColumnDef,
  PaginationState,
} from '@tanstack/react-table';

export type DefaultSort = {
  id: string;
  desc: boolean;
};

export type ManualProps = {
  columns: ColumnDef<any>[];
  data: any;
  defaultSort: DefaultSort;
};

export type NewTableProps<T extends object> = {
  query: UseQueryResult<{ data: T[]; rowCount: number }>;
  columns: any;
  sortingState: SortingState;
  setSortingState: (state: SortingState) => void;
  paginationState: PaginationState;
  setPaginationState: (state: PaginationState) => void;
  pageSizes: number[];
  className?: string;
  onDownload?: () => void;
  isDownloading?: boolean;
};
