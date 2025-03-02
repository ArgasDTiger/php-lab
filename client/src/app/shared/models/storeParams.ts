export class StoreParams {
  genreIds: number[] = [];
  authorIds: number[] = [];
  publisherId: number = 0;
  sort: string = 'nameAsc';
  pageIndex: number = 1;
  pageSize: number= 10;
  search?: string;
}
