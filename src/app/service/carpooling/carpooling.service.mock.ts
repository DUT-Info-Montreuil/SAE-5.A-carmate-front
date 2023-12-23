import { Injectable } from '@angular/core';
import {Carpooling, CarpoolingServiceInterface, CreateCarpoolPayload, Search} from 'src/app/interface/carpooling';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockCarpoolingService implements CarpoolingServiceInterface{

  private carpoolDb: Carpooling[] = [
    {
        starting_point: [40.7128, -74.0060],
        destination: [34.0522, -118.2437],
        price: 50,
        is_canceled: false,
        departure_date_time: "2023-01-01T12:00:00",
        driver_id: 1,
        max_passengers: 1
    },
    {
        starting_point: [37.7749, -122.4194],
        destination: [47.6062, -122.3321],
        price: 40,
        is_canceled: false,
        departure_date_time: "2023-02-15T08:30:00",
        driver_id: 2,
        max_passengers: 2

    },
    {
        starting_point: [34.0522, -118.2437],
        destination: [41.8781, -87.6298],
        price: 35,
        is_canceled: true,
        departure_date_time: "2023-03-10T15:45:00",
        driver_id: 3,
        max_passengers: 1

    },
    {
        starting_point: [41.8781, -87.6298],
        destination: [32.7767, -96.7970],
        price: 60,
        is_canceled: false,
        departure_date_time: "2023-04-05T09:00:00",
        driver_id: 4,
        max_passengers: 2

    },
    {
        starting_point: [32.7767, -96.7970],
        destination: [29.7604, -95.3698],
        price: 45,
        is_canceled: false,
        departure_date_time: "2023-05-20T14:20:00",
        driver_id: 5,
        max_passengers: 3

    },
    {
        starting_point: [29.7604, -95.3698],
        destination: [39.9526, -75.1652],
        price: 55,
        is_canceled: true,
        departure_date_time: "2023-06-15T18:30:00",
        driver_id: 6,
        max_passengers: 3

    },
    {
        starting_point: [39.9526, -75.1652],
        destination: [33.7490, -84.3880],
        price: 48,
        is_canceled: false,
        departure_date_time: "2023-07-02T10:45:00",
        driver_id: 7,
        max_passengers: 2

    },
    {
        starting_point: [33.7490, -84.3880],
        destination: [25.7617, -80.1918],
        price: 70,
        is_canceled: false,
        departure_date_time: "2023-08-18T16:15:00",
        driver_id: 8,
        max_passengers: 1

    },
    {
        starting_point: [25.7617, -80.1918],
        destination: [43.6532, -79.3832],
        price: 42,
        is_canceled: false,
        departure_date_time: "2023-09-12T12:30:00",
        driver_id: 9,
        max_passengers: 3

    },
    {
        starting_point: [43.6532, -79.3832],
        destination: [45.4215, -75.6994],
        price: 55,
        is_canceled: false,
        departure_date_time: "2023-10-05T20:00:00",
        driver_id: 10,
        max_passengers: 2

    },
];

  constructor() { }

  publish(carpool: CreateCarpoolPayload): Observable<any> {
    this.carpoolDb.push({
      starting_point: carpool.starting_point,
      destination: carpool.destination,
      max_passengers: carpool.max_passengers,
      price: carpool.price,
      departure_date_time: new Date(carpool.departure_date_time).toLocaleDateString(),
    });
    return of('');
  }

  search(search: Search): Observable<Carpooling[]> {
    return of(this.carpoolDb);
  }
}
