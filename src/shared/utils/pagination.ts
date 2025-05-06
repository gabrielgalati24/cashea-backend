export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const createPaginatedResult = <T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> => {
  return {
    items,
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  };
};
