import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotifierServiceInterface } from 'src/app/interface/other';
import { of, throwError } from 'rxjs';
import { ScoreServiceInterface, ScoreUserData } from 'src/app/interface/score';
import { ScoreService } from './score.service';

describe('ScoreboardService', () => {
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyHttpClient: jasmine.SpyObj<HttpClient>;
  let spyScoreService: ScoreServiceInterface;

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    spyScoreService = new ScoreService(spyHttpClient, spyNotifierService);
  });

  it('should be created', () => {
    expect(spyScoreService).toBeTruthy();
  });

  describe('getScoreUserData', () => {
    it('should return a single ScoreUserData when all API calls return single objects', (done) => {
      const expectedResult = {
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 5,
        nb_carpooling_done: 5,
        economic_driving_rating: 5,
        safe_driving_rating: 4,
        sociability_rating: 3
      };
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(of({
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 5,
        nb_carpooling_done: 5,
        economic_driving_rating: 5
      }));
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(of({
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 5,
        nb_carpooling_done: 5,
        safe_driving_rating: 4
      }));
      spyOn(spyScoreService, 'getSociability').and.returnValue(of({
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 5,
        nb_carpooling_done: 5,
        sociability_rating: 3
      }));

      spyScoreService.getScoreUserData().subscribe((scoreUserData: ScoreUserData[] | ScoreUserData) => {
        expect(scoreUserData)
          .withContext('should return correct data')
          .toEqual(expectedResult);
        done();
      });
    });

    it('should throw an error when API calls return inconsistent data types', (done) => {
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(of({
        driver_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 5,
        nb_carpooling_done: 5,
        economic_driving_rating: 5
      }));
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          safe_driving_rating: 4
        }
      ]));
      spyOn(spyScoreService, 'getSociability').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          sociability_rating: 3
        }
      ]));

      spyScoreService.getScoreUserData().subscribe({
        next: (scoreUserData: ScoreUserData[] |ScoreUserData) => {
          fail('should not return data');
          done();
        },
        error: (error: Error) => {
          expect(error.message)
            .withContext('should return correct error message')
            .toEqual('Inconsistent data types');
          done();
        }
      });
    });

    it('should display notification when API return error', (done) => {
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(throwError(() => new HttpErrorResponse(
        {
          error: 'Erreur interne.',
          status: 500
        }
      )));
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          safe_driving_rating: 4
        }
      ]));
      spyOn(spyScoreService, 'getSociability').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          sociability_rating: 3
        }
      ]));

      spyScoreService.getScoreUserData().subscribe({
        next: (scoreUserData: ScoreUserData[] |ScoreUserData) => {
          fail('should not return data');
          done();
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status)
            .withContext('should return correct status')
            .toEqual(500);
          done();
        }
      });
    });

    it('should return an array of ScoreUserData when all API calls return arrays', (done) => {
      const expectedResult = [
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          economic_driving_rating: 5,
          safe_driving_rating: 4,
          sociability_rating: 3
        }
      ];
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          economic_driving_rating: 5
        }
      ]));
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          safe_driving_rating: 4
        }
      ]));
      spyOn(spyScoreService, 'getSociability').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          sociability_rating: 3
        }
      ]));

      spyScoreService.getScoreUserData().subscribe((scoreUserData: ScoreUserData[] | ScoreUserData) => {
        expect(scoreUserData)
          .withContext('should return correct data')
          .toEqual(expectedResult);
        done();
      });
    });
  });
});