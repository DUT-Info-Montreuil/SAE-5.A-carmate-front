// user.ts

import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export interface Token {
  token: string;
}

export interface AuthenticationServiceInterface {
  login: (email: string, password: string) => Observable<any>;
  isLogged: () => boolean;
  signup: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => Observable<any>; // Ajout de la méthode signup
}

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<AuthenticationServiceInterface>('AuthenticationServiceInterface');
