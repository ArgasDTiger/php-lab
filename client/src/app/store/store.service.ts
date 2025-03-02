import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IGenre} from "../shared/models/genre";
import {environment} from "../../environments/environment.development";
import {map} from "rxjs";
import {IAuthorFullName} from "../shared/models/authorFullName";
import {StoreParams} from "../shared/models/storeParams";
import {IPagination} from "../shared/models/pagination";
import {IBook} from "../shared/models/book";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getGenres() {
    return this.http.get<IGenre[]>(this.baseUrl + 'genres',
      { observe: 'response' })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getAuthors() {
    return this.http.get<IAuthorFullName[]>(this.baseUrl + 'authors/fullnames',
      { observe: 'response' })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getBooks(storeParams: StoreParams) {
    let params = new HttpParams();

    if (storeParams.authorIds.length > 0) {
      for (let id of storeParams.authorIds) {
        params = params.append('authorIds', id.toString());
      }
    }

    if (storeParams.genreIds.length > 0) {
      for (let id of storeParams.genreIds) {
        params = params.append('genreIds', id.toString());
      }
    }

    if (storeParams.publisherId !== 0) {
      params = params.append('publisherId', storeParams.publisherId.toString())
    }

    if (storeParams.search) {
      params = params.append('search', storeParams.search.trim());
    }

    params = params.append('sort', storeParams.sort);
    params = params.append('pageIndex', storeParams.pageIndex.toString());
    params = params.append('pageSize', storeParams.pageSize.toString());

    return this.http.get<IPagination>(environment.apiUrl + 'books', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getBook(id: number) {
    return this.http.get<IBook>(this.baseUrl + 'books/' + id);
  }

}
