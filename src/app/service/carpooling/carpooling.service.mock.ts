import { Injectable } from '@angular/core';
import { Carpooling, CarpoolingServiceInterface } from 'src/app/interface/carpooling';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockCarpoolingService implements CarpoolingServiceInterface{

  private carpoolDb: Carpooling[] = [];

  constructor() { }

  publish(carpool: Carpooling): Observable<any> {
    this.carpoolDb.push(carpool);
    return of('');
  }
}
