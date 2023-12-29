import {InjectionToken} from "@angular/core";
import { Observable } from "rxjs";

export interface NotifierServiceInterface {
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
}
export const NOTIFIER_SERVICE_TOKEN = new InjectionToken<NotifierServiceInterface>('NotifierServiceInterface');

export type School = {lat: number; lon: number; name: string;};
export interface AddressServiceInterface {
  $schoolList: School[];
  search: (term: string) => Observable<any>;
  find: (lat: number, lon: number) => Observable<any>;
  matchingSchoolDeparture: (lat: number, lon: number) => string | undefined;
}
export const ADDRESS_SERVICE_TOKEN = new InjectionToken<AddressServiceInterface>('AddressServiceInterface');

