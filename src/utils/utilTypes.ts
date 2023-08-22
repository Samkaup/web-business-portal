export type RangeProps = {
  from: number;
  to: number;
};

export type SortingProps = {
  column: string;
  options: {
    ascending: boolean;
  };
};

export type QueryDataAndCount<T> = {
  data: T[];
  rowCount: number;
};