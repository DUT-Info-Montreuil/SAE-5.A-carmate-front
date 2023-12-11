import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassengerProfilesComponent } from './passenger-profiles.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {Router} from "@angular/router";
import {USER_SERVICE_TOKEN, UserServiceInterface} from "../../../interface/user";
import {PROFILE_SERVICE_TOKEN, ProfilesServiceInterface} from "../../../interface/profiles";
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('PassengerProfilesComponent', () => {
  let component: PassengerProfilesComponent;
  let fixture: ComponentFixture<PassengerProfilesComponent>;
  let spyRouterService: jasmine.SpyObj<Router>;
  let spyProfilesService: jasmine.SpyObj<ProfilesServiceInterface>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyUserService: jasmine.SpyObj<UserServiceInterface>;

  beforeEach(async () => {
    spyProfilesService = jasmine.createSpyObj('ProfilesServiceInterface', ['getPassengerProfile', 'getDriverProfile']);
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['success', 'warning', 'error']);
    spyUserService = jasmine.createSpyObj('UserServiceInterface', ['getUser']);
    spyRouterService = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PassengerProfilesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [
        {provide: Router, useValue: spyRouterService},
        {provide: USER_SERVICE_TOKEN, useValue: spyUserService},
        {provide: PROFILE_SERVICE_TOKEN, useValue: spyProfilesService},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PassengerProfilesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if the token is not valid', () => {
    localStorage.setItem("auth_token", "invalidToken");
    const expectedError = new HttpErrorResponse({
      error: 'Not logged',
      status: 401,
    });
    spyUserService.getUser.and.returnValue(throwError(() => expectedError));
    fixture.detectChanges();
    
    expect(spyRouterService.navigate.calls.mostRecent().args).toEqual([['/login']]);
  });
});
