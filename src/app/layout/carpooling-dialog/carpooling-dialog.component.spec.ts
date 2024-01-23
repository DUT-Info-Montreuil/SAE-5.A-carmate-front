import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarpoolingDialogComponent } from './carpooling-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CarpoolingServiceInterface,
  Carpooling,
  CARPOOLING_SERVICE_TOKEN,
} from 'src/app/interface/carpooling';
import {
  SCORE_SERVICE_TOKEN,
  ScoreServiceInterface,
} from 'src/app/interface/score';
import {
  NOTIFIER_SERVICE_TOKEN,
  NotifierServiceInterface,
} from 'src/app/interface/other';
import { of } from 'rxjs';

describe('CarpoolingDialogComponent', () => {
  let component: CarpoolingDialogComponent;
  let fixture: ComponentFixture<CarpoolingDialogComponent>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  let spyScoreService: jasmine.SpyObj<ScoreServiceInterface>;
  let spyNotiferService: jasmine.SpyObj<NotifierServiceInterface>;
  const data = {
    carpooling: {
      starting_point: [48.8558516, 2.3588636],
      destination: [48.9757551, 2.559337],
      price: 50,
      departure_date_time: '2023-02-02T12:00:00',
      driver_id: 1,
      max_passengers: 1,
      seats_taken: 0,
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
    },
    _searchParams: {
      start_lat: 48.8558516,
      start_lon: 2.3588636,
      end_lat: 48.9757551,
      end_lon: 2.559337,
      departure_date_time: '123456789',
    },
  };

  beforeEach(() => {
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', [
      'book',
    ]);
    spyScoreService = jasmine.createSpyObj('ScoreServiceInterface', [
      'getScoreUserData',
    ]);
    spyNotiferService = jasmine.createSpyObj('NotifierServiceInterface', [
      'error',
    ]);
    spyScoreService.getScoreUserData.and.returnValue(
      of({
        driver_id: 0,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: 'image',
        nb_review: 1,
        nb_carpooling_done: 1,
        economic_driving_rating: 5,
        safe_driving_rating: 5,
        sociability_rating: 5,
      }),
    );
    TestBed.configureTestingModule({
      declarations: [CarpoolingDialogComponent],
      imports: [MatCardModule],
      providers: [
        { provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService },
        { provide: SCORE_SERVICE_TOKEN, useValue: spyScoreService },
        { provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotiferService },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close: () => {} } },
      ],
    });
    fixture = TestBed.createComponent(CarpoolingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
