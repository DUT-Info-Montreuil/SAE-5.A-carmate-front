import { AuthenticationService } from './authentication.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthenticationServiceInterface, Token} from "../../../interface/user";
import {of, throwError} from "rxjs";

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationServiceInterface;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const token: Token = {
    token: "working-token"
  }

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get','post']);
    authenticationService = new AuthenticationService(httpClientSpy);
    localStorage.clear();
  });

  describe('login', () => {
    it('should not set isLoggedIn to true when login fails', (done) => {
      const testUser = { email: 'wrong@example.com', password: 'wrongPassword' };
      const expectedError = new HttpErrorResponse({
        error: 'Email not found',
        status: 404,
      });
      httpClientSpy.post.and.returnValue(throwError(() => expectedError));

      authenticationService.login(testUser.email, testUser.password).subscribe({
        next: () =>{done();},
        error: () => {done();}
      })

      expect(authenticationService.isLogged()).toBeFalsy();
    });

    it('should  set isLoggedIn to true when login succeeds', (done) => {
      const testUser = { email: 'test@example.com', password: 'password123' };
      httpClientSpy.post.and.returnValue(of({...token}));

      authenticationService.login(testUser.email, testUser.password).subscribe({
        next: (tokenResponse) => {
          expect(token).toBeTruthy()
          expect(tokenResponse).toEqual(token)
          done();
        },
        error: () => {
          fail('No error should be thrown');
          done();
        }
      });

      expect(authenticationService.isLogged()).toBeTruthy();
    });

    it('should  set authToken if login is successful', (done) => {
      const testUser = { email: 'test@example.com', password: 'password123' };
      httpClientSpy.post.and.returnValue(of({...token}));

      authenticationService.login(testUser.email, testUser.password).subscribe({
        next: (tokenResponse) => {
          expect(token).toBeTruthy()
          expect(tokenResponse).toEqual(token)
          done();
        },
        error: () => {
          fail('No error should be thrown');
          done();
        }
      });

      expect(localStorage.getItem('auth_token')).toEqual(token.token);
    });
    it('should not set authToken if login failed', (done) => {
      const testUser = { email: 'wrong@example.com', password: 'wrongPassword' };
      const expectedError = new HttpErrorResponse({
        error: 'Email not found',
        status: 404,
      });
      httpClientSpy.post.and.returnValue(throwError(() => expectedError));

      authenticationService.login(testUser.email, testUser.password).subscribe({
        next: () =>{done();},
        error: () => {done();}
      })

      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });
});
