import { DriverProfile, PassengerProfile, ProfilesServiceInterface } from "src/app/interface/profiles";
import { AbstractService } from "../../abstractService";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/environement/environement";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ProfilesService extends AbstractService implements ProfilesServiceInterface {
    constructor(
        http: HttpClient,
      ) {
        super(http);
      }
    
    getPassengerProfile(): Observable<any> {
        let authorization_header = {
            "Authorization": `bearer ${localStorage.getItem("auth_token")}`
        }
        return this.http.get<PassengerProfile>(`${environment.path}/profile/passenger`, {headers: authorization_header});   
    }

    getDriverProfile(): Observable<any> {
        let authorization_header = {
            "Authorization": `bearer ${localStorage.getItem("auth_token")}`
        }
        return this.http.get<DriverProfile>(`${environment.path}/profile/driver`, {headers: authorization_header});
    }
}