import {Observable} from "rxjs";
import {InjectionToken} from "@angular/core";

export interface Token {
  token: string;
}

export interface AuthenticationServiceInterface {
  login: (email:string, password:string) => Observable<any>;
  isLogged: () => boolean;
}
export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<AuthenticationServiceInterface>('AuthenticationServiceInterface');
