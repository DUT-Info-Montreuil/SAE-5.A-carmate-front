import {BehaviorSubject, Observable} from "rxjs";
import { InjectionToken } from "@angular/core";

export type Carpooling = {
    id?: number;
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

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type CreateSubscriptionPayload = {
    starting_point: number[];
    destination: number[];
    start_date: number;
    end_date: number;
    start_hour: string;
    days: WeekDay[];
    label: string;
}

export type Subscription = {
    starting_point: number[];
    destination: number[];
    start_date: number;
    end_date: number;
    start_hour: string;
    days: WeekDay[];
    label: string;
    carpools: Carpooling[];
}

export type Search = {
    start_lat: number;
    start_lon: number;
    end_lat: number;
    end_lon: number;
    departure_date_time: string;
}

export interface CarpoolingServiceInterface {
    $carpoolings: BehaviorSubject<Carpooling[]>;
    publish: (carpool: CreateCarpoolPayload) => Observable<any>;
    search: (search: Search) => void;
    createSubscription: (subscription: CreateSubscriptionPayload) => Observable<any>;
    getSubscriptions: (token: string) => Observable<Subscription[]>;
    getCode: (carpooling_id: number) => Observable<number>;
}

export const CARPOOLING_SERVICE_TOKEN = new InjectionToken<CarpoolingServiceInterface>('CarpoolingServiceInterface');