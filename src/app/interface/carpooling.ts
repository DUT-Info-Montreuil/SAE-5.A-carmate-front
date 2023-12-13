import {Observable} from "rxjs";
import { InjectionToken } from "@angular/core";

export interface Carpooling {
    starting_point: string;
    destination: string;
    max_passengers: string;
    price: string,
    departure_date_time: string;
    is_canceled?: boolean;
    driver_id?: string
}

export interface CarpoolingServiceInterface {
    publish: (carpool: Carpooling) => Observable<any>; 
}

export const CARPOOLING_SERVICE_TOKEN = new InjectionToken<CarpoolingServiceInterface>('CarpoolingServiceInterface');
