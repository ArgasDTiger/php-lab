export class StoreParams {
  genreIds: number[] = [];
  authorIds: number[] = [];
  sort: string = 'nameAsc';
  pageIndex: number = 1;
  pageSize: number= 9;
  search?: string;
}
