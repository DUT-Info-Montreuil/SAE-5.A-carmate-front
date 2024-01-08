import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import { ProfilesServiceInterface } from "src/app/interface/profiles";
import { ProfilesService } from "./profiles.service";

describe('ProfileService', () => {
  let profilesService: ProfilesServiceInterface;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    profilesService = new ProfilesService(httpClientSpy);
    localStorage.clear();
  });

  describe('getPassengerProfile', () => {
    it('should return 401 error', (done) => {
      localStorage.setItem("auth_token", "invalidToken");
      const expectedError = new HttpErrorResponse({
        error: 'User not found',
        status: 401
      });
      httpClientSpy.get.and.returnValue(throwError(() => expectedError));
      profilesService.getPassengerProfile(localStorage.getItem('auth-token')!).subscribe({
        next: () => { done.fail('Expected an error, but got a success response.'); },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          done();
        }
      });
    });
  });

  describe('getDriverProfile', () => {
    it('should return 401 error', (done) => {
      localStorage.setItem("auth_token", "invalidToken");
      const expectedError = new HttpErrorResponse({
        error: 'User not found',
        status: 401
      });
      httpClientSpy.get.and.returnValue(throwError(() => expectedError));
      profilesService.getDriverProfile(localStorage.getItem('auth-token')!).subscribe({
        next: () => { done.fail('Expected an error, but got a success response.'); },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          done();
        }
      });
    });
  });
});
