import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Carpooling, CarpoolingServiceInterface, Search } from 'src/app/interface/carpooling';
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

  publish(carpooling: Carpooling): Observable<any> {
    return this.http.post<Carpooling>(`${environment.path}/carpooling/create`, carpooling);
  }

  search(search: Search): Observable<Carpooling[]> {
    return this.http.get<Carpooling[]>(`${environment.path}/carpooling/search`,{params: search});
  }
}
