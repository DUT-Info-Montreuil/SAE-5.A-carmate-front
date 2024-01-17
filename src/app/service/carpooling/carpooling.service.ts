import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Carpooling, CarpoolingServiceInterface, CreateCarpoolPayload, CreateSubscriptionPayload, PublishedSubscription, Search, Subscription, publishedCarpooling } from 'src/app/interface/carpooling';
import { environment } from "../../environement/environement";
import { AbstractService } from "../abstractService";
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from "src/app/interface/other";

@Injectable({
  providedIn: 'root',
})

export class CarpoolingService extends AbstractService implements CarpoolingServiceInterface{
  $carpoolings: BehaviorSubject<Carpooling[]> = new BehaviorSubject<Carpooling[]>([]);

  constructor(
    http: HttpClient,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {
    super(http);
  }

  publish(carpooling: CreateCarpoolPayload): Observable<any> {
    return this.http.post<number>(`${environment.path}/carpooling`, carpooling, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
    });
  }

  search(search: Search): void {
    this.http.get<{"carpoolings_route": Carpooling[], "nb_carpoolings_route": number}>(
      `${environment.path}/carpooling/search`,{params: search}
      )
    .subscribe({
      next: (response) => {
        this.$carpoolings.next(response.carpoolings_route);
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            this.notifier.error("Un ou plusieurs champs sont invalides.");
            break;
          case 503:
            this.notifier.error("Service momentanément indisponible.");
            break;
          default:
            this.notifier.error("Erreur interne.");
            break;
        }
    }});
  }

  createSubscription(subscription: CreateSubscriptionPayload): Observable<any> {
    return this.http.post<any>(`${environment.path}/regular/${subscription.max_passengers ? 'carpooling' : 'booking'}`, subscription, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
      observe: 'response'
    });
  }

  getSubscriptions(): Observable<any> {
    return this.http.get<Subscription[]>(`${environment.path}/history/schedule-carpooling/booked`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }

  getCode(carpooling_id: number): Observable<number> {
    return this.http.get<number>(`${environment.path}/carpooling/TODO`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
      params: {
        carpooling_id: carpooling_id
      }
    });
  }

  getPublishedSubscriptions(): Observable<any> {
    return this.http.get<PublishedSubscription[]>(`${environment.path}/history/scheduled`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }

  getPublishedCarpoolings(): Observable<any> {
    return this.http.get<publishedCarpooling[]>(`${environment.path}/history/carpooling/published`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }

  postCode (passengerCode: number, carpoolingId: number): Observable<any> {
    return this.http.post<publishedCarpooling[]>(`${environment.path}/carpooling/confirm`, {
      passenger_code: passengerCode,
      carpooling_id: carpoolingId
    },
    {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
    });
  }

  book(id: number, is_scheduled?: boolean, date?: number): Observable<void> {
    return this.http.post<void>(`${environment.path}/carpooling/book`, {
      carpooling_id: id,
      is_scheduled: is_scheduled,
      date_for_scheduled: date
    }, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }

  getCarpoolings(): Observable<any> {
    return this.http.get<any>(`${environment.path}/history/carpooling/booked`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }
}
