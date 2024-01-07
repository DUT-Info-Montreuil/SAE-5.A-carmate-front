import { ScoreboardService } from './scoreboard.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ScoreboardServiceInterface } from 'src/app/interface/scoreboard';
import { NotifierServiceInterface } from 'src/app/interface/other';
import { of, throwError } from 'rxjs';
import { ScoreUserData } from 'src/app/interface/scoreboard';
describe('ScoreboardService', () => {
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyHttpClient: jasmine.SpyObj<HttpClient>;
  let spyScoreboardService: ScoreboardServiceInterface;

  beforeEach(() => {
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    spyHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    spyScoreboardService = new ScoreboardService(spyHttpClient, spyNotifierService);
  });

  it('should be created', () => {
    expect(spyScoreboardService).toBeTruthy();
  });

  describe('getScoreUserData', () => {
    it('shoudl return full UserDataScore list on success', (done) => {
      const expectedResult = [
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: new ArrayBuffer(0),
          nmbr_of_rates: 5,
          economic_driving_rating: 5,
          safe_driving_rating: 4,
          sociability_rating: 3
        }
      ];
      spyOn(spyScoreboardService, 'getEconomicDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: new ArrayBuffer(0),
          nmbr_of_rates: 5,
          economic_driving_rating: 5
        }
      ]));
      spyOn(spyScoreboardService, 'getSafeDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: new ArrayBuffer(0),
          nmbr_of_rates: 5,
          safe_driving_rating: 4
        }
      ]));
      spyOn(spyScoreboardService, 'getSociability').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: new ArrayBuffer(0),
          nmbr_of_rates: 5,
          sociability_rating: 3
        }
      ]));

      spyScoreboardService.getScoreUserData().subscribe((scoreUserData: ScoreUserData[]) => {
        expect(scoreUserData)
          .withContext('should return correct data')
          .toEqual(expectedResult);
        done();
      });
    });

    it('should display notification when API return error', (done) => {
      spyOn(spyScoreboardService, 'getEconomicDriving').and.returnValue(throwError(() => new HttpErrorResponse(
        {
          error: 'Erreur interne.',
          status: 500
        }
      )));
      spyOn(spyScoreboardService, 'getSafeDriving').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: new ArrayBuffer(0),
          nmbr_of_rates: 5,
          safe_driving_rating: 4
        }
      ]));
      spyOn(spyScoreboardService, 'getSociability').and.returnValue(of([
        {
          driver_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          profile_picture: new ArrayBuffer(0),
          nmbr_of_rates: 5,
          sociability_rating: 3
        }
      ]));
      
      spyScoreboardService.getScoreUserData().subscribe({
        next: (scoreUserData: ScoreUserData[]) => {
          fail('should not return data');
          done();
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status)
            .withContext('should return correct status')
            .toEqual(500);
          done();
        }
      })
    });
  });
});

