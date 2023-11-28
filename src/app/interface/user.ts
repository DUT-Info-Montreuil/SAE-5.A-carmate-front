import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface Token {
  token: string;
}

export interface AuthenticationServiceInterface {
  login: (email:string, password:string) => Observable<any>;
  logOut: () => Observable<any>;
  isLogged: () => boolean;
  isAdmin: () => boolean;
  isDriver: () => boolean;
  register: (firstName: string, lastName: string, email: string, password: string, accountType: string,  document: File,  academicYearStart?: string, academicYearEnd?: string) => Observable<any>;
}

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<AuthenticationServiceInterface>('AuthenticationServiceInterface');
