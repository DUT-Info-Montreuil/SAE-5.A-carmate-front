import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreboardPageComponent } from './scoreboard-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SCORE_SERVICE_TOKEN, ScoreUserData, ScoreServiceInterface } from 'src/app/interface/score';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { AUTHENTICATION_SERVICE_TOKEN, AuthenticationServiceInterface } from 'src/app/interface/user';
import { ProfilesServiceInterface, PROFILE_SERVICE_TOKEN, DriverProfile, PassengerProfile } from 'src/app/interface/profiles';

describe('ScoreboardPageComponent', () => {
  let component: ScoreboardPageComponent;
  let fixture: ComponentFixture<ScoreboardPageComponent>;
  let spyScoreboardService: jasmine.SpyObj<ScoreServiceInterface>;
  let spyNotifierService: jasmine.SpyObj<NotifierServiceInterface>;
  let spyAuthService: jasmine.SpyObj<AuthenticationServiceInterface>;
  let spyProfilesService: jasmine.SpyObj<ProfilesServiceInterface>;

  beforeEach(() => {
    spyScoreboardService = jasmine.createSpyObj('ScoreServiceInterface', ['getScoreUserData']);
    spyScoreboardService.getScoreUserData.and.returnValue(of([
      {
        driver_id: 0,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 42,
        nb_carpooling_done: 42,
        economic_driving_rating: 1,
        safe_driving_rating: 2,
        sociability_rating: 3
      }
    ]));
    spyNotifierService = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success']);
    spyAuthService = jasmine.createSpyObj('AuthenticationServiceInterface', ['isDriver']);
    spyProfilesService = jasmine.createSpyObj('ProfilesServiceInterface', ['getPassengerProfile', 'getDriverProfile']);
    spyProfilesService.getPassengerProfile.and.returnValue(of({
      user_id: 0,
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture'
    }));
    spyProfilesService.getDriverProfile.and.returnValue(of({
      user_id: 0,
      driver_id: 0,
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture'
    }));
    TestBed.configureTestingModule({
      declarations: [ScoreboardPageComponent],
      imports: [
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatTableModule
      ],
      providers: [
        {provide: SCORE_SERVICE_TOKEN, useValue: spyScoreboardService},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifierService},
        {provide: AUTHENTICATION_SERVICE_TOKEN, useValue: spyAuthService},
        {provide: PROFILE_SERVICE_TOKEN, useValue: spyProfilesService},
      ]
    });
    fixture = TestBed.createComponent(ScoreboardPageComponent);    
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize dataSource on ngOnInit', () => {
    const scoreUserDataList: ScoreUserData[] = [
      {
        driver_id: 0,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 42,
        nb_carpooling_done: 42,
        economic_driving_rating: 1,
        safe_driving_rating: 2,
        sociability_rating: 3
      }
    ];
    spyScoreboardService.getScoreUserData.and.returnValue(of(scoreUserDataList));
  
    component.ngOnInit();

    const userDataListWithAverage = scoreUserDataList.map(user => ({
      ...user,
      average_rating: Number(((user.economic_driving_rating! + user.safe_driving_rating! + user.sociability_rating!) / 3).toFixed(2))
    }));
  
    const expectedUserDataList = userDataListWithAverage.sort((a, b) => b.average_rating - a.average_rating).map((user, index) => ({
      ...user,
      ranking: index + 1
    }));
  
    expect(component.dataSource)
      .withContext('dataSource should be initialized')
      .toBeTruthy();
    expect(component.dataSource.data)
      .withContext('dataSource.data should be initialized with correct data')
      .toEqual(expectedUserDataList);
  });

  it('should initialize isDriver on ngOnInit', () => {
    spyAuthService.isDriver.and.returnValue(true);
    component.ngOnInit();
    expect(component.isDriver)
      .withContext('isDriver should be initialized with true')
      .toBe(true);

    spyAuthService.isDriver.and.returnValue(false);
    component.ngOnInit();
    expect(component.isDriver)
      .withContext('isDriver should be initialized withfalse')
      .toBe(false);
  });

  it('should initialize selfDriverScore and selDriverProfile on ngOnInit if user is a driver', () => {
    spyAuthService.isDriver.and.returnValue(true);
    const expectedSelfDriverScore: ScoreUserData = {
      driver_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      profile_picture: 'image',
      nb_review: 42,
      nb_carpooling_done: 42,
      economic_driving_rating: 1,
      safe_driving_rating: 2,
      sociability_rating: 3
    };
    const expectedSelfDriverProfile: DriverProfile = {
      user_id: 0,
      driver_id: 1,
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture'
    };
    spyProfilesService.getDriverProfile.and.returnValue(of(expectedSelfDriverProfile));
    spyScoreboardService.getScoreUserData.and.callFake((arg) => {
      if (arg !== undefined) {
        console.log('called with param');
        
        return of(expectedSelfDriverScore);
      } else {
        console.log('called without param');
        
        return of([expectedSelfDriverScore, expectedSelfDriverScore]);
      }
    });

    component.ngOnInit();

    expect(component.selfDriverScore)
      .withContext('selfDriverScore should be initialized')
      .toEqual(expectedSelfDriverScore);
    expect(component.selfDriverProfile)
      .withContext('selfDriverProfile should be initialized')
      .toEqual(expectedSelfDriverProfile);
    expect(component.selfPassengerProfile)
      .withContext('selfPassengerProfile should not be initialized')
      .toBeNull();
  });

  it('should initialize selfPassengerProfile on ngOnInit if user is a passenger', () => {
    spyAuthService.isDriver.and.returnValue(false);
    const expectedSelfPassengerProfile: PassengerProfile = {
      user_id: 0,
      description: 'description',
      createdAt: '09/01/2024',
      nb_carpools_done: 42,
      profile_picture: 'profile_picture'
    };
    spyProfilesService.getPassengerProfile.and.returnValue(of(expectedSelfPassengerProfile));
    component.ngOnInit();

    expect(component.selfPassengerProfile)
      .withContext('selfPassengerProfile should be initialized')
      .toEqual(expectedSelfPassengerProfile);
    expect(component.selfDriverProfile)
      .withContext('selfDriverProfile should be initialized')
      .toBeNull();
    expect(component.selfDriverScore)
      .withContext('selfDriverScore should not be initialized')
      .toBeNull();
  });
});