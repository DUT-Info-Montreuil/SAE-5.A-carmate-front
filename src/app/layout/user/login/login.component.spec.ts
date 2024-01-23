import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from '../../../interface/notifier.interface';
import {
  AUTHENTICATION_SERVICE_TOKEN,
  AuthenticationServiceInterface,
} from '../../../interface/user.interface';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Token } from 'src/app/model/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let spyAuthService: jasmine.SpyObj<AuthenticationServiceInterface>;
  let spyRouterService: jasmine.SpyObj<Router>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let queryParams: BehaviorSubject<any>;
  const returnToken: Token = { token: 'someToken' };
  const setEmailAndPassword = (email: string, password: string) => {
    component['loginForm'].controls.email.setValue(email);
    component['loginForm'].controls.password.setValue(password);
  };
  const validUser = { email: 'test@example.com', password: 'Test12+-' };

  beforeEach(async () => {
    spyAuthService = jasmine.createSpyObj('AuthenticationServiceInterface', [
      'login',
      'isLogged',
    ]);
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', [
      'error',
      'success',
      'warning',
    ]);
    queryParams = new BehaviorSubject({});
    spyRouterService = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        FontAwesomeModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: spyRouterService },
        { provide: AUTHENTICATION_SERVICE_TOKEN, useValue: spyAuthService },
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParams.asObservable() },
        },
      ],
    })
      .overrideProvider(ActivatedRoute, {
        useValue: { queryParams: queryParams.asObservable() },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method on submit', () => {
    spyAuthService.login.and.returnValue(of(returnToken));
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyAuthService.login.calls.count()).toEqual(1);
    expect(spyAuthService.login.calls.mostRecent().args).toEqual([
      validUser.email,
      validUser.password,
    ]);
  });

  it('should call login with redirectTo if there are query params', () => {
    fixture.detectChanges();

    spyAuthService.login.and.returnValue(of(returnToken));
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyAuthService.login.calls.count()).toEqual(1);
    expect(spyAuthService.login.calls.mostRecent().args).toEqual([
      validUser.email,
      validUser.password,
    ]);
  });

  it('should set submit enabled if the email and password format are valid', () => {
    setEmailAndPassword(validUser.email, validUser.password);
    fixture.detectChanges();

    expect(component['loginForm'].invalid).toBeFalsy();
    expect(component['needsToChangeAField']).toBeFalsy();
    const button = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    ).nativeElement;
    expect(button.disabled).toBeFalsy();
  });

  it('should not set submit enabled if the email format is invalid', () => {
    const testUser = {
      email: 'testInvalidEmailFormat',
      password: 'password123',
    };
    setEmailAndPassword(testUser.email, testUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    ).nativeElement;
    expect(component['loginForm'].controls.email.invalid).toBeTruthy();
    expect(button.disabled).toBeTruthy();
  });

  it('should not set submit enabled if the password format is invalid', () => {
    const testUser = { email: 'test@example.com', password: 'low' };
    setEmailAndPassword(testUser.email, testUser.password);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    ).nativeElement;
    expect(component['loginForm'].controls.password.invalid).toBeTrue();
    expect(button.disabled).toBeTruthy();
  });

  it('should notify the user if the email is not recognized and button should be disabled', () => {
    spyAuthService.login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Email or password invalid',
            status: 401,
          }),
      ),
    );
    setEmailAndPassword(validUser.email, validUser.password);

    const button = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    ).nativeElement;

    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();

    component.submit();
    fixture.detectChanges();

    expect(spyNotifierService.error).toHaveBeenCalled();
    expect(button.disabled).toBeTruthy();
    expect(component['needsToChangeAField']).toBeTruthy();
  });

  it('should notify the user if the password is wrong and button should be disabled', () => {
    spyAuthService.login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'Email or password invalid',
            status: 401,
          }),
      ),
    );
    setEmailAndPassword(validUser.email, validUser.password);
    const button = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    ).nativeElement;

    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();

    component.submit();
    fixture.detectChanges();

    expect(spyNotifierService.error).toHaveBeenCalled();
    expect(button.disabled).toBeTruthy();
    expect(component['needsToChangeAField']).toBeTruthy();
  });

  it('should notify the user when he is banned', () => {
    spyAuthService.login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'User is banned',
            status: 403,
          }),
      ),
    );
    setEmailAndPassword(validUser.email, validUser.password);
    const button = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    ).nativeElement;

    fixture.detectChanges();
    expect(button.disabled).toBeFalsy();

    component.submit();
    fixture.detectChanges();

    expect(spyNotifierService.error).toHaveBeenCalled();
    expect(button.disabled).toBeFalsy();
    expect(component['needsToChangeAField']).toBeFalsy();
  });

  it('should redirect the user to the home page if he is logged', () => {
    spyAuthService.isLogged.and.returnValue(true);
    fixture.detectChanges();

    expect(spyAuthService.isLogged).toHaveBeenCalled();
    expect(spyRouterService.navigate).toHaveBeenCalled();
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([
      ['/home'],
    ]);
  });

  it('should redirect the user to the redirect page query if he is logged', () => {
    spyAuthService.isLogged.and.returnValue(true);
    queryParams.next({ redirect: '/redirect' });
    fixture.detectChanges();

    expect(spyAuthService.isLogged).toHaveBeenCalled();
    expect(spyRouterService.navigate).toHaveBeenCalled();
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([
      ['/redirect'],
    ]);
  });

  it('should redirect the user after a successful login', () => {
    fixture.detectChanges();

    spyAuthService.login.and.returnValue(of(returnToken));
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyRouterService.navigate).toHaveBeenCalled();
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([
      ['/home'],
    ]);
  });

  it('should not redirect the user after a failed login', () => {
    fixture.detectChanges();

    spyAuthService.login.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            error: 'User is banned',
            status: 403,
          }),
      ),
    );
    setEmailAndPassword(validUser.email, validUser.password);
    component.submit();

    expect(spyRouterService.navigate).not.toHaveBeenCalled();
  });
});
