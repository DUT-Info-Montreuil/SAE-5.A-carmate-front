import { Inject, Injectable } from '@angular/core';
import { Carpooling, CarpoolingServiceInterface, CreateCarpoolPayload, Search, Subscription, publishedCarpooling } from 'src/app/interface/carpooling';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';

@Injectable({
  providedIn: 'root'
})
export class MockCarpoolingService implements CarpoolingServiceInterface{

  $carpoolings: BehaviorSubject<Carpooling[]> = new BehaviorSubject<Carpooling[]>([
    {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757983, 2.5594024],
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
      starting_point: [48.8520, 2.3176],
      destination: [48.9757551, 2.559337],
      price: 35,
      is_canceled: true,
      departure_date_time: "2023-03-10T15:45:00",
      driver_id: 3,
      max_passengers: 1,
    },
    {
      starting_point: [48.8520, 2.3176],
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

  $subscriptions: Subscription[] = [
    {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      start_date: 1704067200,
      end_date: 1706745600,
      start_hour: "08:30",
      days: ["Monday", "Wednesday", "Friday", "Saturday"],
      label: "Tous les lundi mercredi et vendredi de janvier",
      carpools: [
        {
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: "2024-01-13T08:30:00",
          driver_id: 1,
          max_passengers: 2,
          seats_taken: 1,
        },
        {
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: "2024-01-25T08:30:00",
          driver_id: 2,
          max_passengers: 3,
          seats_taken: 2,
        },
        {
          starting_point: [48.8558516, 2.3588636],
          destination: [48.9757551, 2.559337],
          price: 40,
          is_canceled: false,
          departure_date_time: "2024-01-08T08:30:00",
          driver_id: 2,
          max_passengers: 1,
          seats_taken: 3,
        },
      ],
    },
    {
      starting_point: [48.9757551, 2.559337],
      destination: [29.7604, -95.3698],
      start_date: 1718046955,
      end_date: 1733861755,
      start_hour: "14:20",
      days: ["Monday", "Wednesday", "Friday"],
      label: "Travail",
      carpools: [
        {
          starting_point: [48.9757551, 2.559337],
          destination: [29.7604, -95.3698],
          price: 45,
          is_canceled: false,
          departure_date_time: "2023-05-20T14:20:00",
          driver_id: 5,
          max_passengers: 3,
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
      departure_date_time: "2024-01-15T08:30:00",
      driver_id: 1,
      max_passengers: 2,
      seats_taken: 1,
      passengers: [1, 2]
    },
    {
      id: 2,
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 40,
      is_canceled: false,
      departure_date_time: "2024-01-25T08:30:00",
      driver_id: 2,
      max_passengers: 3,
      seats_taken: 2,
      passengers: [3]
    }
  ];

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
        this.$carpoolings.getValue().push({
          starting_point: carpool.starting_point,
          destination: carpool.destination,
          max_passengers: carpool.max_passengers,
          price: carpool.price,
          departure_date_time: new Date(carpool.departure_date_time).toLocaleDateString(),
        });
        this.$carpoolings.next(this.$carpoolings.getValue());
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
        this.$carpoolings.next(this.$carpoolings.getValue());
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

  getSubscriptions(token: string): Observable<any> {
    return of(this.$subscriptions);
  }

  getPublishedCarpoolings(token: string): Observable<publishedCarpooling[]> {
    return of(this.$publishedCarpoolings);
  }

  postCode(passengerCode: number, carpoolingId: number) : Observable<any> {
    if (passengerCode === 123456) {
      return of('');
    } else {
      return throwError(() => new HttpErrorResponse({error: 'Code invalide', status: 400}));
    }
  }
}