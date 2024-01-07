import { Observable, forkJoin, map, of } from "rxjs";
import { ScoreUserData, ScoreboardServiceInterface } from "src/app/interface/scoreboard";

export class MockScoreboardService implements ScoreboardServiceInterface {
  constructor() {}

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
      })
    )    
  }

  getEconomicDriving(): Observable<ScoreUserData[]> {
    return of([
      {
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        economic_driving_rating: 5
      },
      {
        driver_id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        economic_driving_rating: 4
      },
      {
        driver_id: 3,
        first_name: 'John',
        last_name: 'Smith',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        economic_driving_rating: 3
      },
      {
        driver_id: 4,
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        economic_driving_rating: 2
      },
      {
        driver_id: 5,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        economic_driving_rating: 1
      }
    ]);
  }

  getSafeDriving(): Observable<ScoreUserData[]> {
    return of([
      {
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        safe_driving_rating: 4
      },
      {
        driver_id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        safe_driving_rating: 3
      },
      {
        driver_id: 3,
        first_name: 'John',
        last_name: 'Smith',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        safe_driving_rating: 2
      },
      {
        driver_id: 4,
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        safe_driving_rating: 1
      },
      {
        driver_id: 5,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        safe_driving_rating: 0
      }
    ]);
  }

  getSociability(): Observable<ScoreUserData[]> {
    return of([
      {
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        sociability_rating: 3
      },
      {
        driver_id: 2,
        first_name: 'Jane',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        sociability_rating: 2
      },
      {
        driver_id: 3,
        first_name: 'John',
        last_name: 'Smith',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        sociability_rating: 1
      },
      {
        driver_id: 4,
        first_name: 'Jane',
        last_name: 'Smith',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        sociability_rating: 0
      },
      {
        driver_id: 5,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 5,
        sociability_rating: -1
      }
    ]);
  }
}