import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarpoolingDialogComponent } from './carpooling-dialog.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CarpoolingServiceInterface, CARPOOLING_SERVICE_TOKEN } from 'src/app/interface/carpooling';
import { NotifierServiceInterface, NOTIFIER_SERVICE_TOKEN } from 'src/app/interface/other';

describe('CarpoolingDialogComponent', () => {
  let component: CarpoolingDialogComponent;
  let fixture: ComponentFixture<CarpoolingDialogComponent>;
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
      declarations: [CarpoolingDialogComponent],
      imports: [],
      providers: [
        {provide: MatDialog, useValue: spyDialog},
        {provide: MAT_DIALOG_DATA, useValue: carpooling_id},
        {provide: MatDialogRef, useValue: { close: () => {} }},
        {provide: NOTIFIER_SERVICE_TOKEN, useValue: spyNotifier},
        {provide: CARPOOLING_SERVICE_TOKEN, useValue: spyCarpoolingService}
      ]
    });
    fixture = TestBed.createComponent(CarpoolingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
