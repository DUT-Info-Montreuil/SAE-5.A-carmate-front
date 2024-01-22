import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { School } from '../model/address.model';

export interface AddressServiceInterface {
  $schoolList: School[];
  getAddressByString: (term: string) => Observable<any>;
  getAddressByCoords: (lat: number, lon: number) => Observable<any>;
  matchingSchoolDeparture: (lat: number, lon: number) => string | undefined;
  getFormattedAddress: (param: string | number[]) => Observable<string>;
  formatAddress: (addressObject: any) => string;
}

export const ADDRESS_SERVICE_TOKEN =
  new InjectionToken<AddressServiceInterface>('AddressServiceInterface');
