import {Injectable} from '@angular/core';
import {environment} from "../../../environement/environement";
import {BehaviorSubject, catchError, Observable, tap} from "rxjs";
import {AbstractService} from "../../abstractService";
import {AuthenticationServiceInterface, Token} from "../../../interface/user";
import {HttpClient} from "@angular/common/http";
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends AbstractService implements AuthenticationServiceInterface {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  private _isDriver$ = new BehaviorSubject<boolean>(false);
  
  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  login(email_address: string, password: string): Observable<any> {
    const payload = {
      email_address,
      password
    };
    return this.http.post<Token>(`${environment.path}/auth/login`, payload).pipe(
      tap((token: Token) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('auth_token', token.token);
      }),
      catchError(this.passErrorToComponent)
    );
  }

  logOut(): Observable<any> {
    this._isLoggedIn$.next(false);
    localStorage.removeItem('auth-token');
    //TO-DO need to mplemente the route
    return this.http.post<any>(`${environment.path}/auth/logout`,{token: localStorage.getItem('auth_token')});
  } 

  register(
    form: FormGroup,
    document: Blob,
    filename: string
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('first_name', form.value.firstName);
    formData.append('last_name', form.value.lastName);
    formData.append('email_address', form.value.email);
    formData.append('password', form.value.password);
    formData.append('type', form.value.accountType);
    formData.append('document', document, filename);

    return this.http.post<Token>(`${environment.path}/auth/register`, formData).pipe(
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


  isAdmin(): boolean {
    return this._isAdmin$.getValue();
  }

  isDriver(): boolean {
    return this._isDriver$.getValue();
  }
}
