export type PaginatedResponse<T> = {
  data: T;
  count: number;
  page: number;
  nextPage: number;
  previousPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageCount: number;
};
