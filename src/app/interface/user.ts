import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { FormGroup } from "@angular/forms";

export interface Token {
  token: string;
}

export interface AuthenticationServiceInterface {
  login: (email: string, password: string) => Observable<any>;
  isLogged: () => boolean;
  register: (form: FormGroup, blob: Blob, filename: string) => Observable<any>;
}

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<AuthenticationServiceInterface>('AuthenticationServiceInterface');
