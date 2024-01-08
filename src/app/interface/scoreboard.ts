import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export type ScoreUserData = {
  driver_id: number;
  first_name: string;
  last_name: string;
  profile_picture: ArrayBuffer;
  nmbr_of_rates: number;
  economic_driving_rating?: number;
  safe_driving_rating?: number;
  sociability_rating?: number;
}

export interface ScoreboardServiceInterface {
  getScoreUserData: () => Observable<ScoreUserData[]>;
  getEconomicDriving: () => Observable<ScoreUserData[]>;
  getSafeDriving: () => Observable<ScoreUserData[]>;
  getSociability: () => Observable<ScoreUserData[]>;
}

export const SCOREBOARD_SERVICE_TOKEN = new InjectionToken<ScoreboardServiceInterface>('ScoreboardServiceInterface');