import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {map} from "rxjs";
import {IBook} from "../shared/models/book";
import {IPagination} from "../shared/models/pagination";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) { }

  getBooks() {
    let params = new HttpParams();

    params = params.append('pageSize', 12);

    return this.http.get<IPagination>(environment.apiUrl + 'books', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }
}
