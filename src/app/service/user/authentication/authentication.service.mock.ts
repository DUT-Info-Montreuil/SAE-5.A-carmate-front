import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { AuthenticationServiceInterface } from "../../../interface/user";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MockAuthenticationService implements AuthenticationServiceInterface {
  constructor() {}

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  private _isDriver$ = new BehaviorSubject<boolean>(false);
  private userDb: [{ 
    email: string, password: string, token?: string, isBanned: boolean, firstName?:string, lastName?:string, accountType?:string, document?:File}] = [
    { email: "test@test.fr", password: "Test12+-", isBanned: false }
  ]

  login(email: string, password: string): Observable<any> {
    const foundUser = this.userDb.find(user => user.email === email);
    if (foundUser && foundUser.password === password && !foundUser.isBanned) {
      this._isLoggedIn$.next(true);
      this._isDriver$.next(true);
      localStorage.setItem('auth_token', "validToken");
      foundUser.token = "validToken";

      return of(null);
    } else if (!foundUser || foundUser.password !== password) {
      return throwError(() => new HttpErrorResponse({error: 'Email or password invalid', status: 401}));
    } else {
      return throwError(() => new HttpErrorResponse({error: 'User is banned', status: 403}));
    }
  }

  logOut(): Observable<any> {
    const storedToken = localStorage.getItem('auth_token');

    if (storedToken) {
      const currentUser = this.userDb.find(user => user.token === storedToken);

      if (currentUser) {
        delete currentUser.token;
        this._isLoggedIn$.next(false);
        localStorage.removeItem('auth-token');
      } 
    } 
    return of(null);
  }

  register(
    form: FormGroup,
    document: Blob,
    filename: string
  ): Observable<any> {
    return of(null);
  }
  
  private isValidEmail(email: string): boolean {
    // Regular expression to check if the email is in the correct format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
  
  private isValidPassword(password: string): boolean {
    // Regular expression to check if the password has a minimum length of 8 characters 
    // and contains at least one uppercase letter and at least one special character
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return regex.test(password);
  }
  
  private isValidDocument(document: File): boolean {
    // Check if a document is provided and not null or undefined
    return document !== null && document !== undefined;
  }
  
  // Check if the user is logged in
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
