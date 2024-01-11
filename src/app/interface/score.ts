import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export type ScoreUserData = {
  driver_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
  nb_review: number;
  nb_carpooling_done: number
  economic_driving_rating?: number;
  safe_driving_rating?: number;
  sociability_rating?: number;
}

export interface ScoreServiceInterface {
  getScoreUserData: (param?: string | number) => Observable<ScoreUserData[] | ScoreUserData>;
  getEconomicDriving: (param?: string | number) => Observable<ScoreUserData[] | ScoreUserData>;
  getSafeDriving: (param?: string | number) => Observable<ScoreUserData[] | ScoreUserData>;
  getSociability: (param?: string | number) => Observable<ScoreUserData[] | ScoreUserData>;
}

export const SCORE_SERVICE_TOKEN = new InjectionToken<ScoreServiceInterface>('ScoreServiceInterface');