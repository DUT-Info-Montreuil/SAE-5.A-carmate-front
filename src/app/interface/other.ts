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
  getAddressByString: (term: string) => Observable<any>;
  getAddressByCoords: (lat: number, lon: number) => Observable<any>;
  matchingSchoolDeparture: (lat: number, lon: number) => string | undefined;
  getFormattedAddress: (param: string | number[]) => Observable<string>;
  formatAddress: (addressObject: any) => string;
}

export const ADDRESS_SERVICE_TOKEN = new InjectionToken<AddressServiceInterface>('AddressServiceInterface');

