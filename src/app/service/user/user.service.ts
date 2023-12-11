import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/environement/environement";
import { Injectable } from "@angular/core";
import { User, UserServiceInterface } from "src/app/interface/user";
import { AbstractService } from "../abstractService";

@Injectable({
    providedIn: 'root'
})
export class UserService extends AbstractService implements UserServiceInterface {
    constructor(
        http: HttpClient,
      ) {
        super(http);
      }

    getUser(): Observable<any> {
        let authorization_header = {
            "Authorization": `bearer ${localStorage.getItem("auth_token")}`
        }
        return this.http.get<User>(`${environment.path}/user`, {headers: authorization_header});
    }
}