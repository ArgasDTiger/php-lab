import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IGenre } from '../shared/models/genre';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';
import { IAuthorFullName } from '../shared/models/authorFullName';
import { StoreParams } from '../shared/models/storeParams';
import { IPagination } from '../shared/models/pagination';
import { IBook } from '../shared/models/book';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getGenres() {
    return this.http.get<IGenre[]>(this.baseUrl + 'genres', { observe: 'response' })
      .pipe(map(response => response.body));
  }

  getAuthors() {
    return this.http.get<IAuthorFullName[]>(this.baseUrl + 'authors/fullnames', { observe: 'response' })
      .pipe(map(response => response.body));
  }

  getBooks(storeParams: StoreParams) {
    let params = new HttpParams();

    if (storeParams.genreIds.length > 0) {
      params = params.set('genreIds', storeParams.genreIds.join(','));
    }

    if (storeParams.authorIds.length > 0) {
      params = params.set('authorIds', storeParams.authorIds.join(','));
    }

    if (storeParams.search) {
      params = params.append('search', storeParams.search.trim());
    }

    params = params.append('sort', storeParams.sort);
    params = params.append('pageIndex', storeParams.pageIndex.toString());
    params = params.append('pageSize', storeParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'books', { observe: 'response', params })
      .pipe(map(response => response.body));
  }

  getBook(id: number) {
    return this.http.get<IBook>(this.baseUrl + 'books/' + id);
  }

  addBook(formData: FormData) {
    return this.http.post<IBook>(this.baseUrl + 'books', formData);
  }

  updateBook(id: number, formData: FormData) {
    return this.http.post<IBook>(this.baseUrl + 'books/' + id, formData);
  }

  deleteBook(id: number) {
    return this.http.delete(this.baseUrl + 'books/' + id);
  }
}
