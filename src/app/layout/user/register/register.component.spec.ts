import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ActivatedRoute, Router } from "@angular/router";
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from "../../../interface/other";
import { AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface, Token } from "../../../interface/user";
import { BehaviorSubject, of, throwError } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let spyAuthService: jasmine.SpyObj<AuthenticationServiceInterface>;
  let spyRouterService: jasmine.SpyObj<Router>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let queryParams: BehaviorSubject<any>;
  const returnToken: Token = { token: 'someToken' };
  
  const setRegisterFormData = (user: any) => {
    component['registerForm'].controls.firstName.setValue(user.firstName);
    component['registerForm'].controls.lastName.setValue(user.lastName);
    component['registerForm'].controls.email.setValue(user.email);
    component['registerForm'].controls.password.setValue(user.password);
  };

  const validUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    password: 'Test12+-',
    accountType: 'student',
    document: new File(['dummy content'], 'document.txt', { type: 'text/plain' })
  };

  beforeEach(async () => {
    spyAuthService = jasmine.createSpyObj('AuthenticationServiceInterface', ['register']);
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success', 'warning']);
    queryParams = new BehaviorSubject({});
    spyRouterService = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: Router, useValue: spyRouterService},
        {provide: AUTHENTICATION_SERVICE_TOKEN, useValue: spyAuthService},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
        {
          provide: ActivatedRoute,
          useValue: {queryParams: queryParams.asObservable()}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register method on submit', () => {
    spyAuthService.register.and.returnValue(of(null));
    setRegisterFormData(validUser);
    component.submit();

    expect(spyAuthService.register.calls.count()).toEqual(1);
    expect(spyAuthService.register.calls.mostRecent().args).toEqual([
      validUser.firstName,
      validUser.lastName,
      validUser.email,
      validUser.password,
      validUser.accountType,
      validUser.document
    ]);
  });
});
