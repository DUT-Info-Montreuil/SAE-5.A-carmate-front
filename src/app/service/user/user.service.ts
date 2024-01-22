import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environement/environement';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstractService';
import { UserServiceInterface } from 'src/app/interface/user.interface';
import { User } from 'src/app/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService
  extends AbstractService
  implements UserServiceInterface
{
  constructor(http: HttpClient) {
    super(http);
  }

  getUser(): Observable<any> {
    const authorization_header = {
      Authorization: `bearer ${localStorage.getItem('auth_token')}`,
    };
    return this.http.get<User>(`${environment.path}/user`, {
      headers: authorization_header,
    });
  }
}
