import { Injectable } from '@angular/core';
import { Carpool, CarpoolServiceInterface } from 'src/app/interface/carpool';
import { environment } from "../../environement/environement";
import { HttpClient } from "@angular/common/http";
import { AbstractService } from "../abstractService";
import { Observable } from "rxjs";
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root',
})

export class CarpoolService extends AbstractService implements CarpoolServiceInterface{

  constructor(
    http: HttpClient,
  ) {
    super(http);
  }

  publish(carpool: Carpool): Observable<any> {
    return this.http.post<FormGroup>(`${environment.path}/publish-carpool`, carpool)
  }

}
