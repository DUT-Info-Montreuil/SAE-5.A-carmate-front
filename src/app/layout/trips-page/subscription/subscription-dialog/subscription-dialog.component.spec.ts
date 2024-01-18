import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDialogComponent } from './subscription-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NOTIFIER_SERVICE_TOKEN, NotifierServiceInterface } from 'src/app/interface/other';
import { CARPOOLING_SERVICE_TOKEN, CarpoolingServiceInterface } from 'src/app/interface/carpooling';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('SubscriptionDialogComponent', () => {
  let component: SubscriptionDialogComponent;
  let fixture: ComponentFixture<SubscriptionDialogComponent>;
  let spyDialog: jasmine.SpyObj<MatDialog>;
  let spyNotifier: jasmine.SpyObj<NotifierServiceInterface>;
  let spyCarpoolingService: jasmine.SpyObj<CarpoolingServiceInterface>;
  const carpooling_id: number = 1;
  beforeEach(() => {
    spyDialog = jasmine.createSpyObj('MatDialog', ['open', 'close']);
    spyNotifier = jasmine.createSpyObj('NotifierServiceInterface', ['error', 'success']);
    spyCarpoolingService = jasmine.createSpyObj('CarpoolingServiceInterface', ['getCode']);
    spyCarpoolingService.getCode.and.returnValue(of(1234));
    TestBed.configureTestingModule({
      declarations: [SubscriptionDialogComponent],
      imports: [],
      providers: [
        {provide: MatDialog, useValue: spyDialog},
        {provide: MAT_DIALOG_DATA, useValue: carpooling_id},
        {provide: MatDialogRef, useValue: { close: () => {} }},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifier},
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService}
      ]
    });
    fixture = TestBed.createComponent(SubscriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
