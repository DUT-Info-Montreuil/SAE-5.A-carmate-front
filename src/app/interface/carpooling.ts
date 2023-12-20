import {BehaviorSubject, Observable} from "rxjs";
import { InjectionToken } from "@angular/core";

export type Carpooling = {
    starting_point: number[];
    destination: number[];
    max_passengers: number;
    price: number;
    departure_date_time: string;
    is_canceled?: boolean;
    driver_id?: number;
    seats_taken?: number;
}

export type CreateCarpoolPayload = {
    starting_point: number[];
    destination: number[];
    max_passengers: number;
    price: number;
    departure_date_time: number;
}

export type Search = {
    start_lat: number;
    start_lon: number;
    end_lat: number;
    end_lon: number;
    departure_date_time: string;
}

export interface CarpoolingServiceInterface {
    $searchedCarpoolings: BehaviorSubject<Carpooling[]>;
    publish: (carpool: CreateCarpoolPayload) => Observable<number>;
    search: (search: Search) => void;
}

export const CARPOOLING_SERVICE_TOKEN = new InjectionToken<CarpoolingServiceInterface>('CarpoolingServiceInterface');
