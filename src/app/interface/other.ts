import {InjectionToken} from "@angular/core";
import { Observable } from "rxjs";

export interface NotifierServiceInterface {
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
}
export const NOTIFIER_SERVICE_TOKEN = new InjectionToken<NotifierServiceInterface>('NotifierServiceInterface');

export interface AddressServiceInterface {
  search: (term: string) => Observable<any>;
}
export const ADDRESS_SERVICE_TOKEN = new InjectionToken<AddressServiceInterface>('AddressServiceInterface');

