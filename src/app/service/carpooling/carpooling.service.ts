import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Carpooling, CarpoolingServiceInterface, CreateCarpoolPayload, CreateSubscriptionPayload, Search, Subscription } from 'src/app/interface/carpooling';
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
    return this.http.post<any>(`${environment.path}/regular/booking/create`, subscription, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
      observe: 'response'
    });
  }

  getSubscriptions(token: string): Observable<any> {
    return this.http.get<Subscription[]>(`${environment.path}/TODO`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
      params: {
        token: token
      },
      observe: 'response',
    });
  }
}