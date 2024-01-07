import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScoreUserData, ScoreServiceInterface } from 'src/app/interface/score';
import { AbstractService } from '../abstractService';
import { environment } from 'src/app/environement/environement';
import { Observable, catchError, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ScoreService extends AbstractService implements ScoreServiceInterface{
  constructor(
    http: HttpClient
    ) {
    super(http);
  }

  getScoreUserData(param?: string | number): Observable<ScoreUserData[] | ScoreUserData> {
    return forkJoin({
      economic: this.getEconomicDriving(param),
      safe: this.getSafeDriving(param),
      sociability: this.getSociability(param)
    }).pipe(
      map((responses) => {
        const {economic, safe, sociability} = responses;

        if (Array.isArray(economic) && Array.isArray(safe) && Array.isArray(sociability)) {
          return economic.map((item, index) => {
            return {
              driver_id: item.driver_id,
              first_name: item.first_name,
              last_name: item.last_name,
              profile_picture: item.profile_picture,
              nb_review: item.nb_review,
              nb_carpooling_done: item.nb_carpooling_done,
              economic_driving_rating: economic[index].economic_driving_rating,
              safe_driving_rating: safe[index].safe_driving_rating,
              sociability_rating: sociability[index].sociability_rating
            } as ScoreUserData;
          });
        } else if (!Array.isArray(economic) && !Array.isArray(safe) && !Array.isArray(sociability)) {
          return {
            driver_id: economic.driver_id,
            first_name: economic.first_name,
            last_name: economic.last_name,
            profile_picture: economic.profile_picture,
            nb_review: economic.nb_review,
            nb_carpooling_done: economic.nb_carpooling_done,
            economic_driving_rating: economic.economic_driving_rating,
            safe_driving_rating: safe.safe_driving_rating,
            sociability_rating: sociability.sociability_rating
          } as ScoreUserData;
        } else {
          throw new Error('Inconsistent data types');
        }
      }),
      catchError(this.passErrorToComponent)
    );
  }

  getEconomicDriving(param?: string | number): Observable<ScoreUserData[] | ScoreUserData> {
    let options: { headers: { authorization: string; }, params?: { [key: string]: string | number } } = {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    };

    if (param !== undefined) {
      options.params = {param: param};
    }

    return this.http.get<ScoreUserData[]>(`${environment.path}/scoreboard/economic-driving`, options);
  }

  getSafeDriving(param?: string | number): Observable<ScoreUserData[] | ScoreUserData> {
    let options: { headers: { authorization: string; }, params?: { [key: string]: string | number } } = {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    };

    if (param !== undefined) {
      options.params = {param: param};
    }

    return this.http.get<ScoreUserData[]>(`${environment.path}/scoreboard/safe-driving`, options);
  }

  getSociability(param?: string | number): Observable<ScoreUserData[] | ScoreUserData> {
    let options: { headers: { authorization: string; }, params?: { [key: string]: string | number } } = {
      headers: {
        "authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    };

    if (param !== undefined) {
      options.params = {param: param};
    }

    return this.http.get<ScoreUserData[]>(`${environment.path}/scoreboard/sociability`, options);
  }
}