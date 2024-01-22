import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface PassengerProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  description: string;
  createdAt: string;
  nb_carpools_done: number;
  profile_picture: string;
}

export interface DriverProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  driver_id: number;
  description: string;
  createdAt: string;
  nb_carpools_done: number;
  profile_picture: string;
}

export interface ProfilesServiceInterface {
  getPassengerProfile: (param: number | string) => Observable<PassengerProfile>;
  getDriverProfile: (param: number | string) => Observable<DriverProfile>;
  becomeDriver: (param: FormData) => Observable<any>;
}

export const PROFILE_SERVICE_TOKEN =
  new InjectionToken<ProfilesServiceInterface>('ProfilesServiceInterface');
