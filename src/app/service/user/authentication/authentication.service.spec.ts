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
  })
  
  describe('register', () => {
    it('should not register user with an existing email', (done) => {
      const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.fr',
        password: 'Test12+-',
        accountType: 'student',
        document: new File(['dummy content'], 'document.txt', { type: 'text/plain' }),
        academicYearStart: '2021',
        academicYearEnd: '2022'
      };
      const expectedError = new HttpErrorResponse({
        error: 'Email already exists',
        status: 409,
      });
      httpClientSpy.post.and.returnValue(throwError(() => expectedError));

      authenticationService.register(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.password,
        testUser.accountType,
        testUser.document,
        testUser.academicYearStart,
        testUser.academicYearEnd
      ).subscribe({
        next: () => {
          fail('Should not register user');
          done();
        },
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        }
      });
    });

    it('should register user with a new email', (done) => {
      const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'newuser@example.com',
        password: 'Test12+-',
        accountType: 'student',
        document: new File(['dummy content'], 'document.txt', { type: 'text/plain' }),
        academicYearStart: '2021',
        academicYearEnd: '2022'
      };
      httpClientSpy.post.and.returnValue(of(null));

      authenticationService.register(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.password,
        testUser.accountType,
        testUser.document,
        testUser.academicYearStart,
        testUser.academicYearEnd
      ).subscribe({
        next: () => {
          done();
        },
        error: () => {
          fail('No error should be thrown');
          done();
        }
      });
    });
  });
});
