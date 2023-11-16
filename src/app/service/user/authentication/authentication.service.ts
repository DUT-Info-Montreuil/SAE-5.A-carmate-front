import { Injectable } from '@angular/core';
import { environment } from "../../../environement/environement";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { AbstractService } from "../../abstractService";
import { AuthenticationServiceInterface, Token } from "../../../interface/user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends AbstractService implements AuthenticationServiceInterface {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
  ) {
    super(http);
  }

  login(email: string, password: string): Observable<any> {
    const payload = {
      email,
      password
    };
    return this.http.post<Token>(`${environment.path}/login`, payload).pipe(
      tap((token: Token) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('auth_token', token.token);
      }),
      catchError(this.passErrorToComponent)
    );
  }

  register(firstName: string, lastName: string, email: string, password: string, confirmPassword: string): Observable<any> {
    const payload = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    };
    return this.http.post<Token>(`${environment.path}/register`, payload).pipe(
      tap((token: Token) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('auth_token', token.token);
      }),
      catchError(this.passErrorToComponent)
    );
  }

  isLogged(): boolean {
    return this._isLoggedIn$.getValue();
  }
}
