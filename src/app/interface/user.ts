import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface Token {
  token: string;
}

export interface AuthenticationServiceInterface {
  login: (email: string, password: string) => Observable<any>;
  isLogged: () => boolean;
  register: (firstName: string, lastName: string, email: string, password: string, accountType: string,  document: File) => Observable<any>;
}

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<AuthenticationServiceInterface>('AuthenticationServiceInterface');
