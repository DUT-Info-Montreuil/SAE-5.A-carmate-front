// authentification.service.mock.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { AuthenticationServiceInterface } from "../../../interface/user";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MockAuthenticationService implements AuthenticationServiceInterface {
  constructor() {}

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private userDb: [{ email: string, password: string, token?: string, isBanned: boolean }] = [
    { email: "test@test.fr", password: "Test12+-", isBanned: false }
  ]

  login(email: string, password: string): Observable<any> {
    const foundUser = this.userDb.find(user => user.email === email);
    if (foundUser && foundUser.password === password && !foundUser.isBanned) {
      this._isLoggedIn$.next(true);
      localStorage.setItem('auth_token', "validToken");
      foundUser.token = "validToken";

      return of(null);
    } else if (!foundUser || foundUser.password !== password) {
      return throwError(() => new HttpErrorResponse({ error: 'Email or password invalid', status: 401 }));
    } else {
      return throwError(() => new HttpErrorResponse({ error: 'User is banned', status: 403 }));
    }
  }

  signup(email: string, password: string): Observable<any> {
    const foundUser = this.userDb.find(user => user.email === email);

    if (foundUser) {
      return throwError(() => new HttpErrorResponse({ error: 'Email already exists', status: 400 }));
    }

    // Ajoutez un nouvel utilisateur à la "base de données" (simulée)
    this.userDb.push({ email, password, isBanned: false });

    // Vous pouvez ajouter une logique supplémentaire ici (envoi de confirmation par email, etc.)

    return of(null);
  }

  isLogged(): boolean {
    return this._isLoggedIn$.getValue();
  }
}
