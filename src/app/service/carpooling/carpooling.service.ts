import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import {Carpooling, CarpoolingServiceInterface, CreateCarpoolPayload, Search} from 'src/app/interface/carpooling';
import { environment } from "../../environement/environement";
import { AbstractService } from "../abstractService";

@Injectable({
  providedIn: 'root',
})

export class CarpoolingService extends AbstractService implements CarpoolingServiceInterface{

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  publish(carpooling: CreateCarpoolPayload): Observable<number> {
    return this.http.post<number>(`${environment.path}/carpooling`, carpooling, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      },
    });
  }

  search(search: Search): Observable<Carpooling[]> {
    return this.http.get<Carpooling[]>(`${environment.path}/carpooling/search`,{params: search});
  }
}
