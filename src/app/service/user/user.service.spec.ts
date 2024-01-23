import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { UserService } from './user.service';
import { UserServiceInterface } from 'src/app/interface/user';

describe('UserService', () => {
  let userService: UserServiceInterface;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    userService = new UserService(httpClientSpy);
    localStorage.clear();
  });

  describe('get_user', () => {
    it('should return 401 error', (done) => {
      localStorage.setItem('auth_token', 'invalidToken');
      const expectedError = new HttpErrorResponse({
        error: 'User not found',
        status: 401,
      });
      httpClientSpy.get.and.returnValue(throwError(() => expectedError));
      userService.getUser().subscribe({
        next: () => {
          done.fail('Expected an error, but got a success response.');
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          done();
        },
      });
    });
  });
});
