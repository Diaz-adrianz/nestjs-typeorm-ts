export type SuccessResponse<T> = {
  status: boolean;
  message: string;
  data?: T;
};

export type ErrorResponse<T = undefined> = SuccessResponse<T> & {
  stack?: string[];
};

export type PaginateResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};
