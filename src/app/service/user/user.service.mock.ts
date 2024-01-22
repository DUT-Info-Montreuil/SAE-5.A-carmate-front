import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserServiceInterface } from 'src/app/interface/user';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MockUserService implements UserServiceInterface {
  private current_time: Date = new Date();
  private tokenDB: [{ token: string; expire_at: string; user_id: number }] = [
    {
      token: 'validToken',
      expire_at: formatDate(
        this.current_time.setDate(this.current_time.getDate() + 1),
        'dd/MM/yyyy',
        'en',
      ),
      user_id: 1,
    },
  ];

  private userDB: [
    {
      id: number;
      first_name: string;
      last_name: string;
      email_address: string;
      password: string;
      account_status: string;
      created_at: string;
      profile_picture: string | null;
    },
  ] = [
    {
      id: 1,
      first_name: 'first_test',
      last_name: 'last_test',
      email_address: 'test@example.com',
      password: 'pwd',
      account_status: 'Teacher',
      created_at: this.current_time.toDateString(),
      profile_picture: null,
    },
  ];

  constructor() {}

  private getUserIdFromToken() {
    const tokenLocalStorage: string | null = localStorage.getItem('auth_token');

    let user_id = -1;
    if (tokenLocalStorage !== null) {
      this.tokenDB.forEach(function (token) {
        if (token.token == tokenLocalStorage) {
          user_id = token.user_id;
        }
      });
    }
    return user_id;
  }

  getUser(): Observable<any> {
    const user_id = this.getUserIdFromToken();
    if (user_id < 0) {
      return throwError(
        () => new HttpErrorResponse({ error: 'Not logged', status: 401 }),
      );
    }

    let _user = null;
    this.userDB.forEach(function (user) {
      if (user.id == user_id) {
        _user = user;
      }
    });

    if (_user !== null)
      return throwError(
        () => new HttpErrorResponse({ error: 'User nor found', status: 404 }),
      );
    return of(_user);
  }
}
