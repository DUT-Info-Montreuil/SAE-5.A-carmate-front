import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingDialogComponent } from './carpooling-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarpoolingServiceInterface, Carpooling, CARPOOLING_SERVICE_TOKEN } from 'src/app/interface/carpooling';

describe('CarpoolingDialogComponent', () => {
  let component: CarpoolingDialogComponent;
  let fixture: ComponentFixture<CarpoolingDialogComponent>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  const carpooling: Carpooling = {
    starting_point: [48.8558516, 2.3588636],
    destination: [48.9757551, 2.559337],
    price: 50,
    departure_date_time: "2023-02-02T12:00:00",
    driver_id: 1,
    max_passengers: 1,
    seats_taken: 0,
    id: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingDialogComponent],
      imports : [
        MatCardModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: carpooling },
        { provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService },
        { provide: MatDialogRef, useValue: { close: () => {} } }
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
