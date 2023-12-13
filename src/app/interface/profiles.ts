import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export interface PassengerProfile {
    description: string
    createdAt: string
}

export interface DriverProfile {
    description: string
    createdAt: string
}

export interface ProfilesServiceInterface {
    getPassengerProfile: () => Observable<any>;
    getDriverProfile: () => Observable<any>;
}

export const PROFILE_SERVICE_TOKEN = new InjectionToken<ProfilesServiceInterface>('ProfilesServiceInterface');
