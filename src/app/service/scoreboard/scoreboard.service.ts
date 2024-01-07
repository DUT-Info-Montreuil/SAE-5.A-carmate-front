import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ScoreUserData, ScoreboardServiceInterface } from 'src/app/interface/scoreboard';
import { AbstractService } from '../abstractService';
import { environment } from 'src/app/environement/environement';
import { Observable, catchError, forkJoin, map } from 'rxjs';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService extends AbstractService implements ScoreboardServiceInterface{
  constructor(
    http: HttpClient,
    @Inject(NOTIFIER_SERVICE_TOKEN) private notifier: NotifierServiceInterface,
  ) {
    super(http);
  }

  getScoreUserData(): Observable<ScoreUserData[]> {
    return forkJoin({
      economic: this.getEconomicDriving(),
      safe: this.getSafeDriving(),
      sociability: this.getSociability()
    }).pipe(
      map(({economic, safe, sociability}) => {
        return economic.map((item, index) => {
          return {
            driver_id: item.driver_id,
            first_name: item.first_name,
            last_name: item.last_name,
            profile_picture: item.profile_picture,
            nmbr_of_rates: item.nmbr_of_rates,
            economic_driving_rating: economic[index]?.economic_driving_rating,
            safe_driving_rating: safe[index]?.safe_driving_rating,
            sociability_rating: sociability[index]?.sociability_rating
          };
        });
      }),
      catchError(this.passErrorToComponent)
    );
  }

  getEconomicDriving(): Observable<ScoreUserData[]> {
    return this.http.get<ScoreUserData[]>(`${environment.path}/scoreboard/economic-driving`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }

  getSafeDriving(): Observable<ScoreUserData[]> {
    return this.http.get<ScoreUserData[]>(`${environment.path}/scoreboard/safe-driving`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }

  getSociability(): Observable<ScoreUserData[]> {
    return this.http.get<ScoreUserData[]>(`${environment.path}/scoreboard/sociability`, {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
  }
}