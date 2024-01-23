import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ScoreService } from './score.service';
import { ScoreServiceInterface } from 'src/app/interface/score.interface';
import { ScoreUserData } from 'src/app/model/score.model';

describe('ScoreboardService', () => {
  let spyHttpClient: jasmine.SpyObj<HttpClient>;
  let spyScoreService: ScoreServiceInterface;

  beforeEach(() => {
    spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    spyScoreService = new ScoreService(spyHttpClient);
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
        sociability_rating: 3,
      };
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(
        of({
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          economic_driving_rating: 5,
        }),
      );
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(
        of({
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          safe_driving_rating: 4,
        }),
      );
      spyOn(spyScoreService, 'getSociability').and.returnValue(
        of({
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          sociability_rating: 3,
        }),
      );

      spyScoreService
        .getScoreUserData()
        .subscribe((scoreUserData: ScoreUserData[] | ScoreUserData) => {
          expect(scoreUserData)
            .withContext('should return correct data')
            .toEqual(expectedResult);
          done();
        });
    });
    it('should throw an error when API calls return inconsistent data types', (done) => {
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(
        of({
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: 'image',
          nb_review: 5,
          nb_carpooling_done: 5,
          economic_driving_rating: 5,
        }),
      );
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            safe_driving_rating: 4,
          },
        ]),
      );
      spyOn(spyScoreService, 'getSociability').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            sociability_rating: 3,
          },
        ]),
      );

      spyScoreService.getScoreUserData().subscribe({
        next: (scoreUserData: ScoreUserData[] | ScoreUserData) => {
          fail('should not return data');
          done();
        },
        error: (error: Error) => {
          expect(error.message)
            .withContext('should return correct error message')
            .toEqual('Inconsistent data types');
          done();
        },
      });
    });

    it('should catch error if API return HTTP error code', (done) => {
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              error: 'Erreur interne.',
              status: 500,
            }),
        ),
      );
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            safe_driving_rating: 4,
          },
        ]),
      );
      spyOn(spyScoreService, 'getSociability').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            sociability_rating: 3,
          },
        ]),
      );

      spyScoreService.getScoreUserData().subscribe({
        next: (scoreUserData: ScoreUserData[] | ScoreUserData) => {
          fail('should not return data');
          done();
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status)
            .withContext('should return correct status')
            .toEqual(500);
          done();
        },
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
          sociability_rating: 3,
        },
      ];
      spyOn(spyScoreService, 'getEconomicDriving').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            economic_driving_rating: 5,
          },
        ]),
      );
      spyOn(spyScoreService, 'getSafeDriving').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            safe_driving_rating: 4,
          },
        ]),
      );
      spyOn(spyScoreService, 'getSociability').and.returnValue(
        of([
          {
            driver_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            profile_picture: 'image',
            nb_review: 5,
            nb_carpooling_done: 5,
            sociability_rating: 3,
          },
        ]),
      );

      spyScoreService
        .getScoreUserData()
        .subscribe((scoreUserData: ScoreUserData[] | ScoreUserData) => {
          expect(scoreUserData)
            .withContext('should return correct data')
            .toEqual(expectedResult);
          done();
        });
    });
  });
});
