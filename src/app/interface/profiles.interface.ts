import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PassengerProfile, DriverProfile } from '../model/profile.model';

export interface ProfilesServiceInterface {
  getPassengerProfile: (param: number | string) => Observable<PassengerProfile>;
  getDriverProfile: (param: number | string) => Observable<DriverProfile>;
  becomeDriver: (param: FormData) => Observable<any>;
}

export const PROFILE_SERVICE_TOKEN =
  new InjectionToken<ProfilesServiceInterface>('ProfilesServiceInterface');
