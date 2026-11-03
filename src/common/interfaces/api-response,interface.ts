export interface PaginationMeta{
    limit: number,
    hasNextPage: boolean,
    nextCursor: string | null;
}
export interface ApiResponse<T>{
    data: T,
    meta?: PaginationMeta;
}