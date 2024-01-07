import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardPageComponent } from './scoreboard-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SCOREBOARD_SERVICE_TOKEN, ScoreUserData, ScoreboardServiceInterface } from 'src/app/interface/scoreboard';
import { of } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';

describe('ScoreboardPageComponent', () => {
  let component: ScoreboardPageComponent;
  let fixture: ComponentFixture<ScoreboardPageComponent>;
  let spyScoreboardService: jasmine.SpyObj<ScoreboardServiceInterface>;

  beforeEach(() => {
    spyScoreboardService = jasmine.createSpyObj('ScoreboardServiceInterface', ['getScoreUserData']);
    spyScoreboardService.getScoreUserData.and.returnValue(of([
      {
        driver_id: 0,
        first_name: 'John',
        last_name: 'Doe',
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 42,
        economic_driving_rating: 1,
        safe_driving_rating: 2,
        sociability_rating: 3
      }
    ]));
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
        {provide: SCOREBOARD_SERVICE_TOKEN, useValue: spyScoreboardService},
      ]
    });
    fixture = TestBed.createComponent(ScoreboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
        profile_picture: new ArrayBuffer(0),
        nmbr_of_rates: 42,
        economic_driving_rating: 1,
        safe_driving_rating: 2,
        sociability_rating: 3
      }
    ];
    spyScoreboardService.getScoreUserData.and.returnValue(of(scoreUserDataList));
  
    component.ngOnInit();
  
    expect(component.dataSource)
      .withContext('dataSource should be initialized')
      .toBeTruthy();
    expect(component.dataSource.data)
      .withContext('dataSource.data should be initialized with correct data')
      .toEqual(scoreUserDataList);
  });
});
