import {BehaviorSubject, Observable} from "rxjs";
import { InjectionToken } from "@angular/core";
import {PassengerProfile} from "./profiles";

export type Carpooling = {
    id: number;
    starting_point: number[];
    destination: number[];
    max_passengers: number;
    price: number;
    departure_date_time: string;
    is_canceled?: boolean;
    driver_id?: number;
    seats_taken?: number;
    first_name?: string;
    last_name?: string;
    is_scheduled?: boolean;
}

export type CreateCarpoolPayload = {
    starting_point: number[];
    destination: number[];
    max_passengers: number;
    price: number;
    departure_date_time: number;
}

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type CreateSubscriptionPayload = {
    starting_point: number[];
    destination: number[];
    start_date: number;
    end_date: number;
    start_hour: string;
    days: WeekDay[];
    label: string;
    max_passengers?: number;
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

export type publishedCarpooling = {
    id: number;
    starting_point: number[];
    destination: number[];
    max_passengers: number;
    price: number;
    departure_date_time: string;
    is_canceled: boolean;
    driver_id: number;
    seats_taken: number;
    passengers_profile: PassengerProfile[];
}

export type PublishedSubscription = {
    starting_point: number[];
    destination: number[];
    start_date: number;
    end_date: number;
    start_hour: string;
    days: WeekDay[];
    label: string;
    carpools: publishedCarpooling[];
}

export interface CarpoolingServiceInterface {
    $carpoolings: BehaviorSubject<Carpooling[]>;
    publish: (carpool: CreateCarpoolPayload) => Observable<any>;
    search: (search: Search) => void;
    createSubscription: (subscription: CreateSubscriptionPayload) => Observable<any>;
    getSubscriptions: () => Observable<Subscription[]>;
    getCode: (carpooling_id: number) => Observable<number>;
    getPublishedSubscriptions: () => Observable<PublishedSubscription[]>;
    getPublishedCarpoolings: () => Observable<publishedCarpooling[]>;
    postCode: (passengerCode: number, carpoolingId: number) => Observable<any>;
    book: (id: number, is_scheduled?: boolean, date?: number) => Observable<any>;
    getCarpoolings: () => Observable<Carpooling[]>;
}

export const CARPOOLING_SERVICE_TOKEN = new InjectionToken<CarpoolingServiceInterface>('CarpoolingServiceInterface');
