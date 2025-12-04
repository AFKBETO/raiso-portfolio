export type Page<T> = {
  count: number;
  pageNumber: number;
  pageSize: number;
  results: T[];
};
