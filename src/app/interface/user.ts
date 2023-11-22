import {Observable} from "rxjs";
import {InjectionToken} from "@angular/core";

export interface Token {
  token: string;
}

export interface AuthenticationServiceInterface {
  login: (email:string, password:string) => Observable<any>;
  logOut: () => Observable<any>;
  isLogged: () => boolean;
  isAdmin: () => boolean;
  isDriver: () => boolean;
}
export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<AuthenticationServiceInterface>('AuthenticationServiceInterface');
