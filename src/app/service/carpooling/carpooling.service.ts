import { Injectable } from '@angular/core';
import { Carpooling, CarpoolingServiceInterface } from 'src/app/interface/carpooling';
import { environment } from "../../environement/environement";
import { HttpClient } from "@angular/common/http";
import { AbstractService } from "../abstractService";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})

export class CarpoolingService extends AbstractService implements CarpoolingServiceInterface{

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  publish(carpooling: Carpooling): Observable<any> {
    return this.http.post<Carpooling>(`${environment.path}/carpooling/create`, carpooling)
  }

}
