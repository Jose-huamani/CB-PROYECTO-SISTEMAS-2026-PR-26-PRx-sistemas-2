export interface GetRepositoryUsersRequest {
  search?: string;
  role?: string;
  function?: string;
  scope?: 'all' | 'team';
  page?: number;
  limit?: number;
}
