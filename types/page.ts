export type Page<T> = {
  count: number;
  page: number;
  pageSize: number;
  results: T[];
};
