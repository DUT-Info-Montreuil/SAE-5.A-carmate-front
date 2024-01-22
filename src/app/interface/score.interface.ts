import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ScoreUserData } from '../model/score.model';

export interface ScoreServiceInterface {
  getScoreUserData: (
    param?: string | number,
  ) => Observable<ScoreUserData[] | ScoreUserData>;
  getEconomicDriving: (
    param?: string | number,
  ) => Observable<ScoreUserData[] | ScoreUserData>;
  getSafeDriving: (
    param?: string | number,
  ) => Observable<ScoreUserData[] | ScoreUserData>;
  getSociability: (
    param?: string | number,
  ) => Observable<ScoreUserData[] | ScoreUserData>;
}

export const SCORE_SERVICE_TOKEN = new InjectionToken<ScoreServiceInterface>(
  'ScoreServiceInterface',
);
