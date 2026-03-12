export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
