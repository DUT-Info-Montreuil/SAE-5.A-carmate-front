import { Inject, Injectable } from '@angular/core';
import {
  Carpooling,
  CarpoolingServiceInterface,
  CreateCarpoolPayload,
  PublishedSubscription,
  Search,
  Subscription,
  publishedCarpooling,
} from 'src/app/interface/carpooling.interface';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other.interface';
import {PassengerProfile} from "../../interface/profiles.interface";

@Injectable({
  providedIn: 'root',
})
export class MockCarpoolingService implements CarpoolingServiceInterface {
  $carpoolings: BehaviorSubject<Carpooling[]> = new BehaviorSubject<
    Carpooling[]
  >([
    {
      id: 1,
      starting_point: [48.843487, 2.374254],
      destination: [48.979739, 2.553426],
      max_passengers: 3,
      price: 20,
      departure_date_time: 'Wed, 17 Jan 2024 10:11:48 GMT',
      is_canceled: false,
      driver_id: 101,
      seats_taken: 2,
      first_name: 'John',
      last_name: 'Doe',
      is_scheduled: false,
    },
    {
      id: 2,
      starting_point: [48.84335, 2.374057],
      destination: [48.975527, 2.561268],
      max_passengers: 1,
      price: 15,
      departure_date_time: 'Wed, 11 Jan 2024 11:11:48 GMT',
      is_canceled: false,
      driver_id: 102,
      seats_taken: 0,
      first_name: 'John',
      last_name: 'Doe',
      is_scheduled: false,
    },
    {
      id: 3,
      starting_point: [48.853686, 2.369441],
      destination: [48.976223, 2.561324],
      max_passengers: 4,
      price: 25,
      departure_date_time: 'Wed, 12 Jan 2024 09:11:48 GMT',
      is_canceled: false,
      driver_id: 103,
      seats_taken: 3,
      first_name: 'John',
      last_name: 'Doe',
      is_scheduled: true,
    },
    {
      id: 4,
      starting_point: [48.843492, 2.373834],
      destination: [48.975508, 2.559423],
      max_passengers: 2,
      price: 18,
      departure_date_time: 'Wed, 13 Jan 2024 08:11:48 GMT',
      is_canceled: false,
      driver_id: 104,
      seats_taken: 1,
      first_name: 'John',
      last_name: 'Doe',
      is_scheduled: true,
    },
    {
      id: 5,
      starting_point: [48.877086, 2.361286],
      destination: [48.966698, 2.562614],
      max_passengers: 3,
      price: 22,
      departure_date_time: 'Wed, 14 Jan 2024 07:11:48 GMT',
      is_canceled: false,
      driver_id: 105,
      seats_taken: 1,
      first_name: 'John',
      last_name: 'Doe',
      is_scheduled: true,
    },
    {
      id: 6,
      starting_point: [48.8568, 2.3837],
      destination: [48.97591, 2.55951],
      max_passengers: 1,
      price: 12,
      departure_date_time: 'Wed, 15 Jan 2024 07:30:48 GMT',
      is_canceled: false,
      driver_id: 106,
      seats_taken: 0,
      first_name: 'John',
      last_name: 'Doe',
      is_scheduled: true,
    },
  ]);

  $subscriptions: Subscription[] = [
    {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      start_date: 1704067200,
      end_date: 1706745600,
      start_hour: '08:30',
      days: ['Monday', 'Wednesday', 'Friday'],
      label: 'Tous les lundi mercredi et vendredi de janvier',
      carpools: [
        {
          id: 1,
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: '2024-01-17T08:30:00',
          driver_id: 1,
          max_passengers: 2,
          seats_taken: 1,
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          id: 2,
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: '2024-01-25T08:30:00',
          driver_id: 2,
          max_passengers: 3,
          seats_taken: 2,
          first_name: 'John',
          last_name: 'Doe',
        },
        {
          id: 3,
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: '2024-01-08T08:30:00',
          driver_id: 2,
          max_passengers: 1,
          seats_taken: 3,
          first_name: 'John',
          last_name: 'Doe',
        },
      ],
    },
    {
      starting_point: [48.9757551, 2.559337],
      destination: [29.7604, -95.3698],
      start_date: 1718046955,
      end_date: 1733861755,
      start_hour: '14:20',
      days: ['Monday', 'Wednesday', 'Friday'],
      label: 'Travail',
      carpools: [
        {
          id: 4,
          starting_point: [48.9757551, 2.559337],
          destination: [29.7604, -95.3698],
          price: 45,
          is_canceled: false,
          departure_date_time: '2023-05-20T14:20:00',
          driver_id: 5,
          max_passengers: 3,
          seats_taken: 3,
          first_name: 'John',
          last_name: 'Doe',
        },
      ],
    },
  ];

  $publishedSubscriptions: PublishedSubscription[] = [
    {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      start_date: 1704067200,
      end_date: 1706745600,
      start_hour: '08:30',
      days: ['Monday', 'Wednesday', 'Friday'],
      label: 'Tous les lundi mercredi et vendredi de janvier',
      carpools: [
        {
          id: 1,
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: '2024-01-17T08:30:00',
          driver_id: 1,
          max_passengers: 2,
          seats_taken: 1,
          passengers_profile: [
            {
              first_name: 'John',
              last_name: 'Doe',
            } as PassengerProfile,
            {
              first_name: 'Johny',
              last_name: 'Doey',
            } as PassengerProfile,
          ],
        },
        {
          id: 2,
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: '2024-01-25T08:30:00',
          driver_id: 2,
          max_passengers: 3,
          seats_taken: 2,
          passengers_profile: [
            {
              first_name: 'John',
              last_name: 'Doe',
            } as PassengerProfile,
          ],
        },
        {
          id: 3,
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: '2024-01-08T08:30:00',
          driver_id: 2,
          max_passengers: 1,
          seats_taken: 1,
          passengers_profile: [
            {
              first_name: 'John',
              last_name: 'Doe',
            } as PassengerProfile,
          ],
        },
      ],
    },
    {
      starting_point: [48.9757551, 2.559337],
      destination: [29.7604, -95.3698],
      start_date: 1718046955,
      end_date: 1733861755,
      start_hour: '14:20',
      days: ['Monday', 'Wednesday', 'Friday'],
      label: 'Travail',
      carpools: [
        {
          id: 4,
          starting_point: [48.9757551, 2.559337],
          destination: [29.7604, -95.3698],
          price: 45,
          is_canceled: false,
          departure_date_time: '2023-05-20T14:20:00',
          driver_id: 5,
          max_passengers: 3,
          seats_taken: 2,
          passengers_profile: [
            {
              first_name: 'John',
              last_name: 'Doe',
            } as PassengerProfile,
            {
              first_name: 'Johny',
              last_name: 'Doey',
            } as PassengerProfile,
          ],
        },
      ],
    },
  ];

  $publishedCarpoolings: publishedCarpooling[] = [
    {
      id: 1,
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 40,
      is_canceled: false,
      departure_date_time: '2024-01-17T08:30:00',
      driver_id: 1,
      max_passengers: 2,
      seats_taken: 1,
      passengers_profile: [
        {
          first_name: 'John',
          last_name: 'Doe',
        } as PassengerProfile,
        {
          first_name: 'Johny',
          last_name: 'Doey',
        } as PassengerProfile,
      ],
    },
    {
      id: 2,
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 40,
      is_canceled: false,
      departure_date_time: '2024-01-25T08:30:00',
      driver_id: 2,
      max_passengers: 3,
      seats_taken: 2,
      passengers_profile: [
        {
          first_name: 'John',
          last_name: 'Doe',
        } as PassengerProfile,
      ],
    },
  ];

  $myCarpoolings: Carpooling[] = [
    {
      id: 1,
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 40,
      is_canceled: false,
      departure_date_time: '2024-01-17T08:30:00',
      driver_id: 1,
      max_passengers: 2,
      seats_taken: 1,
    },
    {
      id: 2,
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 40,
      is_canceled: false,
      departure_date_time: '2024-01-25T08:30:00',
      driver_id: 2,
      max_passengers: 3,
      seats_taken: 2,
    },
  ];

  constructor(
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {}

  publish(carpool: CreateCarpoolPayload): Observable<any> {
    if (
      carpool.starting_point !== undefined &&
      carpool.destination !== undefined &&
      carpool.max_passengers !== undefined &&
      carpool.price !== undefined &&
      carpool.departure_date_time !== undefined
    ) {
      let maxId = 0;
      if (this.$carpoolings.getValue().length > 0) {
        maxId = Math.max(
          ...this.$carpoolings
            .getValue()
            .map((carpooling) => carpooling.id || 0),
        );
      }
      this.$carpoolings.getValue().push({
        id: maxId + 1,
        starting_point: carpool.starting_point,
        destination: carpool.destination,
        max_passengers: carpool.max_passengers,
        price: carpool.price,
        departure_date_time: new Date(
          carpool.departure_date_time,
        ).toLocaleDateString(),
        driver_id: 1,
        seats_taken: 0,
        first_name: 'John',
        last_name: 'Doe',
      });
      this.$carpoolings.next(this.$carpoolings.getValue());
      return of('');
    } else {
      return throwError(
        () => new HttpErrorResponse({ error: 'Field missing', status: 400 }),
      );
    }
  }

  search(search: Search): void {
    if (
      search.start_lat !== undefined &&
      search.start_lon !== undefined &&
      search.end_lat !== undefined &&
      search.end_lon !== undefined &&
      search.departure_date_time !== undefined
    ) {
      this.$carpoolings.next(this.$carpoolings.getValue());
    } else {
      this.notifier.error('Un ou plusieurs champs sont invalides.');
    }
  }

  createSubscription(subscription: any): Observable<any> {
    if (
      subscription.starting_point !== undefined &&
      subscription.destination !== undefined &&
      subscription.start_date !== undefined &&
      subscription.end_date !== undefined &&
      subscription.start_hour !== undefined &&
      subscription.days !== undefined &&
      subscription.label !== undefined
    ) {
      return of('');
    } else {
      return throwError(
        () => new HttpErrorResponse({ error: 'Field missing', status: 400 }),
      );
    }
  }

  getSubscriptions(): Observable<any> {
    return of(this.$subscriptions);
  }

  getCode(carpooling_id: number): Observable<number> {
    return of(123456);
  }

  getPublishedSubscriptions(): Observable<PublishedSubscription[]> {
    return of(this.$publishedSubscriptions);
  }

  getPublishedCarpoolings(): Observable<publishedCarpooling[]> {
    return of(this.$publishedCarpoolings);
  }

  postCode(passengerCode: number, carpoolingId: number): Observable<any> {
    if (passengerCode == 123456) {
      return of('');
    } else {
      return throwError(
        () => new HttpErrorResponse({ error: 'Code invalide', status: 400 }),
      );
    }
  }

  book(id: number): Observable<any> {
    if (id !== undefined) {
      this.$carpoolings.next(this.$carpoolings.getValue());
    } else {
      throwError(
        () =>
          new HttpErrorResponse({
            error: "Ce trajet n'éxiste plus.",
            status: 400,
          }),
      );
    }
    return of('');
  }

  getCarpoolings(): Observable<Carpooling[]> {
    return of(this.$myCarpoolings);
  }
}
