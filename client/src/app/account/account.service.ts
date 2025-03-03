import { Injectable } from '@angular/core';
import {BehaviorSubject, map, ReplaySubject} from "rxjs";
import {IUser} from "../shared/models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment.development";
import { jwtDecode } from 'jwt-decode';
import {RoleJwtPayload} from "../shared/models/role-jwt-payload";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser>(null!);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient,
              private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null!);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<IUser>(this.baseUrl + 'account', {headers})
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
        })

      );
  }

  login(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/login', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
        })
      );
  }

  register(values: any) {
    return this.http.post<IUser>(this.baseUrl + 'account/register', values)
      .pipe(
        map((user: IUser) => {
          if (user) {
            localStorage.setItem('token', user.token);
            this.currentUserSource.next(user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null!);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<RoleJwtPayload>(token);
      return decoded.role || null;
    }
    return null;
  }

}
