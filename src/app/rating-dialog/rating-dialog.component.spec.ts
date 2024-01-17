import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingDialogComponent } from './rating-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface } from '../interface/carpooling';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from '../interface/other';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RatingDialogComponent', () => {
  let component: RatingDialogComponent;
  let fixture: ComponentFixture<RatingDialogComponent>;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  let spyNotifier: jasmine.SpyObj<NotifierServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  const carpooling_id: number = 1;

  beforeEach(() => {
    spyDialog = jasmine.createSpyObj('MatDialog', ['open', 'close']);
    spyNotifier = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success']);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['rate']);
    spyCarpoolingService.rate.and.returnValue(of());
    TestBed.configureTestingModule({
      declarations: [RatingDialogComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: MatDialog, useValue: spyDialog},
        {provide: MAT_DIALOG_DATA, useValue: carpooling_id},
        {provide: MatDialogRef, useValue: { close: () => {} }},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifier},
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService}
      ]
    });
    fixture = TestBed.createComponent(RatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
