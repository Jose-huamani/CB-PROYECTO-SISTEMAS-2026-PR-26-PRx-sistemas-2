export interface PaginatedResponseModel<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
