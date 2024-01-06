import { Inject, Injectable } from '@angular/core';
import { Carpooling, CarpoolingServiceInterface, CreateCarpoolPayload, Search } from 'src/app/interface/carpooling';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';

@Injectable({
  providedIn: 'root'
})
export class MockCarpoolingService implements CarpoolingServiceInterface{

  $searchedCarpoolings: BehaviorSubject<Carpooling[]> = new BehaviorSubject<Carpooling[]>([
    {
        starting_point: [48.8558516, 2.3588636],
        destination: [48.9757551, 2.559337],
        price: 50,
        is_canceled: false,
        departure_date_time: "2023-01-01T12:00:00",
        driver_id: 1,
        max_passengers: 1,
    },
    {
        starting_point: [48.8520, 2.3176],
        destination: [48.8569,2.3817],
        price: 40,
        is_canceled: false,
        departure_date_time: "2023-02-15T08:30:00",
        driver_id: 2,
        max_passengers: 2,
    },
    {
        starting_point: [34.0522, -118.2437],
        destination: [48.9757551, 2.559337],
        price: 35,
        is_canceled: true,
        departure_date_time: "2023-03-10T15:45:00",
        driver_id: 3,
        max_passengers: 1,
    },
    {
        starting_point: [41.8781, -87.6298],
        destination: [48.9757551, 2.559337],
        price: 60,
        is_canceled: false,
        departure_date_time: "2023-04-05T09:00:00",
        driver_id: 4,
        max_passengers: 2,
    },
    {
        starting_point: [48.9757551, 2.559337],
        destination: [29.7604, -95.3698],
        price: 45,
        is_canceled: false,
        departure_date_time: "2023-05-20T14:20:00",
        driver_id: 5,
        max_passengers: 3,
    },
    {
        starting_point: [29.7604, -95.3698],
        destination: [39.9526, -75.1652],
        price: 55,
        is_canceled: true,
        departure_date_time: "2023-06-15T18:30:00",
        driver_id: 6,
        max_passengers: 3,
    },
  ]);

  constructor(
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) { }

  publish(carpool: CreateCarpoolPayload): Observable<any> {
    if (carpool.starting_point !== undefined &&
      carpool.destination !== undefined &&
      carpool.max_passengers !== undefined &&
      carpool.price !== undefined &&
      carpool.departure_date_time !== undefined)
      {
        this.$searchedCarpoolings.getValue().push({
          starting_point: carpool.starting_point,
          destination: carpool.destination,
          max_passengers: carpool.max_passengers,
          price: carpool.price,
          departure_date_time: new Date(carpool.departure_date_time).toLocaleDateString(),
        });
        this.$searchedCarpoolings.next(this.$searchedCarpoolings.getValue());
        return of('');
      } else {
      return throwError(() => new HttpErrorResponse({error: 'Field missing', status: 400}));
    }
  }

  search(search: Search): void {
    if (search.start_lat !== undefined &&
      search.start_lon !== undefined &&
      search.end_lat !== undefined &&
      search.end_lon !== undefined &&
      search.departure_date_time !== undefined)
      {
        this.$searchedCarpoolings.next(this.$searchedCarpoolings.getValue());
      } else {
        this.notifier.error("Un ou plusieurs champs sont invalides.");
      }
  }

  createSubscription(subscription: any): Observable<any> {
    if (subscription.starting_point !== undefined &&
      subscription.destination !== undefined &&
      subscription.start_date !== undefined &&
      subscription.end_date !== undefined &&
      subscription.start_hour !== undefined &&
      subscription.days !== undefined &&
      subscription.label !== undefined)
      {
        return of('');
      } else {
        return throwError(() => new HttpErrorResponse({error: 'Field missing', status: 400}));
      }
  }
}