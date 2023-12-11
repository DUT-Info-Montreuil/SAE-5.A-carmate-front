import { DriverProfile, PassengerProfile, ProfilesServiceInterface } from "src/app/interface/profiles";
import { Observable, of, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { formatDate } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MockProfilesService implements ProfilesServiceInterface {
    constructor() {}

    private current_time: Date = new Date();
    private tokenDB: [{token: string, expire_at: string, user_id: number}] = [
        {token: "validToken", expire_at: formatDate(this.current_time.setDate(this.current_time.getDate() + 1), 'dd/MM/yyyy', 'en'), user_id: 1}
    ]

    private passengerDB: [{id: number, description: string, created_at: string, user_id: number}] = [
        {id: 1, description: "passenger description", "created_at": formatDate(new Date(), 'dd/MM/yyyy', 'en'), user_id: 1}
    ]

    private driverDB: [{id: number, description: string, created_at: string, user_id: number}] = [
        {id: 1, description: "driver description", "created_at": formatDate(new Date(), 'dd/MM/yyyy', 'en'), user_id: 1}
    ]

    private getUserIdFromToken() {
        let tokenLocalStorage: string | null = localStorage.getItem("auth_token");

        let userId: number = -1;
        if (tokenLocalStorage !== null) {
            this.tokenDB.forEach(function (token) {
                if (token.token == tokenLocalStorage) {
                    userId = token.user_id;
                }
            });
        }
        return userId
    }
    
    getPassengerProfile(): Observable<any> {
        let userId: number = this.getUserIdFromToken();

        let passenger_profile = null;
        if (userId > -1) {
            this.passengerDB.forEach(function (passenger) {
                if (passenger.user_id == userId) {
                    passenger_profile = passenger;
                }
            });
        } else return throwError(() => new HttpErrorResponse({error: 'Not logged', status: 401}));

        if (passenger_profile !== null)
            return throwError(() => new HttpErrorResponse({error: 'User nor found', status: 404}));
        return of(passenger_profile);
    }

    getDriverProfile(): Observable<any> {
        let user_id: number = this.getUserIdFromToken();

        let driver_profile = null;
        if (user_id > -1) {
            this.driverDB.forEach(function (driver) {
                if (driver.user_id == user_id) {
                    driver_profile = driver;
                }
            });
        } else return throwError(() => new HttpErrorResponse({error: 'Not logged', status: 401}));

        if (driver_profile !== null)
            return throwError(() => new HttpErrorResponse({error: 'User nor found', status: 404}));
        return of(driver_profile);
    }
}