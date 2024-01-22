import {
  DriverProfile,
  PassengerProfile,
  ProfilesServiceInterface,
} from 'src/app/interface/profiles';
import { AbstractService } from '../../abstractService';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environement/environement';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService
  extends AbstractService
  implements ProfilesServiceInterface
{
  constructor(http: HttpClient) {
    super(http);
  }

  becomeDriver(param: FormData) {
    return this.http.post(`${environment.path}/profile/driver`, param, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }

  getPassengerProfile(param: number | string): Observable<any> {
    return this.http.get<PassengerProfile>(
      `${environment.path}/profile/passenger`,
      {
        params: { param },
        headers: {
          authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      },
    );
  }

  getDriverProfile(param: number | string): Observable<any> {
    return this.http.get<DriverProfile>(`${environment.path}/profile/driver`, {
      params: { param },
      headers: {
        authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }
}
