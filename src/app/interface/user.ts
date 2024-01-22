import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface Token {
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  emailAddress: string;
  createdAt: string;
  profilePicture: string | null;
}

export interface AuthenticationServiceInterface {
  login: (email: string, password: string) => Observable<any>;
  logOut: () => void;
  isLogged: () => boolean;
  isAdmin: () => boolean;
  isDriver: () => boolean;
  register: (form: FormGroup, blob: Blob, filename: string) => Observable<any>;
}

export interface UserServiceInterface {
  getUser: () => Observable<any>;
}

export const AUTHENTICATION_SERVICE_TOKEN =
  new InjectionToken<AuthenticationServiceInterface>(
    'AuthenticationServiceInterface',
  );
export const USER_SERVICE_TOKEN = new InjectionToken<UserServiceInterface>(
  'UserServiceInterface',
);
