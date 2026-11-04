export interface PaginationMeta{
    limit: number,
    total: number,
    hasNextPage: boolean,
    nextCursor: string | null;
}
export interface ApiResponse<T>{
    data: T,
    meta?: PaginationMeta;
}