export type RangeProps = {
  from: number;
  to: number;
};

export type SortingProps = {
  column: string;
  options: {
    ascending: boolean;
    foriegnTable?: string;
  };
};

export type QueryDataAndCount<T> = {
  data: T[];
  rowCount: number;
};

export type PaginationProps = {
  page?: number;
  pageSize?: number;
};
