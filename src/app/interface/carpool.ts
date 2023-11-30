import {Observable} from "rxjs";

export interface Carpool {
    starting_point: string;
    destination: string;
    max_passengers: string;
    price: string,
    departure_date_time: string;
}

export interface CarpoolServiceInterface {
    publish: (carpool: Carpool) => Observable<any>;
    
}