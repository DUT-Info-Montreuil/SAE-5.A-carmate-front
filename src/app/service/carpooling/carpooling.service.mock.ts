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
          id: 1,
          starting_point: [48.843487, 2.374254],
          destination: [48.979739, 2.553426],
          max_passengers: 3,
          price: 20,
          departure_date_time: "Wed, 10 Jan 2024 10:11:48 GMT",
          driver_id: 101,
          seats_taken: 2,
      },
      {
          id: 2,
          starting_point: [48.84335, 2.374057],
          destination: [48.975527, 2.561268],
          max_passengers: 1,
          price: 15,
          departure_date_time: "Wed, 11 Jan 2024 11:11:48 GMT",
          driver_id: 102,
          seats_taken: 0,
      },
      {
          id: 3,
          starting_point: [48.853686, 2.369441],
          destination: [48.976223, 2.561324],
          max_passengers: 4,
          price: 25,
          departure_date_time: "Wed, 12 Jan 2024 09:11:48 GMT",
          driver_id: 103,
          seats_taken: 3,
      },
      {
          id: 4,
          starting_point: [48.843492, 2.373834],
          destination: [48.975508, 2.559423],
          max_passengers: 2,
          price: 18,
          departure_date_time: "Wed, 13 Jan 2024 08:11:48 GMT",
          driver_id: 104,
          seats_taken: 1,
      },
      {
          id: 5,
          starting_point: [48.877086, 2.361286],
          destination: [48.966698, 2.562614],
          max_passengers: 3,
          price: 22,
          departure_date_time: "Wed, 14 Jan 2024 07:11:48 GMT",
          driver_id: 105,
          seats_taken: 1,
      },
      {
          id: 6,
          starting_point: [48.8568, 2.3837],
          destination: [48.97591,2.55951],
          max_passengers: 1,
          price: 12,
          departure_date_time: "Wed, 15 Jan 2024 07:30:48 GMT",
          driver_id: 106,
          seats_taken: 0,
      }
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
        let maxId = 0;
        if (this.$searchedCarpoolings.getValue().length > 0) {
          maxId = Math.max(...this.$searchedCarpoolings.getValue().map(carpooling => carpooling.id));
        }
        this.$searchedCarpoolings.getValue().push({
          id: maxId + 1,
          starting_point: carpool.starting_point,
          destination: carpool.destination,
          max_passengers: carpool.max_passengers,
          price: carpool.price,
          departure_date_time: new Date(carpool.departure_date_time).toLocaleDateString(),
          driver_id: 1,
          seats_taken: 0,
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

  book(id: number): Observable<void> {
    return of();
  }
}